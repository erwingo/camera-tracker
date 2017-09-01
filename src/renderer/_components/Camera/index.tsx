import * as classnames from 'classnames';
import * as electron from 'electron';
import * as React from 'react';
import './index.scss';

interface Props {
  onCapture?: (canvas: HTMLCanvasElement) => void;
  captureFactor?: number;
  className?: string;
  overlayPixels?: number[][];
}

export class Camera extends React.PureComponent<Props, any> {
  overlayCtx: CanvasRenderingContext2D;
  overlayDomElement: HTMLCanvasElement;
  cameraDomElement: HTMLVideoElement;
  captureFactor: number;
  videoAspectRatio = 1;

  constructor(props: Props) {
    super(props);
    this.captureFactor = props.captureFactor || 1;
  }

  shouldComponentUpdate(nextProps: Props) {
    this.updateOverlay(nextProps.overlayPixels || []);
    return false;
  }

  componentDidMount() {
    this.startCapturer();
    this.startOverlay();
    console.log('width: ', this.cameraDomElement.videoWidth);
    this.cameraDomElement.onloadedmetadata = () => {
      this.videoAspectRatio = this.cameraDomElement.videoWidth / this.cameraDomElement.videoHeight;
      // console.log('onloaded width: ', this.cameraDomElement.videoWidth);
    };
  }

  updateOverlay(overlayPixels: number[][]) {
    console.log(
      this.overlayDomElement.width, '/', this.overlayDomElement.height,
      '>', this.videoAspectRatio
    );

    // if (this.overlayDomElement.width / this.overlayDomElement.height > this.videoAspectRatio) {
    //   console.log(1);
    // }

    if (
      this.overlayDomElement.width !== this.cameraDomElement.clientWidth ||
      this.overlayDomElement.height !== this.cameraDomElement.clientHeight
    ) {
      this.overlayDomElement.width = this.cameraDomElement.clientWidth;
      this.overlayDomElement.height = this.cameraDomElement.clientHeight;
      this.overlayCtx = this.overlayDomElement.getContext('2d')!;
      return;
    }

    this.overlayCtx.clearRect(0, 0, this.overlayDomElement.width, this.overlayDomElement.height);
    this.overlayCtx.fillStyle = 'rgb(255, 0, 0)';

    overlayPixels.forEach(pixel => {
      this.overlayCtx.fillRect(
        pixel[0] * this.captureFactor,
        pixel[1] * this.captureFactor,
        this.captureFactor,
        this.captureFactor
      );
    });
  }

  startOverlay() {
    this.overlayDomElement = this.refs.overlay as HTMLCanvasElement;
    this.overlayCtx = this.overlayDomElement.getContext('2d')!;
  }

  startCapturer() {
    this.cameraDomElement = this.refs.camera as HTMLVideoElement;

    (navigator as any).webkitGetUserMedia(
      { video: true },
      (stream: MediaStream) => {
        this.cameraDomElement.src = URL.createObjectURL(stream);
        // cameraDomElement.onprogress = () => console.log(arguments);

        const recordedChunks: any[] = [];

        const handleDataAvailable = (evt: any) => {
          if (evt.data.size > 0) {
            recordedChunks.push(evt.data);
          }
        };

        // const handleStop = () => {
        //   const blob = new Blob(recordedChunks, {
        //     type: 'video/webm'
        //   });
        //   const url = URL.createObjectURL(blob);
        //   const a = document.createElement('a');
        //   document.body.appendChild(a);

        //   a.href = url;
        //   a.download = 'test.webm';
        //   a.click();
        //   window.URL.revokeObjectURL(url);
        // };

        // const mediaRecorder = new MediaRecorder(stream);
        // mediaRecorder.ondataavailable = handleDataAvailable;
        // mediaRecorder.onstop = handleStop;
        // mediaRecorder.start();
        setInterval(() => {
          const canvas = document.createElement('canvas');
          canvas.width = this.cameraDomElement.clientWidth / this.captureFactor;
          canvas.height = this.cameraDomElement.clientHeight / this.captureFactor;
          const canvasContext = canvas.getContext('2d')!;
          canvasContext.drawImage(this.cameraDomElement, 0, 0, canvas.width, canvas.height);

          if (this.props.onCapture) { this.props.onCapture(canvas); }
        }, 100);
      },
      (err: Error) => {
        alert(`Hubo un error con la camara. ${err}`);
      }
    );
  }

  render() {
    return (
      <div className={classnames('camera', this.props.className)}>
        <video className='camera__video' ref='camera' autoPlay></video>
        <canvas className='camera__overlay' ref='overlay'></canvas>
      </div>
    );
  }
}
