import {Component, OnInit, Input, Inject} from '@angular/core';
import {GameItem} from 'app/model/game.model'
import {GameNewsItem} from 'app/model/gamenewsitem.model'
import {GameMediaItem} from 'app/model/gamemediaitem.model'

@Component({
    selector: 'app-gameinfoview',
    templateUrl: './gameinfoview.component.html',
    styleUrls: ['./gameinfoview.component.scss']
})
export class GameinfoviewComponent implements OnInit {

    @Input() public activeGame: GameItem;

    private gameNewsItems: GameNewsItem[];

    private gameMediaItems: GameMediaItem[];

    constructor(@Inject('httpRequestService') public httpRequestService) {
    }

    ngOnInit() {
        this.loadGameNews();
        this.loadGameMedia();
    }

    /**
     * Load the Game Media items using the httpRequestService
     *
     *
     * @memberOf GameinfoviewComponent
     */
    loadGameMedia() {
        this.httpRequestService.getGameMedia(this.activeGame).subscribe(
            mediaItems => {

                let youtubeHost = 'http://www.youtube.com/v/';
                let youtubeQueryParams = '?version=3&amp;hl=en_US&amp;rel=0&amp;autohide=1&amp;autoplay=1';

                this.gameMediaItems = mediaItems.filter((item: GameMediaItem) => {
                    return item.url.indexOf('https://www.youtube.com') > -1;
                })
                    .map((item: GameMediaItem) => {
                        //TODOitem.url = this.domSanitizer.bypassSecurityTrustResourceUrl(youtubeHost + item.url.split('?')[1].replace('v=', '') + youtubeQueryParams);
                        console.log(item.url);
                        return item;
                    });
            },

            err => {
                console.error("Error setting game media items: " + err);
            }
        );
    }

    /**
     * Load the game news items using the httpRequestService
     *
     *
     * @memberOf GameinfoviewComponent
     */
    loadGameNews() {
        this.httpRequestService.getGameNewsArticles(this.activeGame).subscribe(
            newsItems => {
                this.gameNewsItems = newsItems;
            },

            err => {
                console.error("Error setting game news items: " + err);
            }
        );
    }

}
