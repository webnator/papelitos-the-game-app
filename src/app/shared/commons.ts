export function shuffleArray(array: Array<any>): Array<any> {
  let nArray = array.slice();
  for (let i = nArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [nArray[i], nArray[j]] = [nArray[j], nArray[i]];
  }
  return nArray;
}

export function trackByIndex(index: number, value: number): number {
  return index;
}
