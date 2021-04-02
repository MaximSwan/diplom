import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable()
export class MainApiService {
  private readonly BASE_URL = environment.apiurl;
  constructor(private http: HttpClient) {}

  getAllArts(data?) {
    if (!data) {
      data = {};
    }
    return this.http.post<any>(`${this.BASE_URL}/api/articles/list`, data);
  }

  createPost(data) {
    return this.http.post<any>(`${this.BASE_URL}/api/articles/add`, data);
  }

  loadImg(data: FormData) {
    return this.http.post<any>(`${this.BASE_URL}/api/image/upload/art`, data);
  }
}
