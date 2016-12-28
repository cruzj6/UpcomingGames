import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { UsertrackedComponent } from './usertracked/usertracked.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttprequestService } from 'services/httprequestservice/httprequest.service';
import { UsertrackeditemComponent } from './usertracked/usertrackeditem/usertrackeditem.component'

@NgModule({
  declarations: [
    AppComponent,
    UsertrackedComponent,
    UsertrackeditemComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  providers: [{provide:'httpReq', useClass: HttprequestService}],
  bootstrap: [AppComponent]
})
export class AppModule { }
