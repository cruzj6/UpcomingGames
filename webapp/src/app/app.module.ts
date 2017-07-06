import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { UsertrackedComponent } from './usertracked/usertracked.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpRequestService } from 'services/httprequestservice/httprequest.service';
import { UsertrackeditemComponent } from './usertracked/usertrackeditem/usertrackeditem.component';
import { GameinfoviewComponent } from './usertracked/gameinfoview/gameinfoview.component';
import { routing } from './app.routes';
import { TopTrackedComponent } from './toptracked/toptracked.component';
import { AlertService } from 'services/alertservice/alert.service';
import { AdvancedSearchComponent } from 'app/advancedsearch/advancedsearch.component';
import { CountdownService } from 'services/countdownservice/countdown.service';
import { SafePipe } from 'app/model/safeurl.pipe';
import { GameSearchComponent } from './gamesearch/gamesearch.component';

@NgModule({
  declarations: [
    AppComponent,
    UsertrackedComponent,
    UsertrackeditemComponent,
    GameinfoviewComponent,
    TopTrackedComponent,
    AdvancedSearchComponent,
    SafePipe,
    GameSearchComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    ReactiveFormsModule
  ],
  providers: [{provide:'httpRequestService', useClass: HttpRequestService}, {provide:'alertService', useClass: AlertService}, {provide:'countdownService', useClass: CountdownService}],
  bootstrap: [AppComponent]
})
export class AppModule { }
