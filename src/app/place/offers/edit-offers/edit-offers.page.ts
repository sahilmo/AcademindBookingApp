import { Component, OnInit, OnDestroy } from "@angular/core";
import { Place } from "../../place.model";
import { ActivatedRoute, Router } from "@angular/router";
import { NavController, LoadingController, AlertController } from "@ionic/angular";
import { PlaceService } from "../../place.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-edit-offers",
  templateUrl: "./edit-offers.page.html",
  styleUrls: ["./edit-offers.page.scss"],
})
export class EditOffersPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  placeId:string;
  private placeSubs: Subscription;
  isLoading= false;

  constructor(
    private route: ActivatedRoute,
    private router : Router,
    private navCtrl: NavController,
    private placesService: PlaceService,
    private loadingController: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/place/tabs/offers");
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placeSubs = this.placesService
        .getPlace(paramMap.get("placeId"))
        .subscribe((place) => {
          this.place = place;
          this.form = new FormGroup({
            title: new FormControl(this.place.title, {
              updateOn: "blur",
              validators: [Validators.required],
            }),
            description: new FormControl(this.place.description, {
              updateOn: "blur",
              validators: [Validators.required, Validators.maxLength(180)],
            }),
          });
          this.isLoading = false;
        },
        error =>{
          this.alertCtrl.create({
            header:'An Error Occurred',
            message:'Place could not be fetched. Please Try again later',
            buttons:[{text:'Okay',handler:()=>{
              this.router.navigate(['/place/tabs/offers']);
            }}]
          })
          .then(alertEl=>{
            alertEl.present();
          });
        });
    });
  }
  onUpdateOffer() {
    if (this.form.invalid) {
      return;
    }
    this.loadingController
      .create({
        message: "Updating Place ",
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.placesService
          .updatePlace(
            this.place.id,
            this.form.value.title,
            this.form.value.description
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/place/tabs/offers']);
          });
      });

    console.log(this.form);
  }
  ngOnDestroy() {
    if (this.placeSubs) {
      this.placeSubs.unsubscribe();
    }
  }
}
