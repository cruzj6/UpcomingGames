import { Component, OnInit, Input, Inject } from '@angular/core';
import { GameItem } from 'app/model/game.model'
import { GameNewsItem } from 'app/model/gamenewsitem.model'
import { GameMediaItem } from 'app/model/gamemediaitem.model'
import { DomSanitizer } from '@angular/platform-browser';
import { TemplateRef } from '@angular/core';

@Component({
    selector: 'app-gameinfoview',
    templateUrl: './gameinfoview.component.html',
    styleUrls: ['./gameinfoview.component.scss']
})
export class GameinfoviewComponent implements OnInit {

    @Input() public activeGame: GameItem;

    private gameNewsItems: GameNewsItem[];

    private gameMediaItems: GameMediaItem[];

    private mediaPage: number = 0;

    private isLoadingMediaItems = false;

    private isLoadingNewsItems = false;

    constructor( @Inject('httpRequestService') public httpRequestService, private sanitizer: DomSanitizer) {
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
        this.isLoadingMediaItems = true;
        this.httpRequestService.getGameMedia(this.activeGame).subscribe(
            mediaItems => {
                let youtubeHost = 'https://www.youtube.com/embed/';

                this.gameMediaItems = mediaItems.filter((item: GameMediaItem) => {
                    return item.url.indexOf('https://www.youtube.com') > -1;
                })
                .map((item: GameMediaItem) => {
                        item.url = youtubeHost + item.url.split('?')[1].replace('v=', '');
                        return item;
                });
                this.isLoadingMediaItems = false;
            },

            err => {
                console.error("Error setting game media items: " + err);
                this.isLoadingMediaItems = false;
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
        this.isLoadingNewsItems = true;
        this.httpRequestService.getGameNewsArticles(this.activeGame).subscribe(
            newsItems => {
                this.gameNewsItems = newsItems;
                this.isLoadingNewsItems = false;
            },

            err => {
                console.error("Error setting game news items: " + err);
                this.isLoadingNewsItems = false;
            }
        );
    }

    sanitizeUrl(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }
}
