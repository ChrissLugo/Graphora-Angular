import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecyclingBinComponent } from './recycling-bin.component';

describe('RecyclingBinComponent', () => {
  let component: RecyclingBinComponent;
  let fixture: ComponentFixture<RecyclingBinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecyclingBinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecyclingBinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
