import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UsersComponent } from './pages/users/users.component';
import { ProductsComponent } from './pages/products/products.component';
import { AuthGuard } from './auth.guard';
import { UpdateUserComponent } from './pages/update-user/update-user.component';
import { AddUserComponent } from './pages/add-user/add-user.component';
import { UserProductComponent } from './pages/user-product/user-product.component';

export const routes: Routes = [
    { path: '', 
      redirectTo: 'login',
      pathMatch: 'full'
    },
    { path: 'login', 
      component: LoginComponent
    },
    { path: 'register', 
      component: RegisterComponent
    },
    {
      path: 'users',
      component: UsersComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'products',
      component: ProductsComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'updateUser/:id',
      component: UpdateUserComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'addUser',
      component: AddUserComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'userProduct/:id',
      component: UserProductComponent,
      canActivate: [AuthGuard]
    }
];
