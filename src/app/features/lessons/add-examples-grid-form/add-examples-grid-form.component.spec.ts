import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExamplesGridFormComponent } from './add-examples-grid-form.component';

describe('AddExamplesGridFormComponent', () => {
  let component: AddExamplesGridFormComponent;
  let fixture: ComponentFixture<AddExamplesGridFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExamplesGridFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExamplesGridFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
