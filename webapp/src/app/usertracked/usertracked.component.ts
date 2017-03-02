import {Component, OnInit, Inject} from '@angular/core';
import {GameItem} from 'app/model/game.model'
import {HttpRequestService} from '../../services/httprequestservice/httprequest.service';
import {FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {Subject} from "rxjs";

/**
 * Class for the user tracked component, which handles interactions with the user's
 * currently tracked games
 *
 * @export
 * @class UsertrackedComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-usertracked',
    templateUrl: './usertracked.component.html',
    styleUrls: ['./usertracked.component.scss'],
    providers: [FormBuilder]
})
export class UsertrackedComponent implements OnInit {

    //private vars
    private curMode: string;

    private modeStack: string[];

    private modeDisplayNames: {[modeName: string]: string};

    private static INFO_MODE: string = "info_mode";

    private static GAME_MODE: string = "game_mode";

    private removeMode: Boolean = false;

    private removeModeSubject: Subject<Boolean> = new Subject();

    //public vars
    public trackedGames: GameItem[];

    public displayTrackedGames: GameItem[];

    public selectedGame: GameItem;

    public someTopTracked: GameItem[];

    public searchTrackedInput: string;

    public isLoadingTrackedGames: Boolean;

    public searchMyTrackedForm: FormGroup;

    public isFilterEnabled: Boolean = false;

    //static values
    private static NUM_TOP_TRACKED: number = 5;

    constructor(@Inject('httpRequestService') public httpRequestService: HttpRequestService, private formBuilder: FormBuilder) {
        this.curMode = UsertrackedComponent.GAME_MODE;
        this.modeStack = [];
        this.modeDisplayNames = {};
        this.modeDisplayNames[UsertrackedComponent.INFO_MODE] = "Game Info";
        this.modeDisplayNames[UsertrackedComponent.GAME_MODE] = "Games List";
    }

    ngOnInit() {
        this.loadUserTrackedGames();
        this.loadSomeTopTrackedGames();

        //Set initial search text to empty
        this.searchMyTrackedForm = this.formBuilder.group({
            searchText: new FormControl("")
        });

        //When the search text changes
        this.searchMyTrackedForm.valueChanges.subscribe(data => {
            this.filterDisplayTrackedGames(data.searchText);
        });
    }

    /**
     * Request the User's tracked games from the API, and set in model
     *
     * @memberOf UsertrackedComponent
     */
    loadUserTrackedGames() {
        this.isLoadingTrackedGames = true;
        this.httpRequestService.getUserTrackedGames().subscribe(
            games => {
                this.isLoadingTrackedGames = false;

                //Sort the results
                this.trackedGames = games.sort((g1, g2) => {
                    if (g1.name < g2.name) return -1;
                    if (g1.name > g2.name) return 1;
                    return 0;
                });

                //Filter the displayed tracked games
                let filterText = this.searchMyTrackedForm.get('searchText').value;
                this.filterDisplayTrackedGames(filterText);
            },

            err => {
                this.isLoadingTrackedGames = false;
                console.log("Error displaying user tracked games");
            }
        );
    }

    /**
     * Load a subset of the top tracked games from the API
     *
     *
     * @memberOf UsertrackedComponent
     */
    loadSomeTopTrackedGames() {
        this.httpRequestService.getTopTrackedGames(UsertrackedComponent.NUM_TOP_TRACKED).subscribe(
            games => {
                this.someTopTracked = games;
            },

            err => {
                console.log("Error displaying top tracked games summary: " + err);
            }
        );
    }

    /**
     * Filter the displayed tracked games by the given text
     *
     * @param {string} filterText Text that tracked games item must contain
     *
     * @memberOf UsertrackedComponent
     */
    filterDisplayTrackedGames(filterText: string = "") {
        if (this.trackedGames) {
            this.displayTrackedGames = this.trackedGames
                .filter(game => game.name.toLowerCase().indexOf(filterText.toLowerCase()) >= 0);
        }
    }

    /**
     * Set the currently selected game and transition to game info mode for that game
     *
     * @param {GameItem} game game to use in info mode
     *
     * @memberOf UsertrackedComponent
     */
    selectTrackedGame(game: GameItem) {
        this.selectedGame = game;
        this.modeStack.push(this.curMode);
        this.curMode = UsertrackedComponent.INFO_MODE;
    }

    /**
     * Pop the previous mode off of the stack and set it as the current mode
     *
     *
     * @memberOf UsertrackedComponent
     */
    selectPrevMode() {
        this.curMode = this.modeStack.pop();
    }

    /**
     * Returns the stack containing the stack of previous modes
     *
     * @readonly
     *
     * @memberOf UsertrackedComponent
     */
    get ModeStack() {
        return this.modeStack;
    }

    /**
     * Get the current mode of the user tracked view
     *
     * @readonly
     *
     * @memberOf UsertrackedComponent
     */
    get CurMode() {
        return this.curMode;
    }

    /**
     * Get the value of the GAME_MODE static property, to use in the view
     *
     * @readonly
     *
     * @memberOf UsertrackedComponent
     */
    get GAME_MODE() {
        return UsertrackedComponent.GAME_MODE;
    }

    /**
     * Get the value of the INFO_MODE static property, to use in view
     *
     * @readonly
     *
     * @memberOf UsertrackedComponent
     */
    get INFO_MODE() {
        return UsertrackedComponent.INFO_MODE;
    }

    get ModeDisplayNames() {
        return this.modeDisplayNames;
    }

    /**
     * Set the if in remove mode, updates the subject for observables
     *
     * @param isRemoveMode
     * @constructor
     */
    set RemoveMode(isRemoveMode: Boolean){
        this.removeMode = isRemoveMode;
        this.removeModeSubject.next(this.removeMode);
    }

    getRemoveMode(){
        return this.removeModeSubject.asObservable();
    }

    toggleRemoveMode(){
        this.RemoveMode = !this.removeMode;
    }

    toggleFilterEnabled(){
        this.isFilterEnabled = !this.isFilterEnabled;
    }
}
