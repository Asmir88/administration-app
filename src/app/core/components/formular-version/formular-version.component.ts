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
    public formulars: Formular[] = [];
    public template: Formular | FormularVersion;

    constructor(
        private fb: FormBuilder,
        private formularService: FormularService,
        private formularVersionService: FormularVersionService
        ) {
        this.formGroup = this.fb.group({
            id: new FormControl(null),
            name: new FormControl(null, Validators.required),
            fields: this.fb.array([])
        });
    }

    ngOnInit() {
        this.elementRows = this.formGroup.get('fields') as FormArray;
        this.formularService.getAll().subscribe(x => this.formulars = x);
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

    private initializeForm(template: Formular | FormularVersion, version?: string) {
        this.formGroup = this.fb.group({
            id: template && template instanceof FormularVersion ? template.id : null,
            version: template && template instanceof FormularVersion ? template.version : version,
            fields: this.fb.array([])
        });
        this.elementRows = this.formGroup.get('fields') as FormArray;
        if (template != null) {
            this.formGroup.addControl('id', new FormControl(template.id));
            let field: any;
            for (field of template.fields.sort((a, b) => a.id - b.id)) {
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

    public loadVersion(formularId: number, version: string) {
        if (formularId && version) {
            this.formularVersionService.findVersion(formularId, version).subscribe(x => {
                this.template = x;
                if (x) {
                    this.initializeForm(x, version);
                }
            });
        }
    }

    public addRow() {
        this.elementRows.push(this.createFormRow());
    }

    private createFormRow(id?: number, name?: string, type?: string, quantity?: number, validator?: string) {
        const form = this.fb.group({
            name: new FormControl(name),
            type: new FormControl(type),
            quantity: new FormControl(quantity),
            radioButtonFields: this.fb.array([]),
            validator: new FormControl(validator),
            value: new FormControl(null)
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
        //     this.isSaving = true;
        //     if (this.formGroup.value.id != null) {
        //         this.subscriptions.push(
        //             this.formularService.updateFormular(this.formGroup.value)
        //                 .subscribe(x => {
        //                     this.initializeForm(x);
        //                     this.isSaving = false;
        //                 },
        //                     error => this.handleError(error)
        //                 )
        //             );
        //     } else {
        //         this.subscriptions.push(
        //             this.formularService.createFormular(this.formGroup.value)
        //                 .subscribe(x => {
        //                     this.initializeForm(x);
        //                     this.isSaving = false;
        //                 },
        //                     error => this.handleError(error)
        //                 )
        //         );
        //     }
        }
        console.log(this.formGroup);
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
}