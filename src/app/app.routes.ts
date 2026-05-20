import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

import { AboutUsComponent } from './about-us/about-us.component';
import { userRedirectGuard } from './users/user-redirect.guard';
import { CheckoutComponent } from './checkout/checkout.component';
import { checkoutGuard } from './checkout/checkout.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { authGuard } from './auth/auth.guard';
import { CartComponent } from './cart/cart.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { ItemListingPageComponent } from './item-listings/item-listing-page/item-listing-page.component';
import { EditItemListingComponent } from './item-listings/edit-item-listing/edit-item-listing.component';
import { yrTitle } from './title/qm-title';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { adminGuard } from './admin-dashboard/admin-dashboard.guard';
import { CategoryManagementComponent } from './admin-dashboard/category-management/category-management.component';
import { OrderPlacedComponent } from './order/order-placed/order-placed.component';
import { CreateItemListingComponent } from './admin-dashboard/create-item-listing/create-item-listing.component';
import { createItemListingGuard } from './admin-dashboard/create-item-listing/create-item-listing.guard';
import { OrdersInProgressComponent } from './admin-dashboard/orders-in-progress/orders-in-progress.component';
import { OrdersCompletedComponent } from './admin-dashboard/orders-completed/orders-completed.component';
import { OrderDetailsComponent } from './admin-dashboard/order-details/order-details.component';
import { AddArtistPageComponent } from './admin-dashboard/add-artist-page/add-artist-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Yell Records' },
  { path: 'about-us', component: AboutUsComponent, title: yrTitle('About Us') },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [userRedirectGuard],
    title: yrTitle('Login'),
  },
  { path: 'listing/:listid', component: ItemListingPageComponent },
  {
    path: 'listing/:listid/edit',
    component: EditItemListingComponent,
    canActivate: [authGuard],
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [checkoutGuard],
    title: yrTitle('Checkout'),
  },
  {
    path: 'cart',
    component: CartComponent,
    title: yrTitle('Viewing Cart'),
  },
  {
    path: 'account-settings',
    component: UserSettingsComponent,
    canActivate: [authGuard],
    title: yrTitle('Account Settings'),
    children: [],
  },
  {
    path: 'order-placed',
    component: OrderPlacedComponent,
    title: yrTitle('Success'),
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [adminGuard],
    title: yrTitle('Admin Dashboard'),
    data: { hideFooter: true },
    children: [
      {
        path: '',
        data: { hideFooter: true },
        pathMatch: 'full',
        redirectTo: 'category-management',
      },
      {
        path: 'category-management',
        data: { hideFooter: true },
        component: CategoryManagementComponent,
      },
      {
        path: 'create-listing',
        component: CreateItemListingComponent,
        canDeactivate: [createItemListingGuard],
        data: { hideFooter: true },
      },
      {
        path: 'orders/in-progress',
        component: OrdersInProgressComponent,
        data: { hideFooter: true },
      },
      {
        path: 'orders/completed',
        component: OrdersCompletedComponent,
        data: { hideFooter: true },
      },
      {
        path: 'orders/order-details/:orderId',
        component: OrderDetailsComponent,
        data: { hideFooter: true },
      },
      {
        path: 'add-artist-page',
        component: AddArtistPageComponent,
        data: { hideFooter: true },
      },
    ],
  },
  { path: '**', component: NotFoundComponent, data: { hideFooter: true } }, // Please keep this route at the bottom
];
