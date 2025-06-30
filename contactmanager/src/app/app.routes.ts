import { Routes } from '@angular/router';

import { About } from './about/about';
import { Contacts } from './contacts/contacts';

export const routes: Routes = [
    { path: "contacts", component: Contacts},
    { path: "about", component: About},
    { path: "**", redirectTo: "/contacts"}
];
