import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../Core/auth/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly showPassword = signal(false);
  readonly submitting = computed(() => this.authService.processing());
  readonly error = computed(() => this.authService.errorMessage());

  private returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/curriculums';

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.authService
      .login(this.form.getRawValue(), this.returnUrl)
      .subscribe({
        error: (err) => {
          const message = err?.error?.message ?? 'Login failed. Please verify your credentials and try again.';
          this.authService.setError(message);
        },
      });
  }

  toggleReveal(): void {
    this.showPassword.update((value) => !value);
  }
}





