import { Injectable } from '@angular/core';
import { Http, JsonpModule, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { GameItem } from 'app/model/game.model'
import { GameNewsItem } from 'app/model/gamenewsitem.model'
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
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  } 
}
