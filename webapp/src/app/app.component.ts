import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GameItem } from 'app/model/game.model'
import { AlertItem } from 'app/model/alertitem.interface';
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

  addTrackedGame(game: GameItem) {
    this.httpReq.addTrackedGame(game);
  }
}
