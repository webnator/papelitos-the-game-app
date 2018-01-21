
import {config} from "../config";

const WORDS_PER_PLAYER = config.WORDS_PER_PLAYER;

export class Player {
  private userName: string;
  private userAlias: string;
  private teamAssigned: boolean;
  private userWords: Array<string>;
  private wordsCompleted: boolean;
  private _isRemote: boolean;

  constructor(remote: boolean = false, userName: string = '') {
    this.teamAssigned = false;
    this.userWords = Array(WORDS_PER_PLAYER).fill('');
    this._isRemote = remote;
    this.setName(userName);
  }

  get name(): string {
    return this.userName;
  }

  setName(userName: string) {
    this.userName = userName.charAt(0).toUpperCase() + userName.substr(1).toLowerCase();
    this.setAlias();
  }

  get isRemote(): boolean {
    return this._isRemote === true;
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

  setWord(index: number = null, word: string) {
    if (!index) {
      index = this.userWords.findIndex(word => word === '');
    }
    if (index !== null && index >= 0 && index < this.userWords.length) {
      this.userWords[index] = word;
    }
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
