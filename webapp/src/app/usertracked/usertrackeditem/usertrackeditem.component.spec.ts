/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UsertrackeditemComponent } from './usertrackeditem.component';

describe('UsertrackeditemComponent', () => {
  let component: UsertrackeditemComponent;
  let fixture: ComponentFixture<UsertrackeditemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsertrackeditemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsertrackeditemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
