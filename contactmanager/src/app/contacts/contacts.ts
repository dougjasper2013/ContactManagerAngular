import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgForm } from '@angular/forms';

import { Contact } from '../contact';
import { ContactService } from '../contact.service';

import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-contacts',
  imports: [HttpClientModule, CommonModule, FormsModule],
  providers: [ContactService],
  templateUrl: './contacts.html',
  styleUrls: ['./contacts.css'],  
})
export class Contacts {
  title = 'ContactManager';
  public contacts: Contact[] = [];
  contact: Contact = {firstName:'', lastName:'', emailAddress:'', phone:'', status:'', dob:'', imageName:'', typeID: 0};

  error = '';
  success = '';

  constructor(private contactService: ContactService, private http: HttpClient)
  {
    // no statements required
  }

  ngOnInit()
  {
    this.getContacts();
  }

  getContacts(): void {
    this.contactService.getAll().subscribe(
      (data: Contact[]) => {
        this.contacts = data;
        this.success = 'succesful list retrieval';
        console.log('successful list retrieval');
        console.log(this.contacts);
      },
      (err) => {
        console.log(err);
        this.error = 'error retrieving contacts';
      }
    )
  }
  
  resetAlerts()
  {
    this.error = '';
    this.success = '';
  }

}
