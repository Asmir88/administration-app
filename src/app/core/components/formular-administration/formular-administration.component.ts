import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'formular-administration',
    templateUrl: './formular-administration.component.html',
    styleUrls: ['./formular-administration.component.scss']
})
export class FormularAdministrationComponent {
    formGroup: FormGroup

    constructor(fb: FormBuilder) {
        this.formGroup = fb.group({
        });
    }
}