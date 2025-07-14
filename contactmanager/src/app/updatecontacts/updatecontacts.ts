import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ContactService } from '../contact.service';
import { Contact } from '../contact';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core'; // Add this import

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

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private router: Router,
    private cdr: ChangeDetectorRef, // Inject it here
    private http: HttpClient
  ) {}

  selectedFile: File | null = null;
  originalImageName?: string = ''; // track original

  ngOnInit(): void {
    this.contactID = +this.route.snapshot.paramMap.get('id')!;
    this.contactService.get(this.contactID).subscribe({
      next: (data: Contact) => {
        this.contact = data;
        this.originalImageName = data.imageName;
        this.cdr.detectChanges(); // 👈 This forces Angular to update bindings
      },
      error: () => this.error = 'Error loading contact.'
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.contact.imageName = this.selectedFile.name; // assign for backend
    }
  }

  uploadFile(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) return resolve(''); // no new file

      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.http.post('http://localhost/contactmanagerangular/contactapi/upload', formData).subscribe({
        next: () => resolve(this.selectedFile!.name),
        error: err => reject(err)
      });
    });
  }

  async updateContact(form: NgForm) {
    if (form.invalid) return;

    try {
      await this.uploadFile(); // wait for upload
      const payload = { ...this.contact, contactID: this.contactID, oldImageName: this.originalImageName };

      this.contactService.edit(payload).subscribe({
        next: () => {
          this.success = 'Contact updated successfully';
          this.router.navigate(['/contacts']);
        },
        error: () => this.error = 'Update failed'
      });
    } catch (err) {
      this.error = 'Image upload failed';
    }
  }

}
