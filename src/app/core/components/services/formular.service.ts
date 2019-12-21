import { Injectable } from '@angular/core';
import { Formular } from '../models/formular/formular.model';
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
        return this.http.get<Formular[]>(`${endPoint}/formulars`);
    }

    public getByName(text: string): Observable<Formular> {
        return this.http.get<Formular>(`${endPoint}/formulars/findByName/${text}`);
    }

    public create(formular: Formular): Observable<Formular> {
        return this.http.post<Formular>(`${endPoint}/formulars`, formular);
    }

    public update(formular: Formular): Observable<Formular> {
        return this.http.put<Formular>(`${endPoint}/formulars/${formular.id}`, formular);
    }
}