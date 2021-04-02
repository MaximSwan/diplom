import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { StorageService } from "src/app/shared/services/storage.service";
import { MainApiService } from "../../services/main-api.service";
import { MainArtsService } from "../../services/main-arts.service";

@Component({
  selector: "app-create-post",
  templateUrl: "./create-post.component.html",
  styleUrls: ["./create-post.component.scss"],
})
export class CreatePostComponent implements OnInit {
  createForm = new FormGroup({
    title: new FormControl("", [Validators.required]),
    shortDescr: new FormControl("", [Validators.required]),
    descr: new FormControl("", [Validators.required]),
    file: new FormControl(),
  });

  file;

  constructor(
    private _mainApiService: MainApiService,
    private _router: Router,
    private _mainArtService: MainArtsService,
    private _storageService: StorageService
  ) {}

  ngOnInit() {}
  fileChange(event) {
    this.file = event.target.files[0];
  }
  onSubmit() {
    this._mainApiService
      .createPost({
        title: this.createForm.value.title,
        shortDescr: this.createForm.value.shortDescr,
        descr: this.createForm.value.descr,
      })
      .subscribe((res) => {
        if (!res.error) {
          alert("Пост успешно добавлен");
          if (this.createForm.value.file) {
            let data = new FormData();
            data.append("idArt", res._id);

            data.append("", this.file);
            this._mainApiService.loadImg(data).subscribe(() => {
              this._mainArtService.change.next();
              return this._router.navigate(["/main/page"]);
            });
            return;
          } else {
            this._mainArtService.change.next();

            return this._router.navigate(["/main/page"]);
          }
        }
      });
  }
}
