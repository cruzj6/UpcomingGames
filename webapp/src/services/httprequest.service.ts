import { Injectable } from '@angular/core';
import { Http, JsonpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class HttprequestService {

  constructor(private http: Http) { }

   searchGames(searchString: string) {
    return this.http
      .get('/info/searchgames')
      .map((res) => {console.log(res.json.toString())});
  }

}
