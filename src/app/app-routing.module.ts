import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularComponent } from './core/components/formular.component';
import { CoreRoutingModule } from './core/core-routing.module';
import { FormularAdministrationComponent } from './core/components/formular-administration/formular-administration.component';
import { FormularDetailsComponent } from './core/components/formular-details/formular-details.component';

const routes: Routes = [
    {
        path: '', component: FormularAdministrationComponent, pathMatch: 'full',
        children: [
            {
                path: 'formular-details',
                component: FormularAdministrationComponent
            },
            {
                path: 'formular-administration',
                component: FormularDetailsComponent
            }
        ]
    }
];

@NgModule({
    imports: [CoreRoutingModule, RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }