import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamplesGridContentComponent } from './examples-grid-content.component';

describe('ExamplesGridContentComponent', () => {
  let component: ExamplesGridContentComponent;
  let fixture: ComponentFixture<ExamplesGridContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamplesGridContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamplesGridContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
