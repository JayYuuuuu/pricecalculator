# 进货口径混乱修复 - 完整TODO清单

## 问题描述
当前系统存在进货口径混乱问题：在计算保本ROI时，错误地从成本中减去进项税（`effectiveCost - purchaseVAT + fixedCosts`），导致"先加后减"的逻辑混乱。

### 口径总则
系统成本统一采用不含税口径，所有已是不含税的成本项不得再减去进项税，避免重复抵扣和口径混乱。

## 修复目标
将进项税抵扣从成本计算中移除，在税费计算中正确处理，确保计算逻辑清晰准确。  
服务业税率6%为常量，广告费和平台费需先转换为金额再计算进项税，避免税率与金额混用导致计算错误。

## 需要修改的文件和位置

### 1. 核心计算函数 (js/calculator.js)

#### 1.1 保本ROI计算函数 - 第1175行
**文件**: `js/calculator.js`  
**位置**: 第1175行  
**修改前**: 
```javascript
const B = effectiveCost - purchaseVAT + fixedCosts;     // 分子常数项
```
**修改后**: 
```javascript
const B = effectiveCost + fixedCosts;     // 分子常数项：实际进货成本 + 固定成本分摊
```
**优先级**: 🔴 高 - 核心逻辑

#### 1.2 价格计算函数 - 第1056行
**文件**: `js/calculator.js`  
**位置**: 第1056行  
**修改前**: 
```javascript
const numeratorFinal = purchaseCost.effectiveCost - purchaseCost.purchaseVAT + fixedCosts;
```
**修改后**: 
```javascript
const numeratorFinal = purchaseCost.effectiveCost + fixedCosts; // 实际进货成本 + 固定成本分摊
```
**优先级**: 🔴 高 - 核心逻辑

#### 1.3 到手价推演函数 - 第11262行
**文件**: `js/calculator.js`  
**位置**: 第11262行  
**修改前**: 
```javascript
const numeratorFinal = purchaseCost.effectiveCost - purchaseCost.purchaseVAT + fixedCosts;
```
**修改后**: 
```javascript
const numeratorFinal = purchaseCost.effectiveCost + fixedCosts; // 实际进货成本 + 固定成本分摊
```
**优先级**: 🔴 高 - 核心逻辑

#### 1.4 统一利润计算函数 - 第227行
**文件**: `js/calculator.js`  
**位置**: 第227行  
**修改前**: 
```javascript
const totalVATDeduction = purchaseVAT + adVAT + (platformFee * 0.06 / 1.06);
```
**修改后**: 
```javascript
const totalVATDeduction = purchaseVAT + adVAT + (platformFee * 0.06 / 1.06); // 保持不变，但需要验证逻辑，必须确认传入的是金额而非比例
```
**优先级**: 🟡 中 - 需要验证

#### 1.5 销售成本计算函数 - 第1023行
**文件**: `js/calculator.js`  
**位置**: 第1023行  
**修改前**: 
```javascript
const totalVATDeduction = purchaseCost.purchaseVAT + adVAT + platformVAT;
```
**修改后**: 
```javascript
const totalVATDeduction = purchaseCost.purchaseVAT + adVAT + platformVAT; // 保持不变，但需要验证逻辑，必须确认传入的是金额而非比例
```
**优先级**: 🟡 中 - 需要验证

#### 1.6 其他税费计算位置
**文件**: `js/calculator.js`  
**位置**: 第3416行、第6265行、第8146行  
**优先级**: 🟡 中 - 需要验证，确认传入金额非比例

### 2. 简单利润计算器 (simple-profit-calculator.html)

#### 2.1 保本ROI计算 - 第2236行
**文件**: `simple-profit-calculator.html`  
**位置**: 第2236行  
**修改前**: 
```javascript
const B = effectiveCost - purchaseVAT + fixedCosts;
```
**修改后**: 
```javascript
const B = effectiveCost + fixedCosts; // 实际进货成本 + 固定成本分摊
```
**优先级**: 🔴 高 - 核心逻辑

#### 2.2 保本ROI计算 - 第2459行
**文件**: `simple-profit-calculator.html`  
**位置**: 第2459行  
**修改前**: 
```javascript
const B = effectiveCost - purchaseVAT + fixedCosts;
```
**修改后**: 
```javascript
const B = effectiveCost + fixedCosts; // 实际进货成本 + 固定成本分摊
```
**优先级**: 🔴 高 - 核心逻辑

#### 2.3 税费抵扣计算 - 第2210行
**文件**: `simple-profit-calculator.html`  
**位置**: 第2210行  
**修改前**: 
```javascript
const totalVATDeduction = purchaseVAT + adVAT + serviceVATFromTaxInclusive(platformFeeAmount, v);
```
**修改后**: 
```javascript
const totalVATDeduction = purchaseVAT + adVAT + serviceVATFromTaxInclusive(platformFeeAmount, v); // 保持不变，但需要验证逻辑，必须确认传入的是金额而非比例
```
**优先级**: 🟡 中 - 需要验证

#### 2.4 税费抵扣计算 - 第2441行
**文件**: `simple-profit-calculator.html`  
**位置**: 第2441行  
**修改前**: 
```javascript
const totalVATDeduction = purchaseVAT + adVAT + platformVAT;
```
**修改后**: 
```javascript
const totalVATDeduction = purchaseVAT + adVAT + platformVAT; // 保持不变，但需要验证逻辑，必须确认传入的是金额而非比例
```
**优先级**: 🟡 中 - 需要验证

#### 2.5 税费抵扣计算 - 第3697行
**文件**: `simple-profit-calculator.html`  
**位置**: 第3697行  
**修改前**: 
```javascript
const totalVATDeduction = purchaseVAT + adVAT + (platformFeeAmount * v / (1 + v));
```
**修改后**: 
```javascript
const totalVATDeduction = purchaseVAT + adVAT + (platformFeeAmount * v / (1 + v)); // 保持不变，但需要验证逻辑，必须确认传入的是金额而非比例
```
**优先级**: 🟡 中 - 需要验证

### 3. 价格计算页面 (price.html)

#### 3.1 保本ROI计算 - 第1381行
**文件**: `price.html`  
**位置**: 第1381行  
**修改前**: 
```javascript
const B = effectiveCost - purchaseVAT + fixedCosts;
```
**修改后**: 
```javascript
const B = effectiveCost + fixedCosts; // 实际进货成本 + 固定成本分摊
```
**优先级**: 🔴 高 - 核心逻辑

#### 3.2 保本ROI计算 - 第1725行
**文件**: `price.html`  
**位置**: 第1725行  
**修改前**: 
```javascript
const B = effectiveCost - purchaseVAT + fixedCosts;
```
**修改后**: 
```javascript
const B = effectiveCost + fixedCosts; // 实际进货成本 + 固定成本分摊
```
**优先级**: 🔴 高 - 核心逻辑

#### 3.3 税费抵扣计算 - 第1367行
**文件**: `price.html`  
**位置**: 第1367行  
**修改前**: 
```javascript
const totalVATDeduction = purchaseVAT + adVAT + serviceVATFromTaxInclusive(platformFeeAmount, v);
```
**修改后**: 
```javascript
const totalVATDeduction = purchaseVAT + adVAT + serviceVATFromTaxInclusive(platformFeeAmount, v); // 保持不变，但需要验证逻辑，必须确认传入的是金额而非比例
```
**优先级**: 🟡 中 - 需要验证

#### 3.4 税费抵扣计算 - 第1615行
**文件**: `price.html`  
**位置**: 第1615行  
**修改前**: 
```javascript
const totalVATDeduction = purchaseVAT + adVAT + serviceVATFromTaxInclusive(platformFeeAmount, v);
```
**修改后**: 
```javascript
const totalVATDeduction = purchaseVAT + adVAT + serviceVATFromTaxInclusive(platformFeeAmount, v); // 保持不变，但需要验证逻辑，必须确认传入的是金额而非比例
```
**优先级**: 🟡 中 - 需要验证

#### 3.5 税费抵扣计算 - 第1711行
**文件**: `price.html`  
**位置**: 第1711行  
**修改前**: 
```javascript
const totalVATDeduction = purchaseVAT + adVAT + serviceVATFromTaxInclusive(platformFeeAmount, v);
```
**修改后**: 
```javascript
const totalVATDeduction = purchaseVAT + adVAT + serviceVATFromTaxInclusive(platformFeeAmount, v); // 保持不变，但需要验证逻辑，必须确认传入的是金额而非比例
```
**优先级**: 🟡 中 - 需要验证

### 4. 相关文档文件

#### 4.1 算法一致性分析文档
**文件**: `ALGORITHM_CONSISTENCY_ANALYSIS.md`  
**位置**: 第108行、第148行  
**修改前**: 
```markdown
const B = effectiveCost - purchaseVAT + fixedCosts;     // 分子常数项
```
**修改后**: 
```markdown
const B = effectiveCost + fixedCosts;     // 分子常数项：实际进货成本 + 固定成本分摊
```
**优先级**: 🟢 低 - 文档更新

#### 4.2 算法分析文档
**文件**: `ALGORITHM_ANALYSIS.md`  
**位置**: 需要更新相关说明  
**优先级**: 🟢 低 - 文档更新

## 修改优先级分类

### 🔴 高优先级 (必须修改)
- 所有 `B = effectiveCost - purchaseVAT + fixedCosts` 的计算逻辑
- 所有 `numeratorFinal = effectiveCost - purchaseVAT + fixedCosts` 的计算逻辑
- 总计: 8处

### 🟡 中优先级 (需要验证)
- 所有税费抵扣计算逻辑，且必须确认传入的是金额而不是比例
- 验证服务业税率6%常量使用及广告/平台费金额转换正确
- 验证可抵扣与不可抵扣两条分支逻辑
- 总计: 12处

### 🟢 低优先级 (文档更新)
- 相关文档和注释的更新
- 总计: 2-3处

## 修改策略

### 第一阶段：核心逻辑修复
1. 修改 `js/calculator.js` 中的核心计算函数
2. 修改 `simple-profit-calculator.html` 中的保本ROI计算
3. 修改 `price.html` 中的保本ROI计算

### 第二阶段：税费逻辑验证
1. 验证所有税费抵扣计算逻辑，确认传入金额而非比例
2. 确保进项税抵扣在正确的地方处理，服务业税率6%为常量，广告/平台费先转金额再算进项税
3. 验证可抵扣与不可抵扣两条分支的正确性
4. 测试修改后的计算结果

### 第三阶段：文档更新
1. 更新相关算法分析文档
2. 更新注释和说明
3. 验证文档与代码的一致性

## 预期影响

### 数值变化
- **分子常数项 B**: 增加约12.8%（等于商品进项税金额）
- **保本广告占比**: 降低约19.7%
- **保本ROI**: 提高约24.6%

### 业务影响
- 修正后的计算逻辑更符合业务实际
- 进项税抵扣在税费计算中正确处理
- 成本计算更加清晰和准确

## 验证标准
- 保本ROI计算结果合理
- 税费计算逻辑清晰，且所有传入税费抵扣的参数均为金额
- 固定成本仅在一个环节除以E，不得重复计算
- 无"先加后减"的逻辑混乱

## 总结

**总计需要修改**: 约22-25处代码  
**高优先级修改**: 8处  
**中优先级验证**: 12处  
**低优先级更新**: 2-3处  

这是一个中等规模的重构工作，需要仔细规划和测试，确保修改后的系统逻辑清晰、计算准确。

### 验收清单
1. 不再出现 `- purchaseVAT` 的减项计算
2. `totalVATDeduction` 中所有加数均为金额而非比例
3. 使用统一的 `fromTaxInclusive` 辅助函数处理税费转换
4. 可抵扣与不可抵扣分支测试均通过
5. 保本广告占比随退货率单调上升，符合业务预期
6. 默认参数回归测试，ROI约为3.62
