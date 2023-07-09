import { OffscreenMessage, Response, WorkerMessage } from "./messages";
import { getOptions } from "./options";
import { errString } from "./utils";

function callWorker(message: WorkerMessage): Promise<Response> {
  const worker = new Worker("/worker.js");
  return new Promise((resolve) => {
    worker.onmessage = (recv: MessageEvent<Response>) => resolve(recv.data);
    worker.postMessage(message);
  });
}

chrome.runtime.onMessage.addListener(
  (
    msg: OffscreenMessage,
    _: unknown,
    sendResponse: (msg: Response) => void,
  ): true => {
    void (async () => {
      try {
        const opts = await getOptions();
        const resp = await callWorker({ mhtml: msg, ...opts });
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
