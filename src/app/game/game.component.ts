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
import { collection, doc, updateDoc, onSnapshot  } from "firebase/firestore";
import { ActivatedRoute } from '@angular/router';

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
  game: Game | any;
  gameId: string | undefined;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    const aCollection = collection(this.firestore, 'games')
    this.items$ = collectionData(aCollection);
    // this.game = new Game()
    // console.log('update', this.items$.subscribe((g) => {
    //   console.log('GameUpdate', g);
    // }));
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe(async (params) => {
      this.gameId = params['id'];
      const unsub = onSnapshot(doc(this.firestore, "games", params['id']), (doc) => {
          console.log("Current data: ", doc.data());
          if (doc.exists()) {
            // Extrahiere die Daten aus dem Dokument
            const gameData: any = doc.data()['gameObject'][0];
            this.game.currentPlayer = gameData.currentPlayer;
            this.game.playedCards = gameData.playedCards;
            this.game.players = gameData.players;
            this.game.stack = gameData.stack;
            this.game.pickCardAnimation = gameData.pickCardAnimation;
            this.game.currentCard = gameData.currentCard;
          } else {
            console.log("Document does not exist");
          }
      });
    });
  }


  async newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      console.log('Game is', this.game);
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }


  async saveGame() {
    const coll = collection(this.firestore, "games");
    const docRef = doc(coll, this.gameId);
    const updatedGameData = this.game.toJson();

    await updateDoc(docRef, {
      gameObject: [updatedGameData]
    });
  }

}
