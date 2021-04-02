import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { StorageService } from "./services/storage.service";
import { UserService } from "./services/user.service";
import { AuthInterceptor } from "./services/auth.interceptor";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { UserApiService } from "./services/user-api.service";
@NgModule({
  imports: [CommonModule, NgbModule, RouterModule, HttpClientModule],
  declarations: [NavBarComponent],
  exports: [NavBarComponent],
  providers: [
    StorageService,
    UserService,
    UserApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class SharedModule {}
