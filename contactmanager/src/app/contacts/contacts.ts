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
    this.resetAlerts();

    this.uploadFile();

    this.contactService.add(this.contact).subscribe(
      (res: Contact) => {
        this.contacts.push(res);
        this.success = 'Successfully created';

        f.reset();
      },
      (err) =>  (this.error = err.message)
    );
  }

  uploadFile(): void {
    if (!this.selectedFile)
    {
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post('http://localhost/contactmanagerangular/contactapi/upload', formData).subscribe(
      response => console.log('File uploaded successfully:', response),
      error => console.error('File upload failed:', error)
    );
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
