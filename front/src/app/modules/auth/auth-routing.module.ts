import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RegistrationComponent } from "./components/registration/registration.component";
import { LoginComponent } from "./components/login/login.component";

const routes: Routes = [
  {
    path: "registration",
    component: RegistrationComponent,
    data: { title: "Регистрация" },
  },
  {
    path: "login",
    component: LoginComponent,
    data: { title: "Авторизация" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
