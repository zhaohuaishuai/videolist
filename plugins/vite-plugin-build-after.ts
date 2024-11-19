import { exec } from "child_process";

import fs from "fs";
import path from "path";

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    entry.isDirectory()
      ? copyDir(srcPath, destPath)
      : fs.copyFileSync(srcPath, destPath);
  }
}

export default function buildAfter() {
  return {
    name: "vite-plugin-build-after",
    closeBundle() {
      exec("npx tsc", (err, stdout, stderr) => {
        if (err) {
          console.error(err);
        }

        const src = path.resolve(__dirname, "../dist");
        const dest = path.resolve(
          __dirname,
          "../../star/sgb-v3/src/utils/audio-list"
        );

        copyDir(src, dest);
      });
    },
  };
}
