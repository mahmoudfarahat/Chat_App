import { AuthService } from './../services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { ApiResponse } from '../Models/ApiResponse';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule , MatInputModule  ,FormsModule , MatButtonModule , MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

email! : string;
password! : string;
hide = signal(true);

private authService = inject(AuthService)
private snackBar = inject(MatSnackBar)
private router = inject(Router)
  togglePassword(event: MouseEvent){
  this.hide.set(!this.hide());
  event.stopPropagation()
}

login(){
    this.authService.login(this.email,this.password)
      .subscribe({
        next : ()=>{
          this.snackBar.open("Logged in successfully","close",{
            duration:3000
          })
        },
        error: (err:HttpErrorResponse)=>{
          let error = err.error as ApiResponse<string>;

          this.snackBar.open(error.error)
        },
        complete:()=>{
            this.router.navigate(['/'])
        }
      })
}


}
