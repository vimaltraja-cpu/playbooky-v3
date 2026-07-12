# Activity Modal Illustration Crops

Future activity modal artwork can supply a dedicated crop with:

```ts
illustration: {
  src: string;
  modalSrc?: string;
  alt: string;
}
```

Rendering priority:

```ts
const modalIllustrationSrc =
  activity.illustration.modalSrc ?? activity.illustration.src;
```

Recommended modal crop:

- Displayed size: 1364 x 230
- Preferred export: 2728 x 460
- Preferred format: WebP or AVIF
- Composition: full-bleed
- Transparency: not required unless the artwork genuinely needs it
