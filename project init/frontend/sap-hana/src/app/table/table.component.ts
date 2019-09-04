import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OdataService } from '../services/odata.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  regionColumns : string[] = ["Régió","Mennyiség[HUF]","Érték[db]"];
  countyColumns : string[] = ["Megye","Mennyiség[HUF]","Érték[db]"];
  cityColumns   : string[] = ["Település","Mennyiség[HUF]","Érték[db]"];
  regionData    : any      = null;
  countyData    : any      = null;
  cityData      : any      = null;
  regionName    : string   = null;
  countyName    : string   = null;
  selectedYear  : number   = 2010;
  selectedRegionIndex : number = null;
  selectedCountyIndex : number = null;
  selectedCityIndex   : number = null;

  constructor(private odata: OdataService) {}

  ngOnInit(): void {
    this.odata
      .getYearSubject()
      .subscribe(n => {
        this.selectedYear = n;
        this.listRegions();   
      });
  }

  /* list every region within Hungary */
  listRegions(): void {
    this.odata
      .getRegionData()
      .subscribe((res: any) => {
        this.regionData = res.d.results;
      });
  }

  /* list every county within the region
   * and highlight the selected row */
  selectRegion(name: string, n: number): void {
    /* reset, if the user deselects the region */
    if (this.selectedRegionIndex === n) {
      this.resetData();
    } else {
      this.odata.setCountyName(null);
      this.odata.setCityName(null);
      this.cityData = null;
      this.selectedRegionIndex = n;
      this.odata.setRegionName(this.regionData[n].REGIO);
      this.odata
        .getCountyData()
        .subscribe((res: any) => {
          this.countyData = res.d.results;
        });
    }
  }

  /* list every city within the county 
   * and highlight the selected row */
  selectCounty(name: string, n: number): void {
    this.selectedCountyIndex = n;
    this.odata.setCountyName(this.countyData[n].MEGYE);
    this.odata
      .getCityData(name)
      .subscribe((res: any) => {
        this.cityData = res.d.results;
      });
  }

  /* list every company within the city,
   * and highlight the selected row */
  selectCity(name: string, n: number): void {
    this.selectedCityIndex = n;
    this.odata.setCityName(this.cityData[n].TELEPULES);
  }

  yearSelected(n: number): void { 
    this.odata.setYear(n);
  }

  /* deselect all options */
  resetData(): void {
      this.selectedRegionIndex = null;
      this.selectedCountyIndex = null;
      this.selectedCityIndex = null;
      this.countyData = null;
      this.cityData = null;
      this.odata.resetData();
  }
}
