// Installed-app assets: icons and iOS opening screens (gear logo on dark, never cropped).
import appleTouch from "@/assets/pwa/apple-touch-icon.png.asset.json";
import favicon48 from "@/assets/pwa/favicon-48.png.asset.json";
import icon192 from "@/assets/pwa/icon-192.png.asset.json";

export const APP_THEME = "#140b06";
export const APP_ICON_192 = icon192.url;

export const pwaLinks = [
  { rel: "icon", type: "image/png", sizes: "48x48", href: favicon48.url },
  { rel: "icon", type: "image/png", sizes: "192x192", href: icon192.url },
  { rel: "apple-touch-icon", sizes: "180x180", href: appleTouch.url },
  { rel: "manifest", href: "/manifest.webmanifest" },
  { rel: "apple-touch-startup-image", href: "/__l5e/assets-v1/e4f36fdb-ec7d-4c2b-8607-23b2beff1a52/gearhead-splash-1320x2868.jpg", media: "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" },
  { rel: "apple-touch-startup-image", href: "/__l5e/assets-v1/7d3fecbc-2e6a-4572-ae4a-47d676fda350/gearhead-splash-1206x2622.jpg", media: "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" },
  { rel: "apple-touch-startup-image", href: "/__l5e/assets-v1/8e92fa62-0c39-48af-ab83-3619dfb24f73/gearhead-splash-1290x2796.jpg", media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" },
  { rel: "apple-touch-startup-image", href: "/__l5e/assets-v1/d6ae8ddc-a236-4374-a463-532ba9f2bd4e/gearhead-splash-1179x2556.jpg", media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" },
  { rel: "apple-touch-startup-image", href: "/__l5e/assets-v1/37f90293-a7ec-40ac-9807-f0ff765e6073/gearhead-splash-1284x2778.jpg", media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" },
  { rel: "apple-touch-startup-image", href: "/__l5e/assets-v1/e01aa03b-f48a-4cb7-b91f-95abf6148fa1/gearhead-splash-1170x2532.jpg", media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" },
  { rel: "apple-touch-startup-image", href: "/__l5e/assets-v1/fd13067b-f254-487d-87fe-2735cf854233/gearhead-splash-1125x2436.jpg", media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" },
  { rel: "apple-touch-startup-image", href: "/__l5e/assets-v1/84239be3-8ae9-44b1-b0eb-f34e02257f10/gearhead-splash-1242x2688.jpg", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" },
  { rel: "apple-touch-startup-image", href: "/__l5e/assets-v1/71127978-4519-4087-adef-d91d42bfd94f/gearhead-splash-828x1792.jpg", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" },
  { rel: "apple-touch-startup-image", href: "/__l5e/assets-v1/a51cf797-474d-4118-8c01-f7a7d6261279/gearhead-splash-750x1334.jpg", media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" },
  { rel: "apple-touch-startup-image", href: "/__l5e/assets-v1/a7c873d4-efeb-4f2b-a201-d1f14180cf2b/gearhead-splash-1668x2388.jpg", media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" },
  { rel: "apple-touch-startup-image", href: "/__l5e/assets-v1/d858b0dd-65ba-46c6-82b4-3b5d1dc7b6ff/gearhead-splash-2048x2732.jpg", media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" },
  { rel: "apple-touch-startup-image", href: "/__l5e/assets-v1/445ff320-ff54-4c8e-8bdf-9897386237ca/gearhead-splash-1640x2360.jpg", media: "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" },
  { rel: "apple-touch-startup-image", href: "/__l5e/assets-v1/fca061ee-4327-4838-869d-414fde1ebedd/gearhead-splash-1620x2160.jpg", media: "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" },
];

/** Runs before the page paints: in the installed app, show the logo splash once per browser session. */
export const SPLASH_SCRIPT = `(function(){try{var s=window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;if(!s||sessionStorage.getItem('gh-splash'))return;sessionStorage.setItem('gh-splash','1');var d=document.documentElement;d.classList.add('gh-splash-on');setTimeout(function(){d.classList.add('gh-splash-out');setTimeout(function(){d.classList.remove('gh-splash-on','gh-splash-out')},600)},1500)}catch(e){}})();`;
