import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameComponent } from '../game/game.component';
import { Game } from '../../models/game';
import { collection, addDoc, setDoc, getDoc } from "firebase/firestore";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [GameComponent],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {
  firestore: Firestore = inject(Firestore);

  constructor(private route: Router) { }

  async newGame() {
    let game = new Game();
    const gameInfo = await addDoc(collection(this.firestore, "games"), {
      gameObject: arrayUnion(game.toJson())
    });
    this.route.navigateByUrl(['/game/'] + gameInfo.id);
  }
}
