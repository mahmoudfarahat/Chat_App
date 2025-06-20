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
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from "../components/button/button.component";


@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, RouterLink, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

email! : string;
password! : string;
hide = signal(true);

 authService = inject(AuthService)
private snackBar = inject(MatSnackBar)
private router = inject(Router)
  togglePassword(event: MouseEvent){
  this.hide.set(!this.hide());
  event.stopPropagation()
}

login(){
  this.authService.isLoading.set(true);
    this.authService.login(this.email,this.password)
      .subscribe({
        next : ()=>{
          this.authService.me().subscribe()
          this.snackBar.open("Logged in successfully","close",{
            duration:3000
          })
            this.authService.isLoading.set(false);

        },
        error: (err:HttpErrorResponse)=>{
          let error = err.error as ApiResponse<string>;

          this.snackBar.open(error.error)
                      this.authService.isLoading.set(false);

        },
        complete:()=>{
            this.router.navigate(['/'])
                        this.authService.isLoading.set(false);

        }
      })
}


}
