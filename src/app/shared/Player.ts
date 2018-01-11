

import {config} from "./config";

const WORDS_PER_PLAYER = config.WORDS_PER_PLAYER;

export class Player {
  private userName: string;
  private userAlias: string;
  private teamAssigned: boolean;
  private userWords: Array<string>;
  private wordsCompleted: boolean;

  constructor(userName: string) {
    this.teamAssigned = false;
    this.userWords = Array(WORDS_PER_PLAYER).fill('');
    this.userName = userName.charAt(0).toUpperCase() + userName.substr(1).toLowerCase();
    this.setAlias();
  }

  get name(): string {
    return this.userName;
  }

  get alias(): string {
    return this.userAlias;
  }

  get hasTeam(): boolean {
    return this.teamAssigned;
  }

  get words(): Array<string> {
    return this.userWords;
  }

  get hasEnteredWords(): boolean {
    return this.wordsCompleted;
  }

  set words(words: Array<string>) {
    this.userWords = words;
    this.checkWords();
  }

  setWord(index: number, word: string) {
    this.userWords[index] = word;
    this.checkWords();
  }

  setTeam(hasTeam: boolean = true) {
    this.teamAssigned = hasTeam;
  }

  private setAlias() {
    this.userAlias = this.userName.substr(0, 3).toUpperCase();
  }

  private checkWords() {
    let completed = true;
    this.userWords.forEach(word => {
      if (word === '') {
        completed = false;
      }
    });
    this.wordsCompleted = completed;
  }
}
