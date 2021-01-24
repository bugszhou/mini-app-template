import { awaitWrap } from "../../util";
import * as mkdirp from "mkdirp";
import { join } from "path";
import * as write from "write";

function genJsTpl(styleType = "scss", jsType = "js") {
  const jsTmpl = `
const options = {
  data: {},
  onLoad()${jsType === "ts" ? ": void" : ""} {
    console.log("onLoad");
  },
};

export default options;

Page(options);
`;
  if (styleType === "scss") {
    return `
import "./style";
${jsTmpl}`;
  }
  return jsTmpl;
}

export function genUsuallyTpl(opts: any) {
  genJsTpl(opts.css);
  genHtmlTpl();
  genCSSTpl();
  genJSONTpl();
  return {
    js: genJsTpl(opts.css, opts.js),
    css: genCSSTpl(),
    html: genHtmlTpl(),
    json: genJSONTpl(),
  };
}

function genJSONTpl() {
  return `
  {
    "usingComponents": {}
  }
  `;
}

function genCSSTpl() {
  return ``;
}

function genHtmlTpl() {
  return `<view></view>`;
}

export async function genPreCSSTpl(opts: any) {
  const { js, css, fullPath } = opts;
  const cssJsTpl = `import "./index.${css}";`;
  const [err] = await awaitWrap(mkdirp(join(fullPath, "style")));
  if (err) {
    throw err;
  }
  const [errJs] = await awaitWrap(write(join(fullPath, `style/index.${js}`), cssJsTpl));
  const [errCss] = await awaitWrap(write(join(fullPath, `style/index.${css}`), ""));
  if (errJs || errCss) {
    throw errJs || errCss;
  }
}
