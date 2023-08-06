import { default as init, render as rend } from "../pkg/repub_bind";
import { EpubOptions } from "./options";

const ini = (async () => await init())();

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
  }: Readonly<EpubOptions>,
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
      rmCss,
      hrefHeader,
      bylineHeader,
      coverHeader,
    ));
    return { epub, title };
  } finally {
    res?.free();
  }
}
