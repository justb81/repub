import { Message, Response } from "./messages";
import { errString } from "./utils";

function callWorker(message: Message): Promise<Response> {
  const worker = new Worker("/worker.js");
  return new Promise((resolve) => {
    worker.onmessage = (recv: MessageEvent<Response>) => resolve(recv.data);
    worker.postMessage(message);
  });
}

chrome.runtime.onMessage.addListener(
  (msg: Message, _: unknown, sendResponse: (msg: Response) => void): true => {
    void (async () => {
      try {
        const resp = await callWorker(msg);
        sendResponse(resp);
      } catch (ex) {
        sendResponse({
          success: false,
          err: errString(ex),
        });
      }
    })();
    return true;
  },
);
