import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-addcontacts',
  templateUrl: './addcontacts.html',
  styleUrls: ['./addcontacts.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  providers: [ContactService]
})
export class Addcontacts {
  contact: Contact = {firstName:'', lastName:'', emailAddress:'', phone:'', status:'', dob:'', imageName:'', typeID: 0};
  selectedFile: File | null = null;
  error = '';
  success = '';

  constructor(private contactService: ContactService, private http: HttpClient, private router: Router) {}

  addContact(f: NgForm) {
    this.resetAlerts();

    if (!this.contact.imageName) {
      this.contact.imageName = 'placeholder_100.jpg';
    }

    this.uploadFile();

    this.contactService.add(this.contact).subscribe(
      (res: Contact) => {
        this.success = 'Successfully created';
        f.reset();
        this.router.navigate(['/contacts']); // redirect back
      },
      (err) => this.error = err.message
    );
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post('http://localhost/contactmanagerangular/contactapi/upload', formData).subscribe(
      response => console.log('File uploaded successfully:', response),
      error => console.error('File upload failed:', error)
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.contact.imageName = this.selectedFile.name;
    }
  }

  resetAlerts(): void {
    this.error = '';
    this.success = '';
  }
}
