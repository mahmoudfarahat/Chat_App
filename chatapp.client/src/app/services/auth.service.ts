import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../Models/ApiResponse';
import { User } from '../Models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logout() {
    localStorage.removeItem(this.token);
    localStorage.removeItem('user')
  }
 private baseUrl = 'https://localhost:5000/api/account';
 private token  = 'token'
   httpCLient = inject(HttpClient);

   register(data: FormData): Observable<ApiResponse<string>> {
    return this.httpCLient.post<ApiResponse<string>>(`${this.baseUrl}/register`, data)
    .pipe(
      tap((response)=>{
        localStorage.setItem(this.token, response.data);
   })
  )

   }


   login(email: string , password :string):Observable<ApiResponse<string>>{
      return this.httpCLient
        .post<ApiResponse<string>>(`${this.baseUrl}/login`, {
          email,
          password
        })
          .pipe(
            tap((response)=>{
                if(response.isSuccess){
                  localStorage.setItem(this.token,response.data)
                }
                return response
            })
          )

   }


   me():Observable<ApiResponse<User>>{
    return this.httpCLient.get<ApiResponse<User>>(`${this.baseUrl}/me` ,{
      headers :{
          Authorization: `Bearer ${this.getAccessToken}`
      }
    })
      .pipe(
        tap((response) =>{
        if(response.isSuccess){
            localStorage.setItem("user",JSON.stringify(response.data))
        }
      }))
   }

   get getAccessToken(): string | null {
    return localStorage.getItem(this.token) || ''
   }

   isLoggedIn() : boolean {
    return !!localStorage.getItem(this.token)
   }

   get currentLoggedUser(): User | null {
    const user:User  = JSON.parse(localStorage.getItem("user") || '{}')
    return user
   }
}
