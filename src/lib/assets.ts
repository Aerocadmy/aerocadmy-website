import bounds from './image-bounds.json';

// All raster assets live in the single Next.js public component directory.
const component = (name: string) => `/component%20images/${encodeURIComponent(name)}`;
export const ASSETS = {
  logo: component('aerocadmy-logo.png'),
  motor: component('motor.png'),
  propeller: component('properllers.png'),
  controller: component('flight controller.png'),
  battery: component('battery-theme-no-logo-v2.png'),
  camera: component('camera.png'),
  arm: component('frame arms.png'),
  frameMotorsAttached: component('frame-motors-attached.png'),
  sensor: component('sensor-sensor-wire-fixed.png'),
  screw: component('screw.png'),
  plate: component('frame attachement.png'),
  frameBattery: component('drone-battery-theme-no-logo-v2.png'),
  frameController: component('drone-battery-controller-no-logo-v1.png'),
  frameSensor: component('drone-battery-controller-sensor-no-logo-v1.png'),
  frameBody: component('drone-battery-controller-sensor-body-frame-no-logo-v2.png'),
  finalDrone: component('final-drone.png'),
  body: component('body-frame-bare-hd-v1.png'),
} as const;

export function imageBounds(src: string) {
  const name = decodeURIComponent(src.split('/').pop() || '');
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
