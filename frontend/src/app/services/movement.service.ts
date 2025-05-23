import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movement {
  id?: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private apiUrl = 'http://localhost:3000/api/movements';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Movement[]> {
    return this.http.get<Movement[]>(this.apiUrl);
  }

  create(movement: Movement): Observable<Movement> {
    return this.http.post<Movement>(this.apiUrl, movement);
  }

  update(id: number, movement: Movement): Observable<Movement> {
    return this.http.put<Movement>(`${this.apiUrl}/${id}`, movement);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}