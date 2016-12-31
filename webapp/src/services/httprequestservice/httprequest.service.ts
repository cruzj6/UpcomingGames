import { Injectable } from '@angular/core';
import { RequestOptions, Headers, Http, JsonpModule, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { GameItem } from 'app/model/game.model'
import { GameNewsItem } from 'app/model/gamenewsitem.model'
import { TopTrackedGameItem } from 'app/model/topTrackedGameItem.model'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

/**
 * Services to make requests to the UC Games API
 * 
 * @export
 * @class HttprequestService
 */
@Injectable()
export class HttpRequestService {

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
      .get('/info/searchGames', {
        search: params
      })
      .map((res: Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  /**
   * Get the tracked games for the current user
   * 
   * @returns {Observable<GameItem[]>} List of the users tracked games as GameItems
   * 
   * @memberOf HttprequestService
   */
  getUserTrackedGames(): Observable<GameItem[]> {
     return this.http
      .get('/userdata/trackedGames')
      .map((res: Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  /**
   * Get the news articles for the specified GameItem from the UCgames API
   * 
   * @param {GameItem} game game to get news articles for
   * @returns {Observable<GameNewsItem[]>} List of GameNewsItems for the game news articles returned
   * 
   * @memberOf HttprequestService
   */
  getGameNewsArticles(game: GameItem): Observable<GameNewsItem[]> {
    let params = new URLSearchParams();
    params.set('gameName', game.name);

     return this.http
      .get('/info/articles', {
        search: params
      })
      .map((res: Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error: Error Getting Game News Articles'));
  } 

  /**
   * Get the top tracked games form the UCGames API
   * 
   * @returns {Observable<GameItem[]>} List of top tracked games
   * 
   * @memberOf HttprequestService
   */
  getTopTrackedGames(numberOfGames: number): Observable<GameItem[]> {
    let params = new URLSearchParams();
    params.set("number", String(numberOfGames))

    return this.http
      .get('/info/topTracked', {
        search: params
      })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error: Error Getting Top Tracked Games'));
  }

  /**
   * Add a tracked game to the user's tracked games
   * 
   * @param {number} gameId giant bomb id of the game
   * @returns {Observable}
   * 
   * @memberOf HttpRequestService
   */
  addTrackedGame(gameId: number): any{
    let headers = new Headers({'Content-Type': 'application/json'});
    let data = JSON.stringify({
        gameid: String(gameId)
    });
    let options = new RequestOptions({ headers: headers });
    return this.http
      .post('/userdata/trackedGames', data, options)
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error: Error Getting Top Tracked Games'))
      .toPromise();
  }
}
