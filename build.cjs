#!/usr/bin/env node
/**
 * 构建脚本：把 src/BC-DataArchive.js 复制到仓库根目录 BC-DataArchive.js。
 * 根目录那个文件由 GitHub Pages 发布，油猴加载器动态 import 它。
 * 用法：node build.cjs
 */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const src = path.join(root, 'src', 'BC-DataArchive.js');
const out = path.join(root, 'BC-DataArchive.js');

if (!fs.existsSync(src)) {
  console.error('找不到源文件 src/BC-DataArchive.js');
  process.exit(1);
}

const code = fs.readFileSync(src, 'utf8');
new Function(code); // 语法检查
fs.writeFileSync(out, code);
console.log(`构建完成：BC-DataArchive.js (${Buffer.byteLength(code)} 字节)`);
