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
  selectedRegionIndex : number = 0;
  selectedCountyIndex : number = 0;
  selectedCityIndex   : number = 0;

  // companyColumn : string = "Társaság neve";
  // companyName   : string = null;
  // companyData   : any    = null;
  // selectedCompanyIndex : number = 0;

  constructor(private odata: OdataService) {}

  // // TODO
  // toggleRegionFilterGroup(event, index): void {
  //   let element = event.target;
  //   element.classList.toggle("active");
  //   if(this.data[index].isActive) {
  //     this.data[index].isActive = false;
  //   } else {
  //     this.data[index].isActive = true;
  //   }      
  //   var panel = element.nextElementSibling;
  //   if (panel.style.maxHeight) {
  //     panel.style.maxHeight = null;
  //   } else {
  //     panel.style.maxHeight = panel.scrollHeight + "px";
  //   }
  // }

  ngOnInit(): void {
    this.odata
      .getYear()
      .subscribe(n => {
        this.selectedYear = n;
        this.listRegions();   
      });
  }

  // list every region within Hungary
  listRegions(): void {
    this.odata
      .getRegionData()
      .subscribe((res: any) => {
        this.regionData = res.d.results;
      });
  }

  // list every county within the region
  // and highlight the selected row
  selectRegion(name: string, n: number): void {
    this.selectedRegionIndex = n;
    this.odata.setRegionName(this.regionData[n].REGIO);
    this.odata
      .getCountyData(name)
      .subscribe((res: any) => {
        this.countyData = res.d.results;
        console.log(`COUNTYDATA = ${this.countyData}`);
      });
    this.odata.setCountyName(null);
    this.cityData = null;
    // this.companyData = null;
  }

  // list every city within the county 
  // and highlight the selected row
  selectCounty(name: string, n: number): void {
    this.selectedCountyIndex = n;
    this.odata.setCountyName(this.countyData[n].MEGYE);
    this.odata
      .getCityData(name)
      .subscribe((res: any) => {
        this.cityData = res.d.results;
      console.log(`CITYDATA = ${this.cityData}`);
      });
    // this.companyData = null;
  }

  // list every company within the city,
  // and highlight the selected row
  selectCity(name: string, n: number): void {
    this.selectedCityIndex = n;
    this.odata.setCityName(this.cityData[n].TELEPULES);
    // this.odata
    //   .getCompanyData(name)
    //   .subscribe((res: any) => {
    //     this.companyData = res.d.results;
    //     console.log(`COMPANYDATA = ${this.companyData}`);
    //   });
  }

  yearClicked(n: number): void { 
    this.odata.setYear(n);
    this.activateYearButton(n);
    this.deactivateYearButton(n);
  }

  // // to highlight the clicked region
  // regionClicked(n: number): void {
  //   this.selectedRegionIndex = n;
  //   this.odata.setRegionName(this.regionData[n].REGIO);
  // }

  // // to highlight the clicked county
  // countyClicked(n: number): void {
  //   this.selectedCountyIndex = n;
  //   this.odata.setCountyName(this.countyData[n].MEGYE);
  // }

  // // to highlight the clicked city
  // cityClicked(n: number): void {
  //   this.selectedCityIndex = n;
  //   this.odata.setCityName(this.cityData[n].TELEPULES);
  // }

  // TODO: kell?
  // to highlight the clicked company
  // companyClicked(n: number): void {
  //   this.selectedCompanyIndex = n;
  //   this.odata.setCompanyName(this.companyData[n].TARS_ROV_NEV);
  // }

  activateYearButton(n: number): void {
    document.getElementById(n.toString()).classList.add("active");
  }

  deactivateYearButton(n: number): void {
    document.getElementById(n.toString()).classList.remove("active");
  }
}
