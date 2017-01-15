import { Injectable } from '@angular/core';
import { AlertItem } from 'app/model/alertItem.interface';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/observable';

@Injectable()
export class AlertService {

  public alertsSubject: Subject<AlertItem[]>;

  private alerts: Array<AlertItem>;

  constructor() { 
      this.alertsSubject = new Subject();
      this.alerts = [];
  }

    /**
     * Add an alert to the alert to display
     *
     * @param alert
     */
    addAlert(alert: AlertItem) {
        this.alerts.push(alert);
        this.alertsSubject.next(this.alerts);
    }

    /**
     * Close an alert item by removing it from the array
     * 
     * @param {AlertItem} alert alert you want to close
     * 
     * @memberOf AlertService
     */
    closeAlert(alert: AlertItem){
        let index = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
        this.alertsSubject.next(this.alerts);
    }
    
    /**
     * Get the app's alerts as an observable
     * 
     * @returns {Observable<AlertItem[]>}
     * 
     * @memberOf AlertService
     */
    getAlerts(): Observable<AlertItem[]>{
      return this.alertsSubject.asObservable();
    }
}
