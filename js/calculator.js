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
    
    // 清空结果区域，并禁用分享按钮
    document.getElementById('result').innerHTML = '';
    try { if (window.__setShareButtonsEnabled) window.__setShareButtonsEnabled(false); } catch (e) {}
}

// 调试输出工具函数：在控制台打印结构化的调试数据
// 说明：
// - tag 用于标记当前模块（如 'price' 或 'profit'）
// - payload 是一份包含输入、成本、税费与汇总结果的对象
// - 使用 JSON.stringify 便于复制与粘贴
function debugCalculation(tag, payload) {
    try {
        // 使用折叠分组，方便在控制台查看
        if (console.groupCollapsed) {
            console.groupCollapsed(`[DEBUG] ${tag}`);
            console.log(JSON.stringify(payload, null, 2));
            console.groupEnd();
        } else {
            console.log('[DEBUG]', tag, JSON.stringify(payload, null, 2));
        }
    } catch (e) {
        // 避免调试输出影响正常流程
    }
}

/**
 * 计算实际利润的主函数
 * 
 * 重要说明：利润计算模块与售价计算模块的差异
 * 1. 利润计算模块（本函数）
 *    - 目的：计算实际经营的整体利润率
 *    - 原理：基于实际售价，计算所有订单的平均利润率
 *    - 利润率口径：利润 ÷ 有效订单的含税成交额（把退货损失计入利润）
 *    - 特点：当实际退货率=定价时的设定且佣金/税费退返处理与定价假设一致时，
 *           实际利润率≈目标利润率；
 *           实际退货率更高 → 低于目标；更低 → 高于目标
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
        const totalPurchaseCost = costPrice + invoiceCost; // 总进货成本（实际支付给供应商的金额）
        const purchaseVAT = costPrice * outputTaxRate; // 进项税额（用于抵减销项税）
        const effectiveCost = totalPurchaseCost; // 实际成本就是进货价+开票费用

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

        // 计算总成本（分别计算各项不可退回成本的分摊）
        const shippingCostEffective = shippingCost / effectiveRate;  // 物流费分摊
        const insuranceCostEffective = shippingInsurance / effectiveRate;  // 运费险分摊
        const otherCostEffective = otherCost / effectiveRate;  // 其他成本分摊
        const totalCost = effectiveCost + platformFee + adCostEffective + shippingCostEffective + insuranceCostEffective + otherCostEffective + actualVAT;

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

        // 计算并更新价格指标（基于进货价与含税售价）
        try {
            const metricMultiple = (actualPrice / costPrice).toFixed(2); // 进货倍率 = 售价 ÷ 进货价
            const metricMarkupRate = (((actualPrice - costPrice) / costPrice) * 100).toFixed(2) + '%'; // 加成率
            const metricGrossMargin = (((actualPrice - costPrice) / actualPrice) * 100).toFixed(2) + '%'; // 毛利率

            const elMultiple = document.getElementById('metricMultiple');
            const elMarkup = document.getElementById('metricMarkupRate');
            const elGross = document.getElementById('metricGrossMargin');
            if (elMultiple) elMultiple.textContent = `${metricMultiple}倍`;
            if (elMarkup) elMarkup.textContent = metricMarkupRate;
            if (elGross) elGross.textContent = metricGrossMargin;
        } catch (e) {
            // 指标展示非关键，忽略异常
        }

        // 调试输出：利润计算模块的关键中间量
        debugCalculation('profit', {
            inputs: {
                costPrice,
                actualPrice,
                inputTaxRate,
                outputTaxRate,
                salesTaxRate,
                platformRate,
                shippingCost,
                shippingInsurance,
                adRate,
                otherCost,
                returnRate
            },
            purchase: {
                invoiceCost,
                totalPurchaseCost,
                effectiveCost,
                purchaseVAT
            },
            rates: { effectiveRate },
            fees: {
                platformFee,
                adCost,
                adCostEffective,
                shippingCostEffective: shippingCost / effectiveRate,
                insuranceCostEffective: shippingInsurance / effectiveRate,
                otherCostEffective: otherCost / effectiveRate,
                operationalCostBase,
                operationalCost
            },
            tax: {
                netPrice,
                outputVAT,
                adVAT,
                totalVATDeduction,
                actualVAT
            },
            totals: {
                totalCost,
                profit,
                profitRate
            }
        });

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
        // 启用分享按钮
        try { if (window.__setShareButtonsEnabled) window.__setShareButtonsEnabled(true); } catch (e) {}

        // 计算保本建议售价（利润率=0），沿用售价联立口径
        try {
            const breakevenInputs = {
                costPrice,
                inputTaxRate,
                outputTaxRate: salesTaxRate, // 商品税率=销项税率
                salesTaxRate,
                platformRate,
                shippingCost,
                otherCost,
                adRate,
                shippingInsurance,
                returnRate,
                targetProfitRate: 0
            };
            const purchaseCost0 = calculatePurchaseCost(breakevenInputs);
            const salesCost0 = calculateSalesCost(breakevenInputs, 0, purchaseCost0);
            const priceInfo0 = calculatePrices(purchaseCost0, salesCost0, breakevenInputs);
            const elBreakeven = document.getElementById('breakevenPriceValue');
            if (elBreakeven) elBreakeven.textContent = `¥ ${priceInfo0.finalPrice.toFixed(2)}`;
            // 动态注释：是否包含平台佣金
            const elNote = document.getElementById('breakevenPriceNote');
            if (elNote) {
                const toggleOn = (document.getElementById('profitPlatformFreeToggle') || {}).checked;
                if (toggleOn || platformRate === 0) {
                    elNote.textContent = '免佣金价格';
                } else {
                    elNote.textContent = `包含平台佣金 ${(platformRate * 100).toFixed(1)}%`;
                }
            }
        } catch (e) {}
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
    const costPrice = inputs.costPrice; // 进货价（不含税）
    const invoiceCost = costPrice * inputs.inputTaxRate; // 开票成本（如6%）
    
    // 2. 进项税额计算（可抵扣，未来可用于抵减销项税）
    const purchaseVAT = costPrice * inputs.outputTaxRate; // 商品进项税额（如13%）
    
    // 3. 总进货成本（实际需要支付的金额）
    const totalPurchaseCost = costPrice + invoiceCost; // 总进货成本
    
    // 4. 实际成本就是进货价+开票费用
    const effectiveCost = costPrice + invoiceCost; // 实际成本就是进货价+开票费用

    return {
        costPrice,          // 不含税进货价
        invoiceCost,        // 开票费用
        totalPurchaseCost,  // 实际支付总金额（进货价+开票费用）
        purchaseVAT,        // 可抵扣进项税（用于抵减销项税）
        effectiveCost       // 实际成本（进货价+开票费用）
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
    // 商品进项税不受退货影响，广告费进项税需要分摊，平台佣金进项税不受退货影响
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
    
    // 分子：C（进货成本）- 商品进项税 + F_不可退回/(1-R)
    // 说明：商品进项税为与售价无关的固定抵扣，应在联立时作为常数项体现在分子，
    // 否则会导致解出的建议售价在带入利润页时多出“进货不含税×商品税率”的利润。
    const numeratorFinal = purchaseCost.effectiveCost - purchaseCost.purchaseVAT + fixedCosts;
    // 分母：1 - 平台费 - 税占比 - 目标利润率 - 广告费分摊占比 + 广告费可抵扣进项税占比 + 平台佣金进项税抵扣占比
    const denominatorFinal = 1 - inputs.platformRate - taxFactorOnFinal - inputs.targetProfitRate - adFactorEffective + adVatCreditFactor + platformVatCreditFactor;
    
    // 3. 计算含税售价、及不含税净价
    const finalPrice = numeratorFinal / denominatorFinal;
    const netPrice = finalPrice / (1 + inputs.salesTaxRate);
    
    // 4. 计算各项费用
    const platformFee = finalPrice * inputs.platformRate;
    const adCost = finalPrice * inputs.adRate;
    const outputVAT = netPrice * inputs.salesTaxRate;
    
    // 5. 计算广告费进项税（广告费为可抵扣6%，且为不可退回成本，需按(1-R)分摊）
    const adVAT = (adCost / salesCost.effectiveRate) * VAT_RATE;
    
    // 6. 计算实际税负（销项税 - 进项税）
    // 实缴增值税口径：销项税 - (商品进项税 + 广告费进项税 + 平台佣金进项税)
    // 注：虽然在联立分子里已经扣除了“商品进项税”作为常数项，但实际缴税仍需抵扣商品进项税，
    // 才能保证求解出的含税价在目标利润率下利润=F*t（t=0时利润为0）。
    const totalVATDeduction = purchaseCost.purchaseVAT + adVAT + (platformFee * VAT_RATE);
    const actualVAT = outputVAT - totalVATDeduction;

    // 7. 计算实际利润（收入减去所有成本和费用）
    const totalCost = purchaseCost.effectiveCost + platformFee + (adCost / salesCost.effectiveRate) + fixedCosts + actualVAT;
    const profit = finalPrice - totalCost;

    // 8. 计算"有效成本"用于结果展示（不参与联立，便于理解口径）
    // 有效成本 = C（进货成本） + F_不可退回/(1-R)
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
        profitRate: (profit / finalPrice * 100).toFixed(2),
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
    // 此函数已不再需要，因为成本计算结果模块已从HTML中移除
    // 保留函数以避免调用错误，但不执行任何操作
    return;
}

// 实时计算销售成本
function updateSalesCostSummary(finalPrice = 0) {
    // 此函数已不再需要，因为销售成本预览模块已从HTML中移除
    // 保留函数以避免调用错误，但不执行任何操作
    return;
}

/**
 * 计算合理售价的主函数
 * 
 * 重要说明：售价计算模块与利润计算模块的差异
 * 1. 售价计算模块（本函数）
 *    - 目的：确保有效订单（扣除退货后）达到目标利润率
 *    - 原理：基于退货率提高售价，确保剩余有效订单达到目标利润
 *    - 利润率口径：利润 ÷ 有效订单的含税成交额
 *    - 特点：系统按设定退货率，把预计退货损失摊入有效订单成本，
 *           再解出满足目标利润率的含税售价
 * 
 * 2. 与利润计算模块的区别
 *    - 售价计算：关注单个有效订单的利润率（退货分摊后）
 *    - 利润计算：展示整体业务的利润率（所有订单）
 *    - 差异原因：售价中包含了对退货损失的补偿
 *    - 注意：在相同假设（同一退货率、同一税费/佣金退返规则）下，
 *           两个模块算出的利润率应当非常接近
 * 
 * 3. 实际应用建议
 *    - 建议通过实际运营数据来调整目标利润率
 *    - 密切关注退货率变化对定价的影响
 *    - 确保两个模块使用相同的退货损失处理假设
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

        // 调试输出：售价计算模块的关键中间量
        debugCalculation('price', {
            inputs,
            purchase: purchaseCost,
            salesCost,
            priceInfo
        });

        // 6. 更新销售成本预览
        // updateSalesCostSummary(priceInfo.finalPrice); // 已移除销售成本预览模块

        // 7. 显示结果
        document.getElementById("result").innerHTML = generatePriceResultHtml({
            purchaseCost,
            salesCost,
            priceInfo,
            inputs
        });
        // 启用分享按钮
        try { if (window.__setShareButtonsEnabled) window.__setShareButtonsEnabled(true); } catch (e) {}
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
    // 初始化免佣开关状态与事件
    try {
        initPlatformFreeToggles();
    } catch (e) {}
    
    try {
        // 默认显示利润计算结果
        calculateProfit();
    } catch (error) {
        console.error('初始化计算错误:', error);
    }

    // 初始化分享工具栏按钮事件
    try {
        initShareButtons();
    } catch (e) {}

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

                        // 更新显示（已移除成本计算结果和销售成本预览模块）
                        // updatePurchaseCostSummary();
                        // updateSalesCostSummary(priceInfo.finalPrice);
                        calculate();
                    } catch (error) {
                        // updatePurchaseCostSummary(); // 已移除成本计算结果模块
                        // updateSalesCostSummary(0); // 已移除销售成本预览模块
                    }
                }
            } catch (error) {
                // 处理任何未预期的错误
                console.error('实时计算错误:', error);
            }
        });
    });
});

/**
 * 初始化分享/导出按钮
 * 功能：
 * - 将结果区域（含标题、分析步骤等）渲染为图片
 * - 提供三种操作：下载到本地、复制到剪贴板、系统分享（若浏览器支持）
 * - 成功计算结果后自动启用按钮；无结果或异常时禁用
 */
function initShareButtons() {
    const btnDownload = document.getElementById('btnDownloadImage');
    const btnCopy = document.getElementById('btnCopyImage');
    const btnShare = document.getElementById('btnShareImage');
    const shareButtons = [btnDownload, btnCopy, btnShare].filter(Boolean);

    // 工具：设置按钮启用/禁用
    const setButtonsEnabled = (enabled) => {
        shareButtons.forEach(btn => btn.disabled = !enabled);
    };

    // 初始禁用（直到有计算结果）
    setButtonsEnabled(Boolean(document.getElementById('result')?.firstChild));

    // 暴露到全局，供计算完成后调用
    window.__setShareButtonsEnabled = setButtonsEnabled;

    // 统一的渲染函数：将容器渲染为画布
    const renderResultToCanvas = async () => {
        const container = document.querySelector('.container');
        const resultEl = document.getElementById('result');
        if (!container || !resultEl || !resultEl.firstChild) {
            throw new Error('暂无可分享的结果');
        }
        // 克隆结果区域
        const cloneResultOnly = resultEl.cloneNode(true);

        // 收集当前参数与结论（根据当前Tab）
        const shareCtx = collectShareContext();

        // 包装一个简洁的白底卡片，包含标题 + 参数徽章 + 结论 + 结果内容
        const wrapper = document.createElement('div');
        wrapper.style.background = '#ffffff';
        wrapper.style.color = getComputedStyle(document.body).color || '#333';
        wrapper.style.fontFamily = getComputedStyle(document.body).fontFamily;
        wrapper.style.borderRadius = '16px';
        wrapper.style.padding = '24px';
        wrapper.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
        wrapper.style.width = container.offsetWidth + 'px';

        const title = document.createElement('h2');
        title.textContent = document.querySelector('h2')?.textContent || '电商合理售价计算器';
        title.style.marginTop = '0';
        title.style.textAlign = 'center';
        title.style.fontWeight = '500';
        wrapper.appendChild(title);

        // 参数徽章区
        if (shareCtx && Array.isArray(shareCtx.inputsForBadges)) {
            const badgesWrap = document.createElement('div');
            badgesWrap.className = 'share-badges';
            const sectionTitle = document.createElement('div');
            sectionTitle.className = 'share-section-title';
            sectionTitle.textContent = '计算参数';
            wrapper.appendChild(sectionTitle);
            wrapper.appendChild(badgesWrap);
            shareCtx.inputsForBadges.forEach(b => {
                const badge = document.createElement('span');
                badge.className = 'share-badge';
                badge.textContent = `${b.label}：${b.value}${b.unit || ''}`;
                badgesWrap.appendChild(badge);
            });
        }

        // 结论区
        if (shareCtx && shareCtx.conclusion) {
            const concWrap = document.createElement('div');
            concWrap.className = 'share-conclusion';
            const concTitle = document.createElement('div');
            concTitle.className = 'share-section-title';
            concTitle.textContent = '结论';
            const concText = document.createElement('div');
            concText.className = 'share-conclusion-text';
            concText.textContent = shareCtx.conclusion;
            wrapper.appendChild(concTitle);
            concWrap.appendChild(concText);
            wrapper.appendChild(concWrap);
        }

        // 剪裁结果详情中“步骤/详细成本分析”部分
        try {
            // 两个模式中，步骤区域都在 .calculation-steps 内，统一移除
            cloneResultOnly.querySelectorAll('.calculation-steps').forEach(node => node.remove());
        } catch (_) {}

        // 结果详情
        const detailTitle = document.createElement('div');
        detailTitle.className = 'share-section-title';
        detailTitle.textContent = shareCtx?.mode === 'profit' ? '利润构成分析' : '价格构成分析';
        wrapper.appendChild(detailTitle);
        wrapper.appendChild(cloneResultOnly);

        // 放入文档外层容器
        const offscreen = document.createElement('div');
        offscreen.style.position = 'fixed';
        offscreen.style.left = '-10000px';
        offscreen.style.top = '0';
        offscreen.style.width = container.offsetWidth + 'px';
        offscreen.appendChild(wrapper);
        document.body.appendChild(offscreen);
        try {
            const canvas = await html2canvas(wrapper, {
                backgroundColor: '#ffffff',
                scale: Math.min(2, window.devicePixelRatio || 1.5),
                useCORS: true
            });
            return canvas;
        } finally {
            document.body.removeChild(offscreen);
        }
    };

    // 下载
    if (btnDownload) {
        btnDownload.addEventListener('click', async () => {
            try {
                const canvas = await renderResultToCanvas();
                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                const now = new Date();
                const ts = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
                link.href = dataUrl;
                link.download = `价格计算_${ts}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (e) {
                showToast(e.message || '保存图片失败');
            }
        });
    }

    // 复制到剪贴板（优先 ClipboardItem，其次写入PNG数据URL）
    if (btnCopy) {
        btnCopy.addEventListener('click', async () => {
            try {
                const canvas = await renderResultToCanvas();
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                if (!blob) throw new Error('生成图片失败');
                if (navigator.clipboard && window.ClipboardItem) {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    showToast('已复制到剪贴板');
                } else {
                    // 回退：复制图片的 DataURL 文本
                    const dataUrl = canvas.toDataURL('image/png');
                    await navigator.clipboard.writeText(dataUrl);
                    showToast('已复制图片链接');
                }
            } catch (e) {
                showToast(e.message || '复制失败');
            }
        });
    }

    // 系统分享（Web Share Level 2，支持文件分享的浏览器）
    if (btnShare) {
        btnShare.addEventListener('click', async () => {
            try {
                if (!navigator.share) {
                    showToast('当前浏览器不支持系统分享');
                    return;
                }
                const canvas = await renderResultToCanvas();
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                if (!blob) throw new Error('生成图片失败');
                const file = new File([blob], '价格计算.png', { type: 'image/png' });
                const shareData = {
                    title: '电商合理售价/利润计算结果',
                    text: '基于当前参数的计算过程与结果',
                    files: (navigator.canShare && navigator.canShare({ files: [file] })) ? [file] : undefined
                };
                await navigator.share(shareData);
            } catch (e) {
                if (e && e.name === 'AbortError') return; // 用户取消
                showToast(e.message || '分享失败');
            }
        });
    }
}

/**
 * 轻量提示
 */
function showToast(message) {
    try {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('toast-hide');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 2000);
    } catch (e) {
        alert(message);
    }
}

/**
 * 收集分享所需上下文（当前模式、参数徽章、结论文案）
 * 返回示例：
 * {
 *   mode: 'price' | 'profit',
 *   inputsForBadges: [ { label, value, unit? }, ... ],
 *   conclusion: '建议售价 ¥xx.xx，预期利润率 xx.xx%'
 * }
 */
function collectShareContext() {
    const isProfitMode = document.getElementById('profitTab')?.classList.contains('active');
    if (isProfitMode) {
        // 利润计算模式
        const costPrice = document.getElementById('profitCostPrice')?.value;
        const actualPrice = document.getElementById('actualPrice')?.value;
        const inputTaxRate = document.getElementById('profitInputTaxRate')?.value;
        const outputTaxRate = document.getElementById('profitOutputTaxRate')?.value;
        const salesTaxRate = document.getElementById('profitSalesTaxRate')?.value;
        const platformRate = document.getElementById('profitPlatformRate')?.value;
        const shippingCost = document.getElementById('profitShippingCost')?.value;
        const shippingInsurance = document.getElementById('profitShippingInsurance')?.value;
        const adRate = document.getElementById('profitAdRate')?.value;
        const otherCost = document.getElementById('profitOtherCost')?.value;
        const returnRate = document.getElementById('profitReturnRate')?.value;

        // 从当前结果中提取关键结论（利润金额与利润率）
        const profitValue = document.querySelector('.final-price .price-value')?.textContent || '';
        const profitRateText = document.querySelector('.final-price .price-hint')?.textContent || '';
        const conclusion = `实际售价 ¥${Number(actualPrice || 0).toFixed(2)}，${profitRateText.replace(/\s+/g,' ')}`;

        return {
            mode: 'profit',
            inputsForBadges: [
                { label: '进货价', value: Number(costPrice||0).toFixed(2), unit: '元' },
                { label: '实际售价', value: Number(actualPrice||0).toFixed(2), unit: '元' },
                { label: '开票成本', value: Number(inputTaxRate||0).toFixed(1), unit: '%' },
                { label: '商品进项税率', value: Number(outputTaxRate||0).toFixed(1), unit: '%' },
                { label: '销项税率', value: Number(salesTaxRate||0).toFixed(1), unit: '%' },
                { label: '平台佣金', value: Number(platformRate||0).toFixed(1), unit: '%' },
                { label: '广告费用比例', value: Number(adRate||0).toFixed(1), unit: '%' },
                { label: '退货率', value: Number(returnRate||0).toFixed(1), unit: '%' },
                { label: '物流费', value: Number(shippingCost||0).toFixed(2), unit: '元/单' },
                { label: '运费险', value: Number(shippingInsurance||0).toFixed(2), unit: '元/单' },
                { label: '其他成本', value: Number(otherCost||0).toFixed(2), unit: '元/单' },
            ],
            conclusion: `利润 ${profitValue.replace(/^¥\s?/, '¥ ')}，${profitRateText}`
        };
    } else {
        // 售价计算模式
        const costPrice = document.getElementById('costPrice')?.value;
        const inputTaxRate = document.getElementById('inputTaxRate')?.value;
        const outputTaxRate = document.getElementById('outputTaxRate')?.value;
        const salesTaxRate = document.getElementById('salesTaxRate')?.value;
        const platformRate = document.getElementById('platformRate')?.value;
        const shippingCost = document.getElementById('shippingCost')?.value;
        const shippingInsurance = document.getElementById('shippingInsurance')?.value;
        const adRate = document.getElementById('adRate')?.value;
        const otherCost = document.getElementById('otherCost')?.value;
        const returnRate = document.getElementById('returnRate')?.value;
        const targetProfitRate = document.getElementById('targetProfitRate')?.value;

        // 从当前结果中提取关键结论（建议售价、预期利润率）
        const finalPriceText = document.querySelector('.final-price .price-value')?.textContent || '';
        const hintEl = document.querySelector('.final-price + .calculation-process');
        const profitRateDisplay = (function(){
            try {
                // 在价格构成分析卡片里查找“预期利润”区块百分比
                const profitPercent = hintEl?.querySelector('.composition-item.profit .item-percent')?.textContent?.trim();
                return profitPercent ? `预期利润率 ${profitPercent}` : '';
            } catch(_) { return ''; }
        })();
        const conclusion = `${finalPriceText ? `建议含税售价 ${finalPriceText.replace(/^¥\s?/, '¥ ')}` : ''}${profitRateDisplay ? `，${profitRateDisplay}` : ''}`;

        return {
            mode: 'price',
            inputsForBadges: [
                { label: '进货价', value: Number(costPrice||0).toFixed(2), unit: '元' },
                { label: '开票成本', value: Number(inputTaxRate||0).toFixed(1), unit: '%' },
                { label: '商品税率', value: Number(outputTaxRate||0).toFixed(1), unit: '%' },
                { label: '销项税率', value: Number(salesTaxRate||0).toFixed(1), unit: '%' },
                { label: '平台佣金', value: Number(platformRate||0).toFixed(1), unit: '%' },
                { label: '广告费用比例', value: Number(adRate||0).toFixed(1), unit: '%' },
                { label: '退货率', value: Number(returnRate||0).toFixed(1), unit: '%' },
                { label: '物流费', value: Number(shippingCost||0).toFixed(2), unit: '元/单' },
                { label: '运费险', value: Number(shippingInsurance||0).toFixed(2), unit: '元/单' },
                { label: '其他成本', value: Number(otherCost||0).toFixed(2), unit: '元/单' },
                { label: '目标利润率', value: Number(targetProfitRate||0).toFixed(1), unit: '%' },
            ],
            conclusion
        };
    }
}


/**
 * 初始化“平台免佣”开关，并与输入框联动
 * 功能说明：
 * 1. 两个开关分别作用于售价页(platformRate)与利润页(profitPlatformRate)
 * 2. 开关开启时，将对应输入值置为0，禁用输入框；关闭时恢复到上次的非零值（本地记忆），并解禁输入框
 * 3. 状态持久化到 localStorage，键：platformFreeToggle / profitPlatformFreeToggle；历史值键：platformRateLast / profitPlatformRateLast
 * 4. 切换时自动触发对应页的实时重算
 */
function initPlatformFreeToggles() {
    // 获取DOM
    const togglePrice = document.getElementById('platformFreeToggle');
    const inputPrice = document.getElementById('platformRate');
    const toggleProfit = document.getElementById('profitPlatformFreeToggle');
    const toggleProfitTop = document.getElementById('profitPlatformFreeToggleTop');
    const inputProfit = document.getElementById('profitPlatformRate');

    // 从localStorage恢复状态
    const saved = localStorage.getItem('priceCalculatorInputs');
    let savedObj = {};
    try { savedObj = saved ? JSON.parse(saved) : {}; } catch (e) {}

    const savedPriceToggle = localStorage.getItem('platformFreeToggle') === 'true';
    const savedProfitToggle = localStorage.getItem('profitPlatformFreeToggle') === 'true';

    const savedPriceLast = localStorage.getItem('platformRateLast');
    const savedProfitLast = localStorage.getItem('profitPlatformRateLast');

    // 辅助：应用开关状态
    const applyToggle = (isOn, inputEl, lastKey, toggleKey) => {
        if (!inputEl) return;
        if (isOn) {
            // 记录当前非零值作为上次值（若当前为0则保留原记录）
            const currentVal = parseFloat(inputEl.value || '0');
            if (currentVal > 0) {
                localStorage.setItem(lastKey, String(currentVal));
            }
            inputEl.value = '0';
            inputEl.setAttribute('disabled', 'disabled');
        } else {
            // 恢复上次非零值，若不存在则不变
            const last = localStorage.getItem(lastKey);
            if (last !== null && last !== undefined) {
                inputEl.value = last;
            }
            inputEl.removeAttribute('disabled');
        }
        localStorage.setItem(toggleKey, String(isOn));
    };

    // 首次进入时根据存储恢复UI
    if (togglePrice && inputPrice) {
        if (savedPriceToggle) togglePrice.checked = true;
        applyToggle(savedPriceToggle, inputPrice, 'platformRateLast', 'platformFreeToggle');
    }
    if (toggleProfit && inputProfit) {
        if (savedProfitToggle) toggleProfit.checked = true;
        applyToggle(savedProfitToggle, inputProfit, 'profitPlatformRateLast', 'profitPlatformFreeToggle');
    }
    if (toggleProfitTop) {
        toggleProfitTop.checked = !!savedProfitToggle;
    }

    // 绑定切换事件
    if (togglePrice && inputPrice) {
        togglePrice.addEventListener('change', () => {
            const isOn = togglePrice.checked;
            applyToggle(isOn, inputPrice, 'platformRateLast', 'platformFreeToggle');
            // 切换后保存一次，并触发售价页或利润页实时重算
            saveInputs();
            try { 
                const profitTabActive = document.getElementById('profitTab').classList.contains('active');
                if (profitTabActive) {
                    // 同步利润页两个开关
                    if (toggleProfit) toggleProfit.checked = isOn;
                    if (toggleProfitTop) toggleProfitTop.checked = isOn;
                    calculateProfit();
                } else {
                    calculate();
                }
            } catch (e) {}
        });
    }
    const handleProfitToggleChange = (isOn) => {
        applyToggle(isOn, inputProfit, 'profitPlatformRateLast', 'profitPlatformFreeToggle');
        saveInputs();
        try { 
            // 同步两个利润页开关
            if (toggleProfit) toggleProfit.checked = isOn;
            if (toggleProfitTop) toggleProfitTop.checked = isOn;
            const profitTabActive = document.getElementById('profitTab').classList.contains('active');
            if (profitTabActive) {
                calculateProfit();
            } else {
                calculate();
            }
        } catch (e) {}
    };
    if (toggleProfit && inputProfit) {
        toggleProfit.addEventListener('change', () => {
            handleProfitToggleChange(toggleProfit.checked);
        });
    }
    if (toggleProfitTop && inputProfit) {
        toggleProfitTop.addEventListener('change', () => {
            handleProfitToggleChange(toggleProfitTop.checked);
        });
    }
}
