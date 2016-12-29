import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent {
  constructor(@Inject('httpReq')private httpReq){}

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
