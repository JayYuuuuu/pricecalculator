# 商品清单表格功能修复设计

## 概述

本设计文档旨在修复商品清单表格中的关键计算功能，包括一键重算功能、保本ROI列、保本广告占比列、利润率（20%付费）列以及操作列中的价格验证弹窗和利润推演弹窗的计算函数。基于系统已修复的`calculateProfitUnified()`、`calculateBreakevenROI()`等核心计算函数，确保商品清单模块与其他功能模块计算结果的一致性。

## 问题分析

### 当前问题

1. **一键重算功能**：`recomputeAllCatalogRows()`函数调用的`computeRow()`函数可能使用了过时的计算逻辑
2. **保本ROI列**：显示结果与修复后的`calculateBreakevenROI()`函数计算结果不一致
3. **保本广告占比列**：计算逻辑可能未采用修复后的进项税抵扣方式
4. **利润率（20%付费）列**：未使用统一的`calculateProfitUnified()`函数
5. **价格验证弹窗**：计算过程显示的数据可能基于旧的计算逻辑
6. **利润推演弹窗**：利润推演和到手价推演计算函数需要统一到修复后的算法

### 根本原因

商品清单模块的计算函数没有及时更新到使用系统已修复的核心计算函数，导致计算结果与其他功能模块不一致。

## 技术方案

### 核心修复原则

1. **统一计算源**：所有计算必须基于已修复的核心函数
2. **参数标准化**：使用`getGlobalDefaultsForCatalog()`获取全局默认参数
3. **结果一致性**：确保与"利润计算"、"保本分析"等功能模块计算结果完全一致
4. **多档数据支持**：正确处理单一售价/成本和多档售价/成本的计算

### 修复方案详细设计

#### 1. computeRow 函数修复

**现状**：`computeRow()`函数是商品清单行计算的核心函数，但其内部调用的计算逻辑可能未统一到修复后的算法。

**修复策略**：
```javascript
function computeRowWithCost(std, costPrice) {
    // 构建标准化参数对象
    const inputs = {
        costPrice: costPrice,
        actualPrice: std.salePrice, // 使用含税售价
        inputTaxRate: std.inputTaxRate,
        outputTaxRate: std.outputTaxRate,
        salesTaxRate: std.salesTaxRate,
        platformRate: std.platformRate,
        shippingCost: std.shippingCost,
        shippingInsurance: std.shippingInsurance,
        adRate: 0, // 基础计算不考虑广告费
        otherCost: std.otherCost,
        returnRate: std.returnRate
    };
    
    // 使用统一的利润计算函数
    const profitResult = calculateProfitUnified(inputs);
    
    // 使用统一的保本分析函数
    const roiResult = calculateBreakevenROI({
        costPrice: costPrice,
        inputTaxRate: std.inputTaxRate,
        outputTaxRate: std.outputTaxRate,
        salesTaxRate: std.salesTaxRate,
        platformRate: std.platformRate,
        shippingCost: std.shippingCost,
        shippingInsurance: std.shippingInsurance,
        otherCost: std.otherCost,
        returnRate: std.returnRate,
        finalPrice: std.salePrice
    });
    
    return {
        profit: profitResult.profit,
        profitRate: profitResult.profitRate,
        breakevenROI: roiResult.breakevenROI,
        breakevenAdRate: roiResult.breakevenAdRate
    };
}
```

#### 2. 一键重算功能修复

**现状**：`recomputeAllCatalogRows()`函数遍历所有行并调用`computeRow()`函数。

**修复策略**：
- 确保`computeRow()`函数使用修复后的计算逻辑
- 添加计算性能监控和错误处理
- 统一退货率格式化处理

```javascript
function recomputeAllCatalogRows() {
    const t0 = performance.now();
    let minMs = Infinity, maxMs = 0;
    
    (catalogState.rows || []).forEach((row, idx) => {
        const s = performance.now();
        
        // 使用修复后的计算函数
        const computed = computeRow(row);
        
        const e = performance.now();
        const dt = e - s;
        if (dt < minMs) minMs = dt;
        if (dt > maxMs) maxMs = dt;
        
        catalogState.rows[idx].__result = computed.__result;
        
        // 统一退货率格式化
        formatReturnRateDisplay(catalogState.rows[idx]);
    });
    
    const total = performance.now() - t0;
    console.log(`[一键重算] 完成 ${catalogState.rows.length} 行，耗时: ${total.toFixed(2)}ms，单行范围: ${minMs.toFixed(2)}ms~${maxMs.toFixed(2)}ms`);
    
    // 重新渲染表格
    renderCatalogTable();
    updateCatalogStatus();
    saveCatalogToStorage();
}
```

#### 3. 保本ROI列计算修复

**现状**：表格显示的保本ROI值可能基于旧的计算逻辑。

**修复策略**：
```javascript
function calculateBreakevenROIForRow(row) {
    try {
        const returnRate = parseReturnRate(row.returnRate);
        if (!isFinite(returnRate)) return NaN;
        
        const platformRate = (() => {
            const rate = getPlatformRateByName(row.platform);
            return isFinite(rate) ? rate : 0.055;
        })();
        
        const globals = getGlobalDefaultsForCatalog();
        
        // 处理多档数据
        const salePriceTiers = Array.isArray(row.salePriceTiers) ? 
            row.salePriceTiers.filter(v => isFinite(Number(v)) && Number(v) > 0).map(Number) : [];
        const costTiers = Array.isArray(row.costTiers) ? 
            row.costTiers.filter(v => isFinite(Number(v)) && Number(v) >= 0).map(Number) : [];
        
        // 使用修复后的calculateBreakevenROI函数
        if (salePriceTiers.length === 0 && costTiers.length === 0) {
            const salePrice = Number(row.salePrice) || 0;
            const costPrice = Number(row.costMin) || Number(row.costMax) || 0;
            
            if (salePrice <= 0 || costPrice <= 0) return NaN;
            
            const roiResult = calculateBreakevenROI({
                costPrice: costPrice,
                inputTaxRate: globals.inputTaxRate,
                outputTaxRate: globals.outputTaxRate,
                salesTaxRate: globals.salesTaxRate,
                platformRate: platformRate,
                shippingCost: globals.shippingCost,
                shippingInsurance: globals.shippingInsurance,
                otherCost: globals.otherCost,
                returnRate: returnRate,
                finalPrice: salePrice
            });
            
            return roiResult.breakevenROI;
        }
        
        // 处理多档情况...
        
    } catch (error) {
        console.error('保本ROI计算错误:', error);
        return NaN;
    }
}
```

#### 4. 保本广告占比列修复

**修复策略**：
- 使用修复后的`calculateBreakevenROI()`函数中的`breakevenAdRate`结果
- 添加风险预警标识（低于21%的保本广告占比）
- 统一显示格式和样式

```javascript
// 在renderCatalogRow中修复保本广告占比显示
const formatBreakevenAdRate = (adRate) => {
    if (!isFinite(adRate) || isNaN(adRate)) return '-';
    if (adRate <= 0) return '0%';
    
    const percent = (adRate * 100).toFixed(2) + '%';
    const isDanger = adRate > 0 && adRate < 0.21;
    
    if (isDanger) {
        return `<div style="background:#dc2626; color:#fff; padding:2px 6px; border-radius:4px; font-weight:700; animation:pulse-warning 2s infinite;">⚠️ ${percent}</div>`;
    }
    
    if (adRate >= 1) {
        return `<div style="position:relative; display:inline-block;">${percent}<span title="需≥100%付费占比才保本" style="position:absolute; right:-8px; top:-4px; width:6px; height:6px; background:#ef4444; border-radius:50%;"></span></div>`;
    }
    
    return percent;
};
```

#### 5. 利润率（20%付费）列修复

**现状**：该列显示固定20%付费占比下的利润率，但可能未使用统一的计算函数。

**修复策略**：
```javascript
function calculateProfitRateWith20PercentAd(row) {
    try {
        const globals = getGlobalDefaultsForCatalog();
        const std = mergeGlobalsWithRow(row, globals);
        
        const salePrices = Array.isArray(row.salePriceTiers) && row.salePriceTiers.length > 0 
            ? row.salePriceTiers.map(p => Number(p)).filter(p => isFinite(p) && p > 0)
            : (isFinite(std.salePrice) && std.salePrice > 0 ? [std.salePrice] : []);
        
        const costPrices = Array.isArray(row.costTiers) && row.costTiers.length > 0
            ? row.costTiers.map(c => Number(c)).filter(c => isFinite(c) && c >= 0)
            : (isFinite(std.costMin) && std.costMin > 0 ? [std.costMin] : []);
        
        if (salePrices.length === 0 || costPrices.length === 0) {
            return [];
        }
        
        const profitRates = [];
        
        // 计算多档利润率
        if (salePrices.length > 1 && costPrices.length > 1) {
            const maxTiers = Math.min(salePrices.length, costPrices.length);
            for (let i = 0; i < maxTiers; i++) {
                const inputs = {
                    costPrice: costPrices[i],
                    actualPrice: salePrices[i],
                    inputTaxRate: std.inputTaxRate,
                    outputTaxRate: std.outputTaxRate,
                    salesTaxRate: std.salesTaxRate,
                    platformRate: std.platformRate,
                    shippingCost: std.shippingCost,
                    shippingInsurance: std.shippingInsurance,
                    adRate: 0.20, // 固定20%付费占比
                    otherCost: std.otherCost,
                    returnRate: std.returnRate
                };
                
                // 使用统一的利润计算函数
                const result = calculateProfitUnified(inputs);
                profitRates.push({
                    rate: result.profitRate,
                    tier: `成本¥${costPrices[i].toFixed(2)}-售价¥${salePrices[i].toFixed(2)}`
                });
            }
        } else {
            // 单档计算...
        }
        
        return profitRates;
        
    } catch (error) {
        console.error('利润率计算错误:', error);
        return [];
    }
}
```

#### 6. 价格验证弹窗修复

**现状**：价格验证弹窗显示的计算过程可能基于旧的算法。

**修复策略**：
```javascript
function openPriceValidationModal(row) {
    try {
        const globals = getGlobalDefaultsForCatalog();
        const std = mergeGlobalsWithRow(row, globals);
        
        // 使用统一的计算函数进行验证
        const inputs = {
            costPrice: std.costMin || std.costMax,
            actualPrice: std.salePrice,
            inputTaxRate: std.inputTaxRate,
            outputTaxRate: std.outputTaxRate,
            salesTaxRate: std.salesTaxRate,
            platformRate: std.platformRate,
            shippingCost: std.shippingCost,
            shippingInsurance: std.shippingInsurance,
            adRate: 0,
            otherCost: std.otherCost,
            returnRate: std.returnRate
        };
        
        // 获取详细计算结果
        const detailResult = calculateProfitUnified(inputs);
        const roiResult = calculateBreakevenROI({
            costPrice: inputs.costPrice,
            inputTaxRate: std.inputTaxRate,
            outputTaxRate: std.outputTaxRate,
            salesTaxRate: std.salesTaxRate,
            platformRate: std.platformRate,
            shippingCost: std.shippingCost,
            shippingInsurance: std.shippingInsurance,
            otherCost: std.otherCost,
            returnRate: std.returnRate,
            finalPrice: std.salePrice
        });
        
        // 显示验证结果弹窗
        showPriceValidationResults(row, detailResult, roiResult);
        
    } catch (error) {
        console.error('价格验证错误:', error);
        showToast('价格验证计算失败，请检查输入数据');
    }
}
```

#### 7. 利润推演弹窗修复

**现状**：利润推演弹窗包含"利润推演"和"到手价推演"两个标签页，需要确保计算逻辑统一。

**修复策略**：

##### 利润推演标签页修复
```javascript
function generateProfitScenarioTable(row, costPrice, salePrice) {
    const globals = getGlobalDefaultsForCatalog();
    const std = mergeGlobalsWithRow(row, globals);
    
    // 生成付费占比范围：0% 到 40%，步长 5%
    const adRates = [];
    for (let rate = 0; rate <= 0.40; rate += 0.05) {
        adRates.push(rate);
    }
    
    const results = adRates.map(adRate => {
        const inputs = {
            costPrice: costPrice,
            actualPrice: salePrice,
            inputTaxRate: std.inputTaxRate,
            outputTaxRate: std.outputTaxRate,
            salesTaxRate: std.salesTaxRate,
            platformRate: std.platformRate,
            shippingCost: std.shippingCost,
            shippingInsurance: std.shippingInsurance,
            adRate: adRate,
            otherCost: std.otherCost,
            returnRate: std.returnRate
        };
        
        // 使用统一的利润计算函数
        const result = calculateProfitUnified(inputs);
        
        return {
            adRate: adRate,
            profitRate: result.profitRate,
            profit: result.profit
        };
    });
    
    return results;
}
```

##### 到手价推演标签页修复
```javascript
function generateTakeHomePriceScenario(row, costPrice) {
    const globals = getGlobalDefaultsForCatalog();
    const std = mergeGlobalsWithRow(row, globals);
    
    // 生成付费占比范围：5% 到 40%，步长 5%
    const adRates = [];
    for (let rate = 0.05; rate <= 0.40; rate += 0.05) {
        adRates.push(rate);
    }
    
    // 目标利润率：0%, 3%, 5%, 7%, 9%, 10%, 12%, 15%
    const targetProfitRates = [0, 0.03, 0.05, 0.07, 0.09, 0.10, 0.12, 0.15];
    
    const results = {};
    
    adRates.forEach(adRate => {
        results[adRate] = {};
        
        targetProfitRates.forEach(targetProfitRate => {
            // 使用与到手价推演tab完全一致的计算函数
            const theoreticalParams = {
                inputTaxRate: std.inputTaxRate,
                outputTaxRate: std.outputTaxRate,
                salesTaxRate: std.salesTaxRate,
                platformRate: std.platformRate,
                adRate: adRate,
                returnRate: std.returnRate,
                shippingCost: std.shippingCost,
                shippingInsurance: std.shippingInsurance,
                otherCost: std.otherCost
            };
            
            const takeHomePrice = calculateTheoreticalPrice(
                costPrice, 
                targetProfitRate, 
                theoreticalParams
            );
            
            results[adRate][targetProfitRate] = takeHomePrice;
        });
    });
    
    return results;
}
```

### 错误处理和边界情况

#### 1. 数据验证
```javascript
function validateRowData(row) {
    const errors = [];
    
    if (!row.name || !row.sku || !row.platform) {
        errors.push('商品名称、货号、平台为必填项');
    }
    
    const salePrice = Number(row.salePrice);
    if (!isFinite(salePrice) || salePrice <= 0) {
        errors.push('含税售价必须大于0');
    }
    
    const costPrice = Number(row.costMin) || Number(row.costMax);
    if (!isFinite(costPrice) || costPrice < 0) {
        errors.push('进货价必须大于等于0');
    }
    
    const returnRate = parseReturnRate(row.returnRate);
    if (isFinite(returnRate) && (returnRate < 0 || returnRate > 1)) {
        errors.push('退货率必须在0%到100%之间');
    }
    
    return errors;
}
```

#### 2. 性能优化
```javascript
// 批量计算时使用节流
let batchCalculationTimer = null;

function throttledBatchCalculation() {
    if (batchCalculationTimer) {
        clearTimeout(batchCalculationTimer);
    }
    
    batchCalculationTimer = setTimeout(() => {
        recomputeAllCatalogRows();
        batchCalculationTimer = null;
    }, 300);
}
```

#### 3. 用户体验优化
```javascript
function showCalculationProgress(current, total) {
    const percentage = Math.round((current / total) * 100);
    showToast(`计算进度: ${percentage}% (${current}/${total})`);
}

function showCalculationComplete(duration, rowCount) {
    showToast(`✅ 计算完成！处理 ${rowCount} 行商品，耗时 ${duration.toFixed(2)}ms`);
}
```

## 实施计划

### 阶段一：核心函数修复
1. 修复`computeRow()`和`computeRowWithCost()`函数
2. 更新`recomputeAllCatalogRows()`函数
3. 修复保本ROI和保本广告占比的计算逻辑

### 阶段二：界面更新修复
1. 修复表格列显示逻辑
2. 更新利润率（20%付费）列的计算
3. 优化错误提示和警告标识

### 阶段三：弹窗功能修复
1. 修复价格验证弹窗的计算过程
2. 更新利润推演弹窗的计算函数
3. 完善到手价推演功能

### 阶段四：测试验证
1. 单元测试：验证计算函数的准确性
2. 集成测试：确保与其他模块计算结果一致
3. 用户体验测试：验证界面交互的流畅性

## 验证方案

### 计算一致性验证
1. **对比测试**：使用相同参数在商品清单和利润计算tab中进行计算，验证结果一致性
2. **边界值测试**：测试极端参数情况下的计算稳定性
3. **多档数据测试**：验证多档售价/成本的计算准确性

### 性能验证
1. **批量计算测试**：测试1000+商品的一键重算性能
2. **实时计算测试**：验证输入时的计算响应速度
3. **内存使用监控**：确保没有内存泄漏

### 用户体验验证
1. **操作流畅性**：确保输入框焦点不丢失
2. **错误提示**：验证错误信息的准确性和友好性
3. **视觉反馈**：确保计算状态的及时反馈

## 风险控制

### 向后兼容性
1. **数据格式兼容**：确保现有商品数据能正常加载和计算
2. **接口稳定性**：保持现有函数接口不变，仅更新内部实现
3. **渐进式更新**：支持新旧算法并存，便于回滚

### 错误处理
1. **容错机制**：计算失败时显示错误信息而不是崩溃
2. **数据验证**：输入数据的格式和范围验证
3. **异常恢复**：计算异常时的自动重试机制

### 监控告警
1. **计算性能监控**：跟踪计算耗时和成功率
2. **错误日志记录**：详细记录计算错误信息
3. **用户反馈收集**：收集用户对计算结果的反馈

## 预期效果

### 功能完善度提升
1. **计算准确性**：所有计算结果与系统其他模块完全一致
2. **功能完整性**：一键重算、弹窗功能正常工作
3. **数据可靠性**：多档数据计算准确无误

### 用户体验改善
1. **操作便捷性**：一键重算快速准确
2. **信息透明度**：弹窗详细显示计算过程
3. **错误提示友好**：清晰的错误信息和修复建议

### 系统稳定性增强
1. **计算一致性**：消除不同模块间的计算差异
2. **性能稳定性**：大批量数据处理稳定可靠
3. **维护便利性**：统一的计算逻辑便于后续维护