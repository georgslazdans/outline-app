# Outline App

This is a app that creates an outline from an image using OpenCv and allows to create a Gridfinity box using the built in editor. This is available online [here](https://outline.georgs.lv/)

## Features

### Contour Detection

Using OpenCV extract objects contours that are placed on top of a uniform paper. Paper detection can be skipped to use with scanned images.

### Box Editor

- Gridfinity Box
  - Box splitting
- Contours
  - Point adding/removing and transformation
  - Offset along normals
  - Contour Splitting
  - Shell
- Text
- Primitives
  - Cube
  - Sphere
  - Cylinder
  - Capsule

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Please read the `CONTRIBUTING.md` file before creating Pull Requests.

## Self Hosting

Requirements: [Node.js](https://nodejs.org/en)

The `build` command creates static files in folder `out` that can be added to your web server of choice.

```bash
npm install
npm run build
```

### Using Next.js to host

It's possible to start the prod build using Next.js itself.
Remove the `output: "export"` or change it's value from `"export"` to `"standalone"` inside config file `next.config.mjs`. Then just build and start the server.

```bash
npm install
npm run build
npm run start
```

## Support Me

If you find this project useful, consider supporting me on Ko-Fi.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/L3L41134QC)

## Ideas for Future

These are just here for my own brainstorming and I give **no promises** that any of these will actually be worked on.

### Automatic Detection of Settings

Settings could be guessed by using Machine Learning algorithms and the trained model set could be plenty fast enough to be executed on each picture. If they are accurate enough, then calibration step might be even skipped. 

- Create separate repository application, that can accept valid image and settings.
  - Should be agreed on by the user
  - Add automatic upload of individual contours or all contours that are actually used inside the editor
- Train the model on the data
  - Tensorflow.js seems like a good candidate, since there would be less glue code
- Add option to details form to use the trained model

### Bulk Processing

If the machine learning algorithm works good, then having an option to bulk process images would speed up processing a lot. With many images having a CLI would be much easier to handle and optimize the workflow, e.g. download images from local/cloud storage, rename them and run processing on a folder.

- Multi image upload to web app
- CLI version
  - Would require compatibility to import/export between the CLI and the web app

### Automatic Box Creation

Adjusting settings for the box shouldn't be hard when an outline is imported. Would be even nice, if a single image contains multiple objects, then those objects are rotated and moved to take least amount of space as possible. 

This should allow to automate box creation for a fixed height boxes. In other cases where object height is important, then a manual edit or LIDAR based solution could be applied. At the moment there is no API for accessing LIDAR camera in the browsers, so a separate app for capturing the image and data could be created and then imported.

