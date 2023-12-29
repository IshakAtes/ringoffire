import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, GameComponent, PlayerComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  pickCardAnimation = false;
  currentCard: string | any = '';
  game: Game;

  constructor() {
    this.game = new Game()
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      
      console.log('New card: ' + this.currentCard);
      console.log('Game is', this.game);
      setTimeout(() => {
        this.pickCardAnimation = false;
        this.game.playedCards.push(this.currentCard);
      }, 1000);
    }
  }

}
