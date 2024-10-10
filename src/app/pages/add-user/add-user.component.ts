import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {

  newUserForm: FormGroup;
  
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router){
      this.newUserForm = this.fb.group({
        name : ['', Validators.required],
        email:  ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      })
    }

  clearField(fieldName: string) {
    this.newUserForm.get(fieldName)?.reset();
  }

  onSubmit() {
    if(this.newUserForm.valid){
      this.authService.register(this.newUserForm.value).subscribe({
        next: () => {
          console.log('New user added');
          this.router.navigate(['/users']); 
        },
        error: (err) => {
          console.error('New user registration failed', err);
        }
      });
    }
  }
}
