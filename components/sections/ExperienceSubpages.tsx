import { Hero } from '@/components/sections/Hero';
import { ImgText } from '@/components/sections/ImgText';
import { Img } from '@/components/sections/Img';
import { Video } from '@/components/sections/Video';
import { leiba } from '@/content/en/leiba';
import { sela } from '@/content/en/sela';
import { herchomen } from '@/content/en/herchomen';
import { hantwerc } from '@/content/en/hantwerc';
import { sneo } from '@/content/en/sneo';

export function LeibaBody() {
  const [hero, imgtext] = leiba.columns.colPos5!;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (imgtext.type !== 'mask_imgtext') throw new Error('expected imgtext');
  return (<><Hero section={hero} /><ImgText section={imgtext} /></>);
}

export function SelaBody() {
  const [hero, imgtext, video] = sela.columns.colPos5!;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (imgtext.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (video.type !== 'mask_video') throw new Error('expected video');
  return (<><Hero section={hero} /><ImgText section={imgtext} /><Video section={video} /></>);
}

export function HerchomenBody() {
  const [hero, imgtext] = herchomen.columns.colPos5!;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (imgtext.type !== 'mask_imgtext') throw new Error('expected imgtext');
  return (<><Hero section={hero} /><ImgText section={imgtext} /></>);
}

export function HantwercBody() {
  const [hero, imgtext, img] = hantwerc.columns.colPos5!;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (imgtext.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (img.type !== 'mask_img') throw new Error('expected img');
  return (<><Hero section={hero} /><ImgText section={imgtext} /><Img section={img} /></>);
}

export function SneoBody() {
  const [hero, imgtext, video] = sneo.columns.colPos5!;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (imgtext.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (video.type !== 'mask_video') throw new Error('expected video');
  return (<><Hero section={hero} /><ImgText section={imgtext} /><Video section={video} /></>);
}
