import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { FormComponent } from './form/form.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { OverviewComponent } from './overview/overview.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ProductComponent } from './product/product.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LoaderComponent, FormComponent, ProductsListComponent,
    OverviewComponent, LoginComponent, FooterComponent, HeaderComponent, ProductComponent],
  exports: [LoaderComponent, FormComponent, ProductsListComponent,
    OverviewComponent, LoginComponent, FooterComponent, HeaderComponent, ProductComponent],
  entryComponents: [FormComponent, LoaderComponent, ProductsListComponent]
})
export class ComponentsModule { }
