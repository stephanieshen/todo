import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoItemComponent } from './todo-item.component';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;

    component.todoItem = {
      id: 1,
      todo: 'Sample todo',
      completed: false
    }

    component.index = 0;

    fixture.detectChanges();
  });

  it('should emit removed item', () => {
    spyOn(component.removeItem, 'emit');

    component.removeTodoItem(component.index);

    expect(component.removeItem.emit).toHaveBeenCalledWith(component.index);
  });

  it('should emit completed todoItem', () => {
    spyOn(component.completeItem, 'emit');

    component.completeTodoItem(component.todoItem);

    expect(component.completeItem.emit).toHaveBeenCalledWith(component.todoItem);
  });

  it('should emit updated todoItem', () => {
    spyOn(component.updateItem, 'emit');

    component.updateTodoItem(component.index);

    expect(component.updateItem.emit).toHaveBeenCalledWith(component.index);
  });
});
