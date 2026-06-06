// __mocks__/nextImage.js
// Renders next/image as a plain <img> in jsdom — avoids the image optimization pipeline.
const React = require("react");

const NextImage = ({ src, alt, fill, priority, quality, sizes, ...rest }) =>
  React.createElement("img", { src, alt, ...rest });

NextImage.displayName = "NextImageStub";

module.exports = NextImage;
module.exports.default = NextImage;
