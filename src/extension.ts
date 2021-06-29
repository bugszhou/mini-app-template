// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { join } from "path";
import { existsSync } from "fs";
import { isDirectory } from "path-type";
import validFileName from "valid-filename";
import { get } from "lodash";
import * as mkdirp from "mkdirp";
import * as write from "write";
import del from "del";
import { awaitWrap } from "./util";
import pageGen from "./template/page";
import componentGen from "./template/component";
import normalComponentGen from "./template/normalComponent";

export type MiniAppType = "aliapp" | "weapp";
export type CreateType = "page" | "component" | "normalComponent";

const { workspace } = vscode;
const {
  showErrorMessage,
  showInputBox,
  showQuickPick,
  showInformationMessage,
} = vscode.window;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let pageDisposable = vscode.commands.registerCommand(
    "extension.createMiniAppPage",
    async (info) => {
      await handleCreate(info, "page");
    },
  );

  let componentDisposable = vscode.commands.registerCommand(
    "extension.createMiniAppComponent",
    async (info) => {
      await handleCreate(info, "component");
    },
  );

  let normalComponentDisposable = vscode.commands.registerCommand(
    "extension.createMiniAppNormalComponent",
    async (info) => {
      await handleCreate(info, "normalComponent");
    },
  );

  context.subscriptions.push(
    pageDisposable,
    componentDisposable,
    normalComponentDisposable,
  );
}

function getMiniAppTemplateConfig(type: MiniAppType) {
  const allConfig = workspace.getConfiguration();
  const miniappTemplateConf = get(
    allConfig,
    `miniAppTemplate.rules.${type}`,
    null,
  );
  return miniappTemplateConf;
}

async function handleCreate(info: any, createType: CreateType) {
  // The code you place here will be executed every time your command is executed

  const path = info.path;
  if (!isDirectory(path)) {
    showErrorMessage("Path is not directory");
    return;
  }

  // 1. 获取js文件类型（ts），css文件类型（scss），html文件类型（wxml）
  const miniAppType = await showQuickPick(["aliapp", "weapp"]);
  const conf = getMiniAppTemplateConfig(miniAppType as MiniAppType);
  const otherFile = conf.otherFile;
  if (!conf) {
    showErrorMessage(`Can Not Support ${miniAppType}!`);
    return;
  }

  let fileConfig = conf.file;
  if (otherFile) {
    const fileTypes = otherFile.map((item: any) => item.name);
    fileTypes.unshift("default");
    const fileType = await showQuickPick(fileTypes);

    if (fileType !== "default") {
      fileConfig = otherFile.filter((item: any) => item.name === fileType)[0];
    }
  }

  const options = {
    prompt: "请输入组件名: ",
    placeHolder: "组件名",
  };
  // 调出系统输入框获取组件名
  const filename = await showInputBox(options);

  if (!filename) {
    showErrorMessage(`Page/Component Name is required!`);
    return;
  }

  if (!validFileName(filename)) {
    showErrorMessage(`Page/Component Name is not vaild!`);
    return;
  }

  const fullPath = join(path, filename);

  // 1. 如果存在同名文件夹，则提示文件已存在，终止程序
  if (existsSync(fullPath)) {
    showErrorMessage(`Directory is existed!`);
    return;
  }
  // 2. 没有则新建文件夹
  const [err] = await awaitWrap(mkdirp(fullPath));
  if (err) {
    showErrorMessage("Create Directory Fail!", err);
    return;
  }
  // 3. 获取对应的模版，然后初始化内容，复制到目标文件夹中
  const [createErr] = await awaitWrap(
    createTemplate(miniAppType as MiniAppType, createType, fullPath, {
      ...conf,
      file: fileConfig,
    }),
  );

  if (createErr) {
    const [rmErr] = await awaitWrap(del(fullPath));
    console.error(rmErr);
    showErrorMessage("Create Template Fail!", createErr);
    return;
  }

  showInformationMessage("创建文件成功！");
}

async function createTemplate(
  type: MiniAppType,
  createType: CreateType,
  pathurl: string,
  settings: any,
) {
  const allConfig = workspace.getConfiguration();
  const useDirectoryName = get(
    allConfig,
    `miniAppTemplate.useDirectoryName`,
    false,
  );
  if (createType === "page") {
    await createPageTemplate({
      useDirectoryName,
      settings,
      pathurl,
      type,
    });
  } else if (createType === "component") {
    await createComponentTemplate({
      useDirectoryName,
      settings,
      pathurl,
      type,
    });
  } else {
    await createNormalComponentTemplate({
      useDirectoryName,
      settings,
      pathurl,
      type,
    });
  }
}

async function createPageTemplate(opts: {
  type: MiniAppType;
  [key: string]: any;
}) {
  const { useDirectoryName, settings, pathurl, type } = opts;
  const css = get(settings, "file.css", "scss");
  if (!useDirectoryName) {
    const tpls = pageGen[type].genUsuallyTpl(settings.file);
    try {
      await write(join(pathurl, `index.${settings.file.js}`), tpls.js);
      await write(join(pathurl, `index.${settings.file.html}`), tpls.html);
      await write(join(pathurl, `index.${settings.file.json}`), tpls.json);
    } catch (e) {
      console.error(e);
      throw e;
    }
    if (css !== "scss") {
      await write(join(pathurl, `index.${css}`), tpls.css);
    } else {
      try {
        await pageGen[type].genPreCSSTpl({
          ...settings.file,
          fullPath: pathurl,
        });
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  }
}

async function createComponentTemplate(opts: {
  type: MiniAppType;
  [key: string]: any;
}) {
  const { useDirectoryName, settings, pathurl, type } = opts;
  const css = get(settings, "file.css", "scss");
  if (!useDirectoryName) {
    const tpls = componentGen[type].genUsuallyTpl(settings.file);
    try {
      await write(join(pathurl, `index.${settings.file.js}`), tpls.js);
      await write(join(pathurl, `index.${settings.file.html}`), tpls.html);
      await write(join(pathurl, `index.${settings.file.json}`), tpls.json);
    } catch (e) {
      console.error(e);
      throw e;
    }
    if (css !== "scss") {
      await write(join(pathurl, `index.${css}`), tpls.css);
    } else {
      try {
        await componentGen[type].genPreCSSTpl({
          ...settings.file,
          fullPath: pathurl,
        });
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  }
}

async function createNormalComponentTemplate(opts: {
  type: MiniAppType;
  [key: string]: any;
}) {
  const { useDirectoryName, settings, pathurl, type } = opts;
  const css = get(settings, "file.css", "scss");
  if (!useDirectoryName) {
    const tpls = normalComponentGen[type].genUsuallyTpl(settings.file);
    try {
      await write(join(pathurl, `index.${settings.file.js}`), tpls.js);
      await write(join(pathurl, `index.${settings.file.html}`), tpls.html);
      await write(join(pathurl, `index.${settings.file.json}`), tpls.json);
    } catch (e) {
      console.error(e);
      throw e;
    }
    if (css !== "scss") {
      await write(join(pathurl, `index.${css}`), tpls.css);
    } else {
      try {
        await normalComponentGen[type].genPreCSSTpl({
          ...settings.file,
          fullPath: pathurl,
        });
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
