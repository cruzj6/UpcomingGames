import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GameItem } from 'app/model/game.model'
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent {

  public searchResults: GameItem[];

  public isSearching: Boolean;

  constructor(@Inject('httpRequestService') private httpReq){
    this.isSearching = false;
  }

  searchTypeahead = (text: Observable<string>) => {
    return text.debounceTime(200).distinctUntilChanged()
      .do(() => this.isSearching = true)
      .switchMap(
        searchTerm => this.httpReq.searchGames(searchTerm)
      )
      .do(() => this.isSearching = false);
  }

  search(searchString: string){
    this.httpReq.searchGames(searchString).subscribe(
      games => {
        games.forEach(game => {
          console.log(game.name);
        });
      },

      err => {
        console.log("An error has occured");
      }
    );
    console.log("test");
  }
}
