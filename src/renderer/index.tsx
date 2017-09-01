// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import * as electron from 'electron';
import * as path from 'path';
import * as React from 'react';
import * as reactDOM from 'react-dom';
import { App } from './_components/App';
import './_css/index.scss';
// const image1 = require('./a1.jpg');
// const image2 = require('./a2.jpg');

// Prevent zomming in the page with pinch gesture/shortcuts
electron.webFrame.setVisualZoomLevelLimits(1, 1);

// const userDataPath = (electron.app || electron.remote.app).getPath('userData');

// function imgElToCanvas(domEl: HTMLImageElement, factor = 8) {
//   const canvas = document.createElement('canvas');
//   canvas.width = domEl.width / factor;
//   canvas.height = domEl .height / factor;

//   const canvasContext = canvas.getContext('2d')!;
//   canvasContext.drawImage(domEl, 0, 0, canvas.width, canvas.height);
//   return canvas;
// }

// function drawPixels(
//   canvas: HTMLCanvasElement,
//   canvasCtx: CanvasRenderingContext2D,
//   overlayPixels: number[][]
// ) {
//   const width = 720;
//   const height = 562;
//   canvasCtx.clearRect(0, 0, width, height);
//   canvas.width = width;
//   canvas.height = height;
//   canvasCtx.fillStyle = 'rgb(255, 0, 0)';

//   overlayPixels.forEach(pixel => {
//     // canvasCtx.fillRect(pixel[0], pixel[1], 1, 1);
//     canvasCtx.fillRect(pixel[0] * 8, pixel[1] * 8, 8, 8);
//   });
// }

reactDOM.render(
  <App />,
  document.getElementById('app')
);
