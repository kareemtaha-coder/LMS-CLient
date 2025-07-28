import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumDetailsComponent } from './curriculum-details.component';

describe('CurriculumDetailsComponent', () => {
  let component: CurriculumDetailsComponent;
  let fixture: ComponentFixture<CurriculumDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculumDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
