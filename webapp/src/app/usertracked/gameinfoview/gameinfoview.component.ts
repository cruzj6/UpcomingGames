import {Component, OnInit, Input, Inject} from '@angular/core';
import {GameItem} from 'app/model/game.model'
import {GameNewsItem} from 'app/model/gamenewsitem.model'
import {GameMediaItem} from 'app/model/gamemediaitem.model'
import {DomSanitizer} from '@angular/platform-browser';
import {TemplateRef} from '@angular/core';

@Component({
    selector: 'app-gameinfoview',
    templateUrl: './gameinfoview.component.html',
    styleUrls: ['./gameinfoview.component.scss'],
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
                let youtubeHost = 'http://www.youtube.com/embed/';

                this.gameMediaItems = mediaItems.filter((item: GameMediaItem) => {
                    return item.url.indexOf('https://www.youtube.com') > -1;
                })
                    .map((item: GameMediaItem) => {
                        item.url = youtubeHost + item.url.split('?')[1].replace('v=', '');
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
