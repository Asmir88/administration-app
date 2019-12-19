import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { FormularService } from '../services/formular.service';
import { Observable, Subscription } from 'rxjs';
import { Formular } from '../models/formular.model';

@Component({
    selector: 'formular-administration',
    templateUrl: './formular-administration.component.html',
    styleUrls: ['./formular-administration.component.scss']
})
export class FormularAdministrationComponent implements OnInit, OnDestroy {
    formGroup: FormGroup;
    public elementRows: FormArray;
    public formulars$: Observable<Formular[]>;
    public range = 10;
    private subscriptions: Subscription[] = [];
    public isSaving = false;
    public types = [
        { value: "textbox", text: "Textbox"},
        { value: "checkbox", text: "Checkbox"},
        { value: "radiobutton", text: "Radio button"}
    ];

    private allValidators = [
        { value: "required", text: "Mandatory"},
        { value: "numeric", text: "Number"},
        { value: "none", text: "None"}
    ];

    private selectionFieldValdiators = [
        { value: "required", text: "Mandatory"},
        { value: "none", text: "None"}
    ];

    public validators = this.allValidators;

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
        this.formularService.getAll().subscribe();
        this.formularService.getByName("new formular").subscribe();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(x => x.unsubscribe());
    }

    public search(text: string) {
        if (text) {
            this.subscriptions.push(
                this.formularService.getByName(text).subscribe((x: Formular) => {
                    this.initializeForm(x, text);
                },
                    error => this.handleError(error)
                )
            );
        }
    }

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
                    labels.push(this.radioButtonGroup(label.id, label.name));
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

        if (e.target.value == 'radiobutton') {
            form.get('quantity').setValidators([Validators.required]);
            form.get('quantity').updateValueAndValidity();
        } else {
            form.get('quantity').clearValidators();
            form.get('quantity').updateValueAndValidity();
        }
    }

    public getValidatorList(type: string) {
        if (type == 'textbox') {
            return this.allValidators;
        } else {
            return this.selectionFieldValdiators;
        }
    }

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
                labels.push(this.radioButtonGroup());
            }
        } else {
            for (let step = 0; step < fieldsAmount; step++) {
                labels.push(this.radioButtonGroup());
            }
        }
    }

    private radioButtonGroup(id?: number, label?: string): FormGroup {
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
                    this.formularService.updateFormular(this.formGroup.value)
                        .subscribe(x => {
                            this.initializeForm(x);
                            this.isSaving = false;
                        },
                            error => this.handleError(error)
                        )
                    );
            } else {
                this.subscriptions.push(
                    this.formularService.createFormular(this.formGroup.value)
                        .subscribe(x => {
                            this.initializeForm(x);
                            this.isSaving = false;
                        },
                            error => this.handleError(error)
                        )
                );
            }
        }
        console.log(this.formGroup);
    }
    
    public hasError(form: FormGroup, field: string) {
        return (
            form.get(field).errors &&
            form.get(field).errors.required
        )
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
}