# 利润计算算法修复设计文档

## 1. 概述

### 问题背景
用户提供的正确利润计算算法与系统当前实现存在显著差异，主要体现在：
- 进货成本口径处理不一致
- 税费计算逻辑混乱
- 成本分摊机制不规范
- 变量命名与实际含义不符

### 修复目标
- 统一采用系统参数字段对照表的标准字段名
- 实现与提供的正确算法完全一致的计算逻辑
- 确保所有相关模块的计算结果一致性
- 提高代码可读性和维护性

## 2. 现状分析

### 2.1 当前系统问题

#### 关键问题1：进货成本口径混乱
```javascript
// 当前系统：包含开票成本的"实际成本"
const invoiceCost = costPrice * inputTaxRate;
const totalPurchaseCost = costPrice + invoiceCost;
const effectiveCost = totalPurchaseCost; // 实际是含税成本

// 正确算法：明确区分不含税进价和实际支出
const goodsCost = costPrice * (1 + inputTaxRate); // 进货净成本（不再减进项税）
```

#### 关键问题2：进项税重复抵扣
```javascript
// 当前系统：在effectiveCost中已包含开票成本，又在税费中抵扣purchaseVAT
const purchaseVAT = costPrice * outputTaxRate;
const totalVATDeduction = purchaseVAT + adVAT + platformVAT;

// 正确算法：进项税仅从金额中拆分，不影响成本基数
const inputVAT_goods = costPrice * outputTaxRate; // 因costPrice为不含税
```

#### 关键问题3：成本分摊逻辑不一致
```javascript
// 当前系统：混合处理可退回和不可退回成本
const operationalCost = operationalCostBase / effectiveRate;

// 正确算法：明确区分并按有效率分摊
const fixCost = (shippingCost + shippingInsurance + otherCost) / E;
const adCost = (sellingPrice * adRate) / E;
```

### 2.2 影响范围分析

#### 核心计算函数
- `calculateProfitUnified()` - 统一利润计算函数
- `calculateProfit()` - 主利润计算函数  
- `calculateBreakevenROI()` - 保本ROI计算

#### 相关页面模块
- 利润分析页面（主要）
- 简单利润计算器页面
- 价格计算页面
- 商品清单利润推演弹窗

#### 数据一致性问题
- 不同模块计算结果存在差异
- 进货成本口径不统一
- 税费计算逻辑重复

## 3. 正确算法规范

### 3.1 核心常量定义
```javascript
// 服务类（广告/平台）增值税税率：6%（可抵扣）
const SERVICE_VAT = 0.06;

/** 百分比参数容错：既支持 0.13 也支持 13 */
function pct(x) {
  if (x == null || isNaN(x)) return 0;
  return x > 1 ? x / 100 : x;
}
```

### 3.2 标准参数映射

#### 输入参数标准化
| 正确算法字段 | 系统字段 | 说明 |
|-------------|----------|------|
| `costPrice` | `costPrice` / `profitCostPrice` | 进货价（不含税） |
| `inputTaxRate` | `inputTaxRate` / `profitInputTaxRate` | 开票成本比例 |
| `outputTaxRate` | `outputTaxRate` / `profitOutputTaxRate` | 商品进项税率 |
| `sellingPrice` | `actualPrice` | 售价（含税） |
| `salesTaxRate` | `salesTaxRate` / `profitSalesTaxRate` | 销项税率 |
| `platformRate` | `platformRate` / `profitPlatformRate` | 平台佣金比例 |
| `adRate` | `adRate` / `profitAdRate` | 广告费占比 |
| `shippingCost` | `shippingCost` / `profitShippingCost` | 物流费 |
| `shippingInsurance` | `shippingInsurance` / `profitShippingInsurance` | 运费险 |
| `otherCost` | `otherCost` / `profitOtherCost` | 其他成本 |
| `returnRate` | `returnRate` / `profitReturnRate` | 退货率 |

### 3.3 核心计算逻辑

#### 第一步：参数标准化与有效率计算
```javascript
// 有效率（防守）
const E = Math.max(0, Math.min(1, 1 - returnRate));
if (E === 0) {
  return { profit: -Infinity }; // 无法成交
}
```

#### 第二步：成本计算（不含税口径）
```javascript
const goodsCost = costPrice * (1 + inputTaxRate); // 进货净成本（不再减进项税）
const fixCost = (shippingCost + shippingInsurance + otherCost) / E; // 随发货摊到有效单
const adCost = (sellingPrice * adRate) / E; // 广告费也按发货摊到有效单
const platformCost = sellingPrice * platformRate; // 平台佣金按成交计
```

#### 第三步：税金计算（价内口径）
```javascript
// 销项税额：从含税售价拆出的税额
const outputVAT = sellingPrice * (salesTaxRate / (1 + salesTaxRate));

// 进项税抵扣（金额）：商品 + 广告 + 平台
const inputVAT_goods = costPrice * outputTaxRate; // 因costPrice为不含税
const inputVAT_ad = (sellingPrice * adRate) * (SERVICE_VAT / (1 + SERVICE_VAT));
const inputVAT_platform = platformCost * (SERVICE_VAT / (1 + SERVICE_VAT));
const inputVAT_total = inputVAT_goods + inputVAT_ad + inputVAT_platform;

const netTax = outputVAT - inputVAT_total; // 税负净额
```

#### 第四步：利润计算
```javascript
// 显性成本合计（注意：adCost/platformCost为含税支出）
const totalCost = goodsCost + fixCost + adCost + platformCost;

// 利润（每个有效成交）
const profit = sellingPrice - totalCost - netTax;
```

## 4. 实现方案

### 4.1 核心函数重构

#### 重构calculateProfit函数
```mermaid
graph TD
    A[用户输入] --> B[参数标准化与验证]
    B --> C[计算有效率E]
    C --> D[计算不含税成本goodsCost]
    D --> E[计算分摊成本fixCost/adCost]
    E --> F[计算平台成本platformCost]
    F --> G[计算销项税outputVAT]
    G --> H[计算进项税抵扣inputVAT_total]
    H --> I[计算税负净额netTax]
    I --> J[计算总成本totalCost]
    J --> K[计算最终利润profit]
    K --> L[返回结果对象]
```

#### 标准化返回结果结构
```javascript
return {
  profit,
  breakdown: {
    E, goodsCost, fixCost, adCost, platformCost,
    outputVAT, inputVAT_goods, inputVAT_ad, inputVAT_platform,
    inputVAT_total, netTax, totalCost
  }
};
```

### 4.2 函数接口统一

#### 统一参数接口
所有利润计算相关函数采用相同的参数结构，确保：
- 使用系统参数字段对照表的标准字段名
- 参数类型和单位保持一致
- 支持百分比容错处理

#### 统一返回格式
所有函数返回包含详细breakdown的结果对象，便于调试和验证。

### 4.3 模块间一致性保证

#### calculateProfitUnified函数替换
将现有的`calculateProfitUnified`函数完全替换为符合正确算法的新实现。

#### 其他模块同步更新
- 简单利润计算器的calculateProfit函数
- 价格计算页面的利润计算逻辑
- 商品清单的利润推演逻辑

## 5. 测试验证方案

### 5.1 单元测试用例

#### 基础计算测试
```javascript
// 测试用例1：基础参数
const testCase1 = {
  costPrice: 100,
  inputTaxRate: 0.06,
  outputTaxRate: 0.13,
  sellingPrice: 200,
  salesTaxRate: 0.13,
  platformRate: 0.055,
  adRate: 0.30,
  shippingCost: 2.8,
  shippingInsurance: 1.5,
  otherCost: 2.5,
  returnRate: 0.20
};

// 预期结果验证
const result = calculateProfit(testCase1);
// 验证E = 0.8
// 验证goodsCost = 106
// 验证各项成本分摊正确
// 验证税费计算准确
```

#### 边界条件测试
- 退货率为0%和100%的极端情况
- 各项费率为0的情况
- 高税率和低税率场景

### 5.2 集成测试

#### 模块间一致性测试
验证以下模块的计算结果完全一致：
- 主利润计算页面
- 简单利润计算器
- 商品清单利润推演
- 价格验证弹窗

#### 数据流完整性测试
验证从用户输入到最终结果展示的完整数据流。

## 6. 部署策略

### 6.1 分阶段实施

#### 第一阶段：核心函数修复
- 重构calculateProfit主函数
- 更新calculateProfitUnified函数
- 确保主要利润计算页面正确

#### 第二阶段：其他模块同步
- 更新简单利润计算器
- 修复价格计算页面
- 同步商品清单模块

#### 第三阶段：验证与优化
- 全面测试验证
- 性能优化
- 文档更新

### 6.2 向后兼容性

#### 接口兼容性
保持现有函数的调用接口不变，仅修改内部实现逻辑。

#### 数据兼容性
确保现有的用户数据和配置继续有效。

## 7. 风险控制

### 7.1 主要风险

#### 计算结果变化风险
修复后的计算结果可能与用户之前的计算存在差异，需要：
- 提供详细的变更说明
- 保留旧版本计算结果供对比
- 逐步引导用户适应新的准确计算

#### 系统稳定性风险
大幅度修改核心计算逻辑可能影响系统稳定性：
- 充分的测试验证
- 分阶段部署
- 快速回滚机制

### 7.2 风险缓解措施

#### 详细测试
- 自动化单元测试
- 手工集成测试  
- 用户验收测试

#### 监控机制
- 计算结果异常监控
- 性能指标监控
- 用户反馈收集

## 8. 成功标准

### 8.1 功能完整性
- [ ] 所有利润计算模块使用统一的正确算法
- [ ] 计算结果与提供的正确算法完全一致
- [ ] 所有边界条件处理正确

### 8.2 系统一致性
- [ ] 不同模块间计算结果完全一致
- [ ] 参数字段名称符合系统标准
- [ ] 税费计算逻辑统一规范

### 8.3 代码质量
- [ ] 函数注释与实际逻辑一致
- [ ] 变量命名清晰明确
- [ ] 代码结构清晰易维护

### 8.4 用户体验
- [ ] 计算结果准确可靠
- [ ] 界面显示信息正确
- [ ] 错误处理友好完善