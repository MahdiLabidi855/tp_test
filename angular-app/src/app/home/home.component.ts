import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { User } from '../models/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  usersList:User[]=[];
  firstName = '';
  lastName = '';
  isAdding = false;
  addUserError = '';

  constructor(private userService:UserService){}
  ngOnInit(): void {
    this.getAllUsers()
  }

  getAllUsers(){
      this.userService.getAllUsers().subscribe(res=>{
        res.map(((obj: User)=>{
          this.usersList.push(obj)
        }))
      },
      error=>{
        alert(error);
      })
  }

  addUser(): void {
    const firstName = this.firstName.trim();
    const lastName = this.lastName.trim();

    if (this.isAdding || !firstName || !lastName) {
      return;
    }

    this.isAdding = true;
    this.addUserError = '';
    this.userService.addUser(firstName, lastName).subscribe({
      next: (user: User) => {
        this.usersList = [...this.usersList, user];
        this.firstName = '';
        this.lastName = '';
        this.isAdding = false;
      },
      error: (error: unknown) => {
        this.isAdding = false;
        if (error instanceof HttpErrorResponse && error.status === 0) {
          this.addUserError = 'Could not reach the server. Check your connection and try again.';
        } else if (error instanceof HttpErrorResponse) {
          this.addUserError = `Could not add user (HTTP ${error.status}). Please try again.`;
        } else {
          this.addUserError = 'Could not add user. Please try again.';
        }
      }
    });
  }
  deleteUser(id:string){
    this.userService.deleteUser(id).subscribe(res=>{
      window.location.reload();
    })
  }


}
