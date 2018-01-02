import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DataService {

  constructor(private http: HttpClient) {}

  public getJSON(file): Observable<any> {
    return this.http.get('./assets/' + file)
      .map((res:any) => res)
      .catch((error:any) => { console.log(error); return error;});
  }
}
