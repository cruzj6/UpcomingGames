import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GameItem } from 'app/model/game.model'
import {HttpRequestService} from 'services/httprequestservice/httprequest.service';
import { AlertService } from 'services/alertservice/alert.service';

@Component({
  selector: 'app-gamesearch',
  templateUrl: './gamesearch.component.html',
  styleUrls: ['./gamesearch.component.scss']
})
export class GameSearchComponent implements OnInit {

  public searchResults: GameItem[];

  public isSearching: Boolean;

  constructor(@Inject("httpRequestService") private httpRequestService: HttpRequestService,
  @Inject("alertService") private alertService: AlertService) {
    this.isSearching = false;
  }

  ngOnInit() {
  }

  
  /**
   * Returns an observable of GameItem[] to be used for 
   * ngbTypeahead ng-bootstrap directive
   * 
   * 
   * @memberOf AppComponent
   */
  searchTypeahead = (text: Observable<string>) => {
    return text.debounceTime(200)
      .distinctUntilChanged()
      .do(() => this.isSearching = true)
      .switchMap(
        searchTerm => this.httpRequestService.searchGames(searchTerm)
      )
      .do(() => this.isSearching = false);
  }

  /**
   * Add a tracked game to the user's tracked games
   * 
   * @param {GameItem} game game to add
   * 
   * @memberOf AppComponent
   */
  addTrackedGame(game: GameItem, e) {
    e.stopPropagation()
    this.httpRequestService.addTrackedGame(game).then(
        res => {
            if(res.alreadyTracked)
            {
                this.alertService.createTimedAlert("danger", "Cannot Add: " + game.name + " already tracked!", AlertService.DEFAULT_ALERT_DURATION);
            }
            else
                this.alertService.createTimedAlert("success", "Game Added: " + game.name, AlertService.DEFAULT_ALERT_DURATION);
        },
        err => {
            this.alertService.createTimedAlert("danger", "Error adding tracked game | " + err + ": " + game.name, AlertService.DEFAULT_ALERT_DURATION)
        }
    )
  }

}
