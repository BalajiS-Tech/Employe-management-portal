import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/tasks';

  getAll(): Observable<Task[]> { return this.http.get<Task[]>(this.url); }
  getById(id: string): Observable<Task> { return this.http.get<Task>(`${this.url}/${id}`); }
  create(task: Task): Observable<Task> { return this.http.post<Task>(this.url, task); }
  update(id: string, task: Task): Observable<Task> { return this.http.put<Task>(`${this.url}/${id}`, task); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
