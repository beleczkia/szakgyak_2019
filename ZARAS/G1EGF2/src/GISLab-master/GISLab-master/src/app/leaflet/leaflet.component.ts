import { Component, OnInit } from '@angular/core';
import { OdataServiceService } from '../odata-service.service';
import { HttpClient } from '@angular/common/http';
import * as CanvasJS from '../../assets/canvasjs/canvasjs.min.js';
import 'leaflet';

import proj4 from 'proj4';
import reproject from 'reproject';
import { LayerGroup } from 'leaflet';
//import * as L from 'leaflet'; // ennek hatására a Leaflet JS kódja be lesz töltve (a CSS sajnos nem)

declare let L;
declare let $;

@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.css']
})

export class LeafletComponent implements OnInit {

  constructor(private http: HttpClient, private odata: OdataServiceService) { }

  ngOnInit() {

    
    
    $(document).ready(function () {
      console.log("JQuery works!");
    });

    const map = L.map('map').setView([47.4725471, 19.0606007], 13);
    // Sima Leaflet base map az OpenStreeMap-ról
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    // A küldött fájlok a magyar EOV vetületi rendszerben vannak: https://hu.wikipedia.org/wiki/Egys%C3%A9ges_orsz%C3%A1gos_vet%C3%BClet
    // Nemzetközi kódja: EPSG:23700
    // Definiáljuk ezt a koordináta rendszert, mert nem annyira széles körben használt, hogy alapértelmezetten tudja a library :)
    // Egy ilyen definíció leleshető pl. innen: https://epsg.io/23700 (ld. oldal alsó részén az EXPORT lehetőségeket)
    proj4.defs("EPSG:23700", "+proj=somerc +lat_0=47.14439372222222 +lon_0=19.04857177777778 +k_0=0.99993 +x_0=650000 +y_0=200000 +ellps=GRS67 +towgs84=52.17,-71.82,-14.9,0,0,0,0 +units=m +no_defs");

    var that = this;
    let HUNtowns;
    let HUNregions;
    let townsToDisplay = L.layerGroup();
    let selectedRegion;
    let selectedTown;
    let regionSUM;

    that.odata.getData('?opt=VAROSBAN' + '&city=' + encodeURI("Pánd")).subscribe(
      (companies: any) => {  
        that.draw_chart(companies.map((o) => ({ label: o.name, y: o.money / 100000 })), "Pánd");
     
      }
    );

    this.odata.getData('?opt=SUM').subscribe(
      (data3:any) => {
        regionSUM = data3;

        //this.http.get("assets/geodata/telepulesek.geojson", {responsetype: 'json'}).subscribe(
        this.odata.getData('?opt=TELEPULESEK').subscribe(
          (data1:any) => { 
            HUNtowns = data1;
            
            this.odata.getData('?opt=REGION').subscribe(
              (data2:any) => { 
                HUNregions = data2;
                
                let regions = L.geoJson(reproject.toWgs84(HUNregions, "EPSG:23700", proj4), {
                  style : function(region){
    
                    let i = 0;
                    
                    while(i < regionSUM.length && region.properties.name != regionSUM[i].region_id) i++;
                    let regionMoney = regionSUM[i].money;

                    return{
                        color: getColor(regionMoney/200000000), 
                        //TODO a hardcode helyett, megnézni a legkissebb és a legnagyobb összeget, és az alapján skálázni
                        opacity: 10,
                        fillOpacity: 0.7, //0.7
                        weight: 2
                    }
                  },
    
                  onEachFeature: function onEachFeature(feature, region) {               
                    
                    region.on({
                      mouseover: highlightFeature,
                      mouseout: resetHighlight,
                      click: zoomToFeature
                    });
                  }                          
                });
        
                function resetHighlight(e) {
                  regions.resetStyle(e.target);
                  //info.update(); 
                  //TODO egy field-et létrehozni, ahova a cégeket és az adataikat ki lehet listázni
                }
        
                function zoomToFeature(e) {
                  if(e.target.feature.properties.name != selectedRegion){
                    selectedRegion = e.target.feature.properties.name;
                    console.log("Selected Region: " + selectedRegion);
                    map.fitBounds(e.target.getBounds());
      
                    //First Clear earlier towns:
                    townsToDisplay.clearLayers();
                    
                    console.log("Drawing Towns: ");
                    drawTowns();
                  }
                }
            
                function highlightFeature(e) {
                  
                  let layer = new L.Control();
                   layer = e.target;
            
                   layer.setStyle({
                    weight: 5,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.2
                  });
            
                  if (!L.Browser.ie &&  !L.Browser.edge) {
                    layer.bringToFront();
                  }
                }
    
                function drawTowns(){

                  let iconSize = [6 , 6];
                  var LeafIcon = L.Icon.extend({
                    options: {
                      shadowUrl: 'assets/red_dot.png',
                      iconSize:     iconSize,
                      shadowSize:   iconSize,
                      iconAnchor:   iconSize,
                      shadowAnchor: iconSize,
                      popupAnchor:  iconSize
                    }
                  });

                  var greenIcon = new LeafIcon({iconUrl: 'assets/green_dot.png'});
		              var redIcon = new LeafIcon({iconUrl: 'assets/red_dot.png'});
                  let marker;
                  let towns = L.geoJson(reproject.toWgs84(HUNtowns, "EPSG:23700", proj4),
                    {             
                      onEachFeature: function onEachFeature(feature, town) {
                        
                        if(town.feature.properties.region == selectedRegion) {

                          that.odata.getData('?opt=VAROSBAN' + '&city=' + encodeURI(town.feature.properties.name)).subscribe(
                            (data4: any) => {
                              if(data4.length != 0){
                                marker = L.marker([town._latlng.lat, town._latlng.lng], {icon: greenIcon})
                                  .bindPopup(town.feature.properties.name);
                                marker.on({
                                  click: visualiseTownData
                                }); 
                              }
                              else{
                                marker = L.marker([town._latlng.lat, town._latlng.lng], {icon: redIcon})
                                 .bindPopup(town.feature.properties.name);
                              }

                              marker.addTo(townsToDisplay);
                            
                            }
                          );
                        
                        }
                         
                      }
                    });
                    
                    function visualiseTownData(e){
                      console.log("Selected Town:" + e.target._popup._content);
                      selectedTown = e.target._popup._content;
                      
                      that.odata.getData('?opt=VAROSBAN' + '&city=' + encodeURI(selectedTown)).subscribe(
                        (companies: any) => {
                          //console.log(companies); //array, {name, money}
                          
                          that.draw_chart(companies.map((o) => ({ label: o.name, y: o.money / 100000 })), selectedTown);
                       
                        }
                      );
                    }

                    townsToDisplay.addTo(map);
                }
                regions.addTo(map);

                // Budapest fókusz, 7-es zoom szint
                map.setView({ lat: 47.5, lng: 19.0 }, 7);
            
                // get color depending on population density value
                function getColor(d) {
                  return d > 1000 ? '#800026' :
                      d > 300  ? '#BD0026' :
                      d > 200  ? '#E31A1C' :
                      d > 150  ? '#FC4E2A' :
                      d > 100   ? '#FD8D3C' :
                      d > 75   ? '#FEB24C' :
                      d > 50   ? '#FED976' :
                            '#FFEDA0';
                }

              } 
            ); //~REGION
            
          }
        ); //~TELEPULESEK

      }
    ); //~SUM

  }//ngOnInit

  draw_chart(db: Array<{ y: number, label: string }>, selectedTown) {

    let chart = new CanvasJS.Chart("leafletChartContainer",
      {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: selectedTown + " településen található cégek, és vagyona / mill",
          fontSize: 20
        },
        data: [
          {
            type: "bar",
            indexLabelPlacement: "outside",
            indexLabelOrientation: "horizontal",
            dataPoints: db
          }
        ]
      });
    chart.render();
  };

}
