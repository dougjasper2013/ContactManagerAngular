import { Component, ChangeDetectorRef } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  userName = '';
  password = '';
  confirmPassword = '';
  emailAddress = '';
  errorMessage = '';
  successMessage = '';

  constructor(private auth: Auth, private router: Router, private cdr: ChangeDetectorRef) {}

  register(form: NgForm) {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.cdr.detectChanges();
      return;
    }

    if (form.invalid) return;

    this.auth.register({ userName: this.userName, password: this.password, emailAddress: this.emailAddress })
      .subscribe({
        next: res => {
          this.successMessage = 'Registration successful! You can now log in.';
          this.router.navigate(['/login']);
        },
        error: err => {
          this.errorMessage = err.error?.message || 'Registration failed.';
          this.cdr.detectChanges();
        }
      });
  }
}
