import { ChangeDetectionStrategy, Component, computed, signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { SettingsService } from '../../../../core/services/settings';


Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class ProductDetailsComponent {
  

  public loading = signal(true);
  public error = signal<string | null>(null);

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private settingsService = inject(SettingsService); 

  private theme = toSignal(this.settingsService.getTheme());

  private productStream$ = this.route.paramMap.pipe(
    map(params => params.get('id')),
    filter((id): id is string => !!id), 
    map(id => +id),
    tap(() => { this.loading.set(true); this.error.set(null); }),
    switchMap(id => 
      this.productService.getProductById(id).pipe(
        catchError(err => {
          console.error(err);
          this.error.set('Failed to load product. Please try again.');
          return of(null);
        })
      )
    ),
    tap(() => this.loading.set(false))
  );

  public product = toSignal(this.productStream$, { initialValue: null });

  public salesChartType: ChartType = 'bar';
  public salesChartOptions = computed(() => {
    const isDark = this.theme() === 'dark';
    const textColor = isDark ? '#f5f5f5' : '#666';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: any) => `$${value}k`,
            color: textColor 
          },
          grid: { color: gridColor }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: textColor 
          }
        },
        title: {
          display: true,
          text: 'Monthly Sales Revenue',
          color: textColor 
        }
      }
    } as ChartConfiguration['options']; 
  });

  public salesChartData = computed(() => {
    const p = this.product(); 
    if (!p) {
      return { labels: [], datasets: [] };
    }
    const mockSales = Array.from({ length: 12 }, () => Math.floor(Math.random() * 50) + 10);
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        { 
          data: mockSales, 
          label: `${p.title} Sales`,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
  });

  constructor() {} 
}