import {Component, EventEmitter, Output, Input} from '@angular/core';

@Component({
  selector: 'number-selector',
  templateUrl: 'number-selector.html'
})
export class NumberSelectorComponent {
  public numValue: number = 0;
  @Output() onChange = new EventEmitter<number>();
  @Input() max: number;

  constructor() {
    this.numValue = 0;
  }

  public setNumValue(event: any): void {
    let textValue = event.target.value;
    if (textValue && !isNaN(textValue) && textValue >= 0 && (!this.max || textValue <= this.max)) {
      this.numValue = textValue;
    } else {
      this.numValue = 0;
    }
    this.emitNumberChange();
  }

  public add(): void {
    this.checkNumValidity();
    if (!this.max || this.numValue < this.max) {
      this.numValue++;
      this.emitNumberChange();
    }
  }

  public subtract(): void {
    this.checkNumValidity();
    if (this.numValue > 0) {
      this.numValue--;
      this.emitNumberChange();
    }
  }

  private checkNumValidity() {
    if (isNaN(this.numValue)) {
      this.numValue = 0;
    }
  }

  private emitNumberChange() {
    this.onChange.emit(this.numValue);
  }

}
