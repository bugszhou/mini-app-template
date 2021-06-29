# mini-app-template README

快速生成小程序模板

## Features

可以通过右键生成小程序页面模板和组件模板

## Requirements

No Requirements

## Extension Settings

### 是否和文件夹同名`miniAppTemplate.useDirectoryName`

- 例如：/pages/test/test
- 默认为 false, 格式为：/pages/test/index，不和文件夹名相同

```
{
    "miniAppTemplate.useDirectoryName": false
}
```

### 文件后缀设置`miniAppTemplate.rules`

- js 文件支持 `js`和`ts`
- css 文件支持 `scss`和原生的样式后缀（wxss/acss）
- `otherFile`其他的模板结构类型，是数组结构

```json
{
  "miniAppTemplate.rules": {
    "aliapp": {
      "file": {
        "json": "json",
        "css": "scss",
        "js": "ts",
        "html": "axml"
      },
      "otherFile": [
        {
          "name": "js",
          "json": "json",
          "css": "scss",
          "js": "js",
          "html": "axml"
        }
      ]
    },
    "weapp": {
      "file": {
        "json": "json",
        "css": "scss",
        "js": "ts",
        "html": "wxml"
      },
      "otherFile": [
        {
          "name": "js",
          "json": "json",
          "css": "scss",
          "js": "js",
          "html": "wxml"
        }
      ]
    }
  }
}
```

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Working with Markdown

**Note:** You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
- Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
- Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
