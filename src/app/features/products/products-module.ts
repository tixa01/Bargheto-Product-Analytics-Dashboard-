import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing-module';
import { Products } from './products';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { SharedModule } from '../../shared/shared-module';
import { ProductCard } from './components/product-card/product-card';
import { BaseChartDirective } from 'ng2-charts';


@NgModule({
  declarations: [
    Products,
    ProductListComponent,
    ProductDetailsComponent,
    ProductCard
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
    BaseChartDirective
    
  ]
})
export class ProductsModule { }
