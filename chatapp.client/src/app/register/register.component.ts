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
import { Router  ,RouterLink} from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule , MatInputModule  ,FormsModule , MatButtonModule , MatIconModule ,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

email! : string;
password! : string;
fullName! : string;
profilePicture : string = 'https://randomuser.me/portraits/lego/3.jpg';
profileImage : File | null = null;


  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router  =inject(Router)
  hide = signal(true);
register(){
let formData = new FormData();
formData.append('email',this.email);
formData.append('password',this.password);
formData.append('fullName',this.fullName);
formData.append('profileImage',this.profileImage!);
this.authService.register(formData).subscribe({
  next:()=>{
    this.matSnackBar.open("User Success","Close")
  },
  error:(error:HttpErrorResponse)=>{
      let err = error.error as ApiResponse<string>
      this.matSnackBar.open(err.error,"Close")
  },
  complete:() =>{
      this.router.navigate(['/'])
  }
})

}
togglePassword(event: MouseEvent){
  this.hide.set(!this.hide());
}

onFileSelected(event: any){
  const file: File = event.target.files[0];
  if(file){
  this.profileImage = file;

  const reader = new FileReader();
  reader.onload = (e) =>{
    this.profilePicture = e.target!.result as string
  }
  reader.readAsDataURL(file)
  }

}
}
