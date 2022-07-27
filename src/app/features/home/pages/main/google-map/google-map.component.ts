import { Component, OnInit } from '@angular/core';

import { MapsAPILoader } from '@agm/core';

interface Marker {
  latitude: number;
  longitude: number;
  label: string;
  draggable: boolean;
  content?: string;
  isShown: boolean;
  icon: string;
}

declare var google: any;

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements OnInit {
  currentLatitude: number;
  currentLongitude: number;
  zoom = 10;
  markers: Marker[] = [];
  // Radius circle Configs in meters
  // Radius in meters
  radius = 5000;
  radiusLatitude = 0;
  radiusLongitude = 0;

  constructor(private mapsAPILoader: MapsAPILoader) {}

  ngOnInit(): void {
    //load Map
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
    });
  }

  // Get Current Location Coordinates
  private setCurrentLocation(): void {
    //  IMPLEMENT LOGIC IF geolocation is FORBIDEN
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentLatitude = position.coords.latitude;
        this.currentLongitude = position.coords.longitude;
        this.radiusLatitude = this.currentLatitude;
        this.radiusLongitude = this.currentLongitude;
        for (let i = 1; i < 50; i++) {
          this.markers.push({
            latitude: this.currentLatitude + Math.random(),
            longitude: this.currentLongitude + Math.random(),
            label: `${i}`,
            draggable: false,
            content: `Content no ${i}`,
            isShown: false,
            icon: 'http://www.clker.com/cliparts/e/3/F/I/0/A/google-maps-marker-for-residencelamontagne-md.png',
          });
        }
      });
    }
  }

  public onMarkerClick(label: string, index: number): void {
    console.log(`clicked the marker: ${label || index}`);
  }

  public onRadiusDragEnd(data: {
    coords: {
      lat: number;
      lng: number;
    };
  }): void {
    const { lat, lng } = data.coords;
    this.radiusLatitude = lat;
    this.radiusLongitude = lng;
    this.updateMarkersVisibility();
  }

  public onRaduisChange(type: string, radius: number): void {
    this.radius = radius;
    this.updateMarkersVisibility();
  }

  public updateMarkersVisibility(): void {
    Object.values(this.markers).forEach((marker) => {
      marker.isShown = this.isMarkerInSelectedZone(
        marker,
        this.radiusLatitude,
        this.radiusLongitude
      );
    });
  }

  private isMarkerInSelectedZone(
    marker: Marker,
    radiusLatitude: number,
    radiusLongitude: number
  ): boolean {
    const from = new google.maps.LatLng(marker.latitude, marker.longitude);
    const to = new google.maps.LatLng(radiusLatitude, radiusLongitude);
    if (
      google.maps.geometry.spherical.computeDistanceBetween(from, to) <=
      this.radius
    ) {
      console.log('Radius', this.radius);
      console.log(
        'Distance Between',
        google.maps.geometry.spherical.computeDistanceBetween(from, to)
      );
      return true;
    } else {
      return false;
    }
  }
}
