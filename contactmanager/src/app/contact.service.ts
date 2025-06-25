import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { Contact } from './contact';

@Injectable({
    providedIn: 'root',
})

export class ContactService {
    baseUrl = 'http://localhost/contactmanagerangular/contactapi';

    constructor(private http: HttpClient)
    {
        // No statements required
    }

    getAll() {
        return this.http.get(`${this.baseUrl}/list`).pipe(
            map((res: any) => {
                return res['data'];
            })
        );
    }

    add(contact: Contact) {
        return this.http.post(`${this.baseUrl}/add`, {data: contact}).pipe(
            map((res: any) => {
                return res['data'];
            })
        );
    }

    edit(contact: Contact)
    {
        return this.http.put(`${this.baseUrl}/edit`, {data: contact});
    }

    delete(contactID: any)
    {
        const params = new HttpParams().set('contactID', contactID.toString());
        return this.http.delete(`${this.baseUrl}/delete`, {params: params});
    }
}