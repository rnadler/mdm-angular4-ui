import { Injectable }     from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DataService {

  constructor(private http: Http) {}

  public getJSON(file): Observable<any> {
    return this.http.get('./assets/' + file)
      .map((res:any) => res.json())
      .catch((error:any) => { console.log(error); return error;});
  }
}
