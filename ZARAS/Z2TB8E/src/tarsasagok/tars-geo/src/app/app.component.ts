import { Component, OnInit, ViewChild } from '@angular/core';
import { GeocoderService } from './services/geocoder.service';
import { o } from 'odata';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	title = 'tars-geo';
	@ViewChild('coordSpan') coordSpan;
	@ViewChild('mapImg') mapImg;
	@ViewChild('btnSpan') btnSpan; 
	tarsasagok;
  
	constructor(private geocoder: GeocoderService) {}
	
	ngOnInit() {
		(async () => {
			this.tarsasagok = (await o('/hana/odata.xsodata/').get('Tarsasagok').query( {$top: 100})).d.results;
		})();
	}
	
	async MakeCoords(){
		let c = 0;
		let nulled_cimek = (await o('/hana/odata.xsodata/').get('Cimek').query( {$filter: 'LONG eq null and LAT eq null'})).d.results;
		for(var i = 0; i < nulled_cimek.length; ++i){
			let left = nulled_cimek.length - i;
			this.btnSpan.nativeElement.innerHTML = ''+left+' bejegyzés van hátra!';
			let curr_cim = nulled_cimek[i].CIM;
			let coords = await this.geocoder.getCoordinates(curr_cim);
			++c;
			const data = {
				CIM: curr_cim,
				LAT: coords[0],
				LONG: coords[1]
			}
			try{
				let path = encodeURIComponent("Cimek('"+curr_cim+"')");
				await o('/hana/odata.xsodata/').delete(path).query();
				await o('/hana/odata.xsodata/').post('Cimek',data).query();
			}
			catch(error){ console.error(error)}
		}
		this.btnSpan.nativeElement.innerHTML = ''+c+' bejegyzés frissítve!';
	}

	async Geocode(tarsasag){
		if(!tarsasag.LAT || !tarsasag.LONG){
			let coords = await this.geocoder.getCoordinates(tarsasag.CIM);
			if(!coords){
				this.coordSpan.nativeElement.innerHTML = 'Ismeretlen cím';
				this.mapImg.nativeElement.src = 'https://www.realsimple.com/img/icons/missing-image-4x3.png';
				return;
			}
			tarsasag.LAT = coords[0];
			tarsasag.LONG = coords[1];
			let uri = encodeURIComponent("Cimek('"+tarsasag.CIM+"')");
			try{
				const data = {	
					CIM: tarsasag.CIM,
					LAT: coords[0],
					LONG: coords[1]
				}
				await o('/hana/odata.xsodata/').delete(uri).query();
				await o('/hana/odata.xsodata/').post('Cimek',data).query();
			}catch(error){ console.error(error)}
			
		}
		let str = [tarsasag.LAT,tarsasag.LONG].toString();
		this.coordSpan.nativeElement.innerHTML = str;
		this.mapImg.nativeElement.src = this.geocoder.getMapURL(str);
	}
}