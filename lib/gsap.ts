'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
// EasePack: the original's menu and logo tweens use expoScale(...)
import { ExpoScaleEase } from 'gsap/EasePack';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, MorphSVGPlugin, Draggable, InertiaPlugin, ScrollToPlugin, ExpoScaleEase, useGSAP);
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, MorphSVGPlugin, Draggable, InertiaPlugin, ScrollToPlugin, ExpoScaleEase, useGSAP };
