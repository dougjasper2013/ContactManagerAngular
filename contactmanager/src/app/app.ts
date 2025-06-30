import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NgForm } from '@angular/forms';

import { Contact } from './contact';
import { ContactService } from './contact.service';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'contactmanager';
}
