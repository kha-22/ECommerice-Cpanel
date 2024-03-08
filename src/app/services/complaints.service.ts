import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ComplaintsService {
  private url = environment.apiUrl + "contactus/";

  constructor(private http: HttpClient) {}

  getQuestionWithReplayes(): any {
    return this.http.get(this.url + "getQuestions");
  }

  sendAnswer(id: any, message: any): any {
    var body = {
      id: id,
      replay: message,
    };
    return this.http.post(this.url + "sendAnswer", body);
  }
}
