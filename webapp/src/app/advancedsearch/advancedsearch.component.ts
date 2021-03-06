import {Component, OnInit, Inject} from '@angular/core';
import {HttpRequestService} from "../../services/httprequestservice/httprequest.service";
import {FormGroup, FormBuilder, FormControl} from "@angular/forms";
import {AdvancedSearchRequestItem} from "../model/advancedsearchrequestitem.model";
import {GameItem} from "../model/game.model";
import {AlertService} from "../../services/alertservice/alert.service";
import {NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component(
    {
        selector: 'app-advancedsearch',
        templateUrl: './advancedsearch.component.html',
        styleUrls: ['./advancedsearch.component.scss'],
        providers: [FormBuilder, NgbDatepickerConfig]
    }
)
export class AdvancedSearchComponent implements OnInit{

    //private
    private advancedSearchForm: FormGroup;
    private platforms: {[apiName: string]: string} = {};
    private advancedSearchItem: AdvancedSearchRequestItem;
    private searchResults: GameItem[];
    private releaseDate: string;
    private isLoading: boolean;
    private years: number[] = new Array(100);
    private static START_YEAR = 1970;
    private static months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    constructor(@Inject('httpRequestService') private httpReqService: HttpRequestService,
                @Inject('alertService') private alertService: AlertService,
                private formBuilder: FormBuilder, config: NgbDatepickerConfig){

        //Add all of the platform types to the dictionary
        this.platforms["xbone"] = "Xbox One";
        this.platforms["ps4"] = "Playstation 4";
        this.platforms["wiiu"] = "Wii U";
        this.platforms["pc"] = "PC";
        this.platforms["android"] = "Android";
        this.platforms["ios"] = "iOS";
        this.platforms["switch"] = "Switch";
        this.platforms["3DS"] = "3DS"
        this.platforms[""] = "Any";

        //Set up years options
        for(var i = 0; i < this.years.length - 1; i++){
            this.years[i] = AdvancedSearchComponent.START_YEAR + i;
        }

        //DatePicker config
        config.showWeekdays = false;
        config.navigation = "select";
        config.outsideDays = "hidden";

        this.isLoading = false;
    }

    ngOnInit(){
        //Set up forms for advanced search
        this.advancedSearchForm = this.formBuilder.group({
            searchTerms: new FormControl(""),
            selectedPlatform: new FormControl(""),
            month: new FormControl(1),
            year: new FormControl(new Date().getFullYear())
        });

        this.advancedSearchItem = new AdvancedSearchRequestItem(
                this.advancedSearchForm.get('selectedPlatform').value,
                this.advancedSearchForm.get('month').value,
                this.advancedSearchForm.get('year').value,
                this.advancedSearchForm.get('searchTerms').value
            )

        //When the search data changes
        this.advancedSearchForm.valueChanges.subscribe(data => {
            this.advancedSearchItem = new AdvancedSearchRequestItem(
                data.selectedPlatform,
                data.month,
                data.year,
                data.searchTerms
            )
        });
    }

    /**
     * Submitted to perform an advancedsearch against the UCGames internal API
     *
     *
     * @memberOf AdvancedSearchComponent
     */
    onSubmitAdvancedSearch(){
        if(this.advancedSearchItem.Month === null || this.advancedSearchItem.Year === null){
            this.alertService.createTimedAlert("danger", "Please Select a Release Month/Year", 3000);
        }
        else{
            this.isLoading = true;
            this.httpReqService.searchGamesAdvanced(this.advancedSearchItem).subscribe(
            games => {
                this.searchResults = games;
                this.isLoading = false;
            },

            err => {
                this.alertService.createTimedAlert("danger", err.toString(), 5000);
                this.isLoading = false;
            }
            );
        }
    }

    /**
     * Add a tracked game
     *
     * @param {GameItem} game game to add
     *
     * @memberOf AdvancedSearchComponent
     */
    addTrackedGame(game: GameItem) {
        this.httpReqService.addTrackedGame(game).then(
            res => {
                if(res.alreadyTracked)
                {
                    this.alertService.createTimedAlert("danger", "Cannot Add: " + game.name + " already tracked!", AlertService.DEFAULT_ALERT_DURATION);
                }
                else
                    this.alertService.createTimedAlert("success", "Game Added: " + game.name, AlertService.DEFAULT_ALERT_DURATION);
            },
            err => {
                this.alertService.createTimedAlert("danger", "Error adding tracked game | " + err + ": " + game.name, AlertService.DEFAULT_ALERT_DURATION);
            }
        );
    }

    /**
     * Used to get the list of keys in the platforms dictionary
     *
     * @returns {string[]} Array of keys for the platforms dictionar
     *
     * @memberOf AdvancedSearchComponent
     */
    platformKeys(): string[]{
        let keys = [];
        for(let key in this.platforms){
            keys.push(key);
        }
        return keys;
    }

    get Months(){
        return AdvancedSearchComponent.months;
    }
}