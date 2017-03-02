import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesearchComponent } from './gamesearch.component';

describe('GamesearchComponent', () => {
  let component: GamesearchComponent;
  let fixture: ComponentFixture<GamesearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamesearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
