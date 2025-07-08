import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-contacts',
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
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

  if (this.selectedFile) {
    this.contact.imageName = this.selectedFile.name;
    this.uploadFile();
  } else {
    this.contact.imageName = ''; // Let backend handle default placeholder
  }

  this.contactService.add(this.contact).subscribe(
    (res: Contact) => {
      this.contacts.push(res);
      this.success = 'Successfully created';
      f.reset();
      this.selectedFile = null; // Clear file selection
    },
    (err) => (this.error = err.message)
  );
}


  editContact(firstName: any, lastName: any, emailAddress: any, phone: any, contactID: any)
  {
    this.resetAlerts();

    console.log(firstName.value);
    console.log(lastName.value);
    console.log(emailAddress.value);
    console.log(phone.value);
    console.log(+contactID);
    

    this.contactService.edit({firstName: firstName.value, lastName: lastName.value, emailAddress: emailAddress.value, phone: phone.value, contactID: +contactID})
      .subscribe(
        (res) => {
          this.cdr.detectChanges(); // <--- force UI update
          this.success = 'Successfully edited';
        },
        (err) => (
          this.error = err. message
        )
      );
  }

  deleteContact(contactID: number)
  {
    this.resetAlerts();

    this.contactService.delete(contactID)
      .subscribe(
        (res) => {
          this.contacts = this.contacts.filter( function (item) {
            return item['contactID'] && +item['contactID'] !== +contactID;
          });
          this.cdr.detectChanges(); // <--- force UI update
          this.success = "Deleted successfully";
        },
          (err) => (
            this.error = err.message
          )
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
