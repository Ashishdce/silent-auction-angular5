import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ComponentsModule } from '../../components/components.module';
import { FormComponent } from '../../components/form/form.component';
import { ProductsListComponent } from '../../components/products-list/products-list.component';
import { ProductComponent } from '../../components/product/product.component';
@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
        children: [
          {
            path: 'edit_product/:id',
            component: FormComponent,
          },
          {
            path: 'add_product',
            component: FormComponent,
          },
          {
            path: 'category',
            component: ProductsListComponent,
          },
          {
            path: 'my_offers',
            component: ProductsListComponent,
          },
          {
            path: 'product/:id',
            component: ProductComponent,
          },
          {
            path: '',
            redirectTo: 'category',
            pathMatch: 'full',
          },
          {
            path: '**',
            redirectTo: 'category',
            pathMatch: 'full',
          }
        ]
      }
    ])
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
