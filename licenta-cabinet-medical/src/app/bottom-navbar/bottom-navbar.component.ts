import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.css']
})
export class BottomNavbarComponent implements OnInit {

  constructor() { }


  active_button(btns) {
    for(let i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function() {
        let current = document.getElementsByClassName("nav__link--active");
        current[0].className = current[0].className.replace(" nav__link--active", "");
        this.className += " nav__link--active";
      });
    }
  }

  ngOnInit(): void {
    const btnContainer = document.getElementById("bottomNav");
    const btns = btnContainer.getElementsByClassName("nav__link");
    // console.log(btns);

  }

}
