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

  companyData: any = null;

  searchFilter: string = "TARS_ROV_NEV";

  companyColumns: string[] = ["Név", 
                              "Cím",
                              "Állapot", 
                              "Gazdasági forma",
                              "Adószám", 
                              "Jegyzett tőke [HUF]"];

  constructor(private odata: OdataService) { }

  ngOnInit() {
    fromEvent(this.companySearchInput.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        // filter(res => res.length > 2),
        debounceTime(300),
        distinctUntilChanged())
      .subscribe((text: string) => {
        let searchArg = "substringof(tolower('" + 
          text + "'), tolower(" + this.searchFilter + "))";
        this.odata
          .getCompanyData(searchArg)
          .subscribe((res: any) => {
            this.companyData = res.d.results;
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
        if (name != null) {
          this.refreshResults();
        }
      })
    this.odata
      .getCitySubject()
      .subscribe(name => {
        if (name != null) {
          this.refreshResults();
        }
      })
  }

  refreshResults(): void {
    this.odata
      .getCompanyData(null)
      .subscribe((res: any) => {
        this.companyData = res.d.results;
      })
  }

  filterChanged(str: string): void {
    this.searchFilter = str;   
  }
}
