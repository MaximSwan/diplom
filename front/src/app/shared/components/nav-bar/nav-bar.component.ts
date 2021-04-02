import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"],
})
export class NavBarComponent implements OnInit, OnDestroy {
  navbarOpen = false;
  authToggle = false;
  subscription: Subscription;
  userInfoData = {
    email: "",
    username: "",
    avatar: "",
  };
  constructor(private _userService: UserService) {}

  ngOnInit() {
    this.subscription = this._userService.isAuthorized.subscribe(
      (res: boolean) => {
        if (res) {
          this._userService.user$.subscribe((info) => {

            this.userInfoData.email = info.email;
            this.userInfoData.username = info.username;
            this.userInfoData.avatar = info.avatar;
            this.authToggle = true;
          });
        } else {
          this.authToggle = false;
        }
      }
    );
  }
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onLogout() {
    this._userService.logout();
  }
}
