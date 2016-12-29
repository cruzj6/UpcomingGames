// ====== ./app/app.routes.ts ======

// Imports
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsertrackedComponent } from './usertracked/usertracked.component';

// Route Configuration
export const routes: Routes = [
  { path: 'usertracked', component: UsertrackedComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);