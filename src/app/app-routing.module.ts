import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [  { path: '', redirectTo: 'landing', pathMatch: 'full' },
{
  path: 'landing',
  loadChildren: () =>
    import('./gasless-minting/gasless-minting.module').then(
      (m) => m.GaslessMintingModule
    ),
},
{
  path: 'login',
  loadChildren: () =>
    import('./gasless-minting/gasless-minting.module').then(
      (m) => m.GaslessMintingModule
    ),
},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
