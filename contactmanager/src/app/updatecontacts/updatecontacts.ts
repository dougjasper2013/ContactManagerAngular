import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-updatecontacts',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './updatecontacts.html',
  styleUrls: ['./updatecontacts.css'],
  providers: [ContactService]
})
export class Updatecontacts implements OnInit {
  contactID!: number;
  contact: Contact = {
    firstName: '', lastName: '', emailAddress: '',
    phone: '', status: '', dob: '', imageName: '', typeID: 0
  };

  success = '';
  error = '';
  userName = '';
  maxDate: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  originalImageName: string = '';
  types: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    public authService: Auth,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.maxDate = `${yyyy}-${mm}-${dd}`;
    this.contactID = +this.route.snapshot.paramMap.get('id')!;
    this.contactService.get(this.contactID).subscribe({
      next: (data: Contact) => {
        this.contact = data;
        this.originalImageName = data.imageName || '';
        this.previewUrl = `http://localhost/contactmanagerangular/contactapi/uploads/${this.originalImageName}`;
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error loading contact.'
    });
    
    this.userName = localStorage.getItem('username') || 'Guest';

    // ✅ Load types
    this.http.get<any[]>('http://localhost/contactmanagerangular/contactapi/types.php')
      .subscribe({
        next: (data) => this.types = data,
        error: () => console.error('Failed to load contact types')
      });

  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.contact.imageName = this.selectedFile.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  cancel() {
    this.router.navigate(['/contacts']);
  }


  updateContact(form: NgForm) {
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

    if (form.invalid) return;

    const formData = new FormData();
    formData.append('contactID', this.contactID.toString());
    formData.append('firstName', this.contact.firstName || '');
    formData.append('lastName', this.contact.lastName || '');
    formData.append('emailAddress', this.contact.emailAddress || '');
    formData.append('phone', this.contact.phone || '');
    formData.append('status', this.contact.status || '');
    formData.append('dob', this.contact.dob || '');
    formData.append('imageName', this.contact.imageName || '');
    formData.append('oldImageName', this.originalImageName);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.http.post('http://localhost/contactmanagerangular/contactapi/edit.php', formData).subscribe({
      next: () => {
        this.success = 'Contact updated successfully';
        this.router.navigate(['/contacts']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          const body = err.error;
          this.error = body?.error || 'Duplicate entry detected';
          this.cdr.detectChanges();
        } else {
          this.error = 'Update failed';
          this.cdr.detectChanges();
        }
      }
    });
  }
}
