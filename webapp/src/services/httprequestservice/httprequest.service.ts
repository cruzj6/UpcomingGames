import { Injectable } from '@angular/core';
import { Http, JsonpModule, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { GameItem } from 'app/model/game.model'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/**
 * Services to make requests to the UC Games API
 * 
 * @export
 * @class HttprequestService
 */
@Injectable()
export class HttprequestService {

  constructor(private http: Http) { }

  /**
   * Make a simple contextual query for games
   * 
   * @param {string} searchString search terms separated by spaces
   * @returns {Observable<GameItem[]>} an Observable containing the games results
   * 
   * @memberOf HttprequestService
   */
  searchGames(searchString: string): Observable<GameItem[]> {
    let params = new URLSearchParams();
    params.set('searchTerm', searchString);


    return this.http
      .get('http://localhost:5000/info/searchGames', {
        search: params
      })
      .map((res: Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  getUserTrackedGames(): Observable<GameItem[]> {
     return this.http
      .get('http://localhost:5000/userdata/trackedGames')
      .map((res: Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }
}
