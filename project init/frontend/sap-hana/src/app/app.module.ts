import { BrowserModule }    from '@angular/platform-browser';
import { NgModule }         from '@angular/core';
import { AppComponent }     from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { OdataService }     from './services/odata.service';
import { DiagramComponent } from './diagram/diagram.component';
import { TableComponent }   from './table/table.component';
import { MapComponent }     from './map/map.component';
import { SearchComponent }  from './search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    DiagramComponent,
    TableComponent,
    MapComponent,
    SearchComponent
  ],
  imports: [
  	BrowserModule,
  	HttpClientModule
  ],
  providers: [OdataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
