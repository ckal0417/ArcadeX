import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';



export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'home', loadChildren: () =>
    import('./feactures/routes/public/home.route').then(m => m.homeRoute)
  },
  {path: 'contact', loadChildren: () =>
    import('./feactures/routes/public/contact.ruote').then(m => m.contactRoute)
  },
  {path: 'about', loadChildren: () =>
    import('./feactures/routes/public/about.route').then(m => m.aboutRoute)
  },
  {
    path: 'games', loadChildren: () =>
      import('./feactures/routes/public/game.route').then(m => m.gameRoute)
  },
  {
    path: 'register', loadChildren: () =>
      import('./feactures/routes/public/register.route').then(m => m.regiterRoute)
  },
  {
    path: 'login', loadChildren: () =>
    import('./feactures/routes/private/login.route').then(m => m.loginRoute)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/layouts/private/admin-layouts/admin-layouts').then((m) => m.AdminLayouts),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./feactures/pages/private/dashboard-component/dashboard-component').then((m) => m.DashboardComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./feactures/pages/private/user-component/user-component').then((m) => m.UserComponent)
      },
      {
        path: 'game',
        loadComponent: () =>
          import('./feactures/pages/private/game-component/game-component').then((m) => m.GameComponent)
      },
    ]
  }

];
