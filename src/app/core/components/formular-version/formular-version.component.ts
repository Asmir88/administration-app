import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Formular } from '../models/formular/formular.model';
import { FormularService } from '../services/formular.service';
import { Subscription, Observable } from 'rxjs';
import { NumericValidator } from 'src/app/shared/validators/numeric.validator';
import { FormularVersionService } from '../services/formular-version.service';
import { FormularVersion } from '../models/formular-version/formular-version.model';

@Component({
    selector: 'formular-version',
    templateUrl: './formular-version.component.html',
    styleUrls: ['./formular-version.component.scss']
})
export class FormularVersionComponent {
    formGroup: FormGroup;
    public elementRows: FormArray;
    public formulars$: Observable<Formular[]>;
    public range = 10;
    private subscriptions: Subscription[] = [];
    public isSaving = false;
    public showSubmit = false;
    public formulars: Formular[] = [];
    public template: Formular | FormularVersion;
    public isSubmitted = false;

    constructor(
        private fb: FormBuilder,
        private formularService: FormularService,
        private formularVersionService: FormularVersionService
        ) {
        this.formGroup = this.fb.group({
            id: new FormControl(null),
            version: new FormControl(null, Validators.required),
            fields: this.fb.array([]),
            formular: new FormControl(null)
        });
    }

    public message: string;
    public showMessage: boolean = false;

    ngOnInit() {
        this.elementRows = this.formGroup.get('fields') as FormArray;
        this.formularService.getAll().subscribe(x => this.formulars = x);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(x => x.unsubscribe());
    }

    private initializeForm(template: any, version?: string) {
        this.formGroup = this.fb.group({
            id: template && template.version ? template.id : null,
            version: template && template.version ? template.version : version,
            fields: this.fb.array([]),
            formular: template && template.formular ? template.formular : template,
        });
        let isNew = true;
        if(template.id && template.version) {
            isNew = false;
        }
        this.elementRows = this.formGroup.get('fields') as FormArray;
        if (template != null) {
            this.formGroup.addControl('id', new FormControl(template.id));
            let field: any;
            for (field of template.fields.sort((a, b) => a.id - b.id)) {
                let form = this.createFormRow(isNew ? null : field.id, field.name, field.type, field.quantity, field.validator, field.value);
                const labels = form.controls.radioButtonFields as FormArray;
                field.radioButtonFields.sort((a, b) => a.id - b.id).forEach(label => {
                    labels.push(this.radioButtonGroup(isNew ? null : label.id, label.name));
                });
                this.elementRows.push(form);
            }
        } else {
            this.addRow();
        }
    }

    public loadVersion(formularId: number, version: string) {
        if (formularId && version) {
            version = version.trim();
            this.formularVersionService.find(formularId, version).subscribe(x => {
                this.template = x;
                if (x) {
                    this.initializeForm(x, version);
                    this.showSubmit = true;
                }
            });
        }
    }

    public addRow() {
        this.elementRows.push(this.createFormRow());
    }

    //handle field value for input type
    private transformValue(type: string, value: any): any {
        if (type == 'checkbox') {
            return value == 'true';
        }
        return value;
    }

    //creates another field row in the form - used in "add another row" functionality
    private createFormRow(id?: number, name?: string, type?: string, quantity?: number, validator?: string, value?: string) {
        const form = this.fb.group({
            name: new FormControl(name),
            type: new FormControl(type),
            quantity: new FormControl(quantity),
            radioButtonFields: this.fb.array([]),
            validator: new FormControl(validator),
            value: new FormControl(this.transformValue(type, value) )
        });
        if (id) {
            form.addControl('id', new FormControl(id));
        }
        if (validator == 'required') {
            form.get('value').setValidators([Validators.required]);
            form.get('value').updateValueAndValidity();
        } else if (validator == 'numeric') {
            form.get('value').setValidators([NumericValidator.validateNumber]);
            form.get('value').updateValueAndValidity();
        }
        return form;
    }

    //create form for radio button
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
        this.isSubmitted = true;
        if (this.formGroup.valid) {
            let formBody = this.formGroup;
            //field values are stored are string on the back end so they have to be converted to strings
            formBody.value.fields.forEach(element => {
                element.value = element.value != null ? element.value.toString() : element.value;
            });
            this.isSaving = true;
            if (this.formGroup.value.id != null) {
                this.subscriptions.push(
                    this.formularVersionService.update(this.formGroup.value)
                        .subscribe(x => {
                            //reinitialize form
                            this.initializeForm(x);
                            this.isSaving = false;
                            this.message = 'Version updated';
                            this.showMessage = true;
                        },
                            error => this.handleError(error)
                        )
                    );
            } else {
                this.subscriptions.push(
                    this.formularVersionService.create(this.formGroup.value)
                        .subscribe(x => {
                            //reinitialize form
                            this.initializeForm(x);
                            this.isSaving = false;
                            this.message = 'Version created';
                            this.showMessage = true;
                        },
                            error => this.handleError(error)
                        )
                );
            }
        }
    }

    private handleError(error) {
        this.isSaving = false;
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
    }

    closeAlert() {
        this.showMessage = false;
    }
}