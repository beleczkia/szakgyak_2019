import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GeocoderService {
  constructor(private http: HttpClient) {   }
  
	BingMapsAPIKey = 'AnR0we4gb-wOGkIzhtplEOeIlZtLbuIsq1bhVz-REPiUYuwcON6uix84duNBwWLT';
	coordinateURL1 = 'http://dev.virtualearth.net/REST/v1/Locations/"';
	coordinateURL2 = '"?&key='+this.BingMapsAPIKey;
	mapURL = 'https://dev.virtualearth.net/REST/V1/Imagery/Map/Road/';
	addressURL1 = 'http://dev.virtualearth.net/REST/v1/Locations/';
	addressURL2 = '?c=hu&includeEntityTypes=Address&key='+this.BingMapsAPIKey;


	async getCoordinates(query) {
		let response: any;
		let url = this.coordinateURL1 + query + this.coordinateURL2;

		response = await this.http.get(url).toPromise();
		return response.resourceSets[0].estimatedTotal == 0 ? null : response.resourceSets[0].resources[0].geocodePoints[0].coordinates;
	}
	
	async getAddress(c1,c2){
		let response: any;
		let url = this.addressURL1+c1+','+c2+this.addressURL2;
		response = (await this.http.get(url).toPromise());
		if(response.resourceSets[0].estimatedTotal == 0) return "HIBA";
		let rec = response.resourceSets[0].resources[0].address;
		let country = rec.countryRegion == 'Magyarország' ? '' : rec.countryRegion+', ';
		let post = rec.postalCode+' ';
		let city = rec.locality+', ';
		let street = rec.addressLine;
		return (country + post + city + street);
	}
	
	getMapURL(coords){
		return (this.mapURL+coords+'/10?&pp='+coords+'&key='+this.BingMapsAPIKey);
	}
}