import { Component, HostListener } from '@angular/core';
import * as data from './data';
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  checked = false;
  searchText: string = '';
  selected = 'Name';
  maleFemale = '';
  survivedNot = '';
  placeholder = 'Filter by: ' + this.selected;
  dataJSON = data.data.data;
  newData = [];
  chartType: string = 'bar';

  title = '';
  dataName = [];
  dataFare = [];
  dataAge = [];
  dataSurvived = [];
  dataSex = [];
  dataPclass = [];
  SiblingsSpousesAboard = [];
  ParentsChildrenAboard = [];
  chartDatasets = [];
  chartLabels: Array<any> = [];

  chartColors: Array<any> = [];
  @HostListener('input') oninput() {
    this.maleFemale = '';
    this.survivedNot = '';
    this.filterLocalDataByMultipleFields(this.searchText, [this.selected]);
  }

  public chartOptions: any = {
    responsive: true,
    tooltips: {
      mode: 'index'
    },
    scales: {
      xAxes: [
        {
          display: false
        }
      ],
      yAxes: [
        {
          stacked: true
        }
      ]
    }
  };
  ngOnInit() {
    this.setChart(this.dataJSON);
  }
  setChart(json) {
    this.dataName = [];
    this.dataFare = [];
    this.dataAge = [];
    this.dataSurvived = [];
    this.dataSex = [];
    this.dataPclass = [];
    this.SiblingsSpousesAboard = [];
    this.ParentsChildrenAboard = [];
    this.chartDatasets = [];
    this.chartLabels = [];

    this.chartColors = [];
    for (const [index, item] of json.entries()) {
      const arr = [];
      const arr2 = [];

      arr.push(item.Age);

      arr2.push(item.Fare);
      const survived = item.Survived === 1 ? 'Yes' : 'No';
      this.chartLabels.push(
        item.Name + ', Sex: ' + item.Sex + ', Survived: ' + survived
      );

      this.dataAge.push(item.Age);
      this.dataFare.push(item.Fare);
      this.dataSurvived.push(item.Survived);
      this.dataPclass.push(item.Pclass);
      this.SiblingsSpousesAboard.push(item['Siblings/Spouses Aboard']);
      this.ParentsChildrenAboard.push(item['Parents/Children Aboard']);
    }
    this.chartDatasets = [
      { data: this.dataAge, label: 'Age' },

      { data: this.dataFare, label: 'Fare' },

      { data: this.dataPclass, label: 'Pclass' },
      { data: this.SiblingsSpousesAboard, label: 'Siblings/Spouses Aboard' },
      { data: this.ParentsChildrenAboard, label: 'Parents/Children Aboard' }
    ];
  }
  filterLocalDataByMultipleFields(searchKey: string, keys?: string[]) {
    const items = searchKey
      .split(' ')
      .map((x: { toLowerCase: () => void }) => x.toLowerCase());
    this.newData = this.dataJSON.filter((x: any) => {
      for (const item of items) {
        let flag = false;
        if (keys !== undefined) {
          for (const prop in x) {
            if (keys.includes(prop)) {
              if (
                x[prop]
                  .toString()
                  .toLowerCase()
                  .indexOf(item) !== -1
              ) {
                flag = true;
                break;
              }
            }
          }
        }
        if (keys === undefined) {
          for (const prop in x) {
            if (
              x[prop]
                .toString()
                .toLowerCase()
                .indexOf(item) !== -1
            ) {
              flag = true;
              break;
            }
          }
        }
        if (!flag) {
          return false;
        }
      }
      return true;
    });

    setTimeout(() => {
      this.setChart(this.newData);
    }, 200);
  }
  getDataSource() {
    return this.dataJSON;
  }
  selectionChange(e: any) {
    this.searchText = '';
    this.placeholder = 'Filter by: ' + e.value;
    this.setChart(this.dataJSON);
  }
  filterLocalDataBySex(searchKey: string) {
    this.newData = this.dataJSON.filter((x: any) => {
      let flag = false;

      if (x['Sex'] === searchKey) {
        flag = true;
      }

      if (!flag) {
        return false;
      }

      return true;
    });

    setTimeout(() => {
      this.setChart(this.newData);
    }, 200);
  }
  filterLocalDataBySurvived(searchKey: string) {
    this.newData = this.dataJSON.filter((x: any) => {
      let flag = false;
      if (x['Survived'].toString() === searchKey) {
        flag = true;
      }

      if (!flag) {
        return false;
      }

      return true;
    });

    setTimeout(() => {
      this.setChart(this.newData);
    }, 200);
  }
  onCheckedState(e) {
    this.survivedNot = '';
    this.searchText = '';
    if (e.value === 'all') {
      this.setChart(this.dataJSON);
    }
    if (e.value !== 'all') {
      this.filterLocalDataBySex(e.value);
    }
  }
  onCheckedSurvived(e) {
    this.maleFemale = '';

    this.searchText = '';
    console.log(e);
    if (e.value === 'all') {
      this.setChart(this.dataJSON);
    }
    if (e.value !== 'all') {
      this.filterLocalDataBySurvived(e.value);
    }
  }
}
