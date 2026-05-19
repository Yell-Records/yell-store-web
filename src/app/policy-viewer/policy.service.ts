import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PolicyService {
  readonly baseUrl = `${environment.apiUrl}/policies`;

  private readonly http = inject(HttpClient);

  getPolicy(name: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/${name}`, { responseType: 'text' });
  }

  savePolicy(name: string, content: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${name}`, content);
  }
}
