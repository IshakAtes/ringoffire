import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialogModule } from '@angular/material/dialog';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, GameComponent, PlayerComponent, MatButtonModule, MatIconModule, MatDialogModule, DialogAddPlayerComponent, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  firestore: Firestore = inject(Firestore)
  items$: Observable<any[]>;
  pickCardAnimation = false;
  currentCard: string | any = '';
  game: Game;

  constructor( public dialog: MatDialog) {
    const aCollection = collection(this.firestore, 'games')
    this.items$ = collectionData(aCollection);
    this.game = new Game()
    this.newGame();
    console.log('update', this.items$.subscribe((g) => {
      console.log('GameUpdate', g);
    }));
  }

  // ngOnInit(): void {
  //   this.firestore.collection('games')
  //   .valueChanges()
  //   .subscribe((g) => {
  //     console.log('Update', g)
  //   });
  // }

  newGame() {
    this.game = new Game();
    // let fire = collection(this.firestore, 'games');
    this.firestore
    .collection('games')
    .add({'Hallo': 'Welt'})
    console.log(this.game);
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      console.log('Game is', this.game);

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.pickCardAnimation = false;
        this.game.playedCards.push(this.currentCard);
      }, 1000);
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }

}
