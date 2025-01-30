# Outline App

This is a app that creates an outline from an image using OpenCv and allows to create a Gridfinity box using the built in editor. This is available online [here](https://outline.georgs.lv/)

## Features

### Contour Detection

Using OpenCV extract objects contours that are placed on top of a uniform paper.

### Box Editor

- Gridfinity Box
- Contours
  - Point adding/removing and transformation
  - Offset along normals
  - Contour Splitting
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
