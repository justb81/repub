import { fromByteArray, toByteArray } from "base64-js";
import { Response, WorkerMessage } from "./messages";
import { repub } from "./repub";
import { errString } from "./utils";

onmessage = async (msg: MessageEvent<WorkerMessage>) => {
  try {
    const { mhtml, ...options } = msg.data;
    const raw = toByteArray(mhtml);
    const { epub, title } = await repub(raw, options);
    const resp: Response = { success: true, epub: fromByteArray(epub), title };
    postMessage(resp);
  } catch (ex) {
    const resp: Response = { success: false, err: errString(ex) };
    postMessage(resp);
  }
};
