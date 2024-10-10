import { AuthService } from '../../services/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserRegister } from '../../dto/user-register.dto';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-create-dialog',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule],
  templateUrl: './create-dialog.component.html',
  styleUrl: './create-dialog.component.css'
})
export class CreateDialogComponent implements OnInit{

  productForm: FormGroup;
  users: UserRegister[] = []; 
  isEditMode: boolean = false;
    

  constructor(
    private dialogRef: MatDialogRef<CreateDialogComponent>,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      userId: ['', Validators.required]
      })

      if(data?.product){
        this.isEditMode = true;
        this.productForm.patchValue(data.product);
      }
    }

  ngOnInit(): void {
    this.loadUsers(); 
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error fetching users', error);
      }
    });
  }

  clearField(fieldName: string) {
    this.productForm.get(fieldName)?.reset();
  }

  onConfirm() {
    if(this.productForm.valid){
      const productData = this.productForm.value;
      if(this.isEditMode){
        this.authService.updateProduct(this.data.product.id, productData).subscribe({
          next: () => {
            console.log('Product updated');
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.error('Update failed', err);
          }
        });
      } 
      else {
        this.authService.registerProduct(productData).subscribe({
          next: () => {
            console.log('Product added');
            this.dialogRef.close(true)
          },
          error: (err) => {
            console.error('Product registration failed', err);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false)
  }
}
