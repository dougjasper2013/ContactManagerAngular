import { Component, ChangeDetectorRef } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  userName = '';
  password = '';
  errorMessage = '';

  constructor(private auth: Auth, private router: Router, private cdr: ChangeDetectorRef) {}

  login() {
    this.auth.login({ userName: this.userName, password: this.password }).subscribe({
      next: res => {
        if (res.success) {
          this.auth.setAuth(true);
          localStorage.setItem('username', this.userName);
          this.router.navigate(['/contacts']);
        } else {
          this.errorMessage = res.message || 'Login failed. Please try again.';
        }
        this.cdr.detectChanges();
      },
      error: err => {
        if (err.status === 403) {
          this.errorMessage = err.error?.error || 
            'Too many failed attempts. Please wait 5 minutes before trying again.';
        } 
        else if (err.status === 401) {
          const remaining = err.error?.remainingAttempts ?? null;
          if (remaining !== null && remaining > 0) {
            this.errorMessage = `Invalid username or password. You have ${remaining} attempt(s) remaining before lockout.`;
          } else {
            const lockoutDuration = err.error?.lockoutDuration ?? 5; // Default to 5 minutes
            this.errorMessage = `Your account is locked for  ${lockoutDuration} minutes due to too many failed login attempts. Please try again later.`;
          }
        } 
        else if (err.status === 404) {
          this.errorMessage = 'User not found.';
        } 
        else {
          this.errorMessage = 'Server error during login. Please try again.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
