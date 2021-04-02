import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UserApiService } from "src/app/shared/services/user-api.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  id: number;
  userInfo;
  constructor(
    private _activateRoute: ActivatedRoute,
    private _userApiService: UserApiService
  ) {}

  ngOnInit() {
    this.id = this._activateRoute.snapshot.params["id"];
    this._userApiService.getUserInfo(this.id).subscribe((res) => {
      console.log(res);
      this.userInfo = res;
    });
  }
}
