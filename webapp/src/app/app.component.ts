import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GameItem } from 'app/model/game.model'
import { AlertItem } from 'app/model/alertItem.interface';
import { AlertService } from 'services/alertservice/alert.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent {

  public searchResults: GameItem[];

  public isSearching: Boolean;

  public alerts: AlertItem[];

  private alerts$: Observable<AlertItem[]>;

  constructor(@Inject('httpRequestService') private httpReq,
    @Inject('alertService') private alertService: AlertService){
    this.isSearching = false;
    this.alerts = [];
    this.alerts$ = this.alertService.getAlerts();

    //Update alerts with the service
    this.alerts$.subscribe(
      alerts => {
        this.alerts = alerts;
      }
    );
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
        searchTerm => this.httpReq.searchGames(searchTerm)
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
    this.httpReq.addTrackedGame(game).then(
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
