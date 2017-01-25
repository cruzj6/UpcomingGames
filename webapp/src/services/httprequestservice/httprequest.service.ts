import {Injectable} from '@angular/core';
import {RequestOptions, Headers, Http, JsonpModule, Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {GameItem} from 'app/model/game.model'
import {GameNewsItem} from 'app/model/gamenewsitem.model'
import {GameMediaItem} from 'app/model/gamemediaitem.model'
import {TopTrackedGameItem} from 'app/model/topTrackedGameItem.model'
import {Subject} from 'rxjs/Subject';
import {AdvancedSearchRequestItem} from 'app/model/advancedsearchrequestitem.model';
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

    private userTrackedGames: Array<GameItem>;

    private userTrackedGamesSubject: Subject<GameItem[]> = new Subject<GameItem[]>();

    constructor(private http: Http) {
        this.userTrackedGames = [];
        this.topTrackedGames = [];
    }

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
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    /**
     * Make an advanced search for games
     * 
     * @param {AdvancedSearchRequestItem} params parameters to use in the search
     * @returns {Observable<AdvancedSearchResultItem>} Results of the advanced search
     * 
     * @memberOf HttpRequestService
     */
    searchGamesAdvanced(searchParams: AdvancedSearchRequestItem): Observable<AdvancedSearchResultItem> {
        let params = new URLSearchParams();

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
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
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
            .catch((error: any) => Observable.throw(error.json().error || 'Server error: Error Getting Game News Articles'));
    }

    /**
     * Get the media items for a game
     *
     * @param {GameItem} game game to get media for
     * @returns {Observable<GameMediaItem[]>} observable of game media items
     *
     * @memberOf HttpRequestService
     */
    getGameMedia(game: GameItem): Observable<GameMediaItem[]> {
        let params = new URLSearchParams();
        params.set('gameName', game.name);

        return this.http.get('/info/gameMedia', {
            search: params
        })
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error: Error Getting Game Media'));
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
        params.set("number", String(numberOfGames));

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
                    console.log("Error setting user tracked games: " + err);
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
    addTrackedGame(game: GameItem): any {
        let headers = new Headers({'Content-Type': 'application/json'});
        let data = JSON.stringify({
            gameid: String(game.gbGameId)
        });
        let options = new RequestOptions({headers: headers});

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
            .map((res: Response) => res.json())
            .toPromise();
    }

    /**
     *  Remove a game from the current user's tracked games
     *
     * @param game game to remove from tracked games
     * @returns {Observable} Returns promise for the request
     */
    removeTrackedGame(game: GameItem): any {
        let headers = new Headers({'Content-type': 'application/json'});
        let data = JSON.stringify({
            gameid: String(game.gbGameId)
        });
        let options = new RequestOptions({headers: headers, body: data});

        return this.http
            .delete('/userdata/trackedGames', options)
            .catch((err: any) => {
                return Observable.throw(err.json().error || 'Server Error: Error deleting tracked game');
            })
            .do(() => {
                //Find item we want to remove
                let index = -1;
                for (let i = 0; i < this.userTrackedGames.length; i++) {
                    if (this.userTrackedGames[i].gbGameId === game.gbGameId) {
                        index = i;
                        break;
                    }
                }

                //Remove item
                if (index > -1) {
                    this.userTrackedGames.splice(index, 1);
                    this.userTrackedGamesSubject.next(this.userTrackedGames);
                }
            }).toPromise();
    }

    /**
     * Set the user tracked games, and set for subject to update observers
     *
     * @param {GameItem[]} games games to set as userTrackedGames
     *
     * @memberOf HttpRequestService
     */
    setUserTrackedGames(games: GameItem[]) {
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
    setTopTrackedGames(games: GameItem[]) {
        this.topTrackedGames = games;
        this.topTrackedGamesSubject.next(games);
    }
}
