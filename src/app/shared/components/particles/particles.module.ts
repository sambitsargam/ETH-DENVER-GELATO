import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticlesComponent } from './particles.component';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [ParticlesComponent],
  exports: [ParticlesComponent]
})
export class ParticlesModule { }
