import { default as init, render as rend } from "../pkg/repub_bind";
import { ImageHandling } from "./options";

const ini = (async () => await init())();

// FIXME move this into rust
const remarkableCss = `
p {
  margin-top: 1em;
  margin-bottom: 1em;
}

ul, ol {
  padding: 1em;
}

ul li, ol li {
  margin-left: 1.5em;
  padding-left: 0.5em;
}

figcaption {
  font-size: 0.5rem;
  font-style: italic;
}`;

export async function repub(
  mhtml: Uint8Array,
  {
    imageHandling,
    imageHrefSimilarityThreshold,
    imageBrightness,
    filterLinks,
    rmCss,
    hrefHeader,
    bylineHeader,
    coverHeader,
  }: {
    imageHandling: ImageHandling;
    imageBrightness: number;
    imageHrefSimilarityThreshold: number;
    hrefHeader: boolean;
    bylineHeader: boolean;
    coverHeader: boolean;
    rmCss: boolean;
    filterLinks: boolean;
  },
): Promise<{ epub: Uint8Array; title?: string }> {
  let res;
  try {
    await ini;
    const { epub, title } = (res = rend(
      mhtml,
      imageHandling,
      imageHrefSimilarityThreshold,
      imageBrightness,
      filterLinks,
      rmCss ? remarkableCss : "",
      hrefHeader,
      bylineHeader,
      coverHeader,
    ));
    return { epub, title };
  } finally {
    res?.free();
  }
}
