import { awaitWrap } from "../../util";
import * as mkdirp from "mkdirp";
import { join } from "path";
import * as write from "write";

function genJsTpl(styleType = "scss", jsType = "js") {
  const jsTmpl = `
Page({
  data: {},
  onLoad()${jsType === "ts" ? ": void" : ""} {
    console.log("onLoad");
  },
});
`;
  if (styleType === "scss") {
    return `
import "./style";
${jsTmpl}`;
  }
  return jsTmpl;
}

function genClassWeappJsTpl(styleType = "scss", fileName = "View") {
  const jsTmpl = `
import { PageBase } from "mini-program-base";

interface IData {
  welcomeStr: string;
}

export default class ${fileName}Page
  extends PageBase<IData> {

  data: IData = {
    welcomeStr: "Index Page",
  };

  onLoad(): void {
    console.log("onLoad: ", this);
  }
}

PageBase.render(new ${fileName}Page());
`;
  if (styleType === "scss") {
    return `
import "./style";
${jsTmpl}`;
  }
  return jsTmpl;
}

function genClassAliappJsTpl(styleType = "scss", fileName = "View") {
  const jsTmpl = `
import { PageBase } from "mini-program-base";

interface IData {
  welcomeStr: string;
}

class ${fileName}Page
  extends PageBase<IData>
{

  data: IData = {
    welcomeStr: "Index Page",
  };

  onLoad(): void {
    console.log("onLoad: ", this);
  }
}

PageBase.render(new ${fileName}Page());
`;
  if (styleType === "scss") {
    return `
import "./style";
${jsTmpl}`;
  }
  return jsTmpl;
}

export function genClassWeappTpl(opts: any, fileName = "View") {
  return {
    js: genClassWeappJsTpl(opts.css, fileName),
    css: genCSSTpl(),
    html: genHtmlTpl(),
    json: genJSONTpl(),
  };
}

export function genClassAliappTpl(opts: any, fileName = "View") {
  return {
    js: genClassAliappJsTpl(opts.css, fileName),
    css: genCSSTpl(),
    html: genHtmlTpl(),
    json: genJSONTpl(),
  };
}

export function genUsuallyTpl(opts: any) {
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
  return `<view>Hello World</view>`;
}

export async function genPreCSSTpl(opts: any) {
  const { js, css, fullPath } = opts;
  const cssJsTpl = `import "./index.${css}";`;
  const [err] = await awaitWrap(mkdirp(join(fullPath, "style")));
  if (err) {
    throw err;
  }
  const [errJs] = await awaitWrap(
    write(join(fullPath, `style/index.${js}`), cssJsTpl),
  );
  const [errCss] = await awaitWrap(
    write(join(fullPath, `style/index.${css}`), ""),
  );
  if (errJs || errCss) {
    throw errJs || errCss;
  }
}
