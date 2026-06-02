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
    path: 'store', loadChildren: () =>
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
      {
        path: 'offerts',
        loadComponent: () =>
          import('./feactures/pages/private/offert-component/offert-component').then((m) => m.OffertComponent)
      },
      {
        path: 'genres',
        loadComponent: () =>
          import('./feactures/pages/private/genre-component/genre-component').then((m) => m.GenreComponent)
      },
      {
        path: 'achievements',
        loadComponent: () =>
          import('./feactures/pages/private/achievement-component/achievement-component').then((m) => m.AchievementComponent)
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('./feactures/pages/private/review-component/review-component').then((m) => m.ReviewComponent)
      },
      {
        path: 'review-comments',
        loadComponent: () =>
          import('./feactures/pages/private/review-comment-component/review-comment-component').then((m) => m.ReviewCommentComponent)
      },
      {
        path: 'friends',
        loadComponent: () =>
          import('./feactures/pages/private/friend-component/friend-component').then((m) => m.FriendComponent)
      },
      {
        path: 'library',
        loadComponent: () =>
          import('./feactures/pages/private/library-component/library-component').then((m) => m.LibraryComponent)
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./feactures/pages/private/wishlist-component/wishlist-component').then((m) => m.WishlistComponent)
      },
      {
        path: 'game-sessions',
        loadComponent: () =>
          import('./feactures/pages/private/game-session-component/game-session-component').then((m) => m.GameSessionComponent)
      },
    ]
  }

];
