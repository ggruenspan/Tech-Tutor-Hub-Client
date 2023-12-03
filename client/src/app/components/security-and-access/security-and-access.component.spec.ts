import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityAndAccessComponent } from './security-and-access.component';

describe('SecurityAndAccessComponent', () => {
  let component: SecurityAndAccessComponent;
  let fixture: ComponentFixture<SecurityAndAccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecurityAndAccessComponent]
    });
    fixture = TestBed.createComponent(SecurityAndAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
