// "use-client";

// import { OutlineResult } from "@/lib/opencv/ImageProcessor";
// import Settings from "@/lib/opencv/Settings";
// import { releaseProxy, wrap } from "comlink";
// import { useEffect, useMemo, useState } from "react";

// export function useOutlineOf(imageData: ImageData, settings: Settings) {
//   const [data, setData] = useState({
//     isProcessing: true,
//     result: undefined as OutlineResult | undefined,
//   });

//   const { workerApi } = useWorker();

//   useEffect(() => {
//     // setData({ isProcessing: true, result: undefined });
//     //  console.log("Setting data!", workerApi, imageData, settings);

//     const outline = async () => {
//       console.log("Processing!");
//       const result = await workerApi.outlineOf(imageData, settings);
//       setData({ isProcessing: false, result });
//     };

//     outline();
//     //  .then((result) => setData({ isProcessing: false, result }));
//   }, [workerApi, imageData, settings, setData]);
//   //   }, [workerApi, setData, imageData, settings]);

//   return data;
// }

// function useWorker() {
//   const workerApiAndCleanup = useMemo(() => makeWorkerApiAndCleanup(), []);

//   useEffect(() => {
//     const { cleanup } = workerApiAndCleanup;

//     return () => {
//       cleanup();
//     };
//   }, [workerApiAndCleanup]);

//   return workerApiAndCleanup;
// }

// function makeWorkerApiAndCleanup() {
//   console.log("Initializing worker!");
//   const worker = new Worker(new URL("./Worker.ts", import.meta.url), {
//     name: "opencv-worker",
//     type: "module",
//   });
//   const workerApi = wrap<typeof OpenCVWorker>(worker);

//   const cleanup = () => {
//     // workerApi[releaseProxy]();
//     worker.terminate();
//   };

//   const workerApiAndCleanup = { workerApi, cleanup };

//   return workerApiAndCleanup;
// }
