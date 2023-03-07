import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminViewComponent } from './components/admin-view/admin-view.component';

const routes: Routes = [
  {path: 'admin', component: AdminViewComponent},
  {path: '', redirectTo: 'admin', pathMatch: 'full' },
  {path: '**', redirectTo: 'admin', pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
