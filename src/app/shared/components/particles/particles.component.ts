import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';


export enum PARTICLE_SHAPE {
  CIRCLE,
  HEXAGON,
  CONFETTI,
  HEART
}


@Component({
  selector: 'app-particles',
  templateUrl: './particles.component.html',
  styleUrls: ['./particles.component.scss']
})
export class ParticlesComponent implements AfterViewInit, OnDestroy {


  linkDistance = 150;
  linkWidth = 1;
  repulseDistance = 100;
  repulseDuration = 0.4;
  canvasHeight = 0;
  canvasWidth = 0;
  interaction = {
    status: 'mouseleave',
    pos_x: 0,
    pos_y: 0,
  };
  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;
  particlesList: SingleParticle[] = [];
  animating = true;
  @ViewChild('particles', { static: false }) particlesCanvas!: ElementRef;
  @Input() public shape!: PARTICLE_SHAPE;
  @Input() public moveSpeed!: number;
  @Input() public defSize!: number;
  @Input() public number!: number;
  @Input() public linkingFlag!: boolean;
  @Input() public snowEffect!: boolean;
  colors: any;
  // moveSpeed = 8;
  //  number = 60; defSize = 30;

  constructor() {
    this.colors =  ['#d13447', '#ffbf00', '#263672'];
  }

  ngAfterViewInit() {


    if (window.innerWidth < 768) {
      this.number = 20;
    }

    this.canvas = this.particlesCanvas.nativeElement;
    this.context = this.canvas.getContext('2d')!;
    this.setCanvasSize();
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.number; i++) {
      this.particlesList.push(this.createParticle());
    }

    this.render();
  }

  ngOnDestroy() {
    this.animating = false;
  }

  setCanvasSize() {
    this.canvasHeight = this.canvas.offsetHeight;
    this.canvasWidth = this.canvas.offsetWidth;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
  }

  createParticle(): SingleParticle {
    let x = Math.random() * this.canvasWidth;
    let y = Math.random() * this.canvasHeight;
    // const vx = Math.random() - 0.5;
    // const vy = Math.random() - 0.5;
    const vx = Math.random() - 0.5;
    let vy = Math.random() - 0.5;
    if (this.snowEffect === true) {
      vy = vy + 0.5;
    }

    let color = 'rgba(255,255,255, 0.1)'

    if (this.shape ===  PARTICLE_SHAPE.CONFETTI || this.shape === PARTICLE_SHAPE.HEART) {
      color = this.colors[Math.floor((Math.random() * 3))];
    }

    const size = ((Math.random() * 0.8) + 0.2) * this.defSize;

    if (x > this.canvasWidth - size * 2) {
      x = x - size;
    } else if (x < size * 2) {
      x = x + size;
    }
    if (y > this.canvasHeight - size * 2) {
      y = y - size;
    } else if (y < size * 2) {
      y = y + size;
    }

    return {
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      size: size,
      color: color,
      a: -90,
      life: Math.random() * 30,
      r:Math.floor(Math.random() * 30) + 5
    };
  }

  draw(p: SingleParticle) {

    this.context.fillStyle = p.color;
    this.context.beginPath();
    const rad = (Math.PI / 180);
    if (this.shape === PARTICLE_SHAPE.CIRCLE) {
      this.context.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
    } else if (this.shape === PARTICLE_SHAPE.HEXAGON) {
      this.context.moveTo(p.x + p.size * Math.cos(0), p.y + p.size * Math.sin(0));
      for (let side = 0; side < 7; side++) {
        this.context.lineTo(p.x + p.size * Math.cos(side * 2 * Math.PI / 6), p.y + p.size * Math.sin(side * 2 * Math.PI / 6));
      }
    } else if (this.shape === PARTICLE_SHAPE.HEART) {

      const x1 = p.x + p.r! * Math.cos(p.a! * rad);
      const y1 = p.y + p.r! * Math.sin(p.a! * rad);
      const cx1 = p.x + p.r! * Math.cos((p.a! + 22.5) * rad);
      const cy1 = p.y + p.r! * Math.sin((p.a! + 22.5) * rad);
      const cx2 = p.x + p.r! * Math.cos((p.a! - 22.5) * rad);
      const cy2 = p.y + p.r! * Math.sin((p.a! - 22.5) * rad);
      const chord = 2 * p.r! * Math.sin(22.5 * rad / 2);

      this.context.moveTo(x1, y1);
      this.context.arc(cx1, cy1, chord, (270 + p.a!) * rad, (270 + p.a! + 225) * rad);
      this.context.lineTo(p.x, p.y);
      this.context.moveTo(x1, y1);
      this.context.arc(cx2, cy2, chord, (90 + p.a!) * rad, (90 + p.a! + 135) * rad, true);
      this.context.lineTo(p.x, p.y)
      this.context.globalAlpha = 0.3;
      p.y-=p.vy;
      p.life!*=0.8;
    }else {
      this.context.rect(p.x,p.y,p.size,p.size/4)
    }

    this.context.closePath();
    this.context.fill();
  }

  particlesDraw() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.update();
    for (let i = 0, l = this.particlesList.length; i < l; i++) {
      this.draw(this.particlesList[i]);
    }
  }

  update() {
    let p: SingleParticle = {
      vx: 0,
      vy: 0,
      x: 0,
      y: 0,
      size: 0,
      color: ''
    };
    let p2: SingleParticle = {
      vx: 0,
      vy: 0,
      x: 0,
      y: 0,
      size: 0,
      color: ''
    };
    let ms = 0;

    for (let i = 0, l = this.particlesList.length; i < l; i++) {
      p = this.particlesList[i];
      ms = this.moveSpeed / 2;
      p.x += p.vx * ms;
      p.y += p.vy * ms;

      if (p.x - p.size > this.canvasWidth) {
        p.x = - p.size;
        p.y = Math.random() * this.canvasHeight;
      } else if (p.x + p.size < 0) {
        p.x = this.canvasWidth + p.size;
        p.y = Math.random() * this.canvasHeight;
      }
      if (p.y - p.size > this.canvasHeight) {
        p.y = - p.size;
        p.x = Math.random() * this.canvasWidth;
      } else if (p.y + p.size < 0) {
        p.y = this.canvasHeight + p.size;
        p.x = Math.random() * this.canvasWidth;
      }
      if (this.interaction.status === 'mousemove') {
        this.repulse(p);
      }
      if (this.linkingFlag) {

        for (let j = i + 1; j < l; j++) {
          p2 = this.particlesList[j];
          this.linkParticles(p, p2);
        }
      }
    }
  }

  repulse(p: SingleParticle) {
    const dx_mouse = p.x - this.interaction.pos_x,
      dy_mouse = p.y - this.interaction.pos_y,
      dist_mouse = Math.sqrt(Math.pow(dx_mouse, 2) + Math.pow(dy_mouse, 2));
    const velocity = 100,
      repulseFactor = Math.min(
        Math.max((1 / this.repulseDistance)
          * (-1 * Math.pow(dist_mouse / this.repulseDistance, 2) + 1)
          * this.repulseDistance * velocity, 0), 50);
    p.x = p.x + dx_mouse / dist_mouse * repulseFactor;
    p.y = p.y + dy_mouse / dist_mouse * repulseFactor;
  }

  linkParticles(p1: SingleParticle, p2: SingleParticle) {
    const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    if (dist <= this.linkDistance) {
      if (.7 - (dist / (1 / .7)) / this.linkDistance > 0) {
        this.context.strokeStyle = 'rgba(255, 255,255, .2)';
        this.context.lineWidth = this.linkWidth;
        this.context.beginPath();
        this.context.moveTo(p1.x, p1.y);
        this.context.lineTo(p2.x, p2.y);
        this.context.stroke();
        this.context.closePath();
      }
    }
  }

  render() {
    this.particlesDraw();
    if (this.animating) {
      window.requestAnimationFrame(callback => this.render());
    }
  }


}

interface SingleParticle {
  vx: number;
  vy: number;
  x: number;
  y: number;
  size: number;
  color: string;
  a?:number;
  r?: number;
  life?:number;
}
