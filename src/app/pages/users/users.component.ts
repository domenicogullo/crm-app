import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { UserService } from '../../services/user.service';
import { UserRegister } from '../../dto/user-register.dto';
import { RouterLink } from '@angular/router';
import { ConfirmDialogComponent } from '../../modals/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MaterialModule, RouterLink, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{

  users: UserRegister[] = []
  dataSource = new MatTableDataSource(this.users);

  constructor(
    private userService: UserService, 
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();

    this.dataSource.filterPredicate = (data: UserRegister, filter: string) => {
      return (
        data.id.includes(filter) || data.name.includes(filter) || data.email.includes(filter)
      );
    };
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.dataSource.data = this.users;
      },
      error: (error) => {
        console.error('Error fetching users', error);
      }
    });
  }

  deleteUser(userId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUserProducts(userId).subscribe({
          next: () => {
            console.log("User products deleted");
            
            this.userService.deleteUser(userId).subscribe({
              next: () => {
                this.users = this.users.filter(user => user.id !== userId);
                this.dataSource.data = this.users;
              },
              error: (err) => {
                console.error(`Error during user ${userId} delete`, err);
              }
            });
          },
          error: (error) => {
            console.error(`Error during user ${userId} products delete`, error);
          }
        });
      }
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;
  }
}
