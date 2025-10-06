import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from './base-url.token';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly _baseUrl: string;

  constructor(private http: HttpClient, @Inject(BASE_URL) base: string) {
    this._baseUrl = `${base}/api`;
  }

  get baseUrl(): string {
    return this._baseUrl;
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this._baseUrl}/${endpoint}`);
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this._baseUrl}/${endpoint}`, body);
  }

  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this._baseUrl}/${endpoint}`, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this._baseUrl}/${endpoint}`);
  }
}
