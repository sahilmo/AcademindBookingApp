import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Dubai',
      'very Good Place',
      'https://imagevars.gulfnews.com/2019/09/29/Dubai-skyline_16d7de0fdce_large.jpg',
      1233,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'sahil'
    ),
    new Place(
      'p2',
      'Sharjah',
      'Best Cultural Place',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Majaz_2012.jpg/350px-Majaz_2012.jpg',
      243,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'Aslam'
    ),

    new Place(
      'p3',
      'Abu Dhabi',
      'Best Business Place',
      'https://gulfbusiness.com/wp-content/uploads/2020/04/GettyImages-1085676060.jpg',
      243,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'Raja'
    ),
  ]);
  constructor(private authService: AuthService) {}

  getPlaces() {
    // return [...this._places];
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this._places.pipe(
      take(1),
      map((places) => {
        return {
          ...places.find((p) => {
            return p.id === id;
          }),
        };
      })
    );
    // return {
    //   ...this._places.find((p) => {
    //     return p.id === id;
    //   }),
    // };
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://dummyimage.com/600x400/000/fff',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );

    return this._places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        this._places.next(places.concat(newPlace));
      })
    );
  }

  updatePlace(placeId: string ,title : string , description : string){
     return this._places.pipe(
       take(1),
       delay(1000),
       tap(places =>{
         const updatePlaceIndex = places.findIndex(pl => pl.id === placeId);
         const updatePlaces = [...places];
         const oldPlace = updatePlaces[updatePlaceIndex];
         updatePlaces[updatePlaceIndex] = new Place(
           oldPlace.id,
            title,
            description,
            oldPlace.imageUrl,
            oldPlace.price,
            oldPlace.availableFrom,
            oldPlace.availableTo,
            oldPlace.userId
         );
         this._places.next(updatePlaces);
       })
     );
  }
}
