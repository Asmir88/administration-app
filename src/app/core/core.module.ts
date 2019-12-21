import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularComponent } from './components/formular.component';
import { CoreRoutingModule } from './core-routing.module';
import { FormularVersionComponent } from './components/formular-version/formular-version.component';
import { FormularAdministrationComponent } from './components/formular-administration/formular-administration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NumberRangePipe } from '../shared/pipes/number-range.pipe';
import { FormularService } from './components/services/formular.service';
import { HttpClientModule } from '@angular/common/http';
import { FormularVersionService } from './components/services/formular-version.service';

@NgModule({
    imports: [
        CommonModule,
        CoreRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [
        FormularComponent,
        FormularAdministrationComponent,
        FormularVersionComponent
    ],
    exports: [
        FormularComponent,
        SharedModule,
        HttpClientModule
    ],
    providers: [
        NumberRangePipe,
        FormularService,
        HttpClientModule,
    ] 
})
export class CoreModule { }