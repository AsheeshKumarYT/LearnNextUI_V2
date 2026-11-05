import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// App icons for the PWA, generated from one full-bleed logo artwork (public/pwa-source.svg):
// `npx pwa-assets-generator` writes pwa-64x64 / 192 / 512, maskable-icon-512 and apple-touch-icon-180 into public/.
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    // The artwork is already a full blue square, so no extra padding / background is added around it
    maskable: { ...minimal2023Preset.maskable, padding: 0, resizeOptions: { background: '#2a69b2' } },
    apple: { ...minimal2023Preset.apple, padding: 0, resizeOptions: { background: '#2a69b2' } },
  },
  images: ['public/pwa-source.svg'],
});
