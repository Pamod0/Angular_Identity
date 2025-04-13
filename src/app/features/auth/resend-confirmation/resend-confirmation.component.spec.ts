import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendConfirmationComponent } from './resend-confirmation.component';

describe('ResendConfirmationComponent', () => {
  let component: ResendConfirmationComponent;
  let fixture: ComponentFixture<ResendConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResendConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResendConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
