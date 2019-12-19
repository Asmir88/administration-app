import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NumberRangePipe } from './pipes/number-range.pipe';
import { NumericValidator } from './validators/numeric.validator';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        NumberRangePipe,
        NumericValidator
    ],
    exports: [
        NumberRangePipe,
        NumericValidator
    ]
})
export class SharedModule { }