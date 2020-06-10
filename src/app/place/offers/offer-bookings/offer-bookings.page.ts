import { Component, OnInit, OnDestroy } from "@angular/core";
import { Place } from "../../place.model";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { PlaceService } from "../../place.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-offer-bookings",
  templateUrl: "./offer-bookings.page.html",
  styleUrls: ["./offer-bookings.page.scss"],
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  place: Place;
  private placeSubs: Subscription;
  constructor(
    private router: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlaceService
  ) {}

  ngOnInit() {
    this.router.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/place/tabs/offers");
        return;
      }
      this.placeSubs= this.placesService
        .getPlace(paramMap.get("placeId"))
        .subscribe((place) => {
          this.place = place; 
        });
    });
  }
  ngOnDestroy() {
    if (this.placeSubs) {
      this.placeSubs.unsubscribe();
    }
  }
}
