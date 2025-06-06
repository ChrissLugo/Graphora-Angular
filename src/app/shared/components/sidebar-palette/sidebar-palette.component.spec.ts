import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarPaletteComponent } from './sidebar-palette.component';

describe('SidebarPaletteComponent', () => {
  let component: SidebarPaletteComponent;
  let fixture: ComponentFixture<SidebarPaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarPaletteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
