import { Component, OnInit, OnDestroy } from "@angular/core";
import { BookingService } from "./booking.service";
import { Booking } from "./booking.model";
import { IonItemSliding, LoadingController } from "@ionic/angular";
import { Subscription } from "rxjs";

@Component({
  selector: "app-bookings",
  templateUrl: "./bookings.page.html",
  styleUrls: ["./bookings.page.scss"],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  private bookingSub: Subscription;
  constructor(private bookingService: BookingService,
    private loadingController: LoadingController) { }

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe((bookings) => {
      this.loadedBookings = bookings;
    });
  }

  /**
   *
   * @param bookingId
   * @param slidingEl
   */
  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingController.create({ message: 'Cancling Booking..' }).then(loadingEl => {
      loadingEl.present();
      this.bookingService.cancleBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    })
    //cancel Booking with booking id
  }

  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }
}
