import { Component, OnInit, OnChanges } from '@angular/core';
import * as CanvasJS from '../../../lib/canvasjs.min';
import { OdataService } from '../services/odata.service';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnInit {
  selectedYear: number = 2010;
  data: any = [];

  constructor(private odata: OdataService) { }

  ngOnInit() {
    this.odata
      .getYearSubject()
      .subscribe(n => { 
        console.log("ÉV FRISSÜLT");
        this.selectedYear = n;
        let url = null;
        if (this.odata.getAreaUrl() != null)
          url = this.odata.getAreaUrl();
        else
          url = this.odata.getDefaultUrl();
        this.refreshData(this.selectedYear, url); 
      });
    this.odata
      .getAreaSubject()
      .subscribe(url => {
        if (url != null) {
          this.refreshData(this.selectedYear, url);
        }
      });
  }

  refreshData(n: number, url: string): void {
    this.odata
      .getData(url)
      .subscribe((res: any) => {
        this.data = res.d.results;
        this.showGraph();
      });
  }

  showGraph(): void {
    let arr = [];
    this.data.forEach(function (item) {
      arr.push({label: item.TARS_ROV_NEV,y: item.JEGYZ_TOKE_ERT_HUF/1000000});
    });

    let name: string;
    if (this.odata.getRegionName() === null) {
      name = "Magyarország";
    } else if (this.odata.getCountyName() === null) {
      name = this.odata.getRegionName();
    } else if (this.odata.getCityName() === null) {
      name = this.odata.getCountyName();
    } else {
      name = this.odata.getCityName();
    }

    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: name,
        fontSize: 20
      },
      subtitles: [
        {
          text: "Jegyzett tőke / Millió HUF"
        }
      ],
      data: [ 
        {
          type: "doughnut",
          indexLabelPlacement: "outside",
          indexLabelOrientation: "horizontal",
          dataPoints: arr
        } 
      ],
      backgroundColor: "#F1F1F1"
    });
    
    chart.render();
  }
}
