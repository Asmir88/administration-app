import { Injectable } from '@angular/core';
import { Formular } from '../models/formular.model';
import { endPoint } from 'config';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: "root"
})
export class FormularService {
    constructor(private http: HttpClient) { }

    public getAll(): Observable<Formular[]> {
        return this.http.get<Formular[]>(`${endPoint}/formulars`).pipe(
            tap(x => console.log(x)),
            catchError(x => this.handleError(x))
        );
    }

    public getByName(text: string): Observable<Formular> {
        return this.http.get<Formular>(`${endPoint}/formulars/findByName/${text}`).pipe(
            tap(x => console.log(x)),
            catchError(x => this.handleError(x))
        );
    }

    private handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }
}