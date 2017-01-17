// ====== ./app/app.routes.ts ======

// Imports
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsertrackedComponent } from './usertracked/usertracked.component';
import { TopTrackedComponent } from './toptracked/toptracked.component';
import { AdvancedSearchComponent } from './advancedsearch/advancedsearch.component';

// Route Configuration
export const routes: Routes = [
  { path: 'usertracked', component: UsertrackedComponent },
  { path: 'toptracked', component: TopTrackedComponent},
  { path: 'advancedsearch', component: AdvancedSearchComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);