import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExampleItemFormComponent } from './add-example-item-form.component';

describe('AddExampleItemFormComponent', () => {
  let component: AddExampleItemFormComponent;
  let fixture: ComponentFixture<AddExampleItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExampleItemFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExampleItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
