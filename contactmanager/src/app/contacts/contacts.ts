import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-contacts',
  imports: [HttpClientModule, CommonModule, FormsModule],
  providers: [ContactService],
  templateUrl: './contacts.html',
  styleUrls: ['./contacts.css'],  
})
export class Contacts implements OnInit {
  title = 'ContactManager';
  public contacts: Contact[] = [];
  contact: Contact = {firstName:'', lastName:'', emailAddress:'', phone:'', status:'', dob:'', imageName:'', typeID: 0};

  error = '';
  success = '';

  selectedFile: File | null = null;

  constructor(private contactService: ContactService, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts(): void {
    this.contactService.getAll().subscribe(
      (data: Contact[]) => {
        this.contacts = data;
        this.success = 'successful list retrieval';
        console.log('successful list retrieval');
        console.log(this.contacts);
        this.cdr.detectChanges(); // <--- force UI update
      },
      (err) => {
        console.log(err);
        this.error = 'error retrieving contacts';
      }
    );
  }

  addContact(f: NgForm) {

  }

  onFileSelected(event: Event): void
  {
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0)
    {
      this.selectedFile = input.files[0];
    }
  }

  resetAlerts(): void {
    this.error = '';
    this.success = '';
  }
}
