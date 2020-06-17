import { Component, OnInit, OnDestroy } from "@angular/core";
import { SegmentChangeEventDetail } from "@ionic/core";

import { PlaceService } from "../place.service";
import { Place } from "../place.model";
import { Subscription } from "rxjs";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: "app-discover",
  templateUrl: "./discover.page.html",
  styleUrls: ["./discover.page.scss"],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[] = [];
  listedLoadedPlaces: Place[] = [];
  relevantPlaces : Place[] = [];
  isLoading = false;
  private placeSubs: Subscription;

  constructor(private placeService: PlaceService, private authService:AuthService) {}

  ngOnInit() {
    this.placeSubs =  this.placeService._places.subscribe(places => {
     this.loadedPlaces = places;
     this.relevantPlaces = this.loadedPlaces;
     this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placeService.fetchPlaces().subscribe(()=>{
      this.isLoading = false;
    }
    );
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);
    if (event.detail.value === 'all') {
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }
    else {
      console.log('onFilter Bookable');
      this.relevantPlaces = this.loadedPlaces.filter(
        place => place.userId === this.authService.userId  
      );
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }
  }
  ngOnDestroy() {
    if (this.placeSubs) {
      this.placeSubs.unsubscribe();
    }
  }
}
