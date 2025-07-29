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
          // fallback for non-success responses without an HTTP error
          this.errorMessage = res.message || 'Login failed. Please try again.';
        }
        this.cdr.detectChanges();
      },
      error: err => {
        // ✅ Graceful handling of lockout (403)
        if (err.status === 403) {
          this.errorMessage = err.error?.error || 
            'Too many failed attempts. Please wait 5 minutes before trying again.';
        } 
        // ✅ Handle invalid credentials (401)
        else if (err.status === 401) {
          this.errorMessage = 'Invalid username or password.';
        } 
        // ✅ Handle user not found (404)
        else if (err.status === 404) {
          this.errorMessage = 'User not found.';
        } 
        // ✅ Other server errors
        else {
          this.errorMessage = 'Server error during login. Please try again.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
