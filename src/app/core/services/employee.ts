import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/employees';

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.url);
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.url}/${id}`);
  }

  create(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.url, employee);
  }

  update(id: string, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.url}/${id}`, employee);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
