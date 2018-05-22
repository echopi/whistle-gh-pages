# whistle gh-pages

主要介绍如何自动化部署 gitbook 的资源到项目的 gh-pages。

## 基本思路

利用 github 的 webhook 机制，在

## 前提

1. 设置项目的 gh-pages 通过 `gh-pages` 分支编译。

  ![gh-pages](./asset/gh-pages-setting.png)
2. 提供 API 的应用需要有能力 push 代码到远程分支
