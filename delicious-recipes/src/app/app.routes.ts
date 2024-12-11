import { Routes } from '@angular/router';
import { AuthFormComponent } from './features/user-auth/user-auth.component';
import { DetailsComponent } from './features/details/details.component';
import { CreateEditComponent } from './features/create-edit/create-edit.component';
import { CatalogComponent } from './features/catalog/catalog.component';
import { HomeComponent } from './features/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './features/profile/profile.component';
import { NotFound } from './features/not-found/not-found.component';
import { MyRecipes } from './features/my-recipes/my-recipes.component';
import { UserAccessGuard } from './core/guards/userAccess.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'catalog', component: CatalogComponent },
    { path: 'dashboard', component: MyRecipes, canActivate: [AuthGuard] },
    { path: 'create', component: CreateEditComponent, canActivate: [AuthGuard] },
    { path: 'login', component: AuthFormComponent, canActivate: [UserAccessGuard] },
    { path: 'register', component: AuthFormComponent, canActivate: [UserAccessGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: ':recipeId/details', component: DetailsComponent },
    { path: ':recipeId/edit', component: CreateEditComponent, canActivate: [AuthGuard] },

    { path: '404', component: NotFound },
    { path: '**', component: NotFound }
];
