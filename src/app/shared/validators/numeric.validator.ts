import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidationErrors, Validator, FormControl, ValidatorFn } from '@angular/forms';
@Directive({
    selector: '[validNumber]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: NumericValidator, multi: true }
    ]
})
export class NumericValidator implements Validator {
    validate(control: FormControl): ValidationErrors | null {
        return NumericValidator.validateNumber(control);
    }
    static validateNumber(control: FormControl): ValidationErrors {
        if (isNaN(control.value)) {
            return { mustBeNumeric: 'Value must be number' };
        }
        return null;
    }
}