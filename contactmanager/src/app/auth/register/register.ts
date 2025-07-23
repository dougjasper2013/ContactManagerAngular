import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class Register {
  userName = '';
  password = '';
  emailAddress = '';
  errorMessage = '';
  successMessage = '';

  constructor(private auth: Auth, private router: Router) {}

  register() {
    const trimmedUsername = this.userName.trim();
    const trimmedPassword = this.password.trim();
    const trimmedEmail = this.emailAddress.trim();
  
    // Basic front-end validation
    if (!trimmedUsername || !trimmedPassword || !trimmedEmail) {
      this.errorMessage = 'All fields are required.';
      this.successMessage = '';
      return;
    }
  
    // Call backend registration
    this.auth.register({
      userName: trimmedUsername,
      password: trimmedPassword,
      emailAddress: trimmedEmail
    }).subscribe({
      next: res => {
        if (res.success) {
          this.successMessage = 'Registration successful. Please log in.';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.errorMessage = res.message;
          this.successMessage = '';
        }
      },
      error: () => {
        this.errorMessage = 'Server error during registration.';
        this.successMessage = '';
      }
    });
  }
}

