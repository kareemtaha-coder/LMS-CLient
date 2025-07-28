import { Component, effect, signal } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private initialDark = localStorage.getItem('theme')==='dark';
  themeDark=signal(this.initialDark);

  constructor(){
    effect(()=>{
      if(this.themeDark()){
        document.documentElement.classList.add('dark');
      }else{
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme' ,this.themeDark()?'dark':'light')
    });
  }





  toggleTheme(){
    this.themeDark.set(!this.themeDark());
    console.log(this.themeDark())
  }



}
