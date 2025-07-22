import { Component } from '@angular/core';
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
  username = '';
  password = '';
  errorMessage = '';

  constructor(private auth: Auth, private router: Router) {}

  login() {
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: res => {
        if (res.success) {
          this.auth.setAuth(true);
          this.router.navigate(['/contacts']);
        } else {
          this.errorMessage = res.message;
        }
      },
      error: () => this.errorMessage = 'Server error during login.'
    });
  }
}

