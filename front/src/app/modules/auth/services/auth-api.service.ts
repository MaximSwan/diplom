import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ILogin, IReg } from "../interfaces/auth";

@Injectable()
export class AuthApiService {
  constructor(private http: HttpClient) {}

  private readonly BASE_URL = environment.apiurl;

  sendReg(body: IReg): Observable<{ ok: 1 } | { error: { msg: string } }> {
    return this.http.post<{ ok: 1 } | { error: { msg: string } }>(
      `${this.BASE_URL}/api/auth/registration`,
      body
    );
  }

  sendLogin(
    body: ILogin
  ): Observable<
    | { token: string; userId: string; email: string }
    | { error: { msg: string } }
  > {
    return this.http.post<
      | { token: string; userId: string; email: string }
      | { error: { msg: string } }
    >(`${this.BASE_URL}/api/auth/login`, body);
  }
}
