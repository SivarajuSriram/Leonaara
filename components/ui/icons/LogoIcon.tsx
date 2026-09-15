// Leonaara wordmark (colored version, supplied directly)
import Image, { type ImageProps } from 'next/image';

export function LogoIcon(props: Partial<ImageProps>) {
  return (
    <Image
      src="/images/leonaara-logo.webp"
      alt="Leonaara"
      width={1600}
      height={900}
      {...props}
    />
  );
}
