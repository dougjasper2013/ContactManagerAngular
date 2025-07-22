import { Routes } from '@angular/router';
 
import { About } from './about/about';
import { Contacts } from './contacts/contacts';
import { Addcontacts } from './addcontacts/addcontacts';
import { Updatecontacts } from './updatecontacts/updatecontacts';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { authGuard } from './guards/auth-guard';
 
export const routes: Routes = [
    { path: "contacts", component: Contacts, canActivate: [authGuard]},
    { path: "add", component: Addcontacts, canActivate: [authGuard]},
    { path: "about", component: About},
    { path: "edit/:id", component: Updatecontacts, canActivate: [authGuard]},
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: "**", redirectTo: "/contacts", pathMatch: "full" }
];