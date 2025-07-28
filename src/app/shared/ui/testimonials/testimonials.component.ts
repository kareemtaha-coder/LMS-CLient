import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { Testimonial } from '../../../Core/models/testimonial.model';
import { CommonModule } from '@angular/common';
import { SwiperContainer } from 'swiper/element';



@Component({
  selector: 'app-testimonials',
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TestimonialsComponent implements OnInit ,AfterViewInit {
  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sara Ahmed',
      role: 'Product Manager',
      avatar: '/hero-img.webp',
      content: '"This product completely transformed our workflow. The efficiency gains have been remarkable, and our team productivity has increased by 40% since implementation."',
      rating: 5
    },
    {
      id: 2,
      name: 'Mohamed Ali',
      role: 'UX Designer',
      avatar: '/hero-img.webp',
      content: '"Intuitive, fast, and beautiful! The interface is so well designed that our entire team was up and running with minimal training."',
      rating: 4
    },
    {
      id: 3,
      name: 'Laila Hassan',
      role: 'CTO',
      avatar: '/hero-img.webp',
      content: '"Solid architecture and excellent support. The development team has been responsive to our needs and the product has scaled smoothly with our business growth."',
      rating: 5
    },
    {
      id: 4,
      name: 'Ahmed Mahmoud',
      role: 'Marketing Director',
      avatar: '/hero-img.webp',
      content: '"The analytics capabilities have given us insights we never had before. We\'ve been able to make data-driven decisions that have significantly improved our campaign performance."',
      rating: 5
    },
    {
      id: 5,
      name: 'Nour Ibrahim',
      role: 'Small Business Owner',
      avatar: '/hero-img.webp',
      content: '"As a small business, we needed an affordable solution that wouldn\'t compromise on features. This exceeded our expectations on all fronts."',
      rating: 4
    },
  ];






  @ViewChild('swiperEl', { static: false })
  swiperEl!: ElementRef<SwiperContainer>;


  ngOnInit() {

  }
  ngAfterViewInit(): void {
    const swiperElement = this.swiperEl.nativeElement;
    swiperElement.initialize();  // now recognized by 

}
}
