import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListComponent } from './todo-list.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { FormBuilder } from '@angular/forms';
import { TodoDataService } from '../../core/services/todo/todo.data.service';
import { of } from 'rxjs';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoDataServiceSpy: jasmine.SpyObj<TodoDataService>;

  beforeEach(async () => {
    todoDataServiceSpy = jasmine.createSpyObj('TodoDataService', ['getTodos']);

    await TestBed.configureTestingModule({
      imports: [
        TodoListComponent,
        TodoItemComponent
      ],
      providers: [
        FormBuilder,
        {
          provide: TodoDataService,
          useValue: todoDataServiceSpy
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;

    todoDataServiceSpy.getTodos.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('assigns false to allTasksCompleted by default', () => {
    expect(component.allTasksCompleted).toBeFalse();
  });

  describe('submit', () => {
    it('should return if the form is invalid', () => {
      component.todoForm = { valid: false } as any;
      const result = component.submit();
      expect(result).toBeUndefined();
    });

    it('should call update if itemToUpdate has value', () => {
      component.todoForm = { valid: true } as any;
      component.itemToUpdate = {
        id: 1,
        todo: 'Sample todo',
        completed: false
      }

      spyOn(component, 'update');

      component.submit();

      expect(component.update).toHaveBeenCalled();
    });

    it('should push new item in todoItems array', () => {
      component.todoForm = { 
        valid: true,
        value: {
          todo: 'Sample Todo'
        },
        reset: () => {}
      } as any;
      component.todoItems = [];

      spyOn(component.todoItems, 'push').and.callThrough();

      component.submit();

      expect(component.todoItems.length).toBe(1);
      expect(component.todoItems.push).toHaveBeenCalledWith(jasmine.any(Object));
    });
  });

  describe('update', () => {
    it('should update the item in array', () => {
      const todoItem = {
        id: 1,
        todo: 'Sample todo',
        completed: false
      };

      component.itemToUpdate = {...todoItem};
      component.todoItems = [{...todoItem}];
      component.todoForm = { 
        valid: true,
        value: {
          todo: 'Sample Todo edited'
        },
        reset: () => {}
      } as any;

      spyOn(component.todoItems, 'findIndex').and.callThrough();
      spyOn(component, 'resetForm');

      component.update();

      expect(component.todoItems.findIndex).toHaveBeenCalled();
      expect(component.todoItems[0].todo).toEqual('Sample Todo edited');
      expect(component.resetForm).toHaveBeenCalled();
    });
  });

  describe('removeItemHandler', () => {
    it('should remove the item in array', () => {
      const index = 0;
      component.todoItems = [
        {
          id: 1,
          todo: 'Sample todo',
          completed: false
        }
      ];

      spyOn(component.todoItems, 'splice').and.callThrough();
      spyOn(component, 'resetForm');

      component.removeItemHandler(index);

      expect(component.todoItems.splice).toHaveBeenCalledWith(index, 1);
      expect(component.todoItems.length).toBe(0);
      expect(component.resetForm).toHaveBeenCalled();
    });
  });

  describe('resetForm', () => {
    it('should reset the form and clear itemToUpdate', () => {
      component.todoForm = { 
        reset: () => {}
      } as any;

      spyOn(component.todoForm, 'reset');

      component.resetForm();

      expect(component.todoForm.reset).toHaveBeenCalled();
      expect(component.itemToUpdate).toBeNull();
    });
  });

  describe('completeItemHandler', () => {
    it('should update the completed property of a todo item', () => {
      component.todoItems = [
        {
          id: 1,
          todo: 'Sample todo',
          completed: false
        }
      ];

      component.completeItemHandler(component.todoItems[0]);

      expect(component.todoItems[0].completed).toBeTrue();
      expect(component.allTasksCompleted).toBeTrue();
    });
  });

  describe('updateItemHandler', () => {
    it('should set value to itemToUpdate property and to the form input field', () => {
      const index = 0;
      component.todoItems = [
        {
          id: 1,
          todo: 'Sample todo',
          completed: false
        }
      ];

      component.updateItemHandler(index);

      expect(component.itemToUpdate).toEqual(component.todoItems[0]);
      expect(component.todoForm.get('todo')?.value).toBe(component.todoItems[0].todo);
    });
  });

  describe('cancelEdit', () => {
    it('should call resetForm', () => {
      spyOn(component, 'resetForm');

      component.cancelEdit();

      expect(component.resetForm).toHaveBeenCalled();
    });
  });
});
