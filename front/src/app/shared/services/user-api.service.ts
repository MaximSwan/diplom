import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable()
export class UserApiService {
  private readonly BASE_URL = environment.apiurl;
  constructor(private http: HttpClient) {}

  getUserInfo(id) {
    return this.http.get<any>(`${this.BASE_URL}/api/user/info/${id}`);
  }
}
