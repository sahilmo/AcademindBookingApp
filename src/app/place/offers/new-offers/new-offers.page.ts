import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  MaxLengthValidator,
} from "@angular/forms";
import { PlaceService } from "../../place.service";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { PlaceLocation } from '../../location.model';

@Component({
  selector: "app-new-offers",
  templateUrl: "./new-offers.page.html",
  styleUrls: ["./new-offers.page.scss"],
})
export class NewOffersPage implements OnInit {
  form: FormGroup;
  constructor(
    private placeService: PlaceService,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      price: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required, Validators.min(1)],
      }),
      dateFrom: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      location: new FormControl(null, {
        validators: [Validators.required],
      }),
      
    });
  }
  onLocationPicked(location:PlaceLocation){
    this.form.patchValue({location: location});
  }
  onCreateOffer() {
    if (this.form.invalid) {
      return;
    }
    this.loadingController
      .create({
        message: "Creating place...",
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.placeService
          .addPlace(
            this.form.value.title,
            this.form.value.description,
            this.form.value.price,
            new Date(this.form.value.dateFrom),
            new Date(this.form.value.dateTo),
            this.form.value.location
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();

            this.router.navigate(["place/tabs/offers"]);
          });
      });
  }
}
