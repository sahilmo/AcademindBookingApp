import { Component, OnInit, OnDestroy } from "@angular/core";
import { PlaceService } from "../place.service";
import { Place } from "../place.model";
import { IonItemSliding } from "@ionic/angular";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-offers",
  templateUrl: "./offers.page.html",
  styleUrls: ["./offers.page.scss"],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[] = [];
  isLoading = false;
  private placeSubs: Subscription;
  constructor(private placeService: PlaceService, private router: Router) {}

  ngOnInit() {
    this.placeSubs = this.placeService._places.subscribe((places) => {
      this.offers = places;
    });
    console.log("loaded places " + this.offers.length);
  }

  ionViewWillEnter() {
    this.isLoading=true;
    this.placeService.fetchPlaces().subscribe(()=>{
      this.isLoading = false;
    });

  }
  
  onEdit(offerId: string, slidingItem: IonItemSliding) {
    console.log("edit item " + offerId);
    this.router.navigate(["/", "place", "tabs", "offers", "edit", offerId]);
    slidingItem.close();
  }

  ngOnDestroy() {
    if (this.placeSubs) {
      this.placeSubs.unsubscribe();
    }
  }
}
