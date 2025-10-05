import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  email: string;
  userName: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

const STORAGE_KEY = 'lms_auth_state';
const LOGIN_ENDPOINT = 'https://almehrab.runasp.net/api/Auth/login';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly _token = signal<string | null>(null);
  private readonly _user = signal<AuthUser | null>(null);
  private readonly _errorMessage = signal<string | null>(null);

  readonly processing = signal(false);
  readonly errorMessage = this._errorMessage.asReadonly();

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthResponse;
        this._token.set(parsed.token);
        this._user.set(parsed.user);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  login(request: LoginRequest, redirectTo?: string): Observable<AuthResponse> {
    this.processing.set(true);
    this.setError(null);

    return this.http.post<AuthResponse>(LOGIN_ENDPOINT, request).pipe(
      tap((response) => {
        this.persistSession(response);
        if (redirectTo) {
          this.router.navigateByUrl(redirectTo);
        } else {
          this.router.navigate(['/curriculums']);
        }
      }),
      finalize(() => this.processing.set(false))
    );
  }

  logout(): void {
    this._token.set(null);
    this._user.set(null);
    this.setError(null);
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  token(): string | null {
    return this._token();
  }

  user(): AuthUser | null {
    return this._user();
  }

  isAuthenticated(): boolean {
    return !!this._token();
  }

  setError(message: string | null): void {
    this._errorMessage.set(message);
  }

  private persistSession(response: AuthResponse): void {
    this._token.set(response.token);
    this._user.set(response.user);
    this.setError(null);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
  }
}
