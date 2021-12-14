import { AVPlaybackStatus } from 'expo-av';
import { GameLoopUpdateEventOptionType } from 'react-native-game-engine';

export type MetronomeProps = {
  playSound: () => Promise<AVPlaybackStatus>;
}

type MetronomeInternalProps = {
  timeElapsed: number;
  updateInMs?: number;
  isRunning: boolean;
  biggestDiff?: number;
  max: number;
  min: number;
}

export class Metronome {
  props: MetronomeProps
  internalProps: MetronomeInternalProps

  constructor (props: MetronomeProps) {
    console.log('[Metronome] constructor');
    
    this.internalProps = {isRunning: false, timeElapsed: 0, biggestDiff: 0, min: Number.MAX_VALUE, max: 0};
    this.props = props;
  }

  start(bpm:number) {
    console.log('[Metronome] start');
    
    this.internalProps.updateInMs = 60000 / bpm;
    this.internalProps.isRunning = true;
  }

  stop() {
    console.log('[Metronome] stop');
    console.log('optimal time', this.internalProps.updateInMs);
    console.log('min', this.internalProps.min);
    console.log('max', this.internalProps.max);
    console.log('margin', this.internalProps.max - this.internalProps.min);

    this.internalProps = {isRunning: false, timeElapsed: 0, biggestDiff: 0, min: Number.MAX_VALUE, max: 0};
  }
  
  updateMetronome = (args: GameLoopUpdateEventOptionType) => {    
    if(this.internalProps.isRunning) {
      this.internalProps.timeElapsed += args.time.delta;
      if (this.internalProps.updateInMs && this.internalProps.timeElapsed >= this.internalProps.updateInMs) {
        this.props.playSound();
        console.log(this.internalProps.timeElapsed - this.internalProps.updateInMs);

        if (this.internalProps.timeElapsed < this.internalProps.min) this.internalProps.min = this.internalProps.timeElapsed;        
        if (this.internalProps.timeElapsed > this.internalProps.max) this.internalProps.max = this.internalProps.timeElapsed;        
        this.internalProps.timeElapsed -= this.internalProps.updateInMs;
        
      }
    }
  }

}


