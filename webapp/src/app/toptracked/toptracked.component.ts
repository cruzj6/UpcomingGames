import {Component, OnInit, Inject} from '@angular/core';
import {GameItem} from 'app/model/game.model'
import {TopTrackedGameItem} from 'app/model/topTrackedGameItem.model'
import {HttpRequestService} from 'services/httprequestservice/httprequest.service';
import {AlertItem} from "../model/alertItem.interface";
import { AlertService } from 'services/alertservice/alert.service';
import { Observable } from 'rxjs/observable';

@Component({
    selector: 'app-toptracked',
    templateUrl: './toptracked.component.html',
    styleUrls: ['./toptracked.component.scss'],
})
export class TopTrackedComponent implements OnInit {

    public topTrackedGames: GameItem[];

    public isLoadingTopTracked: Boolean;

    public alerts$: Observable<AlertItem[]>;

    public alerts: AlertItem[];

    private static NUM_COLS = 2;

    constructor(@Inject('httpRequestService') public httpRequestService: HttpRequestService,
        @Inject('alertService') public alertService: AlertService) {}

    ngOnInit() {
        this.loadTopTrackedGames();
        this.alerts = [];
        this.alerts$ = this.alertService.getAlerts();
        this.alerts$.subscribe(
            alerts => {
                this.alerts = alerts;
            }
        );
    }

    /**
     * Add a tracked game using the internal UC Game API, httpRequestService
     *
     * @param game Game to add as a tracked game
     */
    addTrackedGame(game: GameItem) {
        this.httpRequestService.addTrackedGame(game).then(
            res => {
                if(res.alreadyTracked)
                {
                    this.createAlert("danger", "Cannot Add: " + game.name + " already tracked!");
                }
                else
                    this.createAlert("success", "Game Added: " + game.name);
            },
            err => {
                this.createAlert("danger", "Error adding tracked game | " + err + ": " + game.name)
            }
        )
    }

    /**
     * Load the top tracked games from the httpRequestService
     */
    loadTopTrackedGames() {
        this.isLoadingTopTracked = true;
        this.httpRequestService.getTopTrackedGames(20).subscribe(
            games => {
                this.isLoadingTopTracked = false;
                console.log("GOT!");
                console.log(JSON.stringify(games));
                this.topTrackedGames = games.filter(g => {
                    return g != null
                });
            },

            err => {
                this.isLoadingTopTracked = false;
                console.log("Error displaying top tracked games: " + err);
            }
        );
    }

    /**
     * Builds and returns the groups of top tracked games, for formatting
     *
     * @returns {GameItem[][]} Rows and columns of top tracked games
     * @constructor
     */
    get TopTrackedGroups() {
        let topTrackedRows = [];
        for (let i = 0; i < this.topTrackedGames.length - 1; i += TopTrackedComponent.NUM_COLS) {
            let row = [];
            for (let j = 0; j < TopTrackedComponent.NUM_COLS; j++) {
                let ind = i + j;
                if (ind >= (this.topTrackedGames.length - 1)) break;
                row.push(this.topTrackedGames[i + j]);
            }
            topTrackedRows.push(row);
        }

        return topTrackedRows;

    }

    /**
     * External getter for this item's top tracked games
     *
     * @returns {GameItem[]} Top tracked games, according to this component
     * @constructor
     */
    get TopTrackedGames() {
        return this.topTrackedGames;
    }

     /**
     * Create an alert that is closed after x seconds using the alertservice
     * 
     * @param {string} type bootstrap 4 type of alert (success, danger, warning...)
     * @param {message} message message to be displayed in the alert
     * @memberOf TopTracked
     */
    createAlert(type: string, message: string){
        this.alertService.createTimedAlert(type, message, 5000);
    }


}
