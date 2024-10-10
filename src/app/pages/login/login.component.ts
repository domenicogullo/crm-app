import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from '../../modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [
    MaterialModule, 
    ReactiveFormsModule,
    CommonModule]
})
export class LoginComponent {

  loginForm: FormGroup;
  
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router){
      this.loginForm = this.fb.group({
        email:  ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      })
    }

  clearField(fieldName: string) {
    this.loginForm.get(fieldName)?.reset();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (user) => {
          console.log('Login successful', user);
          this.router.navigate(['/users']); 
        },
        error: (err) => {
          alert('Invalid email or password')
          console.error('Login failed', err);
        }
      });
    }
  }
}
