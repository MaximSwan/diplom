import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { StorageService } from "./storage.service";
import { UserService } from "./user.service";

import { catchError } from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private storageService: StorageService,
    private userService: UserService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        authorization: `${this.storageService.getItem("token")}`,
      },
    });
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const status = err && err.status;
        if (status === 401 || status === 403 || status === 400) {
          this.userService.logout();
        }

        return EMPTY;
      })
    );
  }
}
