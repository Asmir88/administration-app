import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularVersionComponent } from './components/formular-version/formular-version.component';
import { FormularAdministrationComponent } from './components/formular-administration/formular-administration.component';

const secondaryRoutes: Routes = [
  { path: 'formular-details',  component: FormularVersionComponent },
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