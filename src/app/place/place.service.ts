import { Injectable } from "@angular/core";
import { Place } from "./place.model";
import { AuthService } from "../auth/auth.service";
import { BehaviorSubject, of } from "rxjs";
import { take, map, tap, delay, switchMap, mapTo } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}
@Injectable({
  providedIn: "root",
})
// new Place(
//   "p1",
//   "Dubai",
//   "very Good Place",
//   "https://imagevars.gulfnews.com/2019/09/29/Dubai-skyline_16d7de0fdce_large.jpg",
//   1233,
//   new Date("2019-01-01"),
//   new Date("2019-12-31"),
//   "sahil"
// ),
// new Place(
//   "p2",
//   "Sharjah",
//   "Best Cultural Place",
//   "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Majaz_2012.jpg/350px-Majaz_2012.jpg",
//   243,
//   new Date("2019-01-01"),
//   new Date("2019-12-31"),
//   "Aslam"
// ),

// new Place(
//   "p3",
//   "Abu Dhabi",
//   "Best Business Place",
//   "https://gulfbusiness.com/wp-content/uploads/2020/04/GettyImages-1085676060.jpg",
//   243,
//   new Date("2019-01-01"),
//   new Date("2019-12-31"),
//   "Raja"
// ),
export class PlaceService {
  _places = new BehaviorSubject<Place[]>([]);
  constructor(private authService: AuthService, private http: HttpClient) {}

  getPlaces() {
    // return [...this._places];
    return this._places.asObservable();
  }

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        "https://academindbookingapp.firebaseio.com/offered-places.json"
      )
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId
                )
              );
            }
          }
          return places;
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://academindbookingapp.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map((placeData) => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId
          );
        })
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generateId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      "https://dummyimage.com/600x400/000/fff",
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );

    return this.http
      .post<{ name: string }>(
        "https://academindbookingapp.firebaseio.com/offered-places.json",

        {
          ...newPlace,
          id: null,
        }
      )
      .pipe(
        switchMap((resData) => {
          generateId = resData.name;
          return this._places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generateId;
          this._places.next(places.concat(newPlace));
        })
      );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatePlaces: Place[];
    return this._places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatePlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatePlaces = [...places];
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
        return this.http.put(
          `https://academindbookingapp.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatePlaces[updatePlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatePlaces);
      })
    );
  }
}
