import { makeAutoObservable } from "mobx";

class ScoreState {
  clicks = 0;
  spammedClicks = 0;

  constructor() {
    makeAutoObservable(this);
  }
}

export const score = new ScoreState();
