import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthguardService } from "src/app/shared/services/authguard.service";
import { CreatePostComponent } from "./components/create-post/create-post.component";
import { MainComponent } from "./components/main/main.component";
import { ProfileComponent } from "./components/profile/profile.component";

const routes: Routes = [
  {
    path: "page",
    component: MainComponent,
    data: { title: "main" },
    canActivate: [AuthguardService],
  },
  {
    path: "create",
    component: CreatePostComponent,
    data: { title: "main" },
    canActivate: [AuthguardService],
  },
  {
    path: "profile/:id",
    component: ProfileComponent,
    canActivate: [AuthguardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
