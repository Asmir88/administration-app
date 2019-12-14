import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularComponent } from './components/formular.component';
import { CoreRoutingModule } from './core-routing.module';
import { FormularDetailsComponent } from './components/formular-details/formular-details.component';
import { FormularAdministrationComponent } from './components/formular-administration/formular-administration.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        CoreRoutingModule,
        ReactiveFormsModule
    ],
    declarations: [
        FormularComponent,
        FormularAdministrationComponent,
        FormularDetailsComponent
    ],
    exports: [
        FormularComponent
    ]
})
export class CoreModule { }