import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "src/app/shared/services/user.service";
import { AuthApiService } from "../../services/auth-api.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
  });

  errorMsg = "";

  successMsg = "";

  constructor(
    private _route: ActivatedRoute,
    private _api: AuthApiService,
    private _router: Router,
    private _userService: UserService
  ) {}

  ngOnInit() {
    if (this._userService.hasAuthData()) {
      this._router.navigate(["/main/page"]);
    }
    const signup = this._route.snapshot.params["ok"];
    if (signup === "1") {
      this.successMsg = "Вы успешно зарегестрировались. Войдите в систему.";
    }
  }

  onSubmit() {
    this._api
      .sendLogin({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      })
      .subscribe((res) => {
        if ((res as { token: string; userId: string; email: string }).token) {
          this._userService.login(res);
          return this._router.navigate(["/main/page"]);
        }
        if ((res as { error: { msg: string } }).error.msg) {
          this.errorMsg = (res as { error: { msg: string } }).error.msg;
        }
      });
  }
}
