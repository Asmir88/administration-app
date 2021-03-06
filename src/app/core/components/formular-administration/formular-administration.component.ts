import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { FormularService } from '../services/formular.service';
import { Observable, Subscription } from 'rxjs';
import { Formular } from '../models/formular/formular.model';

@Component({
    selector: 'formular-administration',
    templateUrl: './formular-administration.component.html',
    styleUrls: ['./formular-administration.component.scss']
})
export class FormularAdministrationComponent implements OnInit, OnDestroy {
    formGroup: FormGroup;
    public elementRows: FormArray;
    public formulars$: Observable<Formular[]>;
    public range = 10; //the max number of labels/options for radio
    private subscriptions: Subscription[] = [];
    public isSaving = false;
    public showSubmit = false; //initially hidden
    public types = [
        { value: "textbox", text: "Textbox" },
        { value: "checkbox", text: "Checkbox" },
        { value: "radiobutton", text: "Radio button" }
    ];

    public validators = [
        { value: "required", text: "Mandatory" },
        { value: "numeric", text: "Number" },
        { value: "none", text: "None" }
    ];

    public successMessage: string;
    public errorMessage: string;
    public showSuccessMessage: boolean = false;
    public showErrorMessage: boolean = false;

    constructor(
        private fb: FormBuilder,
        private formularService: FormularService
    ) {
        this.formGroup = this.fb.group({
            id: new FormControl(null),
            name: new FormControl(null, Validators.required),
            fields: this.fb.array([])
        });
    }

    ngOnInit() {
        this.elementRows = this.formGroup.get('fields') as FormArray;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(x => x.unsubscribe());
    }

    public search(text: string) {
        if (text) {
            text = text.trim();
            this.subscriptions.push(
                this.formularService.getByName(text).subscribe((x: Formular) => {
                    this.initializeForm(x, text);
                    this.showSubmit = true;
                    this.showSuccessMessage = false;
                    this.showErrorMessage = false;
                },
                    error => this.handleError(error)
                )
            );
        }
    }

    //used to reinitialize form after creating or updating formular
    private initializeForm(formular: Formular, defaultName?: string) {
        this.formGroup = this.fb.group({
            name: formular && formular.id ? formular.name : defaultName,
            fields: this.fb.array([])
        });
        this.elementRows = this.formGroup.get('fields') as FormArray;
        if (formular != null) {
            this.formGroup.addControl('id', new FormControl(formular.id));
            let field: any;
            for (field of formular.fields.sort((a, b) => a.id - b.id)) {
                let form = this.createFormRow(field.id, field.name, field.type, field.quantity, field.validator);
                const labels = form.controls.radioButtonFields as FormArray;
                field.radioButtonFields.sort((a, b) => a.id - b.id).forEach(label => {
                    labels.push(this.createRadioButtonGroup(label.id, label.name));
                });
                this.elementRows.push(form);
            }
        } else {
            this.addRow();
        }
    }

    public addRow() {
        this.elementRows.push(this.createFormRow());
    }

    private createFormRow(id?: number, name?: string, type?: string, quantity?: number, validator?: string) {
        const form = this.fb.group({
            name: new FormControl(name, Validators.required),
            type: new FormControl(type, Validators.required),
            quantity: new FormControl(quantity),
            radioButtonFields: this.fb.array([]),
            validator: new FormControl(validator, Validators.required)
        });
        if (id) {
            form.addControl('id', new FormControl(id));
        }
        return form;
    }

    public changeValue(e, index, field) {
        const form = this.getFormGroup(index);
        form.get(field).setValue(e.target.value, {
            onlySelf: true
        })

        if (field == "type") {
            if (e.target.value == 'radiobutton') {
                form.get('quantity').setValidators([Validators.required]);
                form.get('quantity').updateValueAndValidity();
            } else {
                form.get('quantity').clearValidators();
                form.get('quantity').updateValueAndValidity();
                form.get('quantity').reset();
                let labels = form.controls.radioButtonFields as FormArray;
                labels.clear();
            }
        }
    }

    //used to set labels for radio button (add new or remove existing)
    public changeQuantity(e, index) {
        const form = this.getFormGroup(index);
        form.get('quantity').setValue(e.target.value, {
            onlySelf: true
        })
        const fieldsAmount: number = form.get('quantity').value;
        const labels = form.controls.radioButtonFields as FormArray;
        const labelsAmount = labels.length;
        if (labelsAmount > fieldsAmount) {
            for (let step = labelsAmount - 1; step >= fieldsAmount; step--) {
                labels.removeAt(step);
            }
        } else if (labelsAmount < fieldsAmount) {
            for (let step = 0; step < fieldsAmount - labelsAmount; step++) {
                labels.push(this.createRadioButtonGroup());
            }
        } else {
            for (let step = 0; step < fieldsAmount; step++) {
                labels.push(this.createRadioButtonGroup());
            }
        }
    }

    private createRadioButtonGroup(id?: number, label?: string): FormGroup {
        const form = this.fb.group({
            name: new FormControl(label, Validators.required)
        });

        if (id) {
            form.addControl('id', new FormControl(id));
        }
        return form;
    }

    public getFormGroup(index): FormGroup {
        const formGroup = this.elementRows.controls[index] as FormGroup;
        return formGroup;
    }

    public onSubmit() {
        if (this.formGroup.valid) {
            this.isSaving = true;
            if (this.formGroup.value.id != null) {
                this.subscriptions.push(
                    this.formularService.update(this.formGroup.value)
                        .subscribe(x => {
                            this.initializeForm(x);
                            this.isSaving = false;
                            this.successMessage = 'Formular updated';
                            this.showSuccessMessage = true;
                            this.showErrorMessage = false;
                        },
                            error => this.handleError(error)
                        )
                );
            } else {
                this.subscriptions.push(
                    this.formularService.create(this.formGroup.value)
                        .subscribe(x => {
                            this.initializeForm(x);
                            this.isSaving = false;
                            this.successMessage = 'Formular created';
                            this.showSuccessMessage = true;
                            this.showErrorMessage = false;
                        },
                            error => this.handleError(error)
                        )
                );
            }
        } else {
            this.errorMessage = "Form is invalid. All fields must be filled in.";
            this.showErrorMessage = true;
        }
    }

    isSelectable(option: string, form: any) {
        const type = form.get('type').value;
        if (option == 'numeric' && (type == 'checkbox' || type == 'radiobutton')) {
            return true
        }

        return false;
    }

    private handleError(error) {
        this.isSaving = false;
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
    }

    closeSuccessAlert() {
        this.showSuccessMessage = false;
    }

    closeErrorAlert() {
        this.showErrorMessage = false;
    }
}