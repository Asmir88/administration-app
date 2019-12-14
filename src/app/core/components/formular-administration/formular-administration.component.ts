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
    public range = 10;
    public types = [
        { value: "textbox", text: "Textbox"},
        { value: "checkbox", text: "Checkbox"},
        { value: "radiobutton", text: "Radio button"}
    ];

    public validators = [
        { value: "required", text: "Mandatory"},
        { value: "numeric", text: "Number"},
        { value: "none", text: "None"}
    ];

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
            name: null,
            type: null,
            quantity: null,
            radioButtonLabels: this.fb.array([]),
            validator: null
        });
    }

    changeValue(e, index, field) {
        const form = this.getFormGroup(index);
        form.get(field).setValue(e.target.value, {
            onlySelf: true
        })
    }

    changeQuantity(e, index) {
        const form = this.getFormGroup(index);
        form.get('quantity').setValue(e.target.value, {
            onlySelf: true
        })
        const fieldsAmount: number = form.get('quantity').value;
        const labels = form.controls.radioButtonLabels as FormArray;
        const labelsAmount = labels.length;
        if (labelsAmount > fieldsAmount) {
            for (let step = labelsAmount - 1; step >= fieldsAmount; step--) {
                labels.removeAt(step);
            }
        } else if (labelsAmount < fieldsAmount) {
            for (let step = 0; step < fieldsAmount - labelsAmount; step++) {
                labels.push(this.radioButtonGroup());
            }
        } else {
            for (let step = 0; step < fieldsAmount; step++) {
                labels.push(this.radioButtonGroup());
            }
        }
    }

    private radioButtonGroup(): FormGroup {
        return this.fb.group({
            label: ''
        });
    }

    getFormGroup(index): FormGroup {
        const formGroup = this.elementRows.controls[index] as FormGroup;
        return formGroup;
    }

    onSubmit() {
        console.log(this.formGroup);
    }
}