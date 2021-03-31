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
  const { css, fullPath } = opts;
  const [errCss] = await awaitWrap(write(join(fullPath, `index.${css}`), ""));
  if (errCss) {
    throw errCss;
  }
}
