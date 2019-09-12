import { Component, OnInit } from '@angular/core';
import { OdataServiceService } from '../odata-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import proj4 from 'proj4';

import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { fromLonLat } from 'ol/proj';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { Fill, Stroke, Style, Text } from 'ol/style.js';
import Select from 'ol/interaction/Select.js';
import { click, pointerMove, altKeyOnly } from 'ol/events/condition.js';
import { register } from 'ol/proj/proj4';
import { get as getProjection } from 'ol/proj';
import { getArea } from 'ol/sphere';
import colormap from 'colormap';
import { asapScheduler } from 'rxjs';
import * as CanvasJS from '../../assets/canvasjs/canvasjs.min.js';


@Component({
  selector: 'app-openlayer',
  templateUrl: './openlayer.component.html',
  styleUrls: ['./openlayer.component.css']
})
export class OpenlayerComponent implements OnInit {
  map: OlMap;
  source: OlXYZ;
  layer: OlTileLayer;
  view: OlView;
  regionSUM: Array<{ money: number, region_id: string }>;

  constructor(private http: HttpClient, private odata: OdataServiceService) { }

  ngOnInit() {

    this.odata.getData('?opt=SUM').subscribe(
      (data3: any) => {
        this.regionSUM = data3;
        this.draw_map();
        this.draw_chart(this.regionSUM.map((o) => ({ label: o.region_id, y: o.money / 1000000 })));

      });//~sum

  };//~ngOnInit

  draw_map() {
    let that = this;
    let min;//= 1e3; // the smallest area
    let max;//= 3e10; // the biggest area
    max = Math.max(...this.regionSUM.map(o => o.money));/// 235;
    min = Math.min(...this.regionSUM.map(o => o.money));
    //console.log(min);
    //console.log(max);
    //console.log(max - min);

    const steps = 10;
    const ramp = colormap({
      colormap: 'portland',
      nshades: steps,
      alpha: [1, 1]
    });

    function clamp(value: number, low: number, high: number) {
      return Math.max(low, Math.min(value, high));
    }

    function getMoney(name: string) {
      for (let i = 0; i < that.regionSUM.length; ++i) {
        if (that.regionSUM[i].region_id == name) {
          if (name == 'Budapest') {
            //console.log('asd' + that.regionSUM[i].money)
          }

          return that.regionSUM[i].money;
        }
      }
      return min;
    };

    function getColor(feature) {
      //console.log(feature.get('name'));
      const money = getMoney(feature.get('name'));//getArea(feature.getGeometry());
      const f = Math.pow(clamp((money - min) / (max - min), 0, 1), 1 / 4);
      const index = Math.round(f * (steps - 1));
      return ramp[index];
    }

    var defaultStyle: Style =
      function (feature, resolution: number) {
        let newstyle = new Style({
          fill: new Fill({
            color: getColor(feature)
          }),
          stroke: new Stroke({
            color: 'black',
            width: '1'
          }),
          text: new Text({
            font: clamp(20 - resolution / 50, 8, 20) + 'px Calibri,sans-serif',
            overflow: true,
            fill: new Fill({
              color: 'white'
            })
          })
        });

        newstyle.getText().setText(feature.get('name'));
        return newstyle;

      }

    var selectedStyle =
      function (feature, resolution: number) {
        let newstyle = new Style({
          fill: new Fill({
            color: getColor(feature)
          }),
          stroke: new Stroke({
            color: 'red',
            width: '1'
          }),
          text: new Text({
            font: clamp(20 - resolution / 50, 8, 20) + 'px Calibri,sans-serif',
            overflow: true,
            fill: new Fill({
              color: 'white'
            })
          })
        });

        newstyle.getText().setText(feature.get('name'));
        return newstyle;

      }

    var invisStyle =
      function (feature) {
        return new Style({
          fill: new Fill({
            color: 'rgba(255, 30, 30, 0)'
          }),
          stroke: new Stroke({
            color: 'red',
            width: '1'
          })
        });
      }

    proj4.defs("EPSG:23700", "+proj=somerc +lat_0=47.14439372222222 +lon_0=19.04857177777778 +k_0=0.99993 +x_0=650000 +y_0=200000 +ellps=GRS67 +towgs84=52.17,-71.82,-14.9,0,0,0,0 +units=m +no_defs");
    register(proj4);


    this.odata.getData('?opt=REGION').subscribe((regiongeojson: any) => {

      var vectorSourceRegion = new VectorSource({
        features: (new GeoJSON()).readFeatures(regiongeojson)
      });

      var vectorLayerRegion = new VectorLayer({
        source: vectorSourceRegion,
        style: defaultStyle,
        declutter: true,
        zIndex: 0
      });

      var OMEGA = new VectorSource({
      });
      var DELTA = new VectorLayer({
        source: OMEGA,
        style: defaultStyle,
        declutter: true,
        zIndex: 1
      });

      this.source = new OlXYZ({
        url: 'http://tile.osm.org/{z}/{x}/{y}.png'
      });

      this.layer = new OlTileLayer({
        source: this.source
      });

      this.view = new OlView({
        center: fromLonLat([6, 2]),
        zoom: 7.3,
        projection: getProjection("EPSG:23700")
      });

      this.map = new OlMap({
        target: 'openmap',
        layers: [this.layer, vectorLayerRegion, DELTA],
        view: this.view
      });

      var that = this;
      var ClickedRegion = null;
      var SelectedFeatures = [];
      var RegionSource: VectorSource = this.map.getLayers().item(1).getSource();
      var DeltaSource: VectorSource = this.map.getLayers().item(2).getSource();

      /**
       * Az alábbi kód valósítja meg az általunk létrehozott funkcionalitásokat  egérrel való interakciók során a térképen és szavak... ( nézd meg a pikachu rajzomat tök cukiii)
       * 
       */
      var select = new Select({
        //condition: pointerMove //for hover
      });
      this.map.addInteraction(select);
      select.on('select', function (e: any) {
        e.deselected.forEach(deselected => {
          //todo kulon szedni megye és varos deselectet ?? nem biztos
          deselected.setStyle(defaultStyle);
          var index = SelectedFeatures.indexOf(deselected);
          SelectedFeatures.splice(index, 1);
        });
        e.selected.forEach(selected => {
          //ha megyere kattintunk
          if (RegionSource.hasFeature(selected)) {
            selected.setStyle(invisStyle);
            console.log('megyere kattint');

            DeltaSource.clear();
            //Kulthatárok hozzáadása
            that.odata.getData('?opt=KULTHAT' + '&region=' + encodeURI(selected.get('name'))).subscribe((data: any) => {
              DeltaSource.addFeatures((new GeoJSON()).readFeatures(data));

            });
            ClickedRegion = selected;
          }
          else //ha varosra kattintunk
          {
            console.log('varosra kattint');
            selected.setStyle(selectedStyle);
            SelectedFeatures.push(selected);
          }
        });
        // Térkép alatti szöveg
        var citynames = '';
        if (ClickedRegion)
          citynames = ClickedRegion.get('name') + ': '
        if (SelectedFeatures[0])
          citynames += SelectedFeatures[0].get('name');
        for (var i = 1; i < SelectedFeatures.length; ++i)
          citynames += ' + ' + SelectedFeatures[i].get('name');
        document.getElementById('status').innerHTML = citynames ? citynames : '';

      });//~select.on
    });//~regionjson
  };

  draw_chart(db: Array<{ y: number, label: string }>) {

    //Budapest eltorzítani a grafikont a gazdagságával.
    for (let i = 0; i < db.length; ++i)
      if (db[i].label == 'Budapest') {
        db[i].y /= 10;
        break;
      }

    var chart = new CanvasJS.Chart("chartContainer",
      {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Cégek vagyona /mill forint (Budapest /10mill)",

          fontSize: 20
        },
        data: [
          {
            type: "column",
            //indexLabel: "{label}, {y}",
            indexLabelPlacement: "outside",
            indexLabelOrientation: "horizontal",
            dataPoints: db
          }
        ]
      });
    chart.render();
  };

}//~OpenlayerComponent

//                                                           -do                                     
//                                                         /MMN`                                    
//                                                         oMMMM:                                    
// shys+:-`                                               /MMMMM/                                    
// `sMMMMNNmy+-.                                         -sdMMMM+                                    
//   :dMMMMMMh:///-.                                    `o-:+dMM/                                    
//   `+mMMMMd----::/:-`                                +:---:yM:                                    
//     `+mMMN:------:://-`                            .o------h`                                    
//       `/dMs::--------://-                          +:------y                                     
//         `-o++//::------:/+:`                      `o------:o                                     
//             `-+++//::------:+:..--..--..`          /:------o:                                     
//               `-/+++/::----:+:://:://::://:..     o------:s                                      
//                   `.-/+++/-----------------:::/:.  o-----:++                                      
//                       -o:---------------------://:s----:/s`                                      
//                       .+--------------------------:++:--/o:                                       
//                     .+--:///:----------------------::-/++                                        
//                     `s--/dNs:s/-----------------------:oo                                         
//                   `o:--sMMdsm+-----------------------:s                                          
//                   `ss/--:ymmdo------:---------::::-----+                                          
//                 -yssh:------------:s/------:ho-yd/---:/                                          
//                 hsssy+------/+//+oo+:------/MmhNMs---o`                                          
//                 .hsssh/-------mmmmmmmds/:::--omNNh:--:+                                           
//                 hssys-------:mhyyyyhdmmds/----------o.                                           
//                 /yo+--------:h+++++oshmh:---------::s    `-::::/                                 
//                   o-----------y+++++++sy:-------:syyyy:////:----y/`                               
//                   `o----------y++++++so--------+ysssss----------:/o                               
//             .://///+o++++:----+y+++so:--------/hssssy:----------/s`                               
//           :+:-----------:/++/--/oo+:----------+yssyo:---------osy:.``                             
//         +:-----------------/+o:---------------syo:---------:o/::::////////::---.                 
//         s--------------------+s/::::-----://++::--------::oo:---------------::::///:--`          
//         s--------------------os////:-----:::---------::/ooh------------------------:::://:-.     
//         .+/::::::::::---::::+s:-------------------:://++::+--/::-------------------------:::o:   
//           `/+o+////////+ooo+/+:------------------:///o+-` o--:////::-----------------------:/-`   
//             `.:y++ooo++/::---------------------://++/.   `s--/////////::-----------------:/-`     
//               +/------------------------------:+o+-`     +:-:////////////::------------:/-`       
//             .o-------------------------------:/s        s--////o++++++/////::-------:/-`         
//             s:--------------------------------/+ ./:-..:+-:///o:  `..-//+++++/:---:/:`           
//             +/---------------------------------+: `y///:/--://o-          `..:/++//:`             
//           -o----------------------------------/:  y////:--/+o.                 `..               
//           o-----------------------------------:+  s+++o++/+o.                                    
//           +:------------------------------------o-.ohyyh ..-`                                     
//         -+-------------------------------------/mhhdddy                               ff     ff    
//         o---------------------------------------ydhhdds                             f   f   f   f    
//         -+---------------------------------------:s`.:/-                           f     f f     f   
//         -+--::------------------------------------o`                               f      f      f  
//         +://////:::::::::::::///////////::::-----+.                                f   CSERÉP    f   
//         `/s+++/////////++++++++++////////////::-:o                                  f     <3    f   
//       `:/+/:/+o//oos+////:::+ossyyo+++++//////+/oo`                                  f    MÁTÉ f              
//     oyys+//+oo++//-             `.-:://+ssoooo//++//.                                 f       f             
//     -::----.`                           `//////:-:+yhy+`                               f     f             
//                                                 `--:/+sho                               f   f
//                                                                                          f f
//                                                                                           f 



