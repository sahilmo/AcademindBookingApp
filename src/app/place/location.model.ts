export class Coordinates {
  lat: number;
  lng: number;
}

export interface PlaceLocation extends Coordinates {
    address : string;
    staticImageUrl: string;
}
