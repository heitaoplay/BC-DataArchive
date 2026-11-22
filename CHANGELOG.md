# 更新记录 / Changelog

按时间倒序。版本号与脚本头部 `@version` 一致。

---

## v3.3.4 — 修复弹窗被主面板遮挡

**问题**：点「一键全量归档」后弹出的范围选择窗口被主面板盖住，必须关掉主窗口才看得到。

**原因**：弹窗创建时用行内样式写死了 `z-index:25/30`，覆盖了 CSS 里设的 `10020`；主面板是 `9999`，所以弹窗被压在下面。

**修复**：移除三处行内 z-index，统一走 CSS；二级确认弹窗用独立 class `da-modal-backdrop-2`（`z-index:10021`）保持层级高于一级。

**验证**：主面板开着时 `elementFromPoint` 命中弹窗按钮区，无需关主窗口。

---

## v3.3.3 — 自定义极客风勾选框

之前只是用 `accent-color` 给浏览器原生勾选框换色。现在新增 `.da-check` 类，`appearance:none` 去掉原生外观，纯 CSS 画方框 + 勾号：深蓝底、蓝色描边、hover 高亮、选中蓝色渐变 + 白勾、focus 描边、禁用半透明。底层仍是原生 input，键盘与可访问性不受影响。应用到主面板全选、每行勾选、归档范围、恢复预览共四处。

---

## v3.3.2 — 恢复预览界面简化

**问题**：恢复 573 项时每项都展开大段 JSON，弹窗超高，「确定/取消」按钮被挤出屏幕。

**修复**：

- 列表加 `flex:1; min-height:0`，弹窗限高 760px，列表内部滚动
- 弹窗 backdrop 从面板内改挂到 `body` 并 `position:fixed`，脱离主面板 `transform` 造成的定位错乱；同步改 ESC 关闭与存在性检测为 document 级
- 每项默认折叠成一行摘要（"当前 2 B → 备份 1.04 MB（将覆盖）有变化"），点行展开看完整新旧值
- 新增「展开全部 / 收起全部」按钮

---

## v3.2.3 — 移除设置页按钮

按用户要求去掉「扩展组件设置」里的 DA 按钮，只保留人物资料页左下角唯一入口。主动删除旧注册，热注入时即时生效，无需刷新。

---

## v3.2.2 — 修复归档文件变成 0 字节（重大）

**问题**：手动点归档后系统保存框弹出、文件也创建了，但内容 0 字节，并提示保存失败。

**双重原因**：

1. **用户手势丢失**：原流程先弹保存框拿 handle，再跑 1.4 秒动画，最后才 `createWritable()+write()`。此时浏览器的 transient user activation 已过期，Chrome 拒绝写入。
2. **函数被误删**：一次代码整块替换时误删了 `sanitizeRowsForBackup`，导致点击直接抛 `not defined`。

**修复**：合并成 `saveNow()`，`picker → createWritable → write → close` 全部在用户手势链里连续完成；动画降级为写完之后的纯视觉反馈。加回被误删的函数。

**验证**：调用顺序记录为 `["picker","createWritable","write","close"]`，文件内容正确写入。

---

## v3.2.0 — 归档范围可选

「一键全量归档」不再是直接打包四区，而是先弹范围选择框，列出角色数据 / 角色设置 / 共享设置 / 插件数据四项（各显示项数与容量，默认全选），用户勾选后再保存。

- 全选时文件标记 `storage:'all'`；部分选中标记 `storage:'partial'` 并记录 `areas`
- 导入解析同步支持 `partial`，保证部分归档能自产自销
- 「归档选中」和单行归档流程不变

---

## v3.1.1 — 修复热注入新代码不生效

**问题**：改了代码反复热注入，行为却一直是旧版。

**原因**：BC 的 `PreferenceRegisterExtensionSetting` 对同名 Identifier 拒绝覆盖，设置页按钮一直指向旧闭包。

**修复**：注册前先删除旧的 `PreferenceExtensionsSettings['DataArchive']`，再用新闭包注册。

---

## v3.1.0 — 修复真实数据备份崩溃

**问题**：真实角色数据里 `Player.Appearance` 存在循环引用（Asset 反向指向角色），直接 `JSON.stringify` 抛 `Converting circular structure to JSON`。

**修复**：

- `archiveStringify()` 用 WeakSet 检测并断开循环引用，兜底防崩
- 备份时 `sanitizeRowsForBackup()` 用 BC 官方 `ServerAppearanceBundle` 把外观转成安全可移植格式
- 恢复时检测 bundle 格式，用 `ServerAppearanceLoadFromBundle` 在原型副本上还原成可渲染的角色对象，避免二次 bundle 清空数据

---

## v3.0.0 — 保存位置 / 功能提示 / 导入二级确认

- **保存位置**：改用 `showSaveFilePicker()` 弹系统保存对话框让用户选路径，写入后 toast 显示"已保存到：文件名"；取消不写入。不再假设下载会落到默认目录（此前因 Chrome 设了「下载时询问位置」导致归档文件根本没保存）
- **功能提示**：所有按钮加极客风 tooltip，鼠标悬停 / 触屏长按 450ms 显示，不用浏览器原生 title
- **导入校验**：账号不符、类型错误、空数据、体积异常逐项标记，异常项禁止勾选
- **二级确认**：确认恢复改为极客风弹窗，列出将覆盖的项 + 账号对比 + 不可撤销警告，替代原生 confirm

---

## v2.2.x — 适配 R134 资料页 DOM 按钮

**问题**：R134 把资料页按钮从 canvas 绘制改成 DOM 元素，原来的 `DrawButton + MouseIn` 方案点不动（canvas 被 DOM 层盖住，且 `MouseX/MouseY` 恒为 -1）。

**修复**：照 BCX 源码用 DOM 按钮，MutationObserver 监听资料页 menu 容器出现即插入。

- 按钮位置按用户要求放左下角立绘旁，绝对定位，不占右侧 menubar（插件多了会把按钮顶出屏幕）
- 真实点击修复：父容器是 `pointer-events:none`，按钮必须显式 `pointer-events:auto !important` + 提高 z-index（此前用 DOM `.click()` 测试是假成功）
- 跨屏幕适配：尺寸从容器 `font-size` 动态计算，随窗口 resize 重算，六档屏幕验证不跑位

---

## v2.1.0 — ModSDK 注册与原生入口

- 用 `bcModSdk.registerMod` 正规注册（`modInfo` 只放标准字段，`allowReplace` 放第二参数），解决 BCX 报 `Unknown mod not using ModSDK`
- 用 `mod.hookFunction` 替代自己实现的全局函数 hook
- 新增设置页与资料页两个入口（设置页入口在 v3.2.3 移除）
