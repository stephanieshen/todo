import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoItem } from '../../shared/models/todo-item.model';
import { Subject, takeUntil } from 'rxjs';
import { TodoDataService } from '../../core/services/todo/todo.data.service';

@Component({
  selector: 'app-todo-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TodoItemComponent
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent implements OnInit, OnDestroy {

  allTasksCompleted: boolean = false;
  isLoading: boolean = false;
  itemToUpdate!: TodoItem | null;
  todoForm!: FormGroup;
  todoItems: TodoItem[] = [];

  private destroyed$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private todoDataService: TodoDataService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setTodoItems();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }

  submit(): void {
    if (!this.todoForm.valid) {
      return;
    }

    if (this.itemToUpdate) {
      this.update();
      return;
    }

    const newTodoItem = {
      id: Math.floor(Math.random() * 1000),
      userId: 123,
      todo: this.todoForm.value.todo,
      completed: false
    } as TodoItem

    this.todoItems.push(newTodoItem);
    this.todoForm.reset();
  }

  update(): void {
    const index = this.todoItems.findIndex((todoItem: TodoItem) => todoItem.id === this.itemToUpdate?.id);
    this.todoItems[index].todo = this.todoForm.value.todo;
    this.resetForm();
  }

  removeItemHandler(index: number): void {
    this.todoItems.splice(index, 1);
    this.resetForm();
  }

  resetForm(): void {
    this.todoForm.reset();
    this.itemToUpdate = null;
  }

  completeItemHandler(todoItem: TodoItem): void {
    todoItem.completed = !todoItem.completed;
    this.allTasksCompleted = this.areAllTasksCompleted;
  }

  updateItemHandler(index: number): void {
    this.itemToUpdate = this.todoItems[index];
    this.todoForm.get('todo')?.setValue(this.itemToUpdate.todo);
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private get areAllTasksCompleted(): boolean {
    return this.todoItems.every((todoItem: TodoItem) => todoItem.completed);
  }

  private initForm(): void {
    this.todoForm = this.formBuilder.group({
      todo: ['', Validators.required]
    });
  }

  private setTodoItems(): void {
    this.isLoading = true;
    this.todoDataService.getTodos()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (todoItems: TodoItem[]) => {
          this.todoItems = todoItems;
          this.isLoading = false;
        }
      });
  }
}
