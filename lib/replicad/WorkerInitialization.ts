import opencascade from "replicad-opencascadejs";
import { loadFont, setOC } from "replicad";

let initialized = false;

const initializedPromise = new Promise<void>(async (resolve) => {
  if (initialized) {
    resolve();
  } else {
    const OC = await opencascade({
      locateFile: () => "/replicad_single.wasm",
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