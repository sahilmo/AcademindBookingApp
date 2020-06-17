import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  NavController,
  ModalController,
  ActionSheetController,
  LoadingController,
  AlertController,
} from "@ionic/angular";
import { PlaceService } from "../../place.service";
import { ActivatedRoute ,Router} from "@angular/router";
import { Place } from "../../place.model";
import { CreateBookingsComponent } from "../../../bookings/create-bookings/create-bookings.component";
import { Subscription } from "rxjs";
import { BookingService } from "src/app/bookings/booking.service";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: "app-place-detail",
  templateUrl: "./place-detail.page.html",
  styleUrls: ["./place-detail.page.scss"],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  isLoading = false;
  private placeSubs: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private placesService: PlaceService,
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController  
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/place/tabs/discover");
        return;
      }
      this.isLoading = true;
      this.placeSubs = this.placesService
        .getPlace(paramMap.get("placeId"))
        .subscribe(place => {
          this.place = place;
          this.isBookable = place.userId !== this.authService.userId;
          this.isLoading = false;
        },
        error=>{
          this.alertCtrl.create({
            header:'An Error Occurred',
            message:'Place could not be fetched',
            buttons:[{text:'Okay',handler:()=>{
              this.router.navigate(['/place/tabs/discover']);
            }}]
          })
          .then(alertEl=>{
            alertEl.present();
          });
        });
    });
  }

  onBookPlace() {
    //this.navCtrl.navigateBack("/place/tabs/discover");
    const actionSheet = this.actionSheetController
      .create({
        header: "Choose an action",
        buttons: [
          {
            text: "Select Date",
            icon: "calendar",
            handler: () => {
              console.log("Select date clicked");
              this.openBookingModel("select");
            },
          },
          {
            text: "Random Date",
            icon: "share",
            handler: () => {
              console.log("Random clicked");
              this.openBookingModel("random");
            },
          },
          {
            text: "Cancel",
            icon: "close",
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked");
            },
          },
        ],
      })
      .then((actionEl) => {
        actionEl.present();
      });
  }

  openBookingModel(mode: "select" | "random") {
    this.modalCtrl
      .create({
        component: CreateBookingsComponent,
        componentProps: { selectedPlace: this.place, selectedMode: mode },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData.data, resultData.role);
        if (resultData.role === "confirm") {
          this.loadingCtrl
            .create({
              message: "Booking ...",
            })
            .then((loadingEl) => {
              loadingEl.present();
              const data = resultData.data.bookingData;
              this.bookingService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  data.firstName,
                  data.lastName,
                  data.guestNumber,
                  data.startDate,
                  data.endDate
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                });
            });
        }
      });
  }
  ngOnDestroy() {
    if (this.placeSubs) {
      this.placeSubs.unsubscribe();
    }
  }
}
