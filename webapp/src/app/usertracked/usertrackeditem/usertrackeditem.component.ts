import { Component, OnInit, Input, Inject } from '@angular/core';
import { GameItem } from 'app/model/game.model'
import { HttpRequestService } from "../../../services/httprequestservice/httprequest.service";
import { Observable } from "rxjs";
import { AlertService } from 'services/alertservice/alert.service';
import { CountdownService } from 'services/countdownservice/countdown.service';
import {SimpleDate} from 'app/model/simpledate.model';

@Component({
    selector: 'app-usertrackeditem',
    templateUrl: './usertrackeditem.component.html',
    styleUrls: ['./usertrackeditem.component.scss']
})
export class UsertrackeditemComponent implements OnInit {

    @Input() game: GameItem;

    @Input() removeMode$: Observable<Boolean>;

    private isRemoveMode: Boolean;

    private gameDate;

    private timeToRelease: SimpleDate = null;

    constructor( @Inject('httpRequestService') private httpReq: HttpRequestService,
        @Inject('alertService') private alertService: AlertService,
        @Inject('countdownService') private countdownService: CountdownService) { }

    ngOnInit() {
        this.initGameDate();
        this.removeMode$.subscribe(
            isMode => {
                this.isRemoveMode = isMode;
            }
        );
        this.startCountdownTimer();
    }

    startCountdownTimer() {
        //Start countdown if the game isn't out yet
        if (this.updatedTimeToRelease() > 0) {
            setInterval(() => this.timeToRelease = this.countdownService.convertMSToSimpleDate(this.updatedTimeToRelease()), 1000);
        }
    }

    updatedTimeToRelease(): number {
        let ttRelease = this.countdownService.getTimeFromNow(this.gameDate.getTime());
        return ttRelease;
    }

    initGameDate(){
        var gameDate = new Date();
        gameDate.setDate(this.game.releaseDay);
        gameDate.setMonth(this.game.releaseMonth - 1);
        gameDate.setFullYear(this.game.releaseYear);
        gameDate.setMinutes(0);
        gameDate.setHours(0);
        gameDate.setSeconds(0);

        this.gameDate = gameDate;
    }

    removeTrackedGame(e) {
        e.stopPropagation();
        this.httpReq.removeTrackedGame(this.game).then(
            res => {
                this.alertService.createTimedAlert("success", "Removed \"" + this.game.name + "\" from tracked games", AlertService.DEFAULT_ALERT_DURATION);
            }
        );
    }
}
