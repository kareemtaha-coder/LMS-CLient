import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCurriculumsPageComponent } from './manage-curriculums-page.component';

describe('ManageCurriculumsPageComponent', () => {
  let component: ManageCurriculumsPageComponent;
  let fixture: ComponentFixture<ManageCurriculumsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCurriculumsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCurriculumsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
