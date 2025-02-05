import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TodoItem } from '../../../shared/models/todo-item.model';

@Injectable({
  providedIn: 'root'
})
export class TodoDataService {

  private BASE_URL = 'https://dummyjson.com/todos';

  constructor(
    private httpClient: HttpClient
  ) { }

  getTodos(): Observable<TodoItem[]> {
    return this.httpClient.get(this.BASE_URL).pipe(
      map((response: any) => response.todos)
    );
  }
}
