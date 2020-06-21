import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import {
  ModalController,
  ActionSheetController,
  AlertController,
} from "@ionic/angular";

import { MapModalComponent } from "../../map-modal/map-modal.component";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, switchMap } from "rxjs/operators";
import { PlaceLocation, Coordinates } from "src/app/place/location.model";
import { of } from "rxjs";
import { Plugins, Capacitor ,Geolocation} from "@capacitor/core";

@Component({
  selector: "app-location-picker",
  templateUrl: "./location-picker.component.html",
  styleUrls: ["./location-picker.component.scss"],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  @Input() showPreview = false;
  selectedLocationImage: string;
  isLoading = false;
  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onPickLocation() {
    this.actionSheetCtrl
      .create({
        header: "Please Choose",
        buttons: [
          { text: "Auto-Locate ", handler: () => {
            this.locateUser();
          } },
          {
            text: "Pick On Map ",
            handler: () => {
              this.openMap();
            },
          },
          { text: "Cancel ", role: "Cancel" },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
       this.showErrorAlert();
      return;
    } 
    this.isLoading = true ;
    Geolocation.getCurrentPosition()
    .then((getPosition) => {
      const coordinates:Coordinates = {
        lat: getPosition.coords.latitude,
        lng: getPosition.coords.longitude,
      };
      this.createPlace(coordinates.lat,coordinates.lng);
        this.isLoading=false;
      })
      .catch((err) => {
        this.isLoading=false;
        this.showErrorAlert();
      });
  }

  private openMap() {
    this.modalCtrl.create({ component: MapModalComponent }).then((modalEl) => {
      modalEl.onDidDismiss().then((modalData) => {
        if (!modalData.data) {
          return;
        }
        const coordinates :Coordinates = {
          lat : modalData.data.lat,
          lng : modalData.data.lng,
        }
        this.createPlace(coordinates.lat,coordinates.lng);
      });
      modalEl.present();
    });
  }

  private createPlace(lat: number, lng:number){
    const pickedLocation: PlaceLocation = {
      lat: lat,
      lng: lng,
      address: null,
      staticImageUrl: null,
    };
    this.isLoading = true;
    this.getAddress(lat,lng)
      .pipe(
        switchMap((address) => {
          pickedLocation.address = address;
          return of(
            this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
          );
        })
      )
      .subscribe((staticMapImageUrl) => {
        pickedLocation.staticImageUrl = staticMapImageUrl;
        this.selectedLocationImage = staticMapImageUrl;
        this.isLoading = false;
        this.locationPick.emit(pickedLocation);
      });
  }
  showErrorAlert() {
    this.alertCtrl.create({
      header: "Could not fetch location",
      message: "Please use the map to pick location!",
    });
  }

  private getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapAPIKey}`
      )
      .pipe(
        map((geoData: any) => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          console.log(geoData);
          return geoData.results[0].formatted_address;
        })
      );
  }
  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${environment.googleMapAPIKey}`;
  }
}
