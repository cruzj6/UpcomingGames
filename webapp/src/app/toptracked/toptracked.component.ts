import {Component, OnInit, Inject} from '@angular/core';
import {GameItem} from 'app/model/game.model'
import {TopTrackedGameItem} from 'app/model/topTrackedGameItem.model'
import {HttpRequestService} from 'services/httprequestservice/httprequest.service';
import {AlertItem} from "../model/alertItem.interface";

@Component({
    selector: 'app-toptracked',
    templateUrl: './toptracked.component.html',
    styleUrls: ['./toptracked.component.scss']
})
export class TopTrackedComponent implements OnInit {

    public topTrackedGames: GameItem[];

    public isLoadingTopTracked: Boolean;

    public alerts: Array<AlertItem>;

    private static NUM_COLS = 2;

    constructor(@Inject('httpRequestService') public httpRequestService: HttpRequestService) {
    }

    ngOnInit() {
        this.loadTopTrackedGames();
        this.alerts = [];
    }

    /**
     * Add a tracked game using the internal UC Game API, httpRequestService
     *
     * @param game Game to add as a tracked game
     */
    addTrackedGame(game: GameItem) {
        this.httpRequestService.addTrackedGame(game).then(
            res => {
                //Show alert on success
                let alert: AlertItem = {
                    type: "success",
                    message: game.name
                };
                this.addAlert(alert);
            },
            err => {
                //Show alert on error
                let alert: AlertItem = {
                    type: "danger",
                    message: game.name
                };
                this.addAlert(alert);
                console.error("Error adding tracked game: " + err);
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
     * Add an alert to the alert to display
     *
     * @param alert
     */
    addAlert(alert: AlertItem) {
        this.alerts.push(alert);
    }

    closeAlert(alert: AlertItem){
        let index = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
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

}
