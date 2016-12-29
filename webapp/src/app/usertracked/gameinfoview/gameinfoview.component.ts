import { Component, OnInit, Input, Inject } from '@angular/core';
import { GameItem } from 'app/model/game.model'
import { GameNewsItem } from 'app/model/gamenewsitem.model'

@Component({
  selector: 'app-gameinfoview',
  templateUrl: './gameinfoview.component.html',
  styleUrls: ['./gameinfoview.component.scss']
})
export class GameinfoviewComponent implements OnInit {

  @Input() public activeGame: GameItem;

  private gameNewsItems: GameNewsItem[];

  constructor(@Inject('httpReq') public httpReq) { }

  ngOnInit() {
    this.httpReq.getGameNewsArticles(this.activeGame).subscribe(
      newsItems => {
        this.gameNewsItems = newsItems;
      },

      err => {

      }
    );
  }

}
