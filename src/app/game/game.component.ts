import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialogModule } from '@angular/material/dialog';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Observable } from 'rxjs';
import { collection, addDoc } from "firebase/firestore";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

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
  game: Game | any;

  constructor( public dialog: MatDialog) {
    const aCollection = collection(this.firestore, 'games')
    this.items$ = collectionData(aCollection);
    // this.game = new Game()
    console.log('update', this.items$.subscribe((g) => {
      console.log('GameUpdate', g);
    }));
  }

  ngOnInit(): void {
    this.newGame();
  }


  async newGame() {
    this.game = new Game();
    const docRef = await addDoc(collection(this.firestore, "games"), {
      gameObject: arrayUnion(this.game.toJson()),
    });
    console.log("Document written with ID: ", docRef.id);
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
