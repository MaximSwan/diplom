import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class MainArtsService {
  change = new Subject();
  constructor() {}
}
