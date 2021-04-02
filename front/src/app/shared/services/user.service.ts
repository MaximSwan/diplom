import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { StorageService } from "./storage.service";
import { Router } from "@angular/router";

@Injectable()
export class UserService {
  constructor(private storageService: StorageService, private router: Router) {
    if (this.hasAuthData()) {
      this.isAuthorized.next(true);
    }
    const email = this.storageService.getItem("email");
    const username = this.storageService.getItem("username");
    const avatar = this.storageService.getItem("avatar");
    if (email) {
      this.user$.next({ username, email, avatar });
      console.log(this.user$.getValue());
    }
  }

  readonly user$ = new BehaviorSubject<any>(null);

  readonly LOGIN_PATH = "/auth/login";

  isAuthorized = new BehaviorSubject<boolean>(false);

  hasAuthData() {
    const token = this.storageService.getItem("token");
    return Boolean(token);
  }

  login(user) {
    if (user) {
      this.storageService.setItem("token", user.token);
      // this.storageService.setItem("username", user.username);
      this.storageService.setItem("email", user.email);
      // this.storageService.setItem("avatar", user.avatar);
      this.storageService.setItem("id", user.userId);
      const resCache = {
        username: user.username,
        email: user.email,
        // avatar: user.avatar,
      };
      this.user$.next(resCache);
      this.isAuthorized.next(true);
    } else {
      this.isAuthorized.next(false);
      return undefined;
    }
  }

  logout() {
    this.storageService.clear();
    this.isAuthorized.next(false);
    this.router.navigate(["/auth/login"]);
  }
}
