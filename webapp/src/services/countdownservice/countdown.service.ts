import { Injectable } from '@angular/core';
import {SimpleDate} from 'app/model/simpledate.model';

/**
 * Used to countdown to specific dates
 * 
 * @export
 * @class CountdownService
 */
@Injectable()
export class CountdownService {

    /**
     * Get the amount of time in ms between two dates
     * 
     * @param {any} startTime time to start from in ms
     * @param {any} endTime time to end from in ms
     * @returns {number} ms between the two dates
     * 
     * @memberOf CountdownService
     */
    getDateTimeGap(startTime, endTime): number {
        let startDate = new Date(startTime);
        let endDate = new Date(endTime);
        var timeGap = endDate.getTime() - startDate.getTime();

        return timeGap;
    }


    /**
     * Get amount of time in ms until given date
     * 
     * @param {any} endTime 
     * @returns {number} ms until given date
     * 
     * @memberOf CountdownService
     */
    getTimeFromNow(endTime): number {
        let timeGap = this.getDateTimeGap(new Date().getTime(), endTime);
        return timeGap;
    }

    convertMSToSimpleDate(ms) : SimpleDate {
        var remTime = ms;
        var days = Math.floor(ms/(60 * 60 * 24 * 1000));
        remTime -= (days * 60 * 60 * 24 * 1000);
        var hours = Math.floor((ms - (days * 60 * 60 * 24 * 1000))/(60 * 60 * 1000));
        remTime -= (hours * 60 * 60 * 1000);
        var minutes = Math.floor(remTime/(60 * 1000));
        remTime -= (minutes * 60 * 1000);
        var seconds = Math.floor(remTime/(1000));
        let dateTime = new SimpleDate(days, hours, minutes, seconds);
        return dateTime;
    }
}