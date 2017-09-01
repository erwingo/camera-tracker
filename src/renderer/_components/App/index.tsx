import * as React from 'react';
import { Camera } from '../Camera';

/** Compare 2 canvas and return an array of pixels where they mismatch */
function getCanvasMismatches(canvas1: HTMLCanvasElement, canvas2: HTMLCanvasElement, options = {
  /** Possible values [0, 255] */
  sensitivity: 30
}) {
  const mismatchPixels: number[][] = [];
  const { sensitivity } = options;

  const canvas1Ctx = canvas1.getContext('2d')!;
  const canvas2Ctx = canvas2.getContext('2d')!;

  const pixels1 = canvas1Ctx.getImageData(0, 0, canvas1.width, canvas1.height);
  const pixels2 = canvas2Ctx.getImageData(0, 0, canvas2.width, canvas2.height);
  const pixels1Data = pixels1.data;
  const pixels2Data = pixels2.data;
  const dataLength = pixels1.data.length;

  for (let i = 0; i < dataLength; i += 4) {
    for (let j = 0; j < 3; j++) {
      const val1 = pixels1Data[i + j];
      const val2 = pixels2Data[i + j];

      if (val1 !== val2) {
        if (!(val1 >= val2 - sensitivity && val1 <= val2 + sensitivity)) {
          const pixelPos = i / 4;
          mismatchPixels.push([pixelPos % pixels1.width, pixelPos / pixels1.width - 1]);
          break;
        }
      }
    }
  }

  return mismatchPixels;
}

interface State {
  overlayPixels?: number[][];
}

export class App extends React.PureComponent<any, State> {
  previousCapture: (HTMLCanvasElement | undefined);
  alarm = new Audio(require('../../_media/alarm.mp3'));
  isAlarmOn = false;

  constructor() {
    super();
    this.handleCapture = this.handleCapture.bind(this);
    this.alarm.onended = this.alarm.play;
    this.turnOffAlarm = this.turnOffAlarm.bind(this);
    this.state = {};

    window.onkeyup = this.turnOffAlarm;
  }

  componentDidMount() {
    // setTimeout(() => {
    //   const canvas1 = imgElToCanvas(this.refs.img1 as HTMLImageElement);
    //   const canvas2 = imgElToCanvas(this.refs.img2 as HTMLImageElement);

    //   const t1 = performance.now();
    //   const result = evaluateCaptures([canvas1, canvas2]);
    //   const t2 = performance.now();
    //   console.log(t2 - t1);

    //   const overlayCanvas = this.refs.overlay as HTMLCanvasElement;
    //   drawPixels(overlayCanvas, overlayCanvas.getContext('2d')!, result.mismatchPixels);
    // }, 1000);
  }

  turnOnAlarm() {
    this.alarm.play();
    this.isAlarmOn = true;
  }

  turnOffAlarm() {
    this.alarm.pause();
    this.isAlarmOn = false;
  }

  handleCapture(capture: HTMLCanvasElement) {
    let mismatchPixels: number[][] = [];

    if (this.previousCapture && capture.height !== 0 && this.previousCapture.height !== 0) {
      mismatchPixels = getCanvasMismatches(this.previousCapture, capture);
    }

    this.previousCapture = capture;
    if (!this.isAlarmOn && mismatchPixels.length > 20) {
      this.turnOnAlarm();
    }
    this.setState({ ...this.state, overlayPixels: mismatchPixels });
  }

  render() {
    return (
      <div className='app'>
        <Camera
          className='app__camera'
          onCapture={this.handleCapture}
          captureFactor={2}
          overlayPixels={this.state.overlayPixels}
        />
      </div>
    );
  }
}
