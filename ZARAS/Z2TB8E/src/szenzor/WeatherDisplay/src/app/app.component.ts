import { Component, OnInit, ViewChild } from '@angular/core';
import { o } from 'odata';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
	title = 'WeatherDisplay';
	data;
	sensorIds;
	@ViewChild('filter') filterSelect;
	
	ngOnInit() {
		(async () => {
			try{
			this.data = (await o('/hana/odata.xsodata/').get('Data').query( {$top: '100', $format: 'json',$orderby: 'Time,Sensor_Id'})).d.results;
			this.sensorIds = (await o('/hana/odata.xsodata/').get('Sensors').query( {$select: 'Id'})).d.results;
			}catch(error){console.error(error);}
		})();
		(async () => {
			let url = new URL(window.location.href);
			if(url.searchParams.get("Time") != null && url.searchParams.get("Sensor") != null){
				try{
					const data = {
						Time: url.searchParams.get("Time"),
						Sensor: url.searchParams.get("Sensor"),
						Temperature: url.searchParams.get("Temperature"),
						Humidty: url.searchParams.get("Humidity"),
						Pressure: url.searchParams.get("Pressure"),
						Pm1: url.searchParams.get("Pm1"),
						Pm25: url.searchParams.get("Pm25"),
						Pm10: url.searchParams.get("Pm10")
					}
					console.log(data);
					await o('/hana/odata.xsodata/').post('Upload',data).query();
				}catch(error){console.error(error);}
			}
		})();
	}
	
	async Filter(){
		let index = this.filterSelect.nativeElement.selectedIndex;
		if(index){
			let val = this.sensorIds[index-1].Id;
			try{
				this.data = (await o('/hana/odata.xsodata/').get('Data').query( {$top: '100', $filter: 'Sensor_Id eq '+val })).d.results;
			}catch(error){console.error(error);}
		}
		else{
			try{
				this.data = (await o('/hana/odata.xsodata/').get('Data').query( {$top: '100', $format: 'json',$orderby: 'Time,Sensor_Id'})).d.results;
			}catch(error){console.error(error);}
		}
	}
}
