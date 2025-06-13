import { AuthService } from './../services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule , MatInputModule  ,FormsModule , MatButtonModule , MatIconModule],
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
  hide = signal(true);
register(){

}
togglePassword(event: MouseEvent){
  this.hide.set(!this.hide());
}

onFileSelected(event: any){
  
}
}
