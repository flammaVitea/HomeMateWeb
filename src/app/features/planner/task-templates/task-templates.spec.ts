import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTemplates } from './task-templates';

describe('TaskTemplates', () => {
  let component: TaskTemplates;
  let fixture: ComponentFixture<TaskTemplates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskTemplates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskTemplates);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
