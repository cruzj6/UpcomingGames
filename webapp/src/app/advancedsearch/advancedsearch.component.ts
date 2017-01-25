import {Component, OnInit, Inject} from '@angular/core';
import {HttpRequestService} from "../../services/httprequestservice/httprequest.service";
import {FormGroup, FormBuilder, FormControl} from "@angular/forms";
import {AdvancedSearchRequestItem} from "../model/advancedsearchrequestitem.model";
import {GameItem} from "../model/game.model";
import {AlertService} from "../../services/alertservice/alert.service";

@Component(
    {
        selector: 'app-advancedsearch',
        templateUrl: './advancedsearch.component.html',
        styleUrls: ['./advancedsearch.component.scss'],
        providers: [FormBuilder]
    }
)
export class AdvancedSearchComponent implements OnInit{

    //private
    private advancedSearchForm: FormGroup;
    private platforms: {[apiName: string]: string} = {};
    private advancedSearchItem: AdvancedSearchRequestItem;
    private searchResults: GameItem[];

    constructor(@Inject('httpRequestService') private httpReqService: HttpRequestService,
                @Inject('alertService') private alertService: AlertService,
                private formBuilder: FormBuilder){
        this.platforms["xbone"] = "Xbox One";
        this.platforms["ps4"] = "Playstation 4";
        this.platforms["wiiu"] = "Wii U";
        this.platforms["pc"] = "PC";
        this.platforms["android"] = "Android";
        this.platforms["ios"] = "iOS";
    }

    ngOnInit(){

        this.advancedSearchForm = this.formBuilder.group({
            searchTerms: new FormControl(""),
            selectedPlatform: new FormControl("xbone"),
            startDate: new FormControl(null),
            endDate: new FormControl(null)
        });

        //When the search data changes
        this.advancedSearchForm.valueChanges.subscribe(data => {
            this.advancedSearchItem = new AdvancedSearchRequestItem(
                data.selectedPlatform,
                data.startDate ? data.startDate.month : null,
                data.startDate ? data.startDate.year : null,
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
        console.log("submit");
        this.httpReqService.searchGamesAdvanced(this.advancedSearchItem).subscribe(
          games => {
              this.searchResults = games;
              console.log(games);
          },

          err => {
            this.alertService.createTimedAlert("danger", err.toString(), 5000);
          }
        );
    }

    platformKeys(): string[]{
        let keys = [];
        for(let key in this.platforms){
            keys.push(key);
        }

        return keys;
    }
}