import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainComponent } from "./components/main/main.component";
import { MainRoutingModule } from "./main-routing.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MainApiService } from "./services/main-api.service";
import { AuthInterceptor } from "src/app/shared/services/auth.interceptor";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CreatePostComponent } from "./components/create-post/create-post.component";
import { MainArtsService } from "./services/main-arts.service";

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [MainComponent, CreatePostComponent],
  providers: [
    MainArtsService,
    MainApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class MainModule {}
