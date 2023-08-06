import { fromByteArray, toByteArray } from "base64-js";
import { Message, Response } from "./messages";
import { EpubOptions } from "./options";

let num = 0;
let offscreen: null | Promise<void> = null;
let closing: null | Promise<void> = null;

export async function render(
  mhtml: ArrayBuffer,
  epubOpts: Readonly<EpubOptions>,
): Promise<{ epub: ArrayBuffer; title?: string }> {
  await closing;
  num++;
  if (offscreen === null) {
    offscreen = chrome.offscreen.createDocument({
      url: "/offscreen.html",
      // @ts-expect-error this reason isn't in the type
      reasons: [chrome.offscreen.Reason.WORKERS as chrome.offscreen.Reason],
      justification: "workers for parallel wasm",
    });
  }
  await offscreen;

  try {
    const msg: Message = {
      mhtml: fromByteArray(new Uint8Array(mhtml)),
      ...epubOpts,
    };
    const resp: Response = await chrome.runtime.sendMessage(msg);
    if (resp.success) {
      const { epub, title } = resp;
      return { epub: toByteArray(epub), title };
    } else {
      throw new Error(resp.err);
    }
  } finally {
    num--;
    if (num === 0) {
      offscreen = null;
      await (closing = chrome.offscreen.closeDocument());
      closing = null;
    }
  }
}
