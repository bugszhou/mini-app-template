import { awaitWrap } from "../../util";
import * as mkdirp from "mkdirp";
import { join } from "path";
import * as write from "write";

function genJsTpl(styleType = "scss") {
  const jsTmpl = `
Component({
  data: {},
  options: {
    styleIsolation: "apply-shared",
  },
  properties: {},
  observers: {},
  pageLifetimes: {},
  methods: {},
});
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
    js: genJsTpl(opts.css),
    css: genCSSTpl(),
    html: genHtmlTpl(),
    json: genJSONTpl(),
  };
}

function genJSONTpl() {
  return `
  {
    "component": true
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
