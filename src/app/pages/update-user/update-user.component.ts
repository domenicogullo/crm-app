import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../modules/material/material.module';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  standalone: true,
  styleUrls: ['./update-user.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, RouterLink]
})
export class UpdateUserComponent implements OnInit {
  
  userForm: FormGroup;
  userId!: string;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router) {
      this.userForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      });
    }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.userId = id;
      this.loadUser();
    }
    else{
      this.router.navigate(['/users']);
    }
  }

  loadUser(): void {
    this.userService.getUserById(this.userId).subscribe(user => {
      this.userForm.patchValue(user); 
    });
  }

  onSubmit(): void {
    this.userService.updateUser(this.userId, this.userForm.value).subscribe(() => {
      this.router.navigate(['/users']);
    });
  }
}

