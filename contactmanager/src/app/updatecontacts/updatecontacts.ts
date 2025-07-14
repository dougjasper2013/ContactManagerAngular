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
    private cdr: ChangeDetectorRef // Inject it here
  ) {}

  ngOnInit(): void {
    this.contactID = +this.route.snapshot.paramMap.get('id')!;
    this.contactService.get(this.contactID).subscribe({
      next: (data: Contact) => {this.contact = data; this.cdr.detectChanges();}, // Force Angular to update bindings
      error: () => this.error = 'Error loading contact.'
    });
  }

  updateContact(form: NgForm) {
    if (form.invalid) return;
    this.contactService.edit({ ...this.contact, contactID: this.contactID }).subscribe({
      next: () => {
        this.success = 'Contact updated successfully';
        this.router.navigate(['/contacts']);
      },
      error: () => this.error = 'Update failed'
    });
  }
}
