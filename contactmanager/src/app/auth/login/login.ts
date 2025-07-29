import { Component, ChangeDetectorRef } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

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
          this.cdr.detectChanges();
        } else {
          this.errorMessage = res.message;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.errorMessage = 'Server error during login.';
        this.cdr.detectChanges();
      }
      
    });
  }
}

