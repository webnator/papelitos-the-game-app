import {Component, Input} from '@angular/core';

@Component({
  selector: 'timer',
  templateUrl: 'timer.html'
})
export class TimerComponent {
  @Input() time: number;

  public minutes: string;
  public seconds: string;
  public paused: boolean;

  private interval;
  private secondsLeft: number;

  constructor() {
    this.secondsLeft = 0;
    this.formatTime();
  }

  public start() {
    if (this.secondsLeft === 0) {this.secondsLeft = this.time}
    this.paused = false;
    this.formatTime();
    this.setTimeoutInterval();
  }

  public stop() {
    clearInterval(this.interval);
    this.secondsLeft = this.time;
    this.formatTime();
  }

  public pause() {
    this.paused = true;
    clearInterval(this.interval);
  }

  private countdown() {
    if (this.secondsLeft > 0) {
      this.secondsLeft--;
      this.formatTime();
      this.setTimeoutInterval();
    }
  }

  private setTimeoutInterval() {
    this.interval = setTimeout(this.countdown.bind(this), 1000);
  }

  private formatTime() {
    const timerDate = new Date(this.secondsLeft * 1000);
    this.minutes = timerDate.getMinutes().toString();
    this.seconds = timerDate.getSeconds().toString();
  }

}
