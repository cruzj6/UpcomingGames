import { Component, OnInit, Inject } from '@angular/core';
import { GameItem } from 'app/model/game.model'
import { TopTrackedGameItem } from 'app/model/topTrackedGameItem.model'
import { HttpRequestService } from 'services/httprequestservice/httprequest.service';

@Component({
  selector: 'app-toptracked',
  templateUrl: './toptracked.component.html',
  styleUrls: ['./toptracked.component.scss']
})
export class TopTrackedComponent implements OnInit {

  public topTrackedGames: GameItem[];

  constructor(@Inject('httpRequestService') public httpRequestService: HttpRequestService) { }

  ngOnInit() {
    this.loadTrackedGames();
  }

  addTrackedGame(gameId: number)
  {
    this.httpRequestService.addTrackedGame(gameId).then(
      res => {this.loadTrackedGames();}
    )
  }

  loadTrackedGames(){
    this.httpRequestService.getTopTrackedGames(10).subscribe(
      games => {
        console.log("GOT!");
        this.topTrackedGames = games;
      },

      err => {
        console.log("Error displaying top tracked games")
      }
    );
  }

  get TopTrackedGroups()
  {
    let topTrackedRows = new Array<GameItem[]>();
    for(let i = 0; i < this.topTrackedGames.length - 1; i+=3)
    {
      let row = new Array<GameItem>();
      for(let j = 0; j < 3; j++)
      {
        let ind = i + j;
        if(ind >= (this.topTrackedGames.length - 1)) break;
        row.push(this.topTrackedGames[i + j]);
      }
      topTrackedRows.push(row);
    }

    return topTrackedRows;
  
  }

  get TopTrackedGames()
  {
    return this.topTrackedGames;
  }

}
