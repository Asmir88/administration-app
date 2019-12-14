import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
    selector: 'formular-administration',
    templateUrl: './formular-administration.component.html',
    styleUrls: ['./formular-administration.component.scss']
})
export class FormularAdministrationComponent implements OnInit {
    formGroup: FormGroup;
    public elementRows: FormArray;

    get getFormRow() {
        return this.formGroup.get('formElements') as FormArray;
    }

    constructor(private fb: FormBuilder) {
        this.formGroup = this.fb.group({
            formElements: this.fb.array([this.createFormRow()])
        });
    }

    ngOnInit() {
        this.elementRows = this.formGroup.get('formElements') as FormArray;
    }

    addRow() {
        this.elementRows.push(this.createFormRow());
    }

    createFormRow() {
        return this.fb.group({
            name: new FormControl([null]),
            type: new FormControl([null]),
            quantity: new FormControl([null]),
            radioButtonLabels: this.fb.array([this.fb.group({label: null})]),
            validator: new FormControl(['none'])
        });
    }

    changeQuantity(index) {
        const form = this.getFormGroup(index);
        const fieldsAmount: number = form.controls['quantity'].value;
        const labels = form.get('radioButtonLabels') as FormArray;
        const labelsAmount = labels.length;
        for (let step = 0; step < fieldsAmount; step++) {
            labels.push(this.fb.group({label: null}));
          }
    }

    getFormGroup(index): FormGroup {
        const formGroup = this.elementRows.controls[index] as FormGroup;
        return formGroup;
    }

    onSubmit() {
        console.log(this.formGroup);
    }
}