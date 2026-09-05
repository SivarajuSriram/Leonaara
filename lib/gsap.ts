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
// CustomEase: needed for the popup's card-open curve. GSAP's `ease` option
// does NOT parse a raw CSS `cubic-bezier(...)` string -- gsap.parseEase()
// returns undefined for one, so passing it straight through silently drops
// to GSAP's default ease instead of the captured springy overshoot. Feeding
// the same four control points to CustomEase.create() is what actually
// reproduces the curve (verified: peaks ~1.08 around t=.65 before settling).
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, MorphSVGPlugin, Draggable, InertiaPlugin, ScrollToPlugin, ExpoScaleEase, CustomEase, useGSAP);
  // NewsletterPopup: card-open overshoot (0.5s cubic-bezier(.85,1.5,.5,1) in
  // the capture) and the step-2 progress-bar fill (0.5s cubic-bezier(.4,0,.2,1)).
  // Registered once here, by id, so any component can reference them by name.
  CustomEase.create('popupCard', '.85,1.5,.5,1');
  CustomEase.create('popupBar', '.4,0,.2,1');
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, MorphSVGPlugin, Draggable, InertiaPlugin, ScrollToPlugin, ExpoScaleEase, CustomEase, useGSAP };
