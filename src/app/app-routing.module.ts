import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { SellerViewComponent } from './components/seller-view/seller-view.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {path: 'admin', component: AdminViewComponent},
  {path: 'vendedor',  component: SellerViewComponent },
  {path: 'login',  component: LoginComponent },
  {path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: '**', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
