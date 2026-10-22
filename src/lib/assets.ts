import bounds from './image-bounds.json';

// All raster assets live in the single Next.js public component directory.
const component = (name: string) => `/component%20images/${encodeURIComponent(name)}`;
export const ASSETS = {
  logo: component('aerocadmy-logo.webp'),
  motor: component('motor.webp'),
  propeller: component('properllers.webp'),
  controller: component('flight controller.webp'),
  battery: component('battery-theme-no-logo-v2.webp'),
  camera: component('camera.webp'),
  arm: component('frame arms.webp'),
  frameMotorsAttached: component('frame-motors-attached.webp'),
  sensor: component('sensor-sensor-wire-fixed.webp'),
  screw: component('screw.webp'),
  plate: component('frame attachement.webp'),
  frameBattery: component('drone-battery-theme-no-logo-v2.webp'),
  frameController: component('drone-battery-controller-no-logo-v1.webp'),
  frameSensor: component('drone-battery-controller-sensor-no-logo-v1.webp'),
  frameBody: component('drone-battery-controller-sensor-body-frame-no-logo-v2.webp'),
  finalDrone: component('final-drone.webp'),
  body: component('body-frame-bare-hd-v1.webp'),
} as const;

export function imageBounds(src: string) {
  const name = decodeURIComponent(src.split('/').pop() || '').replace(/\.webp$/i, '.png');
  return bounds[name as keyof typeof bounds];
}

// Crop transparent padding in CSS, leaving the original PNG intact.
export function mountComponentImage(el: HTMLDivElement, src: string, width: number) {
  const crop = imageBounds(src);
  const viewport = document.createElement('div');
  viewport.style.position = 'relative';
  viewport.style.width = '100%';
  viewport.style.overflow = 'clip';
  viewport.style.backgroundColor = 'transparent';
  const image = new Image();
  image.alt = '';
  image.draggable = false;
  image.style.display = 'block';
  image.style.maxWidth = 'none';
  image.style.height = 'auto';
  image.style.backgroundColor = 'transparent';
  if (crop) {
    const height = width * crop.cropHeight / crop.cropWidth;
    el.style.height = viewport.style.height = `${height}px`;
    image.style.position = 'absolute';
    image.style.width = `${crop.width / crop.cropWidth * 100}%`;
    image.style.left = `${-crop.x / crop.cropWidth * 100}%`;
    image.style.top = `${-crop.y * width / crop.cropWidth}px`;
  } else {
    image.style.width = '100%';
  }
  viewport.appendChild(image);
  el.appendChild(viewport);
  image.src = src;
  return image;
}
