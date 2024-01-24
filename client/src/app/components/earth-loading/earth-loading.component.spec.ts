import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarthLoadingComponent } from './earth-loading.component';

describe('EarthLoadingComponent', () => {
  let component: EarthLoadingComponent;
  let fixture: ComponentFixture<EarthLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarthLoadingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EarthLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
