import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OdataService } from '../services/odata.service';
import { fromEvent } from "rxjs";
import { debounceTime, map, distinctUntilChanged, filter} from "rxjs/operators";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild("companySearchInput", {static: true})
  companySearchInput: ElementRef;
  isSearch: boolean = true;

  // TODO
  // years: number[] = [ 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017 ];
  companyData: any = null;

  companyColumns: string[] = ["Név","Régió","Megye","Település"];

  constructor(private odata: OdataService) { }

  showFilter: boolean = false;

  ngOnInit() {
    fromEvent(this.companySearchInput.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        // filter(res => res.length > 2),
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((text: string) => {
        let searchArg = `substringof(tolower('${text}'), tolower(TARS_ROV_NEV))`;
        this.odata
          .getCompanyData(searchArg)
          .subscribe((res: any) => {
            this.companyData = res.d.results;
            // console.log(`COMPANYDATA = ${this.companyData}`);
          });
      })
    this.odata
      .getRegionSubject()
      .subscribe(name => {
        this.refreshResults();
      })
    this.odata
      .getCountySubject()
      .subscribe(name => {
        this.refreshResults();
      })
    this.odata
      .getCitySubject()
      .subscribe(name => {
        this.refreshResults();
      })
  }

  refreshResults(): void {
    this.odata
      .getCompanyData()
      .subscribe((res: any) => {
        this.companyData = res.d.results;
        // console.log(`COMPANYDATA = ${this.companyData}`);
      })
  }

  selectYear(n: number) {
    this.odata.setYear(n);
  }

  // TODO
  companyClicked() {}
}
