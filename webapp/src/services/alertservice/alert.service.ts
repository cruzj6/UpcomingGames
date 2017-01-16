import { Injectable } from '@angular/core';
import { AlertItem } from 'app/model/alertItem.interface';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/observable';

@Injectable()
export class AlertService {

  public static DEFAULT_ALERT_DURATION: number = 5000;

  private alertsSubject: Subject<AlertItem[]>;

  private alerts: Array<AlertItem>;

  constructor() { 
      this.alertsSubject = new Subject();
      this.alerts = [];
  }

    /**
     * Add an alert to the alert to list of alerts to be shown until closed
     *
     * @param alert
     */
    addAlert(alert: AlertItem) {
        this.alerts.push(alert);
        this.alertsSubject.next(this.alerts);
    }

    /**
     * Remove an alert from the list of alerts
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

    /**
     * Create an alert that is removed from the list after a given amount of time
     * 
     * @param {string} type type of alert, bootstrap alert type
     * @param {string} message message to display in the alert
     * @param {number} timeToClose amount of time to keep the alert in the list
     * 
     * @memberOf AlertService
     */
    createTimedAlert(type: string, message: string, timeToClose: number){
        //Show alert, build item
        let alert: AlertItem = {
            type: type,
            message: message
        };
        this.addAlert(alert);

        //Remove the alert after x seconds
        setTimeout(() => {
            this.closeAlert(alert);
        }, timeToClose);
    }
}
