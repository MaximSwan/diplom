import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () =>
      import(`./modules/auth/auth.module`).then((module) => module.AuthModule),
  },
  {
    path: "main",
    loadChildren: () =>
      import(`./modules/main/main.module`).then((module) => module.MainModule),
  },
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
