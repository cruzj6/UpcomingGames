/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ToptrackedComponent } from './toptracked.component';

describe('ToptrackedComponent', () => {
  let component: ToptrackedComponent;
  let fixture: ComponentFixture<ToptrackedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToptrackedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToptrackedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
