import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NumberRangePipe } from './pipes/number-range.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        NumberRangePipe
    ],
    exports: [
        NumberRangePipe
    ]
})
export class SharedModule { }