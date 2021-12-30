import { Audio } from 'expo-av';
import { GameLoopUpdateEventOptionType } from 'react-native-game-engine';


type MetronomeInternalProps = {
  timeElapsed: number;
  updateInMs?: number;
  isRunning: boolean;
  biggestDiff?: number;
  max: number;
  min: number;
  // TODO destructor? FinalizationRegistry?
  sound?: Audio.Sound;
}

export class Metronome {
  internalProps: MetronomeInternalProps

  constructor () {
    console.log('[Metronome] constructor');
    
    this.internalProps = {isRunning: false, timeElapsed: 0, biggestDiff: 0, min: Number.MAX_VALUE, max: 0};
    Audio.Sound.createAsync(require('../assets/metronome-tempo-single-sound_G_major.mp3')).then(sound => this.internalProps.sound = sound.sound)
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
    console.log('margin', this.internalProps.max - this.internalProps.min, 'ms');

    this.internalProps = {isRunning: false, timeElapsed: 0, biggestDiff: 0, min: Number.MAX_VALUE, max: 0};
  }
  
  /**
   * calculate the next update and replay the metronome sound
   * @param args game loop args including delta time
   */
  updateMetronome = (args: GameLoopUpdateEventOptionType) => {    
    if(this.internalProps.isRunning) {
      this.internalProps.timeElapsed += args.time.delta;
      if (this.internalProps.updateInMs && this.internalProps.timeElapsed >= this.internalProps.updateInMs) {
        this.internalProps.sound?.replayAsync();
        if (this.internalProps.timeElapsed < this.internalProps.min) this.internalProps.min = this.internalProps.timeElapsed;        
        if (this.internalProps.timeElapsed > this.internalProps.max) this.internalProps.max = this.internalProps.timeElapsed;        
        this.internalProps.timeElapsed -= this.internalProps.updateInMs;
        
      }
    }
  }

}


