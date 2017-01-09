import { Injectable } from '@angular/core';
import { RequestOptions, Headers, Http, JsonpModule, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { GameItem } from 'app/model/game.model'
import { GameNewsItem } from 'app/model/gamenewsitem.model'
import { TopTrackedGameItem } from 'app/model/topTrackedGameItem.model'
import { Subject } from 'rxjs/Subject';
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

  private topTrackedGames: GameItem[];

  private topTrackedGamesSubject: Subject<GameItem[]> = new Subject<GameItem[]>();

  private userTrackedGames: GameItem[];
    
  private userTrackedGamesSubject: Subject<GameItem[]> = new Subject<GameItem[]>();

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
     this.http
      .get('/userdata/trackedGames')
      .map((res: Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
      .subscribe(
        games => {
          this.setUserTrackedGames(games)
        },

        err => {
          console.log(err);
        }
      );

      return this.userTrackedGamesSubject.asObservable();
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

    this.http
      .get('/info/topTracked', {
        search: params
      })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error: Error Getting Top Tracked Games'))
      .subscribe(     
        games => {
          this.setTopTrackedGames(games);
        },

        err => {
          console.log("Error setting user tracked games");
        });
    
    //Send observable so it will be updated whenever this is refreshed
    return this.topTrackedGamesSubject.asObservable();
  }

  /**
   * Add a tracked game to the user's tracked games
   * 
   * @param {GameItem} game game to add
   * @returns {Observable}
   * 
   * @memberOf HttpRequestService
   */
  addTrackedGame(game: GameItem): any{
    let headers = new Headers({'Content-Type': 'application/json'});
    let data = JSON.stringify({
        gameid: String(game.gbGameId)
    });
    let options = new RequestOptions({ headers: headers });

    return this.http
      .post('/userdata/trackedGames', data, options)
      .catch((error: any) => {
        return Observable.throw(error.json().error || 'Server Error: Error Adding tracked game')
      })
      .do(() => {
        //Add tracked game locally to update all items subbed to observable
        this.userTrackedGames.push(game);
        this.userTrackedGamesSubject.next(this.userTrackedGames);
      })
      .toPromise();
  }

  /**
   * Set the user tracked games, and set for subject to update observers
   * 
   * @param {GameItem[]} games games to set as userTrackedGames
   * 
   * @memberOf HttpRequestService
   */
  setUserTrackedGames(games: GameItem[]){
    this.userTrackedGames = games;
    this.userTrackedGamesSubject.next(games);
  }

  /**
   * Set the top tracked games, and set for subject to update observers
   * 
   * @param {GameItem[]} games  games to set as topTrackedGames
   * 
   * @memberOf HttpRequestService
   */
  setTopTrackedGames(games: GameItem[]){
    this.topTrackedGames = games;
    this.topTrackedGamesSubject.next(games);
  }
}
