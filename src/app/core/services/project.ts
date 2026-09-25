import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/projects';

  getAll(): Observable<Project[]> { return this.http.get<Project[]>(this.url); }
  getById(id: string): Observable<Project> { return this.http.get<Project>(`${this.url}/${id}`); }
  create(project: Project): Observable<Project> { return this.http.post<Project>(this.url, project); }
  update(id: string, project: Project): Observable<Project> { return this.http.put<Project>(`${this.url}/${id}`, project); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
