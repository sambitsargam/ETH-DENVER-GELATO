import { NgModule,InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaslessMintingComponent } from './gasless-minting/gasless-minting.component';
import { GaslessMintingRoutingModule } from './gasless -minting-routing.module';
import { ButtonModule } from 'primeng/button';
import { ParticlesModule } from '../shared/components/particles/particles.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FormsModule } from '@angular/forms';





@NgModule({
  declarations: [
    GaslessMintingComponent
  ],
  imports: [
    CommonModule,
    GaslessMintingRoutingModule,
    ButtonModule,
    ParticlesModule,
    ClipboardModule,
    FormsModule,
  ],
  exports: [
    GaslessMintingComponent,
  ],
  providers:[]
})
export class GaslessMintingModule { }
