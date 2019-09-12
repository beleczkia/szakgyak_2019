import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeafletComponent } from './leaflet/leaflet.component';
import { OpenlayerComponent } from './openlayer/openlayer.component';


import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { OdataServiceService } from './odata-service.service';

@NgModule({
  declarations: [
    AppComponent,
    LeafletComponent,
    OpenlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule
  ],
  providers: [OdataServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
