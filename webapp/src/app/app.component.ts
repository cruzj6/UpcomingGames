import { Component } from '@angular/core';
import { HttprequestService } from '../services/httprequest.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [HttprequestService]
})
export class AppComponent {
  title = 'app works!';
  constructor(private httpReq: HttprequestService){}

  search(){
    this.httpReq.searchGames("s");
    console.log("test");
  }
}
