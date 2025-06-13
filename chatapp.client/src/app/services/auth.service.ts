import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../Models/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private baseUrl = 'http://localhost:5000/api/account';
   httpCLient = inject(HttpClient);

   register(data: FormData): Observable<ApiResponse<string>> {
    return this.httpCLient.post<ApiResponse<string>>(`${this.baseUrl}/register`, data)
    .pipe(
      tap((response)=>{
        localStorage.setItem('token', response.data);
   })
  )

   }


}
