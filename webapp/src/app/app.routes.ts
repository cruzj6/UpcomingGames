// ====== ./app/app.routes.ts ======

// Imports
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsertrackedComponent } from './usertracked/usertracked.component';
import { TopTrackedComponent } from './toptracked/toptracked.component';

// Route Configuration
export const routes: Routes = [
  { path: 'usertracked', component: UsertrackedComponent },
  { path: 'toptracked', component: TopTrackedComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);