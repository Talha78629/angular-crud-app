import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  standalone:false,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  barChartData: any; // Data for the bar chart
  chartOptions: any; // Options for customizing the chart
  noDataFound: boolean = false; // Flag to handle no data scenario

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.http.get<any[]>('http://localhost:3000/productList/').subscribe(
      (data) => {
        if (data.length === 0) {
          this.noDataFound = true;
        } else {
          const productNames = data.map((item) => item.productName);
          const prices = data.map((item) => item.price);

          // Populate the bar chart data
          this.barChartData = {
            labels: productNames,
            datasets: [
              {
                label: 'Product Prices',
                data: prices,
                backgroundColor: '#42A5F5'
              }
            ]
          };
          this.noDataFound = false;
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.noDataFound = true;
      }
    );
  }
}
