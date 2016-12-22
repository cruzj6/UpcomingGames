import { Component, OnInit, Inject } from '@angular/core';
import { GameItem } from 'app/model/game.model'

@Component({
  selector: 'app-usertracked',
  templateUrl: './usertracked.component.html',
  styleUrls: ['./usertracked.component.scss']
})
export class UsertrackedComponent implements OnInit {
  public trackedGames: GameItem[];

  constructor(@Inject('httpReq') public httpReq) { }

  ngOnInit() {
    this.httpReq.getUserTrackedGames().subscribe(
      games => {
        this.trackedGames = games;
      },

      err => {
        console.log("Error displaying user tracked games");
      }
    )
  }

}
