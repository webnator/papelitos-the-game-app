
export class Player {
  private userName: string;
  private userAlias: string;
  constructor(userName: string) {
    this.userName = userName;
    this.setAlias();
  }

  get name(): string {
    return this.userName;
  }

  get alias(): string {
    return this.userAlias;
  }

  private setAlias() {
    this.userAlias = this.userName.substr(0, 3);
  }
}
