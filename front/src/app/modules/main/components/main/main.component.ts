import { AfterViewInit, Component, OnInit } from "@angular/core";
import { StorageService } from "src/app/shared/services/storage.service";
import { UserApiService } from "src/app/shared/services/user-api.service";
import { MainApiService } from "../../services/main-api.service";
import { MainArtsService } from "../../services/main-arts.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit, AfterViewInit {
  arts = [];
  pageCount = [];
  currentId = "";

  constructor(
    private _mainApiService: MainApiService,
    private _userApiService: UserApiService,
    private _mainArtService: MainArtsService,
    private _storageService: StorageService
  ) {}

  ngOnInit() {
    // let valPage = this._storageService.getItem("page");
    // console.log(valPage);
    // if (valPage) {
    //   this.getDataForPage(valPage);
    //   return;
    // }
    this._init();
  }

  ngAfterViewInit() {}

  getDataForPage(page) {
    this.arts = [];
    this._storageService.setItem("page", page);
    this._mainApiService.getAllArts({ page }).subscribe((res) => {
      res.arts.forEach((e) => {
        this._userApiService.getUserInfo(e.owner).subscribe((user) => {
          this.arts.push({ ...e, email: user.resUser.email });
        });
      });
    });
  }

  _init(page?) {
    this.arts = [];
    if (!page) {
      if (this._storageService.getItem("page")) {
        page = this._storageService.getItem("page");
      }
    }
    this.currentId = this._storageService.getItem("id");
    page ? this._storageService.setItem("page", page) : null;
    this._mainApiService
      .getAllArts({ page: page ? page : 0 })
      .subscribe((res) => {
        this.pageCount = Array(Math.ceil(res.pages))
          .fill({})
          .map((x, i) => i);
        res.arts.forEach((e) => {
          this._userApiService.getUserInfo(e.owner).subscribe((user) => {
            this.arts.push({ ...e, email: user.resUser.email });
          });
        });
      });
  }
}
