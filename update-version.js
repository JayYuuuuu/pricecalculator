#!/usr/bin/env node

/**
 * 自动更新示例文件版本号脚本
 * 使用方法：node update-version.js [新版本号]
 * 例如：node update-version.js 1.0.2
 */

const fs = require('fs');
const path = require('path');

// 颜色输出函数
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// 获取当前日期
function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD格式
}

// 更新catalog-samples.js文件中的版本号
function updateCatalogSamplesVersion(newVersion) {
  const filePath = 'js/catalog-samples.js';
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const currentDate = getCurrentDate();
    
    // 更新版本号行
    content = content.replace(
      /\/\/ 版本号：v[\d.]+ \([^)]+\)/,
      `// 版本号：v${newVersion} (${currentDate})`
    );
    
    // 更新版本历史
    const versionHistoryEntry = `// v${newVersion} (${currentDate}) - 更新示例数据`;
    
    // 检查是否已有版本历史
    if (content.includes('// 版本历史：')) {
      // 在版本历史开头添加新版本
      content = content.replace(
        /(\/\/ 版本历史：\n)/,
        `$1${versionHistoryEntry}\n`
      );
    } else {
      // 如果没有版本历史，添加完整的版本历史部分
      content = content.replace(
        /(\/\/ 版本号：v[\d.]+ \([^)]+\))/,
        `$1\n// \n// 版本历史：\n${versionHistoryEntry}\n// v1.0.0 (初始版本) - 基础示例数据`
      );
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    logSuccess(`已更新 ${filePath} 中的版本号为 v${newVersion}`);
    
  } catch (error) {
    logError(`更新 ${filePath} 失败: ${error.message}`);
    return false;
  }
  
  return true;
}

// 更新HTML文件中的版本号
function updateHtmlVersion(newVersion) {
  const filePath = 'index.html';
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 更新script标签中的版本号
    content = content.replace(
      /src="js\/catalog-samples\.js\?v=[^"]*"/g,
      `src="js/catalog-samples.js?v=${newVersion}"`
    );
    
    // 如果没有找到带版本号的引用，添加版本号
    if (!content.includes(`src="js/catalog-samples.js?v=${newVersion}"`)) {
      content = content.replace(
        /src="js\/catalog-samples\.js"/g,
        `src="js/catalog-samples.js?v=${newVersion}"`
      );
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    logSuccess(`已更新 ${filePath} 中的版本号为 v${newVersion}`);
    
  } catch (error) {
    logError(`更新 ${filePath} 失败: ${error.message}`);
    return false;
  }
  
  return true;
}

// 显示更新提醒
function showUpdateReminder(newVersion) {
  logInfo('\n📋 版本更新完成！');
  logInfo(`当前版本：${colors.bright}v${newVersion}${colors.reset}`);
  logInfo(`更新日期：${getCurrentDate()}`);
  
  logWarning('\n⚠️  重要提醒：');
  logWarning('1. 请确保已保存所有文件更改');
  logWarning('2. 刷新浏览器页面以加载新版本');
  logWarning('3. 测试"插入示例"功能是否正常工作');
  
  logInfo('\n🔄 下次更新时，运行以下命令：');
  logInfo(`   node update-version.js 新版本号`);
  logInfo(`   例如：node update-version.js 1.0.2`);
}

// 主函数
function main() {
  // 获取命令行参数
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    logError('请提供新版本号！');
    logInfo('使用方法：node update-version.js [新版本号]');
    logInfo('例如：node update-version.js 1.0.2');
    process.exit(1);
  }
  
  const newVersion = args[0];
  
  // 验证版本号格式
  if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
    logError('版本号格式不正确！');
    logInfo('正确格式：主版本.次版本.修订版本');
    logInfo('例如：1.0.2, 2.1.0, 1.0.10');
    process.exit(1);
  }
  
  logInfo(`开始更新版本号为 v${newVersion}...`);
  
  // 更新文件
  const catalogUpdated = updateCatalogSamplesVersion(newVersion);
  const htmlUpdated = updateHtmlVersion(newVersion);
  
  if (catalogUpdated && htmlUpdated) {
    showUpdateReminder(newVersion);
  } else {
    logError('版本更新失败，请检查文件权限和路径');
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = {
  updateCatalogSamplesVersion,
  updateHtmlVersion,
  getCurrentDate
};
