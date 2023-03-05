import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GaslessMintingComponent } from './gasless-minting/gasless-minting.component';

const routes: Routes = [  { path: '', redirectTo: 'landing', pathMatch: 'full' },
{
  path: '',
  component: GaslessMintingComponent
},];

@NgModule({
  imports: [RouterModule.forChild(routes)] ,
  exports: [RouterModule]
})
export class GaslessMintingRoutingModule { }
