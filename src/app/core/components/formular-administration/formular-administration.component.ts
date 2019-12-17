import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { FormularService } from '../services/formular.service';
import { Observable } from 'rxjs';
import { Formular } from '../models/formular.model';

@Component({
    selector: 'formular-administration',
    templateUrl: './formular-administration.component.html',
    styleUrls: ['./formular-administration.component.scss']
})
export class FormularAdministrationComponent implements OnInit {
    formGroup: FormGroup;
    public elementRows: FormArray;
    public formulars$: Observable<Formular[]>;
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

    constructor(
        private fb: FormBuilder,
        private formularService: FormularService
        ) {
        this.formGroup = this.fb.group({
            name: '',
            formElements: this.fb.array([])
        });
    }

    ngOnInit() {
        this.elementRows = this.formGroup.get('formElements') as FormArray;
        this.formularService.getAll().subscribe();
        this.formularService.getByName("new formular").subscribe();
    }

    public search(text: string) {
        this.formularService.getByName(text).subscribe((x: Formular) => {
            this.formGroup = this.fb.group({
                name: x.name,
                formElements: this.fb.array([])
            });
            this.elementRows = this.formGroup.get('formElements') as FormArray;
            let field: any;
            for(field of x.fields) {
                let form = this.createFormRow(field.name, field.type, field.quantity, field.validator);
                const labels = form.controls.radioButtonLabels as FormArray;
                field.radioButtonFields.forEach(label => {
                    labels.push(this.radioButtonGroup(label.name));
                });
                this.elementRows.push(form);
            }
        });
    }

    public addRow() {
        this.elementRows.push(this.createFormRow());
    }

    private createFormRow(name?: string, type?: string, quantity?: number, validator?: string) {
        return this.fb.group({
            name: name,
            type: type,
            quantity: quantity,
            radioButtonLabels: this.fb.array([]),
            validator: validator
        });
    }

    public changeValue(e, index, field) {
        const form = this.getFormGroup(index);
        form.get(field).setValue(e.target.value, {
            onlySelf: true
        })
    }

    public changeQuantity(e, index) {
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

    private radioButtonGroup(label?: string): FormGroup {
        return this.fb.group({
            label: label
        });
    }

    public getFormGroup(index): FormGroup {
        const formGroup = this.elementRows.controls[index] as FormGroup;
        return formGroup;
    }

    public onSubmit() {
        console.log(this.formGroup);
    }
}