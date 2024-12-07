import { Routes } from '@angular/router';
import { AuthFormComponent } from './features/user-auth/user-auth.component';
import { DetailsComponent } from './features/details/details.component';
import { CreateEditComponent } from './features/create-edit/create-edit.component';
import { CatalogComponent } from './features/catalog/catalog.component';
import { HomeComponent } from './features/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './features/profile/profile.component';
import { NotFound } from './features/not-found/not-found.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'catalog', component: CatalogComponent },
    { path: 'create', component: CreateEditComponent, canActivate: [AuthGuard] },
    { path: 'login', component: AuthFormComponent },
    { path: 'register', component: AuthFormComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: ':recipeId/details', component: DetailsComponent },
    { path: ':recipeId/edit', component: CreateEditComponent, canActivate: [AuthGuard] },
    { path: '**', component: NotFound }
];
