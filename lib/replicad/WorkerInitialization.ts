import opencascade from "replicad-opencascadejs/src/replicad_single.js";
// @ts-ignore
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import { loadFont, setOC } from "replicad";

let initialized = false;

const initializedPromise = new Promise<void>(async (resolve) => {
  if (initialized) {
    resolve();
  } else {
    // @ts-ignore
    const OC = await opencascade({
      locateFile: () => opencascadeWasm,
    });

    setOC(OC);
    await loadFont("/fonts/Roboto-Regular.ttf");
    initialized = true;
    resolve();
  }
});

export const waitForInitialization = async () => {
  await initializedPromise;
};