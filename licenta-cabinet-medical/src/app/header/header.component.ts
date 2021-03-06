import { Component, OnInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  // comandaCompleta = false;
  // private comandaSub: Subscription;
  constructor(public authService: AuthService) { }

  private authListnerSubs: Subscription;
  userIsAuthenticated = false;

  onLogout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    const open = document.getElementById('hamburger');
    let changeIcon = true;
    const ulID = document.getElementById('ulID');
    const nav = document.querySelector('nav');
    const overlay = document.querySelector('.overlay');
    const icon = document.querySelector('.menu-toggle i');
    const toggleBrand = document.getElementById('toggleBrandID');

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListnerSubs = this.authService.getAuthStatusListner().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });


    ulID.addEventListener('click', () => {
      open.click();
      toggleBrand.classList.toggle('manuel2');
    });

    const ToggleMenu = () =>
    {
      overlay.classList.toggle('menu-open');
      nav.classList.toggle('menu-open');
    };

    open.addEventListener('click', () => {

      // console.log(window.getComputedStyle(toggleBrand).display);
      // toggleBrand.classList.toggle('manuel1');

      if (window.getComputedStyle(open).display !== 'none'){
        ToggleMenu();

        if (changeIcon) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        }
        else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }


        changeIcon = !changeIcon;
      }

    });

  }

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
  ngOnDestroy() {
    this.authListnerSubs.unsubscribe();
  }
}
