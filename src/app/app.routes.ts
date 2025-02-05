import { Routes } from '@angular/router';
import { TodoListComponent } from './features/todo-list/todo-list.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'todo',
        pathMatch: 'full'
    },
    {
        path: 'todo',
        loadComponent: () => import('./features/todo-list/todo-list.component').then(c => TodoListComponent)
    },
    {
        path: '**',
        redirectTo: 'todo'
    }
];
