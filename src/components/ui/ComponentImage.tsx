import { imageBounds } from '@/lib/assets';

interface Props { src: string; alt: string; className?: string }

export function ComponentImage({ src, alt, className }: Props) {
  const crop = imageBounds(src) || { width: 512, height: 512, x: 0, y: 0, cropWidth: 512, cropHeight: 512 };
  return (
    <svg role="img" aria-label={alt} className={className} width="100%" height="100%"
      viewBox={`${crop.x} ${crop.y} ${crop.cropWidth} ${crop.cropHeight}`} preserveAspectRatio="xMidYMid meet">
      <image href={src} x="0" y="0" width={crop.width} height={crop.height} />
    </svg>
  );
}
