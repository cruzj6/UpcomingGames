import { Component, OnInit, Inject } from '@angular/core';
import { GameItem } from 'app/model/game.model'
import { HttpRequestService } from '../../services/httprequestservice/httprequest.service';

/**
 * Class for the user tracked component, which handles interactions with the user's 
 * currently tracked games
 * 
 * @export
 * @class UsertrackedComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-usertracked',
  templateUrl: './usertracked.component.html',
  styleUrls: ['./usertracked.component.scss']
})
export class UsertrackedComponent implements OnInit {

  private curMode: string;

  private modeStack: string[];

  public trackedGames: GameItem[];

  public selectedGame: GameItem;

  private static INFO_MODE: string = "info_mode";

  private static GAME_MODE: string = "game_mode";

  constructor(@Inject('httpRequestService') public httpRequestService: HttpRequestService) { 
    this.curMode = UsertrackedComponent.GAME_MODE;
    this.modeStack = [];
  }

  ngOnInit() {
    this.httpRequestService.getUserTrackedGames().subscribe(
      games => {
        this.trackedGames = games;
      },

      err => {
        console.log("Error displaying user tracked games");
      }
    )
  }

  /**
   * Set the currently selected game and transition to game info mode for that game
   * 
   * @param {GameItem} game game to use in info mode
   * 
   * @memberOf UsertrackedComponent
   */
  selectTrackedGame(game: GameItem)
  {
    this.selectedGame = game;
    this.modeStack.push(this.curMode);
    this.curMode = UsertrackedComponent.INFO_MODE;
  }

  /**
   * Pop the previous mode off of the stack and set it as the current mode
   * 
   * 
   * @memberOf UsertrackedComponent
   */
  selectPrevMode()
  {
    this.curMode = this.modeStack.pop();
  }

  /**
   * Returns the stack containing the stack of previous modes
   * 
   * @readonly
   * 
   * @memberOf UsertrackedComponent
   */
  get ModeStack()
  {
    return this.modeStack;
  }

  /**
   * Get the current mode of the user tracked view
   * 
   * @readonly
   * 
   * @memberOf UsertrackedComponent
   */
  get CurMode()
  {
    return this.curMode;
  }

  /**
   * Get the value of the GAME_MODE static property, to use in the view
   * 
   * @readonly
   * 
   * @memberOf UsertrackedComponent
   */
  get GAME_MODE()
  {
    return UsertrackedComponent.GAME_MODE;
  }

  /**
   * Get the value of the INFO_MODE static property, to use in view
   * 
   * @readonly
   * 
   * @memberOf UsertrackedComponent
   */
  get INFO_MODE()
  {
    return UsertrackedComponent.INFO_MODE;
  }
}
