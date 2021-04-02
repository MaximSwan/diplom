import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "src/app/shared/services/user.service";
import { AuthApiService } from "../../services/auth-api.service";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent implements OnInit {
  registerForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
  });

  errorMsg = "";

  constructor(
    private _api: AuthApiService,
    private _router: Router,
    private _userService: UserService
  ) {}

  ngOnInit() {
    if (this._userService.hasAuthData()) {
      this._router.navigate(["/main/page/"]);
    }
  }

  onSubmit() {
    this._api
      .sendReg({
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      })
      .subscribe((res) => {
        if ((res as { ok: number }).ok) {
          return this._router.navigate(["/auth/login", { ok: 1 }]);
        }
        if ((res as { error: { msg: string } }).error.msg) {
          this.errorMsg = (res as { error: { msg: string } }).error.msg;
        }
      });
  }
}
