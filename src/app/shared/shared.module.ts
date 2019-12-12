import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module';

@NgModule({
    imports: [
        AngularMaterialModule,
        CommonModule,
        ReactiveFormsModule
    ],
    declarations: [],
    exports: [
        CommonModule,
        ReactiveFormsModule
    ]
})
export class SharedModule { }