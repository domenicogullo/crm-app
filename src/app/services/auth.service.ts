import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable, of, switchMap, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs';
import { UserRegister } from '../dto/user-register.dto';
import { UserLogin } from '../dto/user-login.dto';
import { Product } from '../dto/product.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  private apiUrl = environment.API_URL;
  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn())
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<UserRegister[]>(`${this.apiUrl}/users?email=${email}`).pipe(
      map(users => users.length > 0), 
      catchError(() => of(false)) 
    );
  }

  private generateUniqueId(): number {
    return Math.floor(Math.random() * 100000)
  }

  register(user: UserRegister): Observable<any> {
    user.id = String(this.generateUniqueId());
    
    return this.checkEmailExists(user.email).pipe(
      switchMap(exists => {
        if(exists) {
          alert('Email already exists')
          return throwError(() => new Error('Email already exists'));
        }
        return this.http.post(`${this.apiUrl}/users`, user);
      }),
      catchError(error => throwError(() => error))
    )
  }

  registerProduct(product: Product): Observable<any> {
    product.id = String(this.generateUniqueId());

    return this.http.post(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: string, productData: Product): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, productData);
  }

  
  login(user: UserLogin): Observable<any> {
    return this.http.get<UserRegister[]>(`${this.apiUrl}/users?email=${user.email}&password=${user.password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const loggedUser = users[0];
          localStorage.setItem('authToken', 'dummy-token');
          this.loggedInSubject.next(true); 
          return loggedUser; 
        }
        throw new Error('Invalid email or password');
      }),
      catchError(error => throwError(() => error))
    );
  }
   
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
  
  logout(): void {
    localStorage.removeItem('authToken');
    this.loggedInSubject.next(false);
  }
}
