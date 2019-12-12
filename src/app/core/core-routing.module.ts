import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularDetailsComponent } from './components/formular-details/formular-details.component';
import { FormularAdministrationComponent } from './components/formular-administration/formular-administration.component';

const secondaryRoutes: Routes = [
  { path: 'formular-details',  component: FormularDetailsComponent },
  { path: 'administration', component: FormularAdministrationComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(secondaryRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CoreRoutingModule { }