// ==UserScript==
// @name         归档 · DA — BC Backup & Restore
// @name:zh-CN  归档 — BC 数据备份与恢复工具
// @name:en      Data Archive · DA — BC Backup & Restore
// @namespace    https://github.com/heitaoplay/BC-DataArchive
// @homepage     https://github.com/heitaoplay/BC-DataArchive
// @supportURL   https://github.com/heitaoplay/BC-DataArchive/issues
// @version      3.3.3
// @description  归档（Data Archive）— BC 数据备份与恢复工具。极客风界面 + 导入导出动画 + 三语适配。备份/恢复角色数据（自制道具、外观、金钱声望技能、主从关系）与插件数据，兼容 LCE 备份格式。
// @author       amoy_johnny（基于 Likolisu / awdrrawd 的 BC-LCE 提取重制）
// @match        *://bondageprojects.elementfx.com/R*
// @match        *://www.bondageprojects.elementfx.com/R*
// @match        *://bondage-europe.com/R*
// @match        *://www.bondage-europe.com/R*
// @match        *://bondage-asia.com/R*
// @match        *://www.bondage-asia.com/R*
// @match        *://bondageeurope.com/R*
// @match        *://www.bondageeurope.com/R*
// @icon         https://raw.githubusercontent.com/heitaoplay/BC-DataArchive/main/icon.png
// @icon64       https://raw.githubusercontent.com/heitaoplay/BC-DataArchive/main/icon.png
// @grant        none
// @updateURL    https://raw.githubusercontent.com/heitaoplay/BC-DataArchive/main/BC-DataArchive.user.js
// @downloadURL  https://raw.githubusercontent.com/heitaoplay/BC-DataArchive/main/BC-DataArchive.user.js
// @run-at       document-end
// ==/UserScript==

/*
 * ─────────────────────────────────────────────────────────────
 * 归档 · Data Archive (DA) — BC 数据备份与恢复工具
 *
 * 来源与授权声明：
 * 容量管理面板的核心逻辑提取自 awdrrawd/BC-LCE 的
 * src/settings/storage-manager.js，原作者 Likolisu，采用 AGPL-3.0。
 * 依据协议保留原作者署名，衍生作品同样遵循 AGPL-3.0。
 * 原仓库：https://github.com/awdrrawd/BC-LCE
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ═══════════ 常量 ═══════════ */
  const PREFIX = 'da';
  const PANEL_ID = PREFIX + '-panel';
  const STYLE_ID = PREFIX + '-style';
  const TOAST_ID = PREFIX + '-toast';
  const TOOLTIP_ID = PREFIX + '-tooltip';
  const OVERLAY_ID = PREFIX + '-overlay';
  const ICON_URI = 'data:image/png;base64,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';
  const FORMAT = 'BC-DATAARCHIVE';
  const LEGACY_FORMAT = 'BC-SAVE-VAULT';
  const VERSION = 3; // v3：全新 UI + i18n；v2/v1 备份均可读取

  const STORES = [
    { key: 'character', icon: 'avatar' },
    { key: 'extensionSettings', icon: 'sliders' },
    { key: 'onlineSharedSettings', icon: 'share' },
    { key: 'localStorage', icon: 'database' },
  ];
  const STORE_KEYS = STORES.map(s => s.key);
  const DATA_STORE_KEYS = STORE_KEYS.filter(k => k !== 'character');

  const CHARACTER_FIELDS = [
    { key: 'Crafting', label: { 'zh-CN': '自制道具', 'zh-TW': '自製道具', en: 'Crafted items' }, risk: 'normal' },
    { key: 'Wardrobe', label: { 'zh-CN': '衣柜套装', 'zh-TW': '衣櫃套裝', en: 'Wardrobe outfits' }, risk: 'normal' },
    { key: 'Money', label: { 'zh-CN': '金钱', 'zh-TW': '金錢', en: 'Money' }, risk: 'normal' },
    { key: 'Reputation', label: { 'zh-CN': '声望', 'zh-TW': '聲望', en: 'Reputation' }, risk: 'normal' },
    { key: 'Skill', label: { 'zh-CN': '技能等级', 'zh-TW': '技能等級', en: 'Skills' }, risk: 'normal' },
    { key: 'Title', label: { 'zh-CN': '称号', 'zh-TW': '稱號', en: 'Title' }, risk: 'normal' },
    { key: 'Nickname', label: { 'zh-CN': '昵称', 'zh-TW': '暱稱', en: 'Nickname' }, risk: 'normal' },
    { key: 'Description', label: { 'zh-CN': '个人简介', 'zh-TW': '個人簡介', en: 'Profile description' }, risk: 'normal' },
    { key: 'Owner', label: { 'zh-CN': '主人', 'zh-TW': '主人', en: 'Owner' }, risk: 'normal' },
    { key: 'Lover', label: { 'zh-CN': '恋人', 'zh-TW': '戀人', en: 'Lover' }, risk: 'normal' },
    { key: 'Ownership', label: { 'zh-CN': '主从关系', 'zh-TW': '主從關係', en: 'Ownership' }, risk: 'normal' },
    { key: 'Lovership', label: { 'zh-CN': '恋人关系', 'zh-TW': '戀人關係', en: 'Lovership' }, risk: 'normal' },
    { key: 'Difficulty', label: { 'zh-CN': '难度设置', 'zh-TW': '難度設定', en: 'Difficulty' }, risk: 'normal' },
    { key: 'AllowedInteractions', label: { 'zh-CN': '允许的互动', 'zh-TW': '允許的互動', en: 'Allowed interactions' }, risk: 'normal' },
    { key: 'LabelColor', label: { 'zh-CN': '名牌颜色', 'zh-TW': '名牌顏色', en: 'Name tag color' }, risk: 'normal' },
    { key: 'Game', label: { 'zh-CN': '小游戏进度', 'zh-TW': '小遊戲進度', en: 'Mini-game progress' }, risk: 'normal' },
    { key: 'ArousalSettings', label: { 'zh-CN': '兴奋度设置', 'zh-TW': '興奮度設定', en: 'Arousal settings' }, risk: 'normal' },
    { key: 'WhiteList', label: { 'zh-CN': '白名单', 'zh-TW': '白名單', en: 'Whitelist' }, risk: 'normal' },
    { key: 'BlackList', label: { 'zh-CN': '黑名单', 'zh-TW': '黑名單', en: 'Blacklist' }, risk: 'normal' },
    { key: 'SavedColors', label: { 'zh-CN': '收藏颜色', 'zh-TW': '收藏顏色', en: 'Saved colors' }, risk: 'normal' },
    { key: 'Appearance', label: { 'zh-CN': '当前外观', 'zh-TW': '當前外觀', en: 'Appearance' }, risk: 'high', bundle: 'appearance' },
  ];
  const CHARACTER_FIELD_KEYS = CHARACTER_FIELDS.map(f => f.key);
  const DANGEROUS_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

  /* ═══════════ i18n（国际化：让界面支持多种语言）═══════════ */
  const LANGS = ['zh-CN', 'zh-TW', 'en'];
  const LANG_NAMES = { 'zh-CN': '简体', 'zh-TW': '繁體', en: 'EN' };
  const I18N = {
    'zh-CN': {
      brand: '归档', brandFull: 'BC 数据备份与恢复工具',
      tab_character: '角色数据', tab_extensionSettings: '角色设置', tab_onlineSharedSettings: '共享设置', tab_localStorage: '插件数据',
      hint_character: '服务器角色字段：自制道具、外观、金钱、声望、技能、衣柜、主从关系等。恢复会写回服务器，请谨慎操作。',
      hint_extensionSettings: '插件设置（LSCG / BCX / LCE 等），跟随账号同步到服务器。',
      hint_onlineSharedSettings: '账号级共享开关，跟随账号同步到服务器。',
      hint_localStorage: '浏览器本地存储：各插件配置、备注、主题、聊天记录等，清缓存会丢失。',
      search: '搜索数据键…', backupAll: '一键全量归档', import: '恢复 / 导入', refresh: '刷新',
      colSelect: '选', colName: '名称', colSize: '容量', colActions: '操作',
      backupSelected: '归档选中', deleteSelected: '删除选中', backup: '归档', delete: '删除',
      noDeleteChar: '角色字段只能恢复覆盖，不支持删除',
      emptySearch: '没有匹配的数据', emptyStore: '这个区域目前没有数据',
      summary: '当前区域', items: '项数据', total: '合计', selected: '已选',
      noteData: '恢复会覆盖同名数据，建议先归档一次',
      noteChar: '角色数据恢复会直接写回服务器，高风险项（外观）默认不勾选',
      riskHigh: '高风险', confirmDeleteSel: '确定删除选中的 {n} 项吗？此操作不可撤销。',
      confirmDeleteOne: '确定删除「{key}」？不可撤销。', cancel: '取消', confirmDelete: '确认删除',
      deleted: '已删除 {n} 项', importTitle: '恢复预览', importSub: '共 {n} 项{acct}。勾选要写入的数据（左边当前值，右边备份值）。',
      importSelect: '选', importZone: '区域 / 名称', importCurrent: '当前值', importBackup: '备份值',
      selectAll: '全选', confirmRestore: '确认恢复', selectedCount: '已选 {n} 项',
      confirmChar: '即将把以下角色数据写回游戏服务器：\n{names}\n\n这会覆盖服务器上的当前值，可能影响角色外观/道具/进度。\n确定继续吗？（建议先归档一次）',
      confirmAccount: '即将恢复 {n} 项账号设置到服务器，确定继续吗？',
      valOk: '校验通过', valWarn: '需注意', valBad: '异常',
      valAccountMismatch: '备份账号与当前账号不同', valTypeBad: '数据类型不符合该字段', valHuge: '数据异常巨大（可能损坏）', valEmpty: '数据为空',
      checkTitle: '二级确认 — 即将覆盖数据', checkIntro: '以下 {n} 项将覆盖当前数据，操作不可撤销：',
      checkWarn: '角色数据会写回游戏服务器；建议先做一次全量归档。',
      checkCancel: '返回修改', checkConfirm: '确认覆盖', checkAccountLine: '备份账号：{acct}　当前账号：{cur}',
      restoreDone: '恢复完成：成功 {ok} 项{fail}', charSynced: '角色数据已提交服务器，请重新登录让更改完整生效',
      acctSynced: '账号设置已同步，若未立即刷新请切换页面或重新登录',
      noSelect: '请先勾选要归档的数据', backupDone: '已归档 {n} 项（{size}）',
      allDone: '全量归档完成：共 {n} 项，{z} 个区域',
      savedTo: '已保存到：{path}', savedDownload: '已触发下载：{name}（请到浏览器下载目录查看）',
      saveCancelled: '已取消保存，归档未写入磁盘', saveFailed: '保存失败：{err}',
      tipBackupAll: '先勾选要归档的区域（可全选），再打包成一个 JSON 文件保存到你的电脑。不上传云端；换设备时把文件拷过去，用「恢复/导入」读取。',
      tipImport: '选择之前归档的 JSON 文件恢复数据。会先显示新旧值对比和校验结果，确认后才覆盖现有数据。',
      tipBackup: '把这一项单独保存成 JSON 文件到你的电脑。',
      tipDelete: '从浏览器/账号中删除这一项（角色数据不支持删除）。',
      tipProfileBtn: '归档 · DA — 打开数据备份与恢复工具。数据只存本地文件，不上传云端。',
      tipSettingBtn: '归档 · DA 设置 — 打开数据备份与恢复工具。',
      scopeTitle: '选择归档范围', scopeIntro: '勾选要打包进归档文件的区域（默认全选）。不勾选的区域不会被保存。',
      scopeDone: '开始归档', scopeEmpty: '请至少勾选一个区域',
      expandAll: '展开全部', collapseAll: '收起全部', tipRow: '点这一行展开查看新旧值详情',
      invalidBackup: '导入失败：{err}', parseFail: '备份解析失败',
      importInvalid: '不是本工具或 LCE 支持的备份格式',
      importNoData: '备份文件里没有可恢复的数据',
      syncFail: '同步到服务器失败', writeFail: '写入失败',
      playerMissing: '未检测到游戏角色，请先登录游戏',
      phaseScan: '扫描数据区', phaseCollect: '采集条目', phasePack: '压缩打包', phaseWrite: '生成归档文件',
      phaseParse: '解析归档', phaseVerify: '校验条目', phaseApply: '写入数据',
      phaseDone: '完成', phaseReady: '就绪', archiveStarted: '开始归档…', restoreStarted: '开始恢复…',
      langLabel: '语言',
    },
    'zh-TW': {
      brand: '歸檔', brandFull: 'BC 資料備份與還原工具',
      tab_character: '角色資料', tab_extensionSettings: '角色設定', tab_onlineSharedSettings: '共享設定', tab_localStorage: '外掛資料',
      hint_character: '伺服器角色欄位：自製道具、外觀、金錢、聲望、技能、衣櫃、主從關係等。還原會寫回伺服器，請謹慎操作。',
      hint_extensionSettings: '外掛設定（LSCG / BCX / LCE 等），跟隨帳號同步到伺服器。',
      hint_onlineSharedSettings: '帳號級共享開關，跟隨帳號同步到伺服器。',
      hint_localStorage: '瀏覽器本地儲存：各外掛設定、備註、主題、聊天記錄等，清快取會遺失。',
      search: '搜尋資料鍵…', backupAll: '一鍵全量歸檔', import: '還原 / 匯入', refresh: '重新整理',
      colSelect: '選', colName: '名稱', colSize: '容量', colActions: '操作',
      backupSelected: '歸檔選取', deleteSelected: '刪除選取', backup: '歸檔', delete: '刪除',
      noDeleteChar: '角色欄位只能還原覆蓋，不支援刪除',
      emptySearch: '沒有符合的資料', emptyStore: '這個區域目前沒有資料',
      summary: '目前區域', items: '項資料', total: '合計', selected: '已選',
      noteData: '還原會覆蓋同名資料，建議先歸檔一次',
      noteChar: '角色資料還原會直接寫回伺服器，高風險項目（外觀）預設不勾選',
      riskHigh: '高風險', confirmDeleteSel: '確定刪除選取的 {n} 項嗎？此操作不可復原。',
      confirmDeleteOne: '確定刪除「{key}」？不可復原。', cancel: '取消', confirmDelete: '確認刪除',
      deleted: '已刪除 {n} 項', importTitle: '還原預覽', importSub: '共 {n} 項{acct}。勾選要寫入的資料（左邊目前值，右邊備份值）。',
      importSelect: '選', importZone: '區域 / 名稱', importCurrent: '目前值', importBackup: '備份值',
      selectAll: '全選', confirmRestore: '確認還原', selectedCount: '已選 {n} 項',
      confirmChar: '即將把以下角色資料寫回遊戲伺服器：\n{names}\n\n這會覆蓋伺服器上的目前值，可能影響角色外觀/道具/進度。\n確定繼續嗎？（建議先歸檔一次）',
      confirmAccount: '即將還原 {n} 項帳號設定到伺服器，確定繼續嗎？',
      valOk: '校驗通過', valWarn: '需注意', valBad: '異常',
      valAccountMismatch: '備份帳號與當前帳號不同', valTypeBad: '資料類型不符合該欄位', valHuge: '資料異常巨大（可能損壞）', valEmpty: '資料為空',
      checkTitle: '二級確認 — 即將覆蓋資料', checkIntro: '以下 {n} 項將覆蓋當前資料，操作不可復原：',
      checkWarn: '角色資料會寫回遊戲伺服器；建議先做一次全量歸檔。',
      checkCancel: '返回修改', checkConfirm: '確認覆蓋', checkAccountLine: '備份帳號：{acct}　當前帳號：{cur}',
      restoreDone: '還原完成：成功 {ok} 項{fail}', charSynced: '角色資料已提交伺服器，請重新登入讓變更完整生效',
      acctSynced: '帳號設定已同步，若未立即重新整理請切換頁面或重新登入',
      noSelect: '請先勾選要歸檔的資料', backupDone: '已歸檔 {n} 項（{size}）',
      allDone: '全量歸檔完成：共 {n} 項，{z} 個區域',
      savedTo: '已儲存至：{path}', savedDownload: '已觸發下載：{name}（請至瀏覽器下載目錄查看）',
      saveCancelled: '已取消儲存，歸檔未寫入磁碟', saveFailed: '儲存失敗：{err}',
      tipBackupAll: '先勾選要歸檔的區域（可全選），再打包成一個 JSON 檔案保存到你的電腦。不上傳雲端；換裝置時把檔案拷過去，用「還原/匯入」讀取。',
      tipImport: '選擇之前歸檔的 JSON 檔案還原資料。會先顯示新舊值對比和校驗結果，確認後才覆蓋現有資料。',
      tipBackup: '將這一項單獨保存成 JSON 檔案到你的電腦。',
      tipDelete: '從瀏覽器/帳號中刪除這一項（角色資料不支援刪除）。',
      tipProfileBtn: '歸檔 · DA — 開啟資料備份與還原工具。資料只存本機檔案，不上傳雲端。',
      tipSettingBtn: '歸檔 · DA 設定 — 開啟資料備份與還原工具。',
      scopeTitle: '選擇歸檔範圍', scopeIntro: '勾選要打包進歸檔檔案的區域（預設全選）。未勾選的區域不會被儲存。',
      scopeDone: '開始歸檔', scopeEmpty: '請至少勾選一個區域',
      expandAll: '展開全部', collapseAll: '收起全部', tipRow: '點這一行展開檢視新舊值詳情',
      invalidBackup: '匯入失敗：{err}', parseFail: '備份解析失敗',
      importInvalid: '不是本工具或 LCE 支援的備份格式',
      importNoData: '備份檔案裡沒有可還原的資料',
      syncFail: '同步到伺服器失敗', writeFail: '寫入失敗',
      playerMissing: '未偵測到遊戲角色，請先登入遊戲',
      phaseScan: '掃描資料區', phaseCollect: '採集條目', phasePack: '壓縮打包', phaseWrite: '產生歸檔檔案',
      phaseParse: '解析歸檔', phaseVerify: '校驗條目', phaseApply: '寫入資料',
      phaseDone: '完成', phaseReady: '就緒', archiveStarted: '開始歸檔…', restoreStarted: '開始還原…',
      langLabel: '語言',
    },
    en: {
      brand: 'Archive', brandFull: 'BC Backup & Restore',
      tab_character: 'Character', tab_extensionSettings: 'Char settings', tab_onlineSharedSettings: 'Shared', tab_localStorage: 'Addon data',
      hint_character: 'Server character fields: crafted items, appearance, money, reputation, skills, wardrobe, ownership. Restore writes to the server - use with care.',
      hint_extensionSettings: 'Addon settings (LSCG / BCX / LCE etc.), synced with your account.',
      hint_onlineSharedSettings: 'Account-level shared toggles, synced with your account.',
      hint_localStorage: 'Browser local storage: addon configs, notes, themes, chat logs. Lost when clearing cache.',
      search: 'Search data keys...', backupAll: 'Full archive', import: 'Restore / Import', refresh: 'Refresh',
      colSelect: 'Sel', colName: 'Name', colSize: 'Size', colActions: 'Actions',
      backupSelected: 'Archive selected', deleteSelected: 'Delete selected', backup: 'Archive', delete: 'Delete',
      noDeleteChar: 'Character fields can only be overwritten, not deleted',
      emptySearch: 'No matching data', emptyStore: 'No data in this area',
      summary: 'Current area', items: 'entries', total: 'Total', selected: 'Selected',
      noteData: 'Restore overwrites existing data; archive first',
      noteChar: 'Character restore writes directly to the server; high-risk items (appearance) are unchecked by default',
      riskHigh: 'High risk', confirmDeleteSel: 'Delete {n} selected entries? This cannot be undone.',
      confirmDeleteOne: 'Delete "{key}"? This cannot be undone.', cancel: 'Cancel', confirmDelete: 'Delete now',
      deleted: 'Deleted {n} entries', importTitle: 'Restore preview', importSub: '{n} entries{acct}. Select what to write (current value left, backup value right).',
      importSelect: 'Sel', importZone: 'Area / Name', importCurrent: 'Current value', importBackup: 'Backup value',
      selectAll: 'Select all', confirmRestore: 'Confirm restore', selectedCount: '{n} selected',
      confirmChar: 'The following character data will be written to the game server:\n{names}\n\nThis overwrites current server values and may affect appearance/items/progress.\nContinue? (Archive first recommended)',
      confirmAccount: 'Restore {n} account settings to the server?',
      valOk: 'Valid', valWarn: 'Caution', valBad: 'Invalid',
      valAccountMismatch: 'Backup account differs from current account', valTypeBad: 'Data type does not match this field', valHuge: 'Unusually large data (possibly corrupted)', valEmpty: 'Empty data',
      checkTitle: 'Second confirmation — data will be overwritten', checkIntro: 'The following {n} entries will overwrite current data. This cannot be undone:',
      checkWarn: 'Character data will be written to the game server; consider a full archive first.',
      checkCancel: 'Back to edit', checkConfirm: 'Confirm overwrite', checkAccountLine: 'Backup account: {acct} | Current account: {cur}',
      restoreDone: 'Restore complete: {ok} succeeded{fail}', charSynced: 'Character data submitted to server; re-login for changes to fully apply',
      acctSynced: 'Account settings synced; switch page or re-login if not updated',
      noSelect: 'Select entries to archive first', backupDone: 'Archived {n} entries ({size})',
      allDone: 'Full archive complete: {n} entries across {z} areas',
      savedTo: 'Saved to: {path}', savedDownload: 'Download started: {name} (check your browser download folder)',
      saveCancelled: 'Save cancelled; nothing was written to disk', saveFailed: 'Save failed: {err}',
      tipBackupAll: 'Choose which areas to archive (or select all), then pack them into one JSON file saved to your computer. Nothing is uploaded; on a new device, copy the file and use Restore/Import.',
      tipImport: 'Choose a previously archived JSON file to restore. Shows old/new comparison and validation first; data is overwritten only after you confirm.',
      tipBackup: 'Save just this entry as a JSON file to your computer.',
      tipDelete: 'Remove this entry from the browser/account (character fields cannot be deleted).',
      tipProfileBtn: 'Data Archive — open backup & restore. Data is stored only in local files, never uploaded.',
      tipSettingBtn: 'Data Archive settings — open backup & restore tool.',
      scopeTitle: 'Choose archive scope', scopeIntro: 'Select which areas to pack into the archive (all selected by default). Unselected areas will not be saved.',
      scopeDone: 'Start archive', scopeEmpty: 'Select at least one area',
      expandAll: 'Expand all', collapseAll: 'Collapse all', tipRow: 'Click a row to expand old/new values',
      invalidBackup: 'Import failed: {err}', parseFail: 'Backup parse failed',
      importInvalid: 'Not a supported backup format',
      importNoData: 'No restorable data in the backup file',
      syncFail: 'Server sync failed', writeFail: 'Write failed',
      playerMissing: 'No game character detected; please log in first',
      phaseScan: 'Scanning areas', phaseCollect: 'Collecting entries', phasePack: 'Compressing', phaseWrite: 'Writing archive',
      phaseParse: 'Parsing archive', phaseVerify: 'Verifying entries', phaseApply: 'Applying data',
      phaseDone: 'Done', phaseReady: 'Ready', archiveStarted: 'Starting archive...', restoreStarted: 'Starting restore...',
      langLabel: 'Language',
    },
  };

  let currentLang = 'zh-CN';
  function detectLang() {
    try {
      const t = (typeof TranslationLanguage !== 'undefined' && TranslationLanguage) || localStorage.getItem('TranslationLanguage') || '';
      const low = String(t).toLowerCase();
      if (low.includes('tw') || low.includes('cht') || low.includes('traditional')) return 'zh-TW';
      if (low.includes('cn') || low.includes('sc') || low.includes('chs') || low.includes('simplified')) return 'zh-CN';
      if (low.includes('en')) return 'en';
    } catch (_) {}
    return 'zh-CN';
  }
  function setLang(lang) {
    if (!LANGS.includes(lang)) return;
    currentLang = lang;
    try { localStorage.setItem(PREFIX + '-lang', lang); } catch (_) {}
    if (document.getElementById(PANEL_ID)) render();
  }
  (function initLang() {
    try {
      const saved = localStorage.getItem(PREFIX + '-lang');
      if (saved && LANGS.includes(saved)) { currentLang = saved; return; }
    } catch (_) {}
    currentLang = detectLang();
  })();
  function t(key, vars) {
    let text = (I18N[currentLang] && I18N[currentLang][key]) || I18N['zh-CN'][key] || key;
    if (vars) for (const [k, v] of Object.entries(vars)) text = text.replace(new RegExp('\\{' + k + '\\}', 'g'), String(v));
    return text;
  }
  function fieldLabel(key) {
    const f = CHARACTER_FIELDS.find(x => x.key === key);
    return f ? (f.label[currentLang] || f.label['zh-CN']) : key;
  }
  function storeLabel(type) { return t('tab_' + type); }

  /* ═══════════ SVG 图标（全部矢量绘制，无 emoji）═══════════ */
  const svg = (paths, size) => '<svg viewBox="0 0 24 24" width="' + (size || 18) + '" height="' + (size || 18) + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  const ICONS = {
    avatar: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>'),
    sliders: svg('<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="8" cy="18" r="2" fill="currentColor" stroke="none"/>'),
    share: svg('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.6l6.8-4M8.6 13.4l6.8 4"/>'),
    database: svg('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'),
    download: svg('<path d="M12 3v12m0 0l-4-4m4 4l4-4M4 18v2a1 1 0 001 1h14a1 1 0 001-1v-2"/>'),
    upload: svg('<path d="M12 16V4m0 0L8 8m4-4l4 4M4 18v2a1 1 0 001 1h14a1 1 0 001-1v-2"/>'),
    trash: svg('<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6m4-6v6"/>'),
    close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
    check: svg('<path d="M5 13l4 4L19 7"/>'),
    alert: svg('<path d="M12 3L2 20h20L12 3z"/><path d="M12 9v5m0 3v.5"/>'),
    globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'),
    archive: svg('<path d="M3 5h18v4H3zM5 9v11h14V9M10 13h4"/>'),
    pulse: svg('<path d="M2 12h4l3-8 4 16 3-8h6"/>'),
  };

  // 极客风功能提示：鼠标悬停显示，触屏长按 450ms 显示（和面板同风格，不用浏览器原生 title）
  function showTip(el, text) {
    if (!text) return;
    let tip = document.getElementById(TOOLTIP_ID);
    if (!tip) { tip = document.createElement('div'); tip.id = TOOLTIP_ID; document.body.appendChild(tip); }
    tip.textContent = text;
    const r = el.getBoundingClientRect();
    tip.classList.add('da-tip-show');
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let x = r.left + r.width / 2 - tw / 2;
    let y = r.top - th - 10;
    if (y < 8) y = r.bottom + 10;             // 上方不够就放下方
    x = Math.max(8, Math.min(x, innerWidth - tw - 8));
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  }
  function hideTip() { document.getElementById(TOOLTIP_ID)?.classList.remove('da-tip-show'); }
  function bindTip(el, text) {
    if (!el || !text) return;
    el.classList.add('da-has-tip');
    el.removeAttribute('title'); // 用自定义提示，避免和原生 title 重复弹出
    let holdTimer = null;
    el.addEventListener('mouseenter', () => showTip(el, text));
    el.addEventListener('mouseleave', () => { hideTip(); if (holdTimer) clearTimeout(holdTimer); });
    el.addEventListener('touchstart', () => { holdTimer = setTimeout(() => showTip(el, text), 450); }, { passive: true });
    const cancel = () => { if (holdTimer) clearTimeout(holdTimer); hideTip(); };
    el.addEventListener('touchend', cancel);
    el.addEventListener('touchcancel', cancel);
  }

  function makeButton(text, className, onClick, iconName, title) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'da-btn ' + (className || '');
    if (iconName && ICONS[iconName]) {
      const span = document.createElement('span'); span.className = 'da-ico'; span.innerHTML = ICONS[iconName]; btn.appendChild(span);
    }
    if (text) { const label = document.createElement('span'); label.textContent = text; btn.appendChild(label); }
    if (title) bindTip(btn, title);
    btn.addEventListener('click', () => { hideTip(); onClick(); });
    return btn;
  }

  /* ═══════════ 工具 ═══════════ */
  function safeStringify(v) { try { return JSON.stringify(v); } catch (_) { return null; } }

  // 写归档文件用：BC 的 Appearance 里有循环引用（Asset 反向指回角色），
  // 通用 replacer 检测循环并断开，保证任何角色数据都能安全序列化。
  function archiveStringify(value) {
    const seen = new WeakSet();
    return JSON.stringify(value, (key, val) => {
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) return '[Circular]';
        seen.add(val);
      }
      return val;
    }, 2);
  }
  function byteSize(v) {
    if (v === undefined || v === null) return 0;
    const s = typeof v === 'string' ? v : safeStringify(v);
    if (s === null) return 0;
    try { return new Blob([s]).size; } catch (_) { return s.length * 2; }
  }
  function formatBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1024 ** 2) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1024 ** 2).toFixed(2) + ' MB';
  }
  function safeFilename(v) { return String(v || 'account').replace(/[^a-z0-9._-]+/giu, '_'); }
  function displayValue(v) {
    if (v === undefined) return '—';
    if (typeof v === 'string') { try { return JSON.stringify(JSON.parse(v), null, 2); } catch (_) { return v; } }
    try { return JSON.stringify(v, null, 2); } catch (_) { return String(v); }
  }
  function preview(v, limit) {
    const text = displayValue(v);
    return text.length > limit ? text.slice(0, limit) + '\n… (' + formatBytes(byteSize(v)) + ')' : text;
  }
  function stamp() { return new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-'); }
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function toast(message, kind) {
    let host = document.getElementById(TOAST_ID);
    if (!host) { host = document.createElement('div'); host.id = TOAST_ID; document.body.appendChild(host); }
    const item = document.createElement('div'); item.className = 'da-toast da-toast-' + (kind || 'ok');
    const ic = document.createElement('span'); ic.className = 'da-ico'; ic.innerHTML = ICONS[kind === 'ok' ? 'check' : 'alert'];
    const txt = document.createElement('span'); txt.textContent = message;
    item.append(ic, txt); host.appendChild(item);
    setTimeout(() => { item.classList.add('da-toast-out'); setTimeout(() => item.remove(), 320); }, 2800);
  }

  /* ═══════════ 存储读写层 ═══════════ */
  function playerReady() { return typeof Player !== 'undefined' && !!Player; }
  function isChar(type) { return type === 'character'; }
  function getStore(type) {
    if (type === 'localStorage') { try { return window.localStorage; } catch (_) { return null; } }
    if (!playerReady()) return null;
    if (isChar(type)) return Player;
    if (type === 'extensionSettings') return Player.ExtensionSettings || null;
    if (type === 'onlineSharedSettings') return Player.OnlineSharedSettings || null;
    return null;
  }
  function listRows(type) {
    const store = getStore(type);
    if (!store) return [];
    let entries;
    if (isChar(type)) entries = CHARACTER_FIELD_KEYS.filter(k => k in store).map(k => [k, store[k]]);
    else if (type === 'localStorage') {
      entries = [];
      for (let i = 0; i < store.length; i++) { const k = store.key(i); if (k) entries.push([k, store.getItem(k)]); }
    } else entries = Object.entries(store);
    return entries
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([key, value]) => ({ key, value, size: byteSize(value) }))
      .sort((a, b) => b.size - a.size);
  }
  function readValue(type, key) {
    const store = getStore(type);
    if (!store) return undefined;
    return type === 'localStorage' ? store.getItem(key) : store[key];
  }
  function syncCharacterField(key) {
    if (!playerReady() || typeof ServerAccountUpdate === 'undefined') throw new Error(t('playerMissing'));
    const payload = {};
    if (key === 'Appearance') {
      if (typeof ServerAppearanceBundle !== 'function') throw new Error('ServerAppearanceBundle unavailable');
      payload.Appearance = ServerAppearanceBundle(Player.Appearance);
      payload.AssetFamily = Player.AssetFamily;
    } else payload[key] = Player[key];
    ServerAccountUpdate.QueueData(payload, true);
  }
  function syncStore(type, key) {
    try {
      if (isChar(type)) { syncCharacterField(key); return; }
      if (type === 'extensionSettings' && typeof ServerPlayerExtensionSettingsSync === 'function') ServerPlayerExtensionSettingsSync(key);
      else if (type === 'onlineSharedSettings' && typeof ServerAccountUpdate !== 'undefined') ServerAccountUpdate.QueueData({ OnlineSharedSettings: Player.OnlineSharedSettings });
    } catch (err) { console.warn('[DA] ' + t('syncFail'), err); throw err; }
  }
  function normalizeCharValue(key, value) {
    if ((key === 'Crafting' || key === 'Wardrobe' || key === 'Appearance') && !Array.isArray(value)) throw new TypeError(key + ' must be an array');
    return value;
  }
  function writeValue(type, key, value) {
    const store = getStore(type);
    if (!store) throw new Error('store unavailable: ' + type);
    if (DANGEROUS_KEYS.has(key)) throw new Error('illegal key: ' + key);
    if (type === 'localStorage') store.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    else if (isChar(type)) {
      if (!CHARACTER_FIELD_KEYS.includes(key)) throw new Error('Forbidden character field: ' + key);
      if (key === 'Appearance' && Array.isArray(value) && value.length && value[0] && 'Group' in value[0] && !('Asset' in value[0])) {
        // 备份里是服务器 bundle 格式 → 用 BC 官方函数还原成可渲染的 Appearance
        // 在原型副本上加载，避免函数直接改 Player 造成不可控副作用
        if (typeof ServerAppearanceLoadFromBundle !== 'function') throw new Error('ServerAppearanceLoadFromBundle unavailable');
        const temp = Object.create(Player);
        temp.Appearance = [];
        ServerAppearanceLoadFromBundle(temp, value);
        store.Appearance = temp.Appearance;
      } else {
        store[key] = normalizeCharValue(key, value);
      }
    } else store[key] = value;
    syncStore(type, key);
  }
  function deleteValue(type, key) {
    if (isChar(type)) throw new Error('character fields cannot be deleted');
    const store = getStore(type);
    if (!store) return;
    if (type === 'localStorage') { store.removeItem(key); return; }
    if (!(key in store)) return;
    if (type === 'extensionSettings') { store[key] = null; syncStore(type, key); }
    delete store[key];
    if (type === 'onlineSharedSettings') syncStore(type, key);
  }
  function isHighRisk(type, key) { return isChar(type) && CHARACTER_FIELDS.find(f => f.key === key)?.risk === 'high'; }
  function rowsToObject(rows) { const o = {}; for (const r of rows) o[r.key] = r.value; return o; }
  function accountInfo() {
    return {
      account: (playerReady() && Player.AccountName) || null,
      memberNumber: (playerReady() && Player.MemberNumber) || null,
    };
  }

  /* ═══════════ 导出 / 导入 ═══════════ */
  // 全屏进度动画层：阶段文字 + 进度条 + 数据流
  async function runProgress(stages, onStep) {
    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.id = OVERLAY_ID;
      overlay.innerHTML =
        '<div class="da-progress">' +
        '<div class="da-progress-top"><span class="da-ico">' + ICONS.pulse + '</span><span class="da-progress-title"></span><span class="da-progress-pct">0%</span></div>' +
        '<div class="da-progress-bar"><div class="da-progress-fill"></div></div>' +
        '<div class="da-progress-status"><span class="da-caret">&gt;</span> <span class="da-progress-stage"></span><span class="da-progress-dots"></span></div>' +
        '<div class="da-progress-grid"></div>' +
        '</div>';
      document.body.appendChild(overlay);
      const fill = overlay.querySelector('.da-progress-fill');
      const pct = overlay.querySelector('.da-progress-pct');
      const stageEl = overlay.querySelector('.da-progress-stage');
      const dots = overlay.querySelector('.da-progress-dots');
      let n = 0;
      const total = stages.length;
      const step = async () => {
        if (n >= total) {
          stageEl.textContent = t('phaseDone');
          fill.style.width = '100%'; pct.textContent = '100%';
          await sleep(320);
          overlay.classList.add('da-overlay-out');
          setTimeout(() => overlay.remove(), 300);
          resolve();
          return;
        }
        const label = stages[n];
        stageEl.textContent = label;
        overlay.querySelector('.da-progress-title').textContent = (n === 0 && label === t('phaseParse')) ? t('restoreStarted') : (n === 0 ? t('archiveStarted') : label);
        const target = Math.round(((n + 1) / total) * 100);
        const from = Math.round((n / total) * 100);
        const dur = 230;
        const start = performance.now();
        const animate = (now) => {
          const p = Math.min(1, (now - start) / dur);
          const val = Math.round(from + (target - from) * p);
          fill.style.width = val + '%'; pct.textContent = val + '%';
          if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        dots.textContent = '';
        const dotTimer = setInterval(() => { dots.textContent += '.'; if (dots.textContent.length > 3) dots.textContent = ''; }, 140);
        try { if (onStep) await onStep(n, label); } catch (e) { console.warn('[DA] step error', e); }
        clearInterval(dotTimer);
        await sleep(Math.max(160, dur - 100));
        n++;
        step();
      };
      requestAnimationFrame(() => { overlay.classList.add('da-overlay-in'); step(); });
    });
  }

  // 备份前把角色 Appearance 转成服务器安全 bundle（原始 Player.Appearance 有循环引用，
  // 直接 JSON 会崩；bundle 是 BC 官方可移植格式，恢复时用 ServerAppearanceLoadFromBundle 还原）
  function sanitizeRowsForBackup(type, rows) {
    if (type !== 'character') return rows;
    return rows.map(r => {
      if (r.key !== 'Appearance') return r;
      try {
        if (typeof ServerAppearanceBundle === 'function') {
          return { ...r, value: ServerAppearanceBundle(r.value), bundled: true };
        }
      } catch (e) { console.warn('[DA] Appearance bundle failed', e); }
      return r;
    });
  }

  // 一次性完成保存：picker + createWritable + write + close 全在用户手势链里。
  // 绝不能把 write 拖到动画/定时器之后——那时 transient activation 已丢失，
  // Chrome 会拒绝写入，文件变成 0 字节（用户实际遇到过）。
  async function saveNow(payload, filename) {
    const text = archiveStringify(payload);
    if (typeof window.showSaveFilePicker === 'function') {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{ description: 'BC 归档 JSON', accept: { 'application/json': ['.json'] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(text);
        await writable.close();
        toast(t('savedTo', { path: handle.name }), 'ok');
        return true;
      } catch (err) {
        if (err && err.name === 'AbortError') { toast(t('saveCancelled'), 'warn'); return false; }
        console.warn('[DA] picker failed, fallback to a.download:', err);
      }
    }
    // 降级：普通 a.download
    try {
      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = filename;
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast(t('savedDownload', { name: filename }), 'warn');
      return true;
    } catch (err) {
      toast(t('saveFailed', { err: err.message }), 'error');
      return false;
    }
  }

  // 保存成功后的装饰性动画（不参与写入，纯视觉反馈）
  function showArchiveAnimation(isFull, stages) {
    return runProgress(stages || [t('phaseScan'), t('phaseCollect'), t('phasePack'), t('phaseWrite')]);
  }

  async function backupStore(type, rows, suffix) {
    if (!rows.length) { toast(t('noSelect'), 'warn'); return; }
    const info = accountInfo();
    const payload = Object.assign({ format: FORMAT, version: VERSION, storage: type, createdAt: new Date().toISOString(), tool: 'Data Archive (DA)' }, info, { count: rows.length, data: rowsToObject(sanitizeRowsForBackup(type, rows)) });
    const name = '归档-' + type + '-' + safeFilename(info.account) + '-' + safeFilename(suffix) + '-' + stamp() + '.json';
    const ok = await saveNow(payload, name); // 手势内直接写完
    if (!ok) return;
    showArchiveAnimation(false);
    toast(t('backupDone', { n: rows.length, size: formatBytes(rows.reduce((s, r) => s + r.size, 0)) }), 'ok');
  }

  async function backupAll(selectedTypes) {
    // selectedTypes 为空/undefined 时默认全部四个区域
    const types = Array.isArray(selectedTypes) && selectedTypes.length
      ? STORE_KEYS.filter(k => selectedTypes.includes(k))
      : STORE_KEYS.slice();
    if (!types.length) return;
    const info = accountInfo();
    const data = {};
    let count = 0;
    for (const type of types) {
      const rows = listRows(type);
      data[type] = rowsToObject(sanitizeRowsForBackup(type, rows));
      count += rows.length;
      info[type + 'Count'] = rows.length;
    }
    info.data = data;
    info.areas = types;
    const all = types.length === STORE_KEYS.length;
    const payload = Object.assign({ format: FORMAT, version: VERSION, storage: all ? 'all' : 'partial', createdAt: new Date().toISOString(), tool: 'Data Archive (DA)' }, info);
    const label = all ? '全量' : types.map(x => safeFilename(x)).join('-');
    const ok = await saveNow(payload, '归档-' + label + '-' + safeFilename(info.account) + '-' + stamp() + '.json');
    if (!ok) return;
    showArchiveAnimation(all);
    toast(t('allDone', { n: count, z: types.length }), 'ok');
  }

  function parseBackup(text) {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object') throw new TypeError('invalid backup object');
    const groups = [];
    const toRows = (type, data) => {
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new TypeError('invalid data');
      const entries = Object.entries(data);
      if (entries.some(([k, v]) => !k || DANGEROUS_KEYS.has(k) || v === undefined)) throw new TypeError('illegal keys');
      const safe = isChar(type) ? entries.filter(([k]) => CHARACTER_FIELD_KEYS.includes(k)) : entries;
      return safe.map(([key, value]) => ({ key, value, size: byteSize(value) }));
    };
    if ((parsed.format === FORMAT || parsed.format === LEGACY_FORMAT) && (parsed.version === VERSION || parsed.version === 2 || parsed.version === 1)) {
      if ((parsed.storage === 'all' || parsed.storage === 'partial') && parsed.data && typeof parsed.data === 'object') {
        // all = 四区；partial = 用户自选区域。都按 data 里实际存在的区读取
        for (const type of STORE_KEYS) if (parsed.data[type]) groups.push({ type, rows: toRows(type, parsed.data[type]) });
      } else if (STORE_KEYS.includes(parsed.storage)) groups.push({ type: parsed.storage, rows: toRows(parsed.storage, parsed.data) });
      else throw new TypeError('unknown storage type');
    } else if (parsed.format === 'LCE storage backup' && parsed.version === 2 && DATA_STORE_KEYS.includes(parsed.storage)) {
      groups.push({ type: parsed.storage, rows: toRows(parsed.storage, parsed.data) });
    } else if (parsed.format === 'LCE ExtensionSettings backup' && parsed.version === 1) {
      groups.push({ type: 'extensionSettings', rows: toRows('extensionSettings', parsed.extensionSettings) });
    } else throw new TypeError(t('importInvalid'));
    if (!groups.length || groups.every(g => !g.rows.length)) throw new TypeError(t('importNoData'));
    return { groups, meta: parsed };
  }

  // 导入项校验：返回 { level:'ok'|'warn'|'bad', reasons:[...] }
  function validateRow(type, key, value, meta) {
    const reasons = [];
    let level = 'ok';
    const warn = (msg) => { reasons.push(msg); if (level === 'ok') level = 'warn'; };
    const bad = (msg) => { reasons.push(msg); level = 'bad'; };

    // 账号匹配
    if (meta && meta.account && playerReady() && Player.AccountName && meta.account !== Player.AccountName) {
      warn(t('valAccountMismatch'));
    }
    // 空数据
    if (value === undefined || value === null || value === '') bad(t('valEmpty'));
    // 类型校验（角色字段）
    if (isChar(type)) {
      const def = CHARACTER_FIELDS.find(f => f.key === key);
      if (!def) bad(t('valTypeBad') + ' (unknown field)');
      else if ((key === 'Crafting' || key === 'Wardrobe' || key === 'Appearance') && !Array.isArray(value)) bad(t('valTypeBad'));
      else if (key === 'Money' && typeof value !== 'number') bad(t('valTypeBad'));
      else if ((key === 'WhiteList' || key === 'BlackList' || key === 'Reputation' || key === 'Lovership' || key === 'SavedColors') && !Array.isArray(value)) bad(t('valTypeBad'));
    }
    // 体积异常（超过 20MB 视为可疑）
    if (byteSize(value) > 20 * 1024 * 1024) warn(t('valHuge'));
    return { level, reasons };
  }

  /* ═══════════ 界面状态 ═══════════ */
  let toolbarRefs = null; // 保存工具栏控件引用，语言切换时刷新文案
  let activeType = STORE_KEYS[0];
  let sortKey = 'size', sortDir = -1;
  const selected = new Set();
  function currentRows() {
    const all = listRows(activeType);
    const q = (document.getElementById(PREFIX + '-search')?.value || '').trim().toLocaleLowerCase();
    const filtered = q ? all.filter(r => r.key.toLocaleLowerCase().includes(q)) : all;
    return filtered.slice().sort((a, b) => {
      const cmp = sortKey === 'name' ? a.key.localeCompare(b.key, undefined, { numeric: true, sensitivity: 'base' }) : a.size - b.size;
      return cmp * sortDir;
    });
  }

  /* ═══════════ 样式（极客终端风）═══════════ */
  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
#${PANEL_ID}{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;width:min(1140px,95vw);height:min(800px,92vh);display:flex;flex-direction:column;overflow:hidden;border:1px solid #3d6ea3;border-radius:8px;background:#0b1424;color:#c9d9ef;box-shadow:0 0 0 1px #5b9bd522,0 0 60px #0a1a3055,0 30px 90px #000e;font:13px/1.5 'JetBrains Mono','SF Mono','Cascadia Code',ui-monospace,SFMono-Regular,Consolas,Menlo,monospace}
#${PANEL_ID} *{box-sizing:border-box}
#${PANEL_ID}::before{content:'';position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(#1e3a5f18 1px,transparent 1px),linear-gradient(90deg,#1e3a5f18 1px,transparent 1px);background-size:28px 28px;z-index:0}
#${PANEL_ID}>*{position:relative;z-index:1}
.da-head{display:flex;align-items:center;gap:14px;flex:none;height:66px;padding:0 20px;border-bottom:1px solid #1e3a5f;background:linear-gradient(90deg,#0f1e33,#0b1424)}
.da-brand{display:flex;align-items:center;gap:12px}
.da-brand-img{width:38px;height:38px;border-radius:8px;border:1px solid #3d6ea3}
.da-brand-txt{display:flex;flex-direction:column;line-height:1.2}
.da-brand-name{font-size:17px;font-weight:700;color:#e6f3ff;letter-spacing:.5px}
.da-brand-name em{font-style:normal;color:#7db8e8}
.da-brand-sub{font-size:10px;color:#6f8bb0;letter-spacing:1.2px;text-transform:uppercase}
.da-head-spacer{flex:1}
.da-lang{display:flex;align-items:center;gap:6px;padding:5px 9px;border:1px solid #274563;border-radius:5px;background:#0d1a2c;color:#8fb4d8;font:inherit;font-size:11px;cursor:pointer;transition:.15s}
.da-lang:hover{border-color:#5b9bd5;color:#bfe0ff}
.da-lang .da-ico{display:flex;color:#7db8e8}
.da-lang select{border:0;background:transparent;color:inherit;font:inherit;outline:none;cursor:pointer}
.da-lang select option{background:#0d1a2c;color:#c9d9ef}
.da-icon-btn{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border:1px solid #274563;border-radius:5px;background:#0d1a2c;color:#8fb4d8;cursor:pointer;transition:.15s}
.da-icon-btn:hover{border-color:#ff6b7a;color:#ff8a96;background:#2a1620}
.da-tabs{display:flex;gap:2px;flex:none;padding:0 16px;border-bottom:1px solid #1e3a5f;background:#0a1220}
.da-tab{position:relative;display:flex;align-items:center;gap:8px;padding:13px 16px;border:0;background:transparent;color:#6f8bb0;font:inherit;font-size:12px;cursor:pointer;transition:.18s}
.da-tab .da-ico{opacity:.7}
.da-tab:hover{color:#bfe0ff;background:#112036}
.da-tab.active{color:#7db8e8;text-shadow:0 0 12px #5b9bd566}
.da-tab.active .da-ico{opacity:1}
.da-tab.active::after{content:'';position:absolute;left:12px;right:12px;bottom:0;height:2px;background:#5b9bd5;box-shadow:0 0 10px #5b9bd5}
.da-hint{flex:none;padding:8px 20px;background:#0d1c30;border-bottom:1px solid #1a3352;color:#7f9dc0;font-size:11px;line-height:1.5}
.da-hint::before{content:'// ';color:#4a7fb5}
.da-toolbar{display:flex;align-items:center;gap:10px;flex:none;padding:12px 18px;background:#0a1322;flex-wrap:wrap;border-bottom:1px solid #162b45}
.da-search{flex:1;min-width:180px;padding:9px 12px 9px 34px;border:1px solid #274563;border-radius:5px;background:#070f1c;color:#c9d9ef;font:inherit;font-size:12px;outline:none;transition:.15s;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236f8bb0' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='M16.5 16.5L21 21'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:10px center;background-size:15px}
.da-search:focus{border-color:#5b9bd5;box-shadow:0 0 0 2px #5b9bd522;color:#e6f3ff}
.da-btn{display:inline-flex;align-items:center;gap:7px;min-height:34px;padding:6px 13px;border:1px solid #2b4c70;border-radius:5px;background:#112036;color:#b8d2ec;font:inherit;font-size:12px;cursor:pointer;white-space:nowrap;transition:.16s;position:relative;overflow:hidden}
.da-btn:hover:not(:disabled){border-color:#5b9bd5;color:#e6f3ff;background:#162a45;box-shadow:0 0 14px #5b9bd522}
.da-btn:active:not(:disabled){transform:translateY(1px)}
.da-btn:disabled{opacity:.35;cursor:not-allowed}
.da-btn-primary{border-color:#3d7fc0;background:linear-gradient(180deg,#1b4a7a,#123660);color:#dcefff}
.da-btn-primary:hover:not(:disabled){border-color:#7db8e8;background:linear-gradient(180deg,#245c96,#174271)}
.da-btn-ok{border-color:#2e7d5b;background:linear-gradient(180deg,#164a36,#0f3527);color:#b8f0d4}
.da-btn-ok:hover:not(:disabled){border-color:#4fd39a;background:linear-gradient(180deg,#1c6146,#124331)}
.da-btn-danger{border-color:#8a3542;background:linear-gradient(180deg,#4a1c26,#33141c);color:#ffb3bd}
.da-btn-danger:hover:not(:disabled){border-color:#ff6b7a;background:linear-gradient(180deg,#66232f,#481822)}
.da-ico{display:inline-flex;align-items:center;justify-content:center}
.da-ico svg{display:block}
.da-list{flex:1;overflow:auto;padding:8px 18px 18px;scrollbar-width:thin;scrollbar-color:#2b4c70 transparent}
.da-list::-webkit-scrollbar{width:8px;height:8px}
.da-list::-webkit-scrollbar-thumb{background:#2b4c70;border-radius:4px}
.da-columns,.da-row{display:grid;grid-template-columns:40px minmax(180px,1fr) 100px 260px;gap:12px;align-items:center}
.da-columns{position:sticky;top:0;z-index:2;padding:8px 12px;background:#0d1a2c;border:1px solid #1e3a5f;border-radius:5px 5px 0 0;color:#6f8bb0;font-size:11px;letter-spacing:1px;text-transform:uppercase}
.da-sort{padding:4px 8px;border:1px solid #274563;border-radius:4px;background:#0a1626;color:#8fb4d8;font:inherit;font-size:11px;cursor:pointer;transition:.15s}
.da-sort:hover{border-color:#5b9bd5;color:#bfe0ff}
.da-sort-size{justify-self:end}
.da-batch{display:flex;justify-content:flex-end;gap:8px}
.da-batch .da-btn{min-height:26px;padding:3px 8px;font-size:11px}
.da-row{min-height:46px;padding:6px 12px;margin:6px 0;border:1px solid #1a3352;border-left:2px solid #2b4c70;border-radius:4px;background:#0d1829;transition:.16s;position:relative}
.da-row:hover{background:#112038;border-left-color:#5b9bd5;border-color:#2b4c70;transform:translateX(2px)}
/* 自定义极客风勾选框：去原生外观，画方框+勾号，保留 input 原生行为 */
.da-check{appearance:none;-webkit-appearance:none;position:relative;flex-shrink:0;width:17px;height:17px;margin:0;border:1.5px solid #3d6ea3;border-radius:3px;background:#0b1728;cursor:pointer;transition:border-color .15s,background .15s,box-shadow .15s}
.da-check:hover{border-color:#7db8e8;background:#12243a}
.da-check:checked{border-color:#5b9bd5;background:linear-gradient(150deg,#2a6ea8,#173f66);box-shadow:0 0 0 1px #5b9bd544,inset 0 0 8px #7db8e844}
.da-check:checked::after{content:'';position:absolute;left:4px;top:1px;width:6px;height:11px;border:solid #eaf6ff;border-width:0 2px 2px 0;transform:rotate(45deg)}
.da-check:focus-visible{outline:2px solid #7db8e8;outline-offset:2px}
.da-check:disabled{opacity:.4;cursor:not-allowed;border-color:#2b4c70}
.da-check:disabled:checked{background:#2b4c70}
.da-row input[type=checkbox]{width:17px;height:17px;margin:0}
.da-key{font-family:inherit;overflow-wrap:anywhere;font-size:12px}
.da-field-label{font-size:12px;font-weight:600;color:#dceaff}
.da-field-raw{font-size:10px;color:#5f7a9c;margin-top:2px}
.da-risk{display:inline-block;font-size:9px;padding:1px 5px;border:1px solid #a86a2a;border-radius:3px;background:#3a2812;color:#ffcf8a;margin-left:6px;letter-spacing:.5px}
.da-val{display:inline-block;font-size:9px;padding:1px 5px;border-radius:3px;margin-left:5px;letter-spacing:.5px}
.da-val-ok{border:1px solid #2e7d5b;background:#12301f;color:#8ee6b8}
.da-val-warn{border:1px solid #a86a2a;background:#3a2812;color:#ffcf8a}
.da-val-bad{border:1px solid #a33131;background:#3a1414;color:#ff9d9d}
.da-imp-reason{font-size:10px;color:#ffb3bd;margin-top:4px}
.da-imp-row.da-imp-bad{opacity:.55}
.da-confirm-list{max-height:180px;overflow:auto;margin:10px 0;padding:8px 10px;border:1px solid #274563;border-radius:4px;background:#070f1c;font-size:11px;color:#b8d2ec}
.da-confirm-list div{padding:2px 0}
.da-scope-list{padding:10px 18px;display:flex;flex-direction:column;gap:8px}
.da-scope-item{display:flex;align-items:center;gap:12px;padding:11px 13px;border:1px solid #1a3352;border-left:2px solid #2b4c70;border-radius:4px;background:#0d1829;cursor:pointer;transition:.15s}
.da-scope-item:hover{border-left-color:#5b9bd5;background:#112038}
.da-scope-item input{width:17px;height:17px;margin:0;flex-shrink:0}
.da-scope-info{display:flex;flex-direction:column;gap:2px;flex:1}
.da-scope-name{font-size:13px;font-weight:600;color:#dceaff}
.da-scope-desc{font-size:10px;color:#7f9dc0}
.da-scope-size{font-size:11px;color:#8fb4d8;font-variant-numeric:tabular-nums}
.da-size{text-align:right;color:#8fb4d8;font-variant-numeric:tabular-nums;font-size:12px}
.da-actions{display:flex;justify-content:flex-end;gap:8px}
.da-actions .da-btn{min-height:27px;padding:3px 9px;font-size:11px}
.da-summary{flex:none;padding:10px 20px;border-top:1px solid #1e3a5f;background:#0a1220;color:#7f9dc0;font-size:11px;display:flex;gap:18px;align-items:center;flex-wrap:wrap}
.da-summary b{color:#7db8e8;font-weight:600}
.da-summary .da-sep{color:#2b4c70}
.da-empty{padding:70px 20px;text-align:center;color:#5f7a9c;font-size:12px}
.da-empty::before{content:'>_';display:block;color:#3d6ea3;font-size:20px;margin-bottom:12px}
.da-confirm{grid-column:1/-1;display:flex;align-items:center;justify-content:flex-end;gap:8px;padding-top:6px;color:#ffb3bd;font-size:11px}
.da-modal-backdrop{position:fixed;inset:0;z-index:10020;display:flex;align-items:center;justify-content:center;padding:22px;background:#030810d9;backdrop-filter:blur(2px)}
.da-modal{display:flex;flex-direction:column;width:min(1160px,100%);max-height:100%;height:min(760px,100%);overflow:hidden;border:1px solid #3d6ea3;border-radius:6px;background:#0b1424;box-shadow:0 0 40px #0a1a3066,0 20px 60px #000}
.da-modal-head{padding:14px 18px;border-bottom:1px solid #1e3a5f;background:#0f1e33;font-size:14px;font-weight:600;color:#dcefff;flex-shrink:0}
.da-modal-head::before{content:'> ';color:#5b9bd5}
.da-modal-head small{display:block;font-weight:400;font-size:10px;color:#7f9dc0;margin-top:4px;padding-left:16px}
.da-import-list{overflow:auto;flex:1 1 auto;min-height:0;padding:8px 16px}
.da-imp-row{flex-shrink:0}
.da-imp-peek{grid-column:3/-1;display:flex;gap:8px;align-items:center;min-width:0;cursor:pointer;padding:4px 6px;border-radius:3px}
.da-imp-peek:hover{background:#0e1c30}
.da-imp-peek span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:10px/1.6 inherit;color:#7f9dc0}
.da-imp-diff{font-size:9px;padding:2px 6px;border-radius:3px;border:1px solid #2b4c70;color:#7db8e8;white-space:nowrap}
.da-imp-diff.changed{border-color:#a86a2a;color:#ffcf8a}
.da-imp-detail{grid-column:3/-1;display:none;margin-top:6px}
.da-imp-row.expanded .da-imp-detail{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.da-imp-row.expanded .da-imp-peek{display:none}
.da-imp-cols,.da-imp-row{display:grid;grid-template-columns:40px 150px minmax(180px,1fr) minmax(180px,1fr);gap:10px;align-items:start}
.da-imp-cols{position:sticky;top:-8px;z-index:1;padding:8px;background:#0d1a2c;border-bottom:1px solid #1e3a5f;color:#6f8bb0;font-size:11px;letter-spacing:1px;text-transform:uppercase}
.da-imp-row{padding:10px 8px;border-bottom:1px solid #162b45}
.da-imp-row:hover{background:#0e1c30}
.da-imp-row input[type=checkbox]{width:17px;height:17px;margin:2px 0 0;flex-shrink:0}
.da-imp-type{font-size:9px;padding:2px 6px;border:1px solid #2b4c70;border-radius:3px;color:#7db8e8;width:max-content;letter-spacing:.5px}
.da-imp-key{font-size:11px;overflow-wrap:anywhere;margin-top:5px;color:#dceaff;cursor:pointer}
.da-imp-key:hover{color:#8fc5f0}
.da-imp-val{max-height:100px;overflow:auto;margin:0;padding:8px;border:1px solid #162b45;border-left:2px solid #2b4c70;border-radius:3px;background:#070f1c;white-space:pre-wrap;overflow-wrap:anywhere;font:10px/1.5 inherit;color:#9db8d6}
.da-imp-val.new{border-left-color:#2e7d5b;background:#0a1c16;color:#a8e6c6}
.da-modal-actions{display:flex;align-items:center;gap:10px;padding:12px 18px;border-top:1px solid #1e3a5f;background:#0a1220;flex-shrink:0;position:sticky;bottom:0;z-index:3}
.da-modal-actions .da-count{margin-right:auto;color:#8fb4d8;font-size:11px}
#${TOAST_ID}{position:fixed;right:22px;bottom:92px;z-index:10010;display:flex;flex-direction:column;gap:8px;pointer-events:none}
.da-toast{display:flex;align-items:center;gap:9px;padding:11px 15px;border:1px solid #2b4c70;border-left:3px solid #5b9bd5;border-radius:5px;background:#0f1e33ee;color:#dcefff;font-size:12px;box-shadow:0 8px 24px #0009;animation:da-toast-in .25s ease;max-width:380px}
.da-toast-ok{border-left-color:#4fd39a}.da-toast-ok .da-ico{color:#4fd39a}
.da-toast-err{border-left-color:#ff6b7a}.da-toast-err .da-ico{color:#ff6b7a}
.da-toast-warn{border-left-color:#ffb454}.da-toast-warn .da-ico{color:#ffb454}
.da-toast-out{opacity:0;transform:translateX(20px);transition:.3s}
@keyframes da-toast-in{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
#${TOOLTIP_ID}{position:fixed;z-index:10030;max-width:340px;padding:10px 13px;border:1px solid #3d6ea3;border-left:3px solid #5b9bd5;border-radius:5px;background:#0d1a2cf5;color:#dcefff;font:12px/1.6 'JetBrains Mono',ui-monospace,Consolas,monospace;box-shadow:0 8px 28px #000b;pointer-events:none;opacity:0;transform:translateY(6px);transition:opacity .16s,transform .16s}
#${TOOLTIP_ID}.da-tip-show{opacity:1;transform:translateY(0)}
#${TOOLTIP_ID}::before{content:'// ';color:#5b9bd5}
.da-has-tip{position:relative}
#${OVERLAY_ID}{position:fixed;inset:0;z-index:10020;display:flex;align-items:center;justify-content:center;background:#030810e8;opacity:0;transition:opacity .25s}
#${OVERLAY_ID}.da-overlay-in{opacity:1}
#${OVERLAY_ID}.da-overlay-out{opacity:0}
.da-progress{position:relative;width:min(520px,90vw);padding:26px 28px;border:1px solid #3d6ea3;border-radius:8px;background:linear-gradient(160deg,#0f1e33,#0a1220);box-shadow:0 0 50px #5b9bd522,0 20px 60px #000;overflow:hidden;transform:scale(.95);transition:transform .3s}
#${OVERLAY_ID}.da-overlay-in .da-progress{transform:scale(1)}
.da-progress-grid{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(#1e3a5f1a 1px,transparent 1px),linear-gradient(90deg,#1e3a5f1a 1px,transparent 1px);background-size:22px 22px}
.da-progress-top{display:flex;align-items:center;gap:10px;margin-bottom:18px;color:#7db8e8}
.da-progress-title{font-size:14px;font-weight:600;color:#dcefff;letter-spacing:1px}
.da-progress-pct{margin-left:auto;font-size:16px;color:#7db8e8;font-variant-numeric:tabular-nums}
.da-progress-bar{height:6px;border:1px solid #274563;border-radius:3px;background:#070f1c;overflow:hidden;position:relative}
.da-progress-fill{height:100%;width:0;background:linear-gradient(90deg,#2b6ea8,#5b9bd5,#7db8e8);box-shadow:0 0 12px #5b9bd5;transition:width .12s linear;position:relative}
.da-progress-fill::after{content:'';position:absolute;right:0;top:0;bottom:0;width:30px;background:linear-gradient(90deg,transparent,#bfe0ff88)}
.da-progress-status{margin-top:18px;font-size:12px;color:#8fb4d8;min-height:20px;position:relative}
.da-caret{color:#5b9bd5}
.da-progress-dots{color:#5b9bd5}
@keyframes da-sheen{0%{background-position:0 -100%}100%{background-position:0 200%}}
@media(max-width:820px){#${PANEL_ID}{width:96vw;height:94vh}.da-columns,.da-row{grid-template-columns:34px 1fr auto}.da-columns>:nth-child(3),.da-size{display:none}.da-columns>:nth-child(4),.da-actions{grid-column:2/-1}.da-imp-cols,.da-imp-row{grid-template-columns:34px 1fr}.da-imp-cols>:nth-child(n+3),.da-imp-val{grid-column:2}.da-imp-cols>:nth-child(n+3){display:none}.da-brand-sub{display:none}}
`;
    document.head.appendChild(style);
  }

  /* ═══════════ 面板渲染 ═══════════ */
  function render() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    const host = panel.querySelector('.da-list');
    const tabs = panel.querySelector('.da-tabs');
    const hint = panel.querySelector('.da-hint');
    const summary = panel.querySelector('.da-summary');

    const brandName = panel.querySelector('.da-brand-name');
    if (brandName) brandName.innerHTML = t('brand') + ' <em>· DA</em>';
    const brandSub = panel.querySelector('.da-brand-sub');
    if (brandSub) brandSub.textContent = t('brandFull');

    // 语言切换时刷新工具栏 / 语言框文案
    if (toolbarRefs) {
      toolbarRefs.search.placeholder = t('search');
      toolbarRefs.backupAll.querySelector('span:last-child').textContent = t('backupAll');
      toolbarRefs.import.querySelector('span:last-child').textContent = t('import');
      toolbarRefs.langSel.title = t('langLabel');
      panel.setAttribute('aria-label', t('brandFull'));
    }

    tabs.replaceChildren();
    for (const store of STORES) {
      const tab = makeButton(storeLabel(store.key), 'da-tab' + (store.key === activeType ? ' active' : ''), () => {
        if (store.key === activeType) return;
        activeType = store.key; selected.clear();
        const s = document.getElementById(PREFIX + '-search'); if (s) s.value = '';
        render();
      }, store.icon);
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(store.key === activeType));
      tabs.appendChild(tab);
    }
    hint.textContent = t('hint_' + activeType);

    const all = listRows(activeType);
    const visible = currentRows();
    for (const key of [...selected]) if (!all.some(r => r.key === key)) selected.delete(key);

    const total = all.reduce((s, r) => s + r.size, 0);
    summary.replaceChildren();
    const mk = (label, value) => {
      const span = document.createElement('span'); span.textContent = label + ' ';
      const b = document.createElement('b'); b.textContent = value; span.appendChild(b); return span;
    };
    summary.append(mk(t('summary') + ':', storeLabel(activeType)), mk(t('total') + ':', all.length + ' ' + t('items') + ' / ' + formatBytes(total)), mk(t('selected') + ':', String(selected.size)));
    const sep = document.createElement('span'); sep.className = 'da-sep'; sep.textContent = '│'; summary.appendChild(sep);
    const note = document.createElement('span');
    note.textContent = isChar(activeType) ? t('noteChar') : t('noteData');
    summary.appendChild(note);

    host.replaceChildren();
    const cols = document.createElement('div'); cols.className = 'da-columns';
    const selectAllLabel = document.createElement('label'); selectAllLabel.style.display = 'flex';
    const selectAll = document.createElement('input'); selectAll.type = 'checkbox'; selectAll.className = 'da-check';
    selectAll.checked = visible.length > 0 && visible.every(r => selected.has(r.key));
    selectAll.title = t('selectAll');
    selectAll.addEventListener('change', () => {
      for (const r of visible) selectAll.checked ? selected.add(r.key) : selected.delete(r.key);
      render();
    });
    selectAllLabel.appendChild(selectAll); cols.appendChild(selectAllLabel);

    const sortBtn = (key, label, cls) => {
      const arrow = sortKey === key ? (sortDir > 0 ? '▲' : '▼') : '⇅';
      return makeButton(label + ' ' + arrow, 'da-sort ' + (cls || ''), () => {
        if (sortKey === key) sortDir *= -1; else { sortKey = key; sortDir = key === 'name' ? 1 : -1; }
        render();
      });
    };
    cols.appendChild(sortBtn('name', t('colName')));
    cols.appendChild(sortBtn('size', t('colSize'), 'da-sort-size'));

    const batch = document.createElement('div'); batch.className = 'da-batch';
    const backupSel = makeButton(t('backupSelected'), '', () => {
      const rows = all.filter(r => selected.has(r.key));
      if (!rows.length) return toast(t('noSelect'), 'warn');
      backupStore(activeType, rows, 'selected');
    }, 'download', t('tipBackup'));
    backupSel.disabled = selected.size === 0;
    batch.appendChild(backupSel);
    if (isChar(activeType)) {
      const tip = document.createElement('span'); tip.style.cssText = 'opacity:.55;font-size:10px'; tip.textContent = t('noDeleteChar');
      batch.appendChild(tip);
    } else {
      const delSel = makeButton(t('deleteSelected'), 'da-btn-danger', () => {
        const rows = all.filter(r => selected.has(r.key));
        if (!rows.length) return;
        showConfirmDialog(
          t('confirmDelete'),
          t('confirmDeleteSel', { n: rows.length }),
          rows.map(r => storeLabel(activeType) + ' / ' + r.key),
          null,
          () => {
            for (const r of rows) deleteValue(activeType, r.key);
            selected.clear(); render(); toast(t('deleted', { n: rows.length }), 'warn');
          }
        );
      }, 'trash', t('tipDelete'));
      delSel.disabled = selected.size === 0;
      batch.appendChild(delSel);
    }
    cols.appendChild(batch); host.appendChild(cols);

    if (!visible.length) {
      const empty = document.createElement('div'); empty.className = 'da-empty';
      empty.textContent = all.length ? t('emptySearch') : t('emptyStore');
      host.appendChild(empty); return;
    }

    for (const row of visible) {
      const card = document.createElement('div'); card.className = 'da-row';
      const cb = document.createElement('input'); cb.type = 'checkbox'; cb.className = 'da-check'; cb.checked = selected.has(row.key);
      cb.title = row.key;
      cb.addEventListener('change', () => { cb.checked ? selected.add(row.key) : selected.delete(row.key); render(); });
      card.appendChild(cb);

      const keyEl = document.createElement('div');
      if (isChar(activeType)) {
        const label = document.createElement('div'); label.className = 'da-field-label'; label.textContent = fieldLabel(row.key);
        const raw = document.createElement('div'); raw.className = 'da-field-raw'; raw.textContent = row.key;
        keyEl.append(label, raw);
        if (isHighRisk(activeType, row.key)) {
          const risk = document.createElement('span'); risk.className = 'da-risk'; risk.textContent = t('riskHigh'); label.appendChild(risk);
        }
      } else { keyEl.className = 'da-key'; keyEl.textContent = row.key; }
      keyEl.title = row.key; card.appendChild(keyEl);

      const sizeEl = document.createElement('div'); sizeEl.className = 'da-size'; sizeEl.textContent = formatBytes(row.size); card.appendChild(sizeEl);

      const actions = document.createElement('div'); actions.className = 'da-actions';
      actions.appendChild(makeButton(t('backup'), '', () => backupStore(activeType, [row], row.key), 'download', t('tipBackup')));
      if (!isChar(activeType)) {
        actions.appendChild(makeButton(t('delete'), 'da-btn-danger', () => {
          if (card.querySelector('.da-confirm')) return;
          const confirm = document.createElement('div'); confirm.className = 'da-confirm';
          const warn = document.createElement('span'); warn.textContent = t('confirmDeleteOne', { key: row.key });
          confirm.append(warn,
            makeButton(t('cancel'), '', () => confirm.remove()),
            makeButton(t('confirmDelete'), 'da-btn-danger', () => {
              deleteValue(activeType, row.key); selected.delete(row.key); render(); toast(t('deleted', { n: 1 }), 'warn');
            }));
          card.appendChild(confirm);
        }, 'trash', t('tipDelete')));
      }
      card.appendChild(actions); host.appendChild(card);
    }
  }

  /* ═══════════ 导入预览弹窗 ═══════════ */
  // 通用极客风确认弹窗（替代原生 window.confirm，风格统一、不阻塞 CDP）
  function showConfirmDialog(title, intro, itemLines, warnText, onConfirm) {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    const bd = document.createElement('div'); bd.className = 'da-modal-backdrop'; bd.style.zIndex = '30';
    const m = document.createElement('section'); m.className = 'da-modal'; m.style.width = 'min(620px,100%)';
    const h = document.createElement('div'); h.className = 'da-modal-head'; h.textContent = title;
    const body = document.createElement('div'); body.style.padding = '16px 20px';
    const introEl = document.createElement('div'); introEl.textContent = intro; body.appendChild(introEl);
    if (itemLines && itemLines.length) {
      const lst = document.createElement('div'); lst.className = 'da-confirm-list';
      for (const line of itemLines) { const d = document.createElement('div'); d.textContent = '> ' + line; lst.appendChild(d); }
      body.appendChild(lst);
    }
    if (warnText) {
      const w = document.createElement('div'); w.style.cssText = 'font-size:11px;color:#ff9d9d;line-height:1.6;margin-top:8px';
      w.textContent = warnText; body.appendChild(w);
    }
    const acts = document.createElement('div'); acts.className = 'da-modal-actions';
    acts.append(
      makeButton(t('cancel'), '', () => bd.remove()),
      makeButton(t('confirmDelete'), 'da-btn-danger', () => { bd.remove(); onConfirm(); }, 'trash')
    );
    m.append(h, body, acts); bd.appendChild(m); document.body.appendChild(bd);
  }

  // 归档范围选择弹窗：让用户勾选要打包的区域（默认全选）
  function showScopeDialog() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel || panel.querySelector('.da-scope-backdrop')) return;
    const bd = document.createElement('div'); bd.className = 'da-modal-backdrop da-scope-backdrop'; bd.style.zIndex = '25';
    const m = document.createElement('section'); m.className = 'da-modal'; m.style.width = 'min(560px,100%)';
    const h = document.createElement('div'); h.className = 'da-modal-head';
    h.textContent = t('scopeTitle');
    const intro = document.createElement('small'); intro.textContent = t('scopeIntro'); h.appendChild(intro);
    const lst = document.createElement('div'); lst.className = 'da-scope-list';
    const stats = {};
    for (const type of STORE_KEYS) {
      const rows = listRows(type);
      stats[type] = { n: rows.length, size: rows.reduce((s, r) => s + r.size, 0) };
    }
    for (const store of STORES) {
      const st = stats[store.key];
      const label = document.createElement('label'); label.className = 'da-scope-item';
      const cb = document.createElement('input'); cb.type = 'checkbox'; cb.className = 'da-check'; cb.checked = true; cb.value = store.key;
      const info = document.createElement('div'); info.className = 'da-scope-info';
      const name = document.createElement('div'); name.className = 'da-scope-name'; name.textContent = storeLabel(store.key);
      const desc = document.createElement('div'); desc.className = 'da-scope-desc'; desc.textContent = t('hint_' + store.key);
      info.append(name, desc);
      const size = document.createElement('div'); size.className = 'da-scope-size';
      size.textContent = st.n + ' ' + t('items') + ' / ' + formatBytes(st.size);
      label.append(cb, info, size); lst.appendChild(label);
    }
    const acts = document.createElement('div'); acts.className = 'da-modal-actions';
    const go = makeButton(t('scopeDone'), 'da-btn-primary', async () => {
      const picked = [...lst.querySelectorAll('input:checked')].map(cb => cb.value);
      if (!picked.length) return toast(t('scopeEmpty'), 'warn');
      bd.remove();
      await backupAll(picked);
    }, 'archive');
    acts.append(makeButton(t('cancel'), '', () => bd.remove()), go);
    m.append(h, lst, acts); bd.appendChild(m); document.body.appendChild(bd);
  }

  function showImportDialog(parsed, input) {
    const panel = document.getElementById(PANEL_ID);
    if (!panel || document.querySelector('.da-modal-backdrop')) return;
    const backdrop = document.createElement('div'); backdrop.className = 'da-modal-backdrop';
    const modal = document.createElement('section'); modal.className = 'da-modal';
    const head = document.createElement('div'); head.className = 'da-modal-head';
    head.textContent = t('importTitle');
    const sub = document.createElement('small');
    const acct = parsed.meta?.account ? '（' + parsed.meta.account + '）' : '';
    sub.textContent = t('importSub', { n: parsed.groups.reduce((s, g) => s + g.rows.length, 0), acct });
    head.appendChild(sub);

    const list = document.createElement('div'); list.className = 'da-import-list';
    const cols = document.createElement('div'); cols.className = 'da-imp-cols';
    for (const label of [t('importSelect'), t('importZone'), t('importCurrent'), t('importBackup')]) {
      const span = document.createElement('span'); span.textContent = label; cols.appendChild(span);
    }
    cols.title = t('tipRow');
    list.appendChild(cols);
    const chosen = new Set();
    const genKey = (type, key) => type + '\u0000' + key;
    const validity = new Map(); // id -> validation result

    for (const group of parsed.groups) {
      const zone = storeLabel(group.type);
      for (const row of group.rows) {
        const line = document.createElement('div'); line.className = 'da-imp-row';
        const id = genKey(group.type, row.key);
        const highRisk = isHighRisk(group.type, row.key);
        const v = validateRow(group.type, row.key, row.value, parsed.meta);
        validity.set(id, v);
        if (v.level === 'bad') line.classList.add('da-imp-bad');

        const cb = document.createElement('input'); cb.type = 'checkbox'; cb.className = 'da-check';
        cb.checked = v.level !== 'bad' && !highRisk;
        cb.disabled = v.level === 'bad'; // 异常项禁止导入
        if (cb.checked) chosen.add(id);
        cb.addEventListener('change', () => { cb.checked ? chosen.add(id) : chosen.delete(id); refresh(); });
        line.appendChild(cb);

        const nameWrap = document.createElement('div');
        const tag = document.createElement('div'); tag.className = 'da-imp-type'; tag.textContent = zone;
        const name = document.createElement('div'); name.className = 'da-imp-key';
        const label = isChar(group.type) ? fieldLabel(row.key) : row.key;
        name.textContent = label; name.title = isChar(group.type) ? label + ' (' + row.key + ')' : row.key;
        if (highRisk) { const r = document.createElement('span'); r.className = 'da-risk'; r.textContent = t('riskHigh'); name.appendChild(r); }
        const badge = document.createElement('span');
        badge.className = 'da-val da-val-' + v.level;
        badge.textContent = v.level === 'ok' ? t('valOk') : v.level === 'warn' ? t('valWarn') : t('valBad');
        if (v.reasons.length) bindTip(badge, v.reasons.join('\n'));
        name.appendChild(badge);
        if (v.reasons.length) {
          const reason = document.createElement('div'); reason.className = 'da-imp-reason'; reason.textContent = v.reasons.join('；');
          name.appendChild(reason);
        }
        nameWrap.append(tag, name); line.appendChild(nameWrap);

        // 摘要行（默认显示）：一句话说明这项会不会变化；点整行展开看完整新旧值
        const currentVal = readValue(group.type, row.key);
        const changed = safeStringify(currentVal) !== safeStringify(row.value);
        const peek = document.createElement('div'); peek.className = 'da-imp-peek';
        const peekText = document.createElement('span');
        peekText.textContent = changed
          ? '当前 ' + formatBytes(byteSize(currentVal)) + ' → 备份 ' + formatBytes(byteSize(row.value)) + '（将覆盖）'
          : '与当前一致，无需恢复';
        const diffTag = document.createElement('div');
        diffTag.className = 'da-imp-diff' + (changed ? ' changed' : '');
        diffTag.textContent = changed ? '有变化' : '无变化';
        peek.append(peekText, diffTag);

        const detail = document.createElement('div'); detail.className = 'da-imp-detail';
        const cur = document.createElement('pre'); cur.className = 'da-imp-val'; cur.textContent = preview(currentVal, 700);
        const nw = document.createElement('pre'); nw.className = 'da-imp-val new'; nw.textContent = preview(row.value, 700);
        detail.append(cur, nw);
        line.append(peek, detail);
        // 点名称或摘要展开/收起（不点复选框）
        const toggle = () => line.classList.toggle('expanded');
        name.addEventListener('click', toggle);
        peek.addEventListener('click', toggle);
        list.appendChild(line);
      }
    }

    // 二级确认弹窗（极客风，替换原生 confirm）
    const showSecondConfirm = (picked) => {
      const b2 = document.createElement('div'); b2.className = 'da-modal-backdrop'; b2.style.zIndex = '30';
      const m2 = document.createElement('section'); m2.className = 'da-modal'; m2.style.width = 'min(620px,100%)';
      const h2 = document.createElement('div'); h2.className = 'da-modal-head'; h2.textContent = t('checkTitle');
      const body = document.createElement('div'); body.style.padding = '16px 20px';
      const intro = document.createElement('div'); intro.textContent = t('checkIntro', { n: picked.length }); body.appendChild(intro);
      const list2 = document.createElement('div'); list2.className = 'da-confirm-list';
      for (const row of picked) {
        const d = document.createElement('div');
        const label = row.type === 'character' ? fieldLabel(row.key) : row.key;
        d.textContent = '> ' + storeLabel(row.type) + ' / ' + label + '  (' + formatBytes(row.size) + ')';
        list2.appendChild(d);
      }
      body.appendChild(list2);
      if (parsed.meta?.account && playerReady() && Player.AccountName) {
        const acc = document.createElement('div'); acc.style.cssText = 'font-size:11px;color:#ffb454;margin:8px 0';
        acc.textContent = t('checkAccountLine', { acct: parsed.meta.account, cur: Player.AccountName });
        body.appendChild(acc);
      }
      const warnEl = document.createElement('div'); warnEl.style.cssText = 'font-size:11px;color:#ff9d9d;line-height:1.6';
      warnEl.textContent = t('checkWarn'); body.appendChild(warnEl);
      const acts = document.createElement('div'); acts.className = 'da-modal-actions';
      const cancel2 = makeButton(t('checkCancel'), '', () => b2.remove());
      const confirm2 = makeButton(t('checkConfirm'), 'da-btn-danger', async () => {
        b2.remove();
        backdrop.remove();
        let ok = 0, fail = 0;
        await runProgress([t('phaseParse'), t('phaseVerify'), t('phaseApply')], async (n) => {
          if (n === 2) {
            for (const row of picked) {
              try { writeValue(row.type, row.key, row.value); ok++; }
              catch (err) { console.warn('[DA] ' + t('writeFail'), err); fail++; }
            }
          }
        });
        if (input) input.value = '';
        render();
        toast(t('restoreDone', { ok, fail: fail ? ' / ' + t('writeFail') + ': ' + fail : '' }), fail ? 'warn' : 'ok');
        if (ok && picked.some(p => p.type === 'character')) toast(t('charSynced'), 'warn');
        else if (ok && picked.some(p => p.type !== 'localStorage')) toast(t('acctSynced'), 'warn');
      }, 'upload');
      acts.append(cancel2, confirm2);
      m2.append(h2, body, acts); b2.appendChild(m2); panel.appendChild(b2);
    };

    const actions = document.createElement('div'); actions.className = 'da-modal-actions';
    const count = document.createElement('span'); count.className = 'da-count';
    const importBtn = makeButton(t('confirmRestore'), 'da-btn-ok', () => {
      const picked = [];
      for (const group of parsed.groups) for (const row of group.rows)
        if (chosen.has(genKey(group.type, row.key))) picked.push({ ...row, type: group.type });
      if (!picked.length) return;
      showSecondConfirm(picked);
    }, 'upload');

    const refresh = () => { count.textContent = t('selectedCount', { n: chosen.size }); importBtn.disabled = chosen.size === 0; };
    let expanded = false;
    const expandBtn = makeButton(t('expandAll'), '', () => {
      expanded = !expanded;
      list.querySelectorAll('.da-imp-row').forEach(r => r.classList.toggle('expanded', expanded));
      expandBtn.querySelector('span')?.replaceChildren(document.createTextNode(expanded ? t('collapseAll') : t('expandAll')));
    }, 'check');
    actions.append(count,
      makeButton(t('selectAll'), '', () => {
        for (const group of parsed.groups) for (const row of group.rows) {
          const id = genKey(group.type, row.key);
          if (validity.get(id)?.level === 'bad') continue;
          chosen.add(id);
        }
        list.querySelectorAll('.da-imp-row input[type=checkbox]:not(:disabled)').forEach(cb => { cb.checked = true; });
        refresh();
      }, 'check'),
      expandBtn,
      makeButton(t('cancel'), '', () => { backdrop.remove(); if (input) input.value = ''; }),
      importBtn);
    modal.append(head, list, actions); backdrop.appendChild(modal); document.body.appendChild(backdrop); refresh();
  }

  /* ═══════════ 面板构建 ═══════════ */
  function buildPanel() {
    if (document.getElementById(PANEL_ID)) return;
    injectStyle();
    const panel = document.createElement('section'); panel.id = PANEL_ID;
    panel.setAttribute('aria-label', t('brandFull'));

    const head = document.createElement('header'); head.className = 'da-head';
    const brand = document.createElement('div'); brand.className = 'da-brand';
    const brandImg = document.createElement('img'); brandImg.className = 'da-brand-img'; brandImg.src = ICON_URI; brandImg.alt = 'DA';
    const brandTxt = document.createElement('div'); brandTxt.className = 'da-brand-txt';
    const brandName = document.createElement('div'); brandName.className = 'da-brand-name';
    const brandSub = document.createElement('div'); brandSub.className = 'da-brand-sub';
    brandTxt.append(brandName, brandSub); brand.append(brandImg, brandTxt);
    const spacer = document.createElement('div'); spacer.className = 'da-head-spacer';

    const langBox = document.createElement('label'); langBox.className = 'da-lang';
    const langIcon = document.createElement('span'); langIcon.className = 'da-ico'; langIcon.innerHTML = ICONS.globe; langBox.appendChild(langIcon);
    const langSel = document.createElement('select');
    langSel.title = t('langLabel');
    for (const l of LANGS) {
      const opt = document.createElement('option'); opt.value = l; opt.textContent = LANG_NAMES[l];
      opt.selected = l === currentLang; langSel.appendChild(opt);
    }
    langSel.addEventListener('change', () => setLang(langSel.value));
    langBox.appendChild(langSel);

    const closeBtn = makeButton('', 'da-icon-btn', () => panel.remove(), 'close', 'ESC');
    head.append(brand, spacer, langBox, closeBtn);

    const tabs = document.createElement('nav'); tabs.className = 'da-tabs'; tabs.setAttribute('role', 'tablist');
    const hint = document.createElement('div'); hint.className = 'da-hint';
    const toolbar = document.createElement('div'); toolbar.className = 'da-toolbar';
    const search = document.createElement('input'); search.id = PREFIX + '-search'; search.className = 'da-search';
    search.type = 'search'; search.placeholder = t('search'); search.addEventListener('input', render);
    const backupAllBtn = makeButton(t('backupAll'), 'da-btn-primary', showScopeDialog, 'archive', t('tipBackupAll'));
    const fileInput = document.createElement('input'); fileInput.type = 'file'; fileInput.accept = 'application/json,.json'; fileInput.style.display = 'none';
    const importBtn = makeButton(t('import'), 'da-btn-ok', () => fileInput.click(), 'upload', t('tipImport'));
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files?.[0]; if (!file) return;
      try { showImportDialog(parseBackup(await file.text()), fileInput); }
      catch (err) { console.warn('[DA] ' + t('parseFail'), err); toast(t('invalidBackup', { err: err.message }), 'error'); fileInput.value = ''; }
    });
    toolbar.append(search, backupAllBtn, importBtn, fileInput);
    toolbarRefs = { search, backupAll: backupAllBtn, import: importBtn, langSel };

    const list = document.createElement('div'); list.className = 'da-list';
    const summary = document.createElement('div'); summary.className = 'da-summary';
    panel.append(head, tabs, hint, toolbar, list, summary);
    document.body.appendChild(panel);
    render();
  }

  function togglePanel() {
    if (document.getElementById(PANEL_ID)) document.getElementById(PANEL_ID).remove();
    else buildPanel();
  }

  /* ═══════════ 游戏原生入口注册 ═══════════
   * 人物资料页（bio）→ DOM 按钮（R134 的 menubar），点击后回到房间主界面再开归档面板。
   * 扩展组件设置里的按钮已按用户要求移除。
   */
  let daMod = null; // ModSDK mod 实例

  // 用 ModSDK 注册 mod（BCX 兼容性检查要求 hook 型插件必须注册）
  function ensureMod() {
    if (daMod) return daMod;
    const api = window.bcModSdk;
    if (!api || typeof api.registerMod !== 'function') return null;
    try {
      // modInfo 只放标准字段；allowReplace 必须在第二参数（热注入覆盖必备）
      daMod = api.registerMod(
        {
          name: 'DataArchive',
          fullName: '归档 · DA — BC Backup & Restore',
          version: '2.1.0',
          repository: 'https://github.com/heitaoplay/BC-DataArchive',
          icon: ICON_URI,
        },
        { allowReplace: true }
      );
      console.log('[DA] ModSDK 注册成功');
    } catch (e) {
      console.warn('[DA] ModSDK 注册失败', e);
      daMod = null;
    }
    return daMod;
  }

  // 通过 ModSDK hook 函数（BCX 能识别，不会报 Unknown mod）
  function hookGameFn(name, fn) {
    const mod = ensureMod();
    if (!mod || typeof mod.hookFunction !== 'function') return false;
    try { mod.hookFunction(name, 8, fn); return true; }
    catch (e) { console.warn('[DA] hook ' + name + ' 失败', e); return false; }
  }

  function openFromGame() {
    // 从设置页/资料页回到房间主界面，避免面板叠在其他界面上
    // 用 CommonSetScreen 直接切到聊天室（PreferenceExit 在部分打包版本里不切屏）
    try {
      if (typeof CommonSetScreen === 'function') CommonSetScreen('Online', 'ChatRoom');
      else if (typeof PreferenceExit === 'function') PreferenceExit();
    } catch (_) {
      try { if (typeof PreferenceExit === 'function') PreferenceExit(); } catch (_) {}
    }
    setTimeout(() => { if (!document.getElementById(PANEL_ID)) buildPanel(); }, 120);
  }

  function registerGameEntries() {
    // ── 移除扩展组件设置里的按钮 ──
    // 只保留人物资料页入口；主动删掉旧注册，热注入时也能即时消失
    try {
      if (typeof PreferenceExtensionsSettings === 'object' && PreferenceExtensionsSettings['DataArchive']) {
        delete PreferenceExtensionsSettings['DataArchive'];
        console.log('[DA] 已移除扩展组件设置按钮');
      }
    } catch (e) { console.warn('[DA] 移除设置按钮失败', e); }

    // ── 资料页按钮：R134 用 DOM menubar，照 BCX 的做法插 DOM 按钮 ──
    // 老版本靠 canvas DrawButton + MouseIn，R134 已改成 DOM，canvas 按钮会被盖住点不到
    const viewingSelf = () => {
      try {
        return typeof InformationSheetSelection !== 'undefined' &&
          (InformationSheetSelection === Player.MemberNumber || InformationSheetSelection?.MemberNumber === Player.MemberNumber);
      } catch (_) { return false; }
    };

    // 从容器的 font-size（BC 的响应式基准）算按钮尺寸，避免按钮自身默认字体把 em 变成 16px
    const applyProfileButtonSize = (btn, screenEl) => {
      try {
        const em = parseFloat(getComputedStyle(screenEl).fontSize) || 16;
        if (em <= 16) return; // font-size 还没就绪，等下次校正
        const side = Math.round(em);
        btn.style.left = Math.round(em * 0.34) + 'px';
        btn.style.bottom = Math.round(em * 1.25) + 'px';
        btn.style.width = side + 'px';
        btn.style.height = side + 'px';
      } catch (_) {}
    };

    const injectProfileButton = () => {
      try {
        if (!viewingSelf()) return;
        const screenId = (typeof InformationSheetIDs !== 'undefined' && InformationSheetIDs.screen) || 'information-sheet-screen';
        const screenEl = document.getElementById(screenId);
        if (!screenEl) return;
        const BTN_ID = 'da-profile-button';
        const existing = document.getElementById(BTN_ID);
        if (existing) {
          // 已插入过：重新校正尺寸（BC 可能是在插入后才设好容器 font-size）
          applyProfileButtonSize(existing, screenEl);
          return;
        }

        // 手工建一个和原生样式一致的按钮，绝对定位在左下角（不占 menubar，避免插件多了被顶出屏幕）
        const btn = document.createElement('button');
        btn.id = BTN_ID;
        btn.type = 'button';
        btn.className = 'blank-button button button-styling HideOnPopup';
        btn.setAttribute('role', 'menuitem');
        btn.title = currentLang === 'en' ? 'Data Archive — Backup & Restore' : currentLang === 'zh-TW' ? '歸檔 — 資料備份與還原' : '归档 — 数据备份与恢复';
        // 父容器 #information-sheet-screen 是 pointer-events:none（BC 靠 canvas 收点击），
        // 必须给按钮显式 auto，否则真实鼠标点不到（程序 .click() 能触发是假象）。
        // font:inherit 让按钮的 em 跟随容器 font-size（BC 的响应式基准），自动适配各种屏幕。
        btn.style.cssText = 'position:absolute;left:0.34em;bottom:1.25em;width:1em;height:1em;margin:0;z-index:50;pointer-events:auto !important;cursor:pointer;font:inherit;';
        applyProfileButtonSize(btn, screenEl);
        // 容器 font-size 可能在插入后才就绪，下一帧再校正一次
        requestAnimationFrame(() => applyProfileButtonSize(btn, screenEl));
        setTimeout(() => applyProfileButtonSize(btn, screenEl), 200);
        const img = document.createElement('img');
        img.src = ICON_URI; img.className = 'button-image'; img.alt = 'DA';
        img.style.cssText = 'width:100%;height:100%;object-fit:contain;';
        const tip = document.createElement('div');
        tip.className = 'button-tooltip button-tooltip-right';
        tip.textContent = btn.title;
        btn.append(img, tip);
        bindTip(btn, t('tipProfileBtn'));
        btn.addEventListener('click', () => openFromGame());
        screenEl.appendChild(btn);
        console.log('[DA] 资料页按钮已插入（左下角）');
      } catch (e) { console.warn('[DA] 资料页按钮插入失败', e); }
    };

    // R134 资料页按钮是 DOM menubar，用 MutationObserver 监听容器出现即插入（最可靠）
    try {
      const observer = new MutationObserver(() => injectProfileButton());
      observer.observe(document.body, { childList: true, subtree: true });
      // 窗口尺寸变化时重新校正按钮大小/位置
      window.addEventListener('resize', () => {
        const btn = document.getElementById('da-profile-button');
        const screenEl = document.getElementById((typeof InformationSheetIDs !== 'undefined' && InformationSheetIDs.screen) || 'information-sheet-screen');
        if (btn && screenEl) applyProfileButtonSize(btn, screenEl);
      });
      // 立即尝试一次（若已在资料页）
      injectProfileButton();
    } catch (e) { console.warn('[DA] 资料页按钮监听失败', e); }

    // BCX 同款 hook 点也插一次（双保险）
    hookGameFn('InformationSheetLoad', async (args, next) => {
      const r = await next(args);
      injectProfileButton();
      return r;
    });
  }

  // 等游戏核心就绪后注册入口
  function waitAndRegister(attempt) {
    if ((typeof ElementButton === 'object' || typeof ElementWrap === 'function') && !!window.bcModSdk) {
      registerGameEntries();
    } else if (attempt < 60) {
      setTimeout(() => waitAndRegister(attempt + 1), 250);
    }
  }
  waitAndRegister(0);

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const overlay = document.getElementById(OVERLAY_ID);
    if (overlay) return; // 动画进行中不接受关闭
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    const modal = document.querySelector('.da-modal-backdrop');
    if (modal) { modal.remove(); return; }
    panel.remove();
  });
})();
