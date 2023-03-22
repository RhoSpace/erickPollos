import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { AppRoutingModule } from './app-routing.module';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { HttpClientModule} from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SellerViewComponent } from './components/seller-view/seller-view.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminViewComponent,
    SellerViewComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
