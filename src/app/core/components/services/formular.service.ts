import { Injectable } from '@angular/core';
import { Formular } from '../models/formular.model';
import { endPoint } from 'config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: "root"
})
export class FormularService {
    constructor(private http: HttpClient) { }

    public getAll(): Observable<Formular[]> {
        return this.http.get<Formular[]>(`${endPoint}/formulars`).pipe(
            tap(x => console.log(x))
        );
    }

    public getByName(text: string): Observable<Formular> {
        return this.http.get<Formular>(`${endPoint}/formulars/findByName/${text}`).pipe(
            tap(x => console.log(x))
        );
    }

    public createFormular(formular: Formular): Observable<Formular> {
        return this.http.post<Formular>(`${endPoint}/formulars`, formular).pipe(
            tap(x => console.log(x))
        );
    }

    public updateFormular(formular: Formular): Observable<Formular> {
        return this.http.put<Formular>(`${endPoint}/formulars/${formular.id}`, JSON.stringify(formular), {headers : new HttpHeaders({ 'Content-Type': 'application/json' })}).pipe(
            tap(x => console.log(x))
        );
    }
}