/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TopTrackedComponent } from './toptracked.component';

describe('ToptrackedComponent', () => {
  let component: TopTrackedComponent;
  let fixture: ComponentFixture<TopTrackedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopTrackedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopTrackedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
