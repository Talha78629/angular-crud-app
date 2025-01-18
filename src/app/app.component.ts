import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone:false,
  templateUrl: './app.component.html',

  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'crud-app';

  displayedColumns: string[] = ['productName', 'category', 'price', 'date', 'freshness', 'action'];
  dataSource!: MatTableDataSource<any>;

  // Chart data
  barChartData: any;
  chartOptions: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  // Open dialog to add new product
  openDialog(): void {
    this.dialog.open(DialogComponent, {
      width: '30%',
    }).afterClosed().subscribe((val) => {
      if (val === 'Save') {
        this.getAllProducts();
      }
    });
  }
// Get all products from the server
  getAllProducts() {
    this.api.getProduct().subscribe({
      next: (res) => {
        // Update table data
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // Update chart data
        const labels = res.map((item: any) => item.productName);
        const prices = res.map((item: any) => item.price);

        this.barChartData = {
          labels: labels,
          datasets: [
            {
              label: 'Product Prices',
              data: prices,
              backgroundColor: '#42A5F5',
            },
          ],
        };

        this.chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
          scales: {
            x: {
              ticks: {
                maxRotation: 90,
                minRotation: 45,
              },
            },
            y: {
              beginAtZero: true,
            },
          },
          elements: {
            bar: {
              barThickness: res.length === 1 ? 40 : 'flex',
              maxBarThickness: 50,
            },
          },
        };
      },
      error: () => {
        alert('Error while fetching records');
      },
    });
  }
// Edit product
  editProduct(row: any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: row,
    }).afterClosed().subscribe((val) => {
      if (val === 'Update') {
        this.getAllProducts();
      }
    });
  }

  // Delete product
  deleteProduct(id: number) {
    this.api.deleteProduct(id).subscribe({
      next: () => {
        alert('Deleted successfully');
        this.getAllProducts();
      },
      error: () => {
        alert('Failed to delete');
      },
    });
  }

  // Apply filter to data
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
