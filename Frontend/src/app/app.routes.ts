import { Routes } from '@angular/router';



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
  {path: 'login', loadChildren: () =>
    import('./feactures/routes/private/login.route').then(m => m.loginRoute)
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
    path:'admin', loadComponent: () =>
      import('./feactures/pages/private/dashboard-component/dashboard-component').then(m => m.DashboardComponent)
  }

];
