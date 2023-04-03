import { awaitWrap } from "../../util";
import * as mkdirp from "mkdirp";
import { join } from "path";
import * as write from "write";

function genJsTpl(styleType = "scss", fileName = "Custom") {
  const jsTmpl = `

import { ComponentBase, IComponentData, IMiniComponentOptions } from "mini-program-base";

class ${fileName}Component extends ComponentBase<unknown> {
  data: IComponentData<${fileName}Component, unknown> = Object.create(null);

  options: IMiniComponentOptions = {
    styleIsolation: "apply-shared",
  };
}

ComponentBase.render(new ${fileName}Component());
`;
  if (styleType === "scss") {
    return `
import "./style";
${jsTmpl}`;
  }
  return jsTmpl;
}

function generateInterface(fileName = "") {
  return `export declare namespace I${fileName}Component {
  // 声明data中的数据类型
  interface IData {
    helloWord: string;
  }
}`;
}

export function genUsuallyTpl(opts: any, fileName = "Custom") {
  genJsTpl(opts.css);
  genHtmlTpl();
  genCSSTpl();
  genJSONTpl();
  return {
    js: genJsTpl(opts.css, fileName),
    css: genCSSTpl(),
    html: genHtmlTpl(),
    json: genJSONTpl(),
    interface: generateInterface(fileName),
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
