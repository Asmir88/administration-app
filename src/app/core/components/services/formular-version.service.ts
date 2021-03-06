import { Injectable } from '@angular/core';
import { endPoint } from 'config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormularVersion } from '../models/formular-version/formular-version.model';
import { Formular } from '../models/formular/formular.model';

@Injectable({
    providedIn: "root"
})
export class FormularVersionService {
    constructor(private http: HttpClient) { }

    public getAll(): Observable<FormularVersion[]> {
        return this.http.get<FormularVersion[]>(`${endPoint}/formularVersions`);
    }

    public find(id: number, version: string): Observable<FormularVersion | Formular> {
        return this.http.get<FormularVersion | Formular>(`${endPoint}/formularVersions/findVersion/${id}/${version}`);
    }

    public create(formularVersion: FormularVersion): Observable<FormularVersion> {
        return this.http.post<FormularVersion>(`${endPoint}/formularVersions`, formularVersion);
    }

    public update(formularVersion: FormularVersion): Observable<FormularVersion> {
        return this.http.put<FormularVersion>(`${endPoint}/formularVersions/${formularVersion.id}`, formularVersion);
    }
}