import React from "react";
import githubLogo from "./GitHub_Logo.png";
import ExportedImage from "next-image-export-optimizer";

type Props = {};

const GitHubLink = ({}: Props) => {
  return (
    <a href="https://github.com/georgslazdans/outline-app" className="max-h-8">
      <ExportedImage
        className="object-contain relative dark:invert"
        src={githubLogo}
        alt={"GitHub Logo"}
        priority
        height={41}
        width={100}
      ></ExportedImage>
    </a>
  );
};

export default GitHubLink;
