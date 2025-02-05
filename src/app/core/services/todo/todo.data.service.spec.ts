import { TestBed } from '@angular/core/testing';

import { TodoDataService } from './todo.data.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { TodoItem } from '../../../shared/models/todo-item.model';

describe('TodoDataService', () => {
  let service: TodoDataService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: httpSpy
        }
      ]
    });

    service = TestBed.inject(TodoDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and return todos', () => {
    const mockResponse = {
      todos: [
        {
          id: 1,
          todo: 'Sample todo',
          completed: false
        }
      ]
    };

    httpSpy.get.and.returnValue(of(mockResponse));

    service.getTodos().subscribe({
      next: (todoItems: TodoItem[]) => {
        expect(todoItems).toEqual(mockResponse.todos);
      }
    })

    expect(httpSpy.get).toHaveBeenCalledWith(service['BASE_URL']);
  });
});
