// ==UserScript==
// @name         归档 · DA — BC Backup & Restore
// @name:zh-CN   归档 — BC 数据备份与恢复工具
// @name:en      Data Archive · DA — BC Backup & Restore
// @namespace    https://github.com/heitaoplay/BC-DataArchive
// @version      3.6.0
// @description  归档（Data Archive）— BC 数据备份与恢复工具。核心代码从 GitHub Pages 加载，刷新即更新。
// @author       amoy_johnny（基于 Likolisu / awdrrawd 的 BC-LCE 提取重制）
// @match        *://*.bondageprojects.elementfx.com/*
// @match        *://*.bondage-asia.com/*
// @match        *://*.bondage-europe.com/*
// @match        *://*.bondageeurope.com/*
// @match        *://bondageprojects.elementfx.com/*
// @match        *://bondage-asia.com/*
// @match        *://bondage-europe.com/*
// @match        *://bondageeurope.com/*
// @include      /^https:\/\/(www\.)?bondage(projects\.elementfx|-(europe|asia))\.com\/.*/
// @icon         https://raw.githubusercontent.com/heitaoplay/BC-DataArchive/main/icon.png
// @icon64       https://raw.githubusercontent.com/heitaoplay/BC-DataArchive/main/icon.png
// @grant        none
// @homepage     https://github.com/heitaoplay/BC-DataArchive
// @supportURL   https://github.com/heitaoplay/BC-DataArchive/issues
// @updateURL    https://raw.githubusercontent.com/heitaoplay/BC-DataArchive/main/BC-DataArchive.user.js
// @downloadURL  https://raw.githubusercontent.com/heitaoplay/BC-DataArchive/main/BC-DataArchive.user.js
// @run-at       document-end
// ==/UserScript==

// 轻量加载器：核心代码托管在 GitHub Pages，每次刷新 BC 页面动态 import 最新版。
// ?v= 时间戳绕开浏览器缓存 —— push 新代码后刷新页面即生效，无需在油猴里手动更新。
const DA_CDN = "https://heitaoplay.github.io/BC-DataArchive/BC-DataArchive.js";

setTimeout(() => {
  import(`${DA_CDN}?v=${(Date.now() / 10000).toFixed(0)}`)
    .then(() => console.log("[DA] 已从 GitHub Pages 加载核心代码"))
    .catch(err => console.error("[DA] 核心代码加载失败，请检查网络或 GitHub Pages 状态:", err));
}, 8000);
