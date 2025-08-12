// Tab切换功能
function switchTab(tabName) {
    // 隐藏所有tab内容
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 移除所有tab按钮的active状态
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 显示选中的tab内容
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // 设置选中tab按钮的active状态
    event.target.classList.add('active');
    
    // 清空结果区域
    document.getElementById('result').innerHTML = '';
}

/**
 * 计算实际利润的主函数
 * 
 * 重要说明：利润计算模块与售价计算模块的差异
 * 1. 利润计算模块（本函数）
 *    - 目的：计算实际经营的整体利润率
 *    - 原理：基于实际售价，计算所有订单的平均利润率
 *    - 特点：显示的利润率通常会高于售价计算模块的目标利润率
 *    - 例如：如果售价是基于8%目标利润率计算的：
 *      · 由于售价中包含了退货补偿
 *      · 实际利润率可能会达到12-15%
 * 
 * 2. 与售价计算模块的区别
 *    - 利润计算：展示整体业务表现（所有订单的平均结果）
 *    - 售价计算：关注单个有效订单的目标利润（扣除退货影响）
 *    - 差异原因：售价计算模块会提高价格来补偿退货损失
 * 
 * 3. 实际应用说明
 *    - 此模块适合评估实际经营效果
 *    - 可以用来验证定价策略的实际效果
 *    - 帮助理解退货率对整体利润的影响
 *    - 建议同时参考两个模块来制定定价策略
 */
function calculateProfit() {
    try {
        // 获取基础输入
        const costPrice = validateInput(parseFloat(document.getElementById('profitCostPrice').value), 0.01, 1000000, "进货价");
        const actualPrice = validateInput(parseFloat(document.getElementById('actualPrice').value), 0.01, 1000000, "实际售价");
        const inputTaxRate = validateInput(parseFloat(document.getElementById('profitInputTaxRate').value), 0, 100, "开票成本") / 100;
        const outputTaxRate = validateInput(parseFloat(document.getElementById('profitOutputTaxRate').value), 0, 100, "商品进项税率") / 100;
        const salesTaxRate = validateInput(parseFloat(document.getElementById('profitSalesTaxRate').value), 0, 100, "销项税率") / 100;
        const platformRate = validateInput(parseFloat(document.getElementById('profitPlatformRate').value), 0, 100, "平台抽佣比例") / 100;
        const shippingCost = validateInput(parseFloat(document.getElementById('profitShippingCost').value), 0, 10000, "物流费");
        const shippingInsurance = validateInput(parseFloat(document.getElementById('profitShippingInsurance').value), 0, 100, "运费险");
        const adRate = validateInput(parseFloat(document.getElementById('profitAdRate').value), 0, 100, "广告费用比例") / 100;
        const otherCost = validateInput(parseFloat(document.getElementById('profitOtherCost').value), 0, 10000, "其他成本");
        const returnRate = validateInput(parseFloat(document.getElementById('profitReturnRate').value), 0, 100, "退货率") / 100;

        // 计算进货成本
        const invoiceCost = costPrice * inputTaxRate; // 开票成本
        const totalPurchaseCost = costPrice + invoiceCost; // 总进货成本
        const purchaseVAT = costPrice * outputTaxRate; // 进项税额
        const effectiveCost = totalPurchaseCost - purchaseVAT; // 税后实际成本

        // 计算有效销售率
        const effectiveRate = 1 - returnRate;

        // 计算销售相关费用（考虑退货率）
        const platformFee = actualPrice * platformRate; // 平台佣金（可退回）
        const adCost = actualPrice * adRate; // 广告费（不可退回，需分摊）
        const adCostEffective = adCost / effectiveRate; // 分摊后的广告费
        const adVAT = adCostEffective * 0.06; // 广告费可抵扣进项税（6%）
        
        // 运营成本（不可退回，需分摊）
        const operationalCostBase = shippingCost + shippingInsurance + otherCost;
        const operationalCost = operationalCostBase / effectiveRate;

        // 计算销项税
        const netPrice = actualPrice / (1 + salesTaxRate); // 不含税售价
        const outputVAT = netPrice * salesTaxRate; // 销项税额

        // 计算总可抵扣进项税
        const totalVATDeduction = purchaseVAT + adVAT + (platformFee * 0.06); // 商品+广告+平台佣金的进项税
        const actualVAT = outputVAT - totalVATDeduction; // 实际应缴税额

        // 计算总成本（考虑退货分摊）
        const totalCost = effectiveCost + platformFee + adCostEffective + operationalCost + actualVAT;

        // 计算利润
        const profit = actualPrice - totalCost;
        const profitRate = (profit / actualPrice * 100).toFixed(2);

        // 更新实时利润显示
        const actualProfitInput = document.getElementById('actualProfit');
        const profitRateDisplay = document.getElementById('profitRate');
        const profitStatus = document.getElementById('profitStatus');

        // 设置利润金额和样式
        actualProfitInput.value = `¥ ${profit.toFixed(2)}`;
        actualProfitInput.className = profit >= 0 ? 'profit-positive' : 'profit-negative';

        // 设置利润率
        profitRateDisplay.textContent = `${profitRate}%`;

        // 设置状态提示
        let statusText = '';
        let statusClass = '';
        if (profit < 0) {
            statusText = '亏损';
            statusClass = 'status-bad';
        } else if (profitRate < 5) {
            statusText = '利润率过低';
            statusClass = 'status-warning';
        } else if (profitRate > 30) {
            statusText = '利润率优秀';
            statusClass = 'status-good';
        } else {
            statusText = '利润率正常';
            statusClass = 'status-good';
        }
        profitStatus.textContent = statusText;
        profitStatus.className = statusClass;

        // 生成结果HTML
        document.getElementById('result').innerHTML = generateResultHtml({
            purchaseCost: {
                totalPurchaseCost,
                effectiveCost,
                purchasePrice: costPrice,
                invoiceCost,
                purchaseVAT
            },
            salesCost: {
                operationalCosts: {
                    shipping: shippingCost / effectiveRate,
                    insurance: shippingInsurance / effectiveRate,
                    advertising: adCost / effectiveRate,
                    other: otherCost / effectiveRate
                },
                adVAT,
                totalOperationalCost: operationalCost,
                totalVATDeduction,
                returnRate,
                effectiveRate
            },
            priceInfo: {
                netPrice,
                finalPrice: actualPrice,
                platformFee,
                outputVAT,
                actualVAT,
                profit,
                profitRate,
                adCost,
                fixedCosts: operationalCostBase / effectiveRate,
                adVAT,
                totalVATDeduction,
                effectiveNonReturnableCost: (operationalCostBase + adCost) / effectiveRate,
                effectiveCostTotal: effectiveCost + (operationalCostBase + adCost) / effectiveRate,
                taxFactorOnFinal: salesTaxRate / (1 + salesTaxRate),
                adFactorEffective: adRate / effectiveRate,
                adVatCreditFactor: 0.06 * (adRate / effectiveRate),
                profitFactorEffective: profit / actualPrice,
                platformVatCreditFactor: 0.06 * platformRate
            },
            inputs: {
                platformRate,
                adRate,
                outputTaxRate,
                inputTaxRate,
                shippingCost,
                shippingInsurance,
                otherCost,
                returnRate
            }
        });
    } catch (error) {
        document.getElementById('result').innerHTML = `
            <div class="error">${error.message}</div>
        `;
    }
}

// 保存所有输入值到localStorage
function saveInputs() {
    const inputs = {
        // 售价计算tab的输入
        costPrice: document.getElementById("costPrice").value,
        inputTaxRate: document.getElementById("inputTaxRate").value,
        outputTaxRate: document.getElementById("outputTaxRate").value,
        salesTaxRate: document.getElementById("salesTaxRate").value,  // 销售成本中的销项税率
        platformRate: document.getElementById("platformRate").value,
        adRate: document.getElementById("adRate").value,
        shippingInsurance: document.getElementById("shippingInsurance").value,
        shippingCost: document.getElementById("shippingCost").value,
        otherCost: document.getElementById("otherCost").value,
        targetProfitRate: document.getElementById("targetProfitRate").value,
        
        // 利润计算tab的输入
        profitCostPrice: document.getElementById("profitCostPrice").value,
        actualPrice: document.getElementById("actualPrice").value,
        profitInputTaxRate: document.getElementById("profitInputTaxRate").value,
        profitOutputTaxRate: document.getElementById("profitOutputTaxRate").value,
        profitSalesTaxRate: document.getElementById("profitSalesTaxRate").value,
        profitPlatformRate: document.getElementById("profitPlatformRate").value,
        profitShippingCost: document.getElementById("profitShippingCost").value,
        profitShippingInsurance: document.getElementById("profitShippingInsurance").value,
        profitAdRate: document.getElementById("profitAdRate").value,
        profitOtherCost: document.getElementById("profitOtherCost").value,
        profitReturnRate: document.getElementById("profitReturnRate").value
    };
    localStorage.setItem('priceCalculatorInputs', JSON.stringify(inputs));
    
    // 显示保存成功提示
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = '已保存输入值';
    document.body.appendChild(toast);
    
    // 2秒后移除提示
    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
}

// 从localStorage加载保存的输入值
function loadSavedInputs() {
    const saved = localStorage.getItem('priceCalculatorInputs');
    if (saved) {
        const inputs = JSON.parse(saved);
        Object.entries(inputs).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value;
            }
        });
    }
}

// 验证输入值的合法性
function validateInput(value, min, max, name) {
    if (isNaN(value) || value < min || value > max) {
        throw new Error(`${name}必须在${min}到${max}之间`);
    }
    return value;
}

// 获取并验证所有输入值
function getValidatedInputs() {
    return {
        costPrice: validateInput(parseFloat(document.getElementById("costPrice").value), 0.01, 1000000, "进货价"),
        inputTaxRate: validateInput(parseFloat(document.getElementById("inputTaxRate").value), 0, 100, "进项税率") / 100,
        outputTaxRate: validateInput(parseFloat(document.getElementById("outputTaxRate").value), 0, 100, "商品税率") / 100,
        salesTaxRate: validateInput(parseFloat(document.getElementById("salesTaxRate").value), 0, 100, "销项税率") / 100,
        platformRate: validateInput(parseFloat(document.getElementById("platformRate").value), 0, 100, "平台抽佣比例") / 100,
        shippingCost: validateInput(parseFloat(document.getElementById("shippingCost").value), 0, 10000, "物流费"),
        otherCost: validateInput(parseFloat(document.getElementById("otherCost").value), 0, 10000, "其他成本"),
        adRate: validateInput(parseFloat(document.getElementById("adRate").value), 0, 100, "付费占比") / 100,
        shippingInsurance: validateInput(parseFloat(document.getElementById("shippingInsurance").value), 0, 100, "运费险"),
        returnRate: validateInput(parseFloat(document.getElementById("returnRate").value), 0, 100, "退货率") / 100,
        targetProfitRate: validateInput(parseFloat(document.getElementById("targetProfitRate").value), 0, 100, "目标利润率") / 100
    };
}

// 计算进货成本和可抵扣税额
function calculatePurchaseCost(inputs) {
    // 1. 基础进货成本计算
    const purchasePrice = inputs.costPrice; // 进货价（不含税）
    const invoiceCost = purchasePrice * inputs.inputTaxRate; // 开票成本（如6%）
    
    // 2. 进项税额计算（可抵扣，未来可用于抵减销项税）
    const purchaseVAT = purchasePrice * inputs.outputTaxRate; // 商品进项税额（如13%）
    
    // 3. 总进货成本（实际需要支付的金额）
    const totalPurchaseCost = purchasePrice + invoiceCost; // 总进货成本
    
    // 4. 税后实际成本（考虑未来进项税抵扣后的实际成本）
    const effectiveCost = totalPurchaseCost - purchaseVAT; // 考虑进项税抵扣后的实际成本

    return {
        purchasePrice,      // 不含税进货价
        invoiceCost,        // 开票费用
        totalPurchaseCost,  // 实际支付总金额
        purchaseVAT,        // 可抵扣进项税（未来税收收益）
        effectiveCost       // 考虑税收抵扣后的实际成本
    };
}

// 计算销售成本和税费
function calculateSalesCost(inputs, adCost, purchaseCost) {
    // 1. 计算退货影响
    const returnRate = inputs.returnRate;
    const effectiveRate = 1 - returnRate;

    // 2. 计算销售相关成本（考虑退货分摊）
    const operationalCosts = {
        shipping: inputs.shippingCost / effectiveRate,
        insurance: inputs.shippingInsurance / effectiveRate,
        advertising: adCost / effectiveRate,
        other: inputs.otherCost / effectiveRate
    };

    // 3. 广告费和平台佣金的进项税额（可抵扣）
    const VAT_RATE = 0.06; // 现代服务业增值税率6%
    const adVAT = (adCost / effectiveRate) * VAT_RATE;
    const platformVAT = inputs.platformRate * VAT_RATE; // 平台佣金的可抵扣进项税率

    // 4. 总销售成本（不含平台佣金，因为佣金基于最终售价）
    const totalOperationalCost = Object.values(operationalCosts).reduce((a, b) => a + b, 0);

    // 5. 总可抵扣进项税
    const totalVATDeduction = purchaseCost.purchaseVAT + adVAT + platformVAT;

    return {
        operationalCosts,
        adVAT,
        totalOperationalCost,
        totalVATDeduction,
        returnRate,
        effectiveRate
    };
}

// 计算最终价格和相关费用
function calculatePrices(purchaseCost, salesCost, inputs) {
    // 1. 计算固定成本（考虑退货率）
    // 按新规则：仅对"不可退回"的固定成本（物流、运费险、其他）按有效销售率分摊
    // 进货成本C不随退货率分摊，原因：退货后商品可回收再售，成本不被损耗
    const fixedCosts = (inputs.shippingCost + inputs.shippingInsurance + inputs.otherCost) / salesCost.effectiveRate;
    
    // 2. 利润率按定义：(最终售价-所有成本和税费)/最终售价 = 目标利润率
    // 将基于最终价计提的销项税等比例项换算为"最终价的占比"
    const VAT_RATE = 0.06; // 现代服务业增值税率6%
    const taxFactorOnFinal = inputs.salesTaxRate / (1 + inputs.salesTaxRate); // 销项税占最终售价比例
    const adFactorEffective = inputs.adRate / salesCost.effectiveRate;       // 广告费分摊（不可退回）
    const adVatCreditFactor = VAT_RATE * adFactorEffective;                  // 广告费进项税抵扣占比
    const platformVatCreditFactor = VAT_RATE * inputs.platformRate;          // 平台佣金进项税抵扣占比
    const profitFactorEffective = inputs.targetProfitRate;                   // 目标利润率按最终售价口径，不随退货分摊
    
    // 分子：C（已扣进项税）+ F_不可退回/(1-R)
    const numeratorFinal = purchaseCost.effectiveCost + fixedCosts;
    // 分母：1 - 平台费 - 税占比 - 目标利润率 - 广告费分摊占比 + 广告费可抵扣进项税占比 + 平台佣金进项税抵扣占比
    const denominatorFinal = 1 - inputs.platformRate - taxFactorOnFinal - inputs.targetProfitRate - adFactorEffective + adVatCreditFactor + platformVatCreditFactor;
    
    // 3. 计算含税售价、及不含税净价
    const finalPrice = numeratorFinal / denominatorFinal;
    const netPrice = finalPrice / (1 + inputs.salesTaxRate);
    
    // 4. 计算各项费用
    const platformFee = finalPrice * inputs.platformRate;
    const adCost = finalPrice * inputs.adRate;
    const outputVAT = netPrice * inputs.salesTaxRate;
    const profit = finalPrice * inputs.targetProfitRate;
    
    // 5. 计算广告费进项税（广告费为可抵扣6%，且为不可退回成本，需按(1-R)分摊）
    const adVAT = (adCost / salesCost.effectiveRate) * VAT_RATE;
    
    // 6. 计算实际税负（销项税 - 进项税(商品+广告)）
    const totalVATDeduction = purchaseCost.purchaseVAT + adVAT;
    const actualVAT = outputVAT - totalVATDeduction;

    // 7. 计算"有效成本"用于结果展示（不参与联立，便于理解口径）
    // 有效成本 = C（税后进货成本） + F_不可退回/(1-R)
    // 其中 F_不可退回 = 广告费 + 发货物流费 + 运费险 + 其他固定成本
    const effectiveNonReturnableCost = (inputs.shippingCost + inputs.shippingInsurance + inputs.otherCost) / salesCost.effectiveRate + (adCost / salesCost.effectiveRate);
    const effectiveCostTotal = purchaseCost.effectiveCost + effectiveNonReturnableCost;

    return {
        netPrice,
        finalPrice,
        platformFee,
        outputVAT,
        actualVAT,
        profit,
        profitRate: inputs.targetProfitRate * 100,
        adCost,
        fixedCosts,
        adVAT,
        totalVATDeduction,
        effectiveNonReturnableCost,
        effectiveCostTotal,
        taxFactorOnFinal,
        adFactorEffective,
        adVatCreditFactor,
        profitFactorEffective,
        platformVatCreditFactor
    };
}

// 实时计算进货成本
function updatePurchaseCostSummary() {
    try {
        const costPrice = parseFloat(document.getElementById("costPrice").value) || 0;
        const inputTaxRate = parseFloat(document.getElementById("inputTaxRate").value) / 100 || 0;
        const outputTaxRate = parseFloat(document.getElementById("outputTaxRate").value) / 100 || 0;

        const invoiceCost = costPrice * inputTaxRate;
        const totalPayment = costPrice + invoiceCost;
        const purchaseVAT = costPrice * outputTaxRate;
        const effectiveCost = totalPayment - purchaseVAT;

        document.getElementById("totalPayment").textContent = `¥${totalPayment.toFixed(2)}`;
        document.getElementById("effectiveCost").textContent = `¥${effectiveCost.toFixed(2)}`;
    } catch (error) {
        document.getElementById("totalPayment").textContent = "¥0.00";
        document.getElementById("effectiveCost").textContent = "¥0.00";
    }
}

// 实时计算销售成本
function updateSalesCostSummary(finalPrice = 0) {
    try {
        // 获取基础输入值
        const shippingCost = parseFloat(document.getElementById("shippingCost").value) || 0;
        const shippingInsurance = parseFloat(document.getElementById("shippingInsurance").value) || 0;
        const otherCost = parseFloat(document.getElementById("otherCost").value) || 0;
        const returnRate = parseFloat(document.getElementById("returnRate").value) / 100 || 0;
        const salesTaxRate = parseFloat(document.getElementById("salesTaxRate").value) / 100 || 0;
        const platformRate = parseFloat(document.getElementById("platformRate").value) / 100 || 0;
        const adRate = parseFloat(document.getElementById("adRate").value) / 100 || 0;

        // 计算有效销售率（考虑退货）
        const effectiveRate = 1 - returnRate;

        // 计算固定成本（考虑退货分摊）
        const totalFixedCost = (shippingCost + shippingInsurance + otherCost) / effectiveRate;

        // 计算基于最终售价的费用
        const platformFee = finalPrice * platformRate;
        const adCost = finalPrice * adRate;
        // 广告费为不可退回，需按有效销售率分摊
        const adCostEffective = adCost / effectiveRate;
        const salesTax = finalPrice / (1 + salesTaxRate) * salesTaxRate;  // 正确的销项税计算：含税价÷(1+税率)×税率

        // 计算总销售成本
        const totalSalesCost = totalFixedCost + platformFee + adCostEffective + salesTax;

        // 更新显示
        document.getElementById("totalFixedCost").textContent = `¥${totalFixedCost.toFixed(2)}`;
        document.getElementById("platformFeePreview").textContent = `¥${platformFee.toFixed(2)}`;
        document.getElementById("adCostPreview").textContent = `¥${adCostEffective.toFixed(2)}`;
        document.getElementById("salesTax").textContent = `¥${salesTax.toFixed(2)}`;
        document.getElementById("totalSalesCost").textContent = `¥${totalSalesCost.toFixed(2)}`;

        // 更新销项税率显示
        const salesTaxLabel = document.querySelector('#salesCostSummary div:nth-child(4) span:first-child');
        salesTaxLabel.textContent = `销项税（${(salesTaxRate * 100).toFixed(1)}%）：`;

    } catch (error) {
        document.getElementById("totalFixedCost").textContent = "¥0.00";
        document.getElementById("platformFeePreview").textContent = "¥0.00";
        document.getElementById("adCostPreview").textContent = "¥0.00";
        document.getElementById("salesTax").textContent = "¥0.00";
        document.getElementById("totalSalesCost").textContent = "¥0.00";
    }
}

/**
 * 计算合理售价的主函数
 * 
 * 重要说明：售价计算模块与利润计算模块的差异
 * 1. 售价计算模块（本函数）
 *    - 目的：确保有效订单（扣除退货后）达到目标利润率
 *    - 原理：基于退货率提高售价，确保剩余有效订单达到目标利润
 *    - 例如：目标利润率8%，退货率20%时：
 *      · 售价会被适当提高，以确保80%的有效订单达到8%的利润率
 *      · 最终售价会高于简单基于8%利润率计算的价格
 * 
 * 2. 与利润计算模块的区别
 *    - 售价计算：关注单个有效订单的利润率（退货分摊后）
 *    - 利润计算：展示整体业务的利润率（所有订单）
 *    - 这导致：相同售价下，利润计算模块显示的利润率会高于目标利润率
 *    - 原因：售价中包含了对退货损失的补偿
 * 
 * 3. 实际应用建议
 *    - 如果想让整体利润率接近目标值，可以适当调低这里的目标利润率
 *    - 建议通过实际运营数据来调整目标利润率
 *    - 密切关注退货率变化对定价的影响
 */
function calculate() {
    // 清除之前的错误信息
    document.getElementById("result").innerHTML = "";
    try {
        // 1. 获取并验证所有输入值
        const inputs = getValidatedInputs();
        
        // 2. 验证比例费用组合（按最终售价口径）：
        // 需满足 1 - (平台 + 销项税占比 + 目标利润 + 广告分摊 - 广告进项抵扣) > 0
        const returnRate = parseFloat(document.getElementById("returnRate").value) / 100 || 0;
        const effectiveRate = 1 - returnRate;
        const VAT_RATE = 0.06; // 现代服务业增值税率6%
        const taxFactorOnFinal = inputs.salesTaxRate / (1 + inputs.salesTaxRate);
        const adFactorEffective = inputs.adRate / effectiveRate;
        const adVatCreditFactor = VAT_RATE * adFactorEffective;
        const profitFactorEffective = inputs.targetProfitRate; // 利润率按最终售价口径
        const denominatorFinal = 1 - (inputs.platformRate + taxFactorOnFinal + profitFactorEffective + adFactorEffective - adVatCreditFactor);
        if (denominatorFinal <= 0) {
            throw new Error("参数组合过高（平台、税费占比、目标利润、广告费(分摊) - 广告进项抵扣），无法计算有效售价");
        }

        // 3. 计算进货成本和可抵扣进项税
        const purchaseCost = calculatePurchaseCost(inputs);
        
        // 4. 计算销售成本和总可抵扣税额（不含广告费，因为广告费会基于最终售价计算）
        const salesCost = calculateSalesCost(inputs, 0, purchaseCost);
        
        // 5. 一次性计算最终价格和各项费用
        const priceInfo = calculatePrices(purchaseCost, salesCost, inputs);

        // 6. 更新销售成本预览
        updateSalesCostSummary(priceInfo.finalPrice);

        // 7. 显示结果
        document.getElementById("result").innerHTML = generatePriceResultHtml({
            purchaseCost,
            salesCost,
            priceInfo,
            inputs
        });
    } catch (error) {
        // 显示错误信息
        document.getElementById("result").innerHTML = `
            <div class="error">${error.message}</div>
        `;
    }
}

// 页面加载时的初始化
window.addEventListener('load', () => {
    loadSavedInputs(); // 先加载保存的输入值
    
    try {
        // 默认显示利润计算结果
        calculateProfit();
    } catch (error) {
        console.error('初始化计算错误:', error);
    }

    // 为所有输入框添加实时计算功能
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            try {
                // 判断当前激活的tab
                const profitTabActive = document.getElementById('profitTab').classList.contains('active');
                
                if (profitTabActive) {
                    // 利润计算tab的实时计算
                    try {
                        calculateProfit();
                    } catch (error) {
                        // 如果输入无效，清空结果区域
                        document.getElementById('result').innerHTML = '';
                    }
                } else {
                    // 售价计算tab的实时计算
                    try {
                        // 获取并验证所有输入值
                        const inputs = getValidatedInputs();
                        
                        // 计算进货成本
                        const purchaseCost = calculatePurchaseCost(inputs);
                        
                        // 计算销售成本（不含广告费，因为广告费会基于最终售价计算）
                        const salesCost = calculateSalesCost(inputs, 0, purchaseCost);
                        
                        // 计算最终价格
                        const priceInfo = calculatePrices(purchaseCost, salesCost, inputs);

                        // 更新显示
                        updatePurchaseCostSummary();
                        updateSalesCostSummary(priceInfo.finalPrice);
                        calculate();
                    } catch (error) {
                        updatePurchaseCostSummary();
                        updateSalesCostSummary(0);
                    }
                }
            } catch (error) {
                // 处理任何未预期的错误
                console.error('实时计算错误:', error);
            }
        });
    });
});
