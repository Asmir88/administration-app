import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';

const modules: any[] = [
  LayoutModule,
];

@NgModule({
  imports: [ ...modules ],
  exports: [ ...modules ]
  
})
export class AngularMaterialModule { }