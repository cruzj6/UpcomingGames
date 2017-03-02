import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AlertItem } from 'app/model/alertItem.interface';
import { AlertService } from 'services/alertservice/alert.service';
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

  public alerts: AlertItem[];

  private alerts$: Observable<AlertItem[]>;

  constructor(@Inject('httpRequestService') private httpReq,
    @Inject('alertService') private alertService: AlertService){
    this.alerts = [];
    this.alerts$ = this.alertService.getAlerts();

    //Update alerts with the service
    this.alerts$.subscribe(
      alerts => {
        this.alerts = alerts;
      }
    );
  }
}
