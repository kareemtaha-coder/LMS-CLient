import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumCardComponent } from './curriculum-card.component';

describe('CurriculumCardComponent', () => {
  let component: CurriculumCardComponent;
  let fixture: ComponentFixture<CurriculumCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculumCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
