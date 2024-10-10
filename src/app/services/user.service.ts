import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { UserRegister } from '../dto/user-register.dto';
import { Product } from '../dto/product.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserRegister[]> {
    return this.http.get<UserRegister[]>(`${this.apiUrl}/users`);
  }

  getUserById(userId: string): Observable<UserRegister> {
    return this.http.get<UserRegister>(`${this.apiUrl}/users/${userId}`)
  }
  
  updateUser(userId: string, userData: UserRegister): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}`, userData);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }

  deleteUserProducts(userId: string): Observable<void> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?userId=${userId}`).pipe(
      map(products => {
        products.forEach(product => {
          this.http.delete<void>(`${this.apiUrl}/products/${product.id}`).subscribe({
            next: () => {
              console.log(`Product with ID ${product.id} deleted`);
            },
            error: (err) => {
              console.error(`Error during delete of product with ID ${product.id}`, err);
            }
          });
        });
      })
    );
  }
}

