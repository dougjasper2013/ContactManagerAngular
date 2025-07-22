import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  standalone: true,
  selector: 'app-addcontacts',
  templateUrl: './addcontacts.html',
  styleUrls: ['./addcontacts.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  providers: [ContactService]
})
export class Addcontacts implements OnInit {
  contact: Contact = {
    firstName: '', lastName: '', emailAddress: '',
    phone: '', status: '', dob: '', imageName: '',
    typeID: 0
  };

  selectedFile: File | null = null;
  error = '';
  success = '';
  userName = '';
  maxDate: string = '';
  types: { typeID: number, contactType: string }[] = [];

  constructor(
    private contactService: ContactService,
    public authService: Auth,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTypes();
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.maxDate = `${yyyy}-${mm}-${dd}`;
    this.userName = localStorage.getItem('username') || 'Guest';
  }

  loadTypes(): void {
    this.http.get<{ typeID: number, contactType: string }[]>('http://localhost/contactmanagerangular/contactapi/types.php')
      .subscribe({
        next: (data) => this.types = data,
        error: () => this.error = 'Failed to load contact types'
      });
  }

  addContact(f: NgForm) {
    this.resetAlerts();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.contact.emailAddress??'')) {
      this.error = 'Please enter a valid email address.';
      this.cdr.detectChanges();
      return;
    }

    const phoneRegex = /^(\(\d{3}\)\s|\d{3}-)\d{3}-\d{4}$/;
    if (!phoneRegex.test(this.contact.phone??'')) {
      this.error = 'Please enter a valid phone number.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.contact.imageName) {
      this.contact.imageName = 'placeholder_100.jpg';
    }

    this.contactService.add(this.contact).subscribe(
      (res: Contact) => {
        this.success = 'Successfully created';

        if (this.selectedFile && this.contact.imageName !== 'placeholder_100.jpg') {
          this.uploadFile();
          this.cdr.detectChanges();
        }

        f.reset();
        this.router.navigate(['/contacts']);
      },
      (err) => {
        this.error = err.error?.message || err.message || 'Error occurred';
        this.cdr.detectChanges();
      }
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
