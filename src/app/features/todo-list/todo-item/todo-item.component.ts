import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItem } from '../../../shared/models/todo-item.model';

@Component({
  selector: 'app-todo-item',
  imports: [
    CommonModule
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent {

  @Input() todoItem!: TodoItem;
  @Input() index!: number;

  @Output() removeItem: EventEmitter<number> = new EventEmitter();
  @Output() completeItem: EventEmitter<TodoItem> = new EventEmitter();
  @Output() updateItem: EventEmitter<number> = new EventEmitter();

  removeTodoItem(index: number): void {
    this.removeItem.emit(index);
  }

  completeTodoItem(todoItem: TodoItem): void {
    this.completeItem.emit(todoItem);
  }

  updateTodoItem(index: number): void {
    this.updateItem.emit(index);
  }
}
