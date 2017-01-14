import {Component, OnInit, Input, Inject} from '@angular/core';
import {GameItem} from 'app/model/game.model'
import {HttpRequestService} from "../../../services/httprequestservice/httprequest.service";
import {Observable} from "rxjs";

@Component({
    selector: 'app-usertrackeditem',
    templateUrl: './usertrackeditem.component.html',
    styleUrls: ['./usertrackeditem.component.scss']
})
export class UsertrackeditemComponent implements OnInit {

    @Input() game: GameItem;

    @Input() removeMode$: Observable<Boolean>;

    private isRemoveMode: Boolean;

    constructor(@Inject('httpRequestService') private httpReq: HttpRequestService) {
    }

    ngOnInit() {
        this.removeMode$.subscribe(
            isMode => {
                this.isRemoveMode = isMode;
            }
        );
    }

    removeTrackedGame(e) {
        e.stopPropagation();
        this.httpReq.removeTrackedGame(this.game);
    }

}
