// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { join } from "path";
import { existsSync } from "fs";
import { isDirectory } from "path-type";
import validFileName from "valid-filename";
import { get } from "lodash";
import * as mkdirp from "mkdirp";
import { awaitWrap } from "./util";

enum MiniAppType {
  aliapp,
  weapp,
}

const { workspace } = vscode;
const { showErrorMessage, showInputBox, showQuickPick } = vscode.window;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "mini-app-template" is now active!',
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension.createMiniAppPage",
    async (info) => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from Mini App Template!",
      );
      const path = info.path;
      if (!isDirectory(path)) {
        showErrorMessage("Path is not directory");
        return;
      }

      // 1. 获取js文件类型（ts），css文件类型（scss），html文件类型（wxml）
      const miniAppType = await showQuickPick(["aliapp", "weapp"]);
      const conf = getMiniAppTemplateConfig(miniAppType);
      if (!conf) {
        showErrorMessage(`Can Not Support ${miniAppType}!`);
        return;
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
			console.log(fullPath);
      // 2. 没有则新建文件夹
      const [err, createRes] = await awaitWrap(mkdirp(fullPath));
			console.log(createRes);
      if (err) {
      	showErrorMessage("Create Directory Fail!", err);
      	return;
			}
      // 3. 获取对应的模版，然后初始化内容，复制到目标文件夹中

      console.log("创建模版文件成功！", fullPath);
    },
  );

  context.subscriptions.push(disposable);
}

function getMiniAppTemplateConfig(type: string | undefined) {
  const allConfig = workspace.getConfiguration();
  const miniappTemplateConf = get(
    allConfig,
    `miniAppTemplate.rules.${type}`,
    null,
  );
  return miniappTemplateConf;
}

// this method is called when your extension is deactivated
export function deactivate() {}
