import { Component, OnInit, Input } from '@angular/core';
import { GameItem } from 'app/model/game.model'

@Component({
  selector: 'app-usertrackeditem',
  templateUrl: './usertrackeditem.component.html',
  styleUrls: ['./usertrackeditem.component.scss']
})
export class UsertrackeditemComponent implements OnInit {

  @Input() game: GameItem;

  constructor() { }

  ngOnInit() {
  }

}
