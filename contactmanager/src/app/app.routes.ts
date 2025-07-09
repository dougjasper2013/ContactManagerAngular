import { Routes } from '@angular/router';

import { About } from './about/about';
import { Contacts } from './contacts/contacts';
import { Addcontacts } from './addcontacts/addcontacts';

export const routes: Routes = [
    { path: "contacts", component: Contacts},
    { path: "add", component: Addcontacts},
    { path: "about", component: About},
    { path: "**", redirectTo: "/contacts"}
];
