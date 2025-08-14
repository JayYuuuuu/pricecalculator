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

    // 若切到标价页，初始化一次展示（尝试实时计算）
    try {
        if (tabName === 'listprice') {
            calculateListPrice();
        }
    } catch (_) {}
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
        const adRate = validateInput(parseFloat(document.getElementById('profitAdRate').value), 0, 100, "全店付费占比") / 100;
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
            const metricGrossMargin = (((actualPrice - costPrice) / actualPrice) * 100).toFixed(2) + '%'; // 毛利率

            const elMultiple = document.getElementById('metricMultiple');
            const elGross = document.getElementById('metricGrossMargin');
            if (elMultiple) elMultiple.textContent = `${metricMultiple}倍`;
            if (elGross) elGross.textContent = metricGrossMargin;

            // 计算并展示保本ROI（利润=0时所需的GMV/广告费）
            const roiRes = calculateBreakevenROI({
                costPrice,
                inputTaxRate,
                outputTaxRate,
                salesTaxRate,
                platformRate,
                shippingCost,
                shippingInsurance,
                otherCost,
                returnRate,
                finalPrice: actualPrice
            });
            const elROI = document.getElementById('metricBreakevenROI');
            if (elROI) {
                const val = roiRes.breakevenROI;
                if (!isFinite(val)) {
                    elROI.textContent = '∞';
                } else if (isNaN(val) || val <= 0) {
                    elROI.textContent = '-';
                } else {
                    elROI.textContent = Number(val).toFixed(2);
                }
                if (roiRes && roiRes.note) {
                    elROI.title = roiRes.note;
                } else {
                    elROI.removeAttribute('title');
                }
            }

            // 展示保本广告占比
            const elAdRate = document.getElementById('metricBreakevenAdRate');
            if (elAdRate) {
                const a = roiRes.breakevenAdRate;
                if (isNaN(a)) {
                    elAdRate.textContent = '-';
                } else if (!isFinite(a)) {
                    elAdRate.textContent = '-';
                } else if (a <= 0) {
                    elAdRate.textContent = '0%';
                } else {
                    elAdRate.textContent = (a * 100).toFixed(2) + '%';
                }
            }
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
        profitReturnRate: document.getElementById("profitReturnRate").value,

        // 标价计算tab 输入
        targetFinalPrice: (document.getElementById('targetFinalPrice')||{}).value,
        listPriceRates: (function(){
            try {
                return Array.from(document.querySelectorAll('.lp-rate'))
                    .filter(x => x.checked)
                    .map(x => parseFloat(x.value));
            } catch(_) { return []; }
        })(),
        fullReductionTiers: (function(){
            try {
                return Array.from(document.querySelectorAll('#fullReductionList .tier-row')).map(row => ({
                    threshold: parseFloat(row.querySelector('.tier-threshold').value),
                    off: parseFloat(row.querySelector('.tier-off').value)
                }));
            } catch(_) { return []; }
        })()
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

        // 恢复标价页：立减勾选、满减档位
        try {
            if (Array.isArray(inputs.listPriceRates)) {
                const all = document.querySelectorAll('.lp-rate');
                all.forEach(cb => { cb.checked = inputs.listPriceRates.includes(parseFloat(cb.value)); });
            }
        } catch (_) {}
        try {
            if (Array.isArray(inputs.fullReductionTiers)) {
                const list = document.getElementById('fullReductionList');
                if (list) {
                    // 清空现有，按存储重建
                    list.innerHTML = '';
                    inputs.fullReductionTiers.forEach(t => {
                        const row = document.createElement('div');
                        row.className = 'tier-row';
                        row.style.display = 'flex';
                        row.style.alignItems = 'center';
                        row.style.gap = '8px';
                        row.innerHTML = '<span style="color:#666; font-size:0.9rem;">满</span>'+
                                        `<input type="number" class="tier-threshold" value="${Number(t.threshold||0).toFixed(2)}" step="0.01" style="width:120px;">`+
                                        '<span style="color:#666; font-size:0.9rem;">减</span>'+
                                        `<input type="number" class="tier-off" value="${Number(t.off||0).toFixed(2)}" step="0.01" style="width:120px;">`+
                                        '<button type="button" class="save-button" onclick="saveInputs()" style="margin:0;">保存</button>'+
                                        '<button type="button" class="batch-modal-btn" onclick="removeTierRow(this)" style="margin:0;">删除</button>';
                        list.appendChild(row);
                    });
                    // 若没有任何档位，添加一行默认
                    if (inputs.fullReductionTiers.length === 0) {
                        addTierRow();
                    }
                }
            }
        } catch (_) {}
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
        outputTaxRate: validateInput(parseFloat(document.getElementById("outputTaxRate").value), 0, 100, "进项税率") / 100,
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

/**
 * 计算“保本ROI”阈值（GMV ÷ 广告费），在利润=0时所需的最低ROI。
 *
 * 定义与假设（与本项目口径一致）：
 * - ROI 定义：GMV(含税售价) / 广告费（按全店付费占比计提的广告总额）
 * - 广告费在利润模型中视为“不可退回成本”，按有效销售率(1-退货率)分摊；
 * - 广告费可获得 6% 进项税抵扣；平台佣金可获得 6% 进项税抵扣；
 * - 销项税占比 = 销项税率 / (1 + 销项税率)
 * - 利润=0 的联立：
 *   P = (C - 进项税 + 固定成本/(1-R)) ÷ [1 - 平台费 - 销项税占比 - (广告费/(1-R)) + 6%*广告费/(1-R) + 6%*平台费]
 *   反解广告费占比 a（即付费占比）：
 *   a* = (1-R)/0.94 * (D - B/P)
 *   其中：
 *     D = 1 - 平台费 - 销项税占比 + 0.06*平台费
 *     B = 实际进货成本C - 商品进项税 + 固定成本/(1-R)
 *     P = 含税售价
 *   则保本ROI = 1 / a*
 *
 * 参数：
 * - params: {
 *     costPrice,            // 进货价（不含税）
 *     inputTaxRate,         // 开票成本比例(0~1)
 *     outputTaxRate,        // 商品进项税率(0~1)
 *     salesTaxRate,         // 销项税率(0~1)
 *     platformRate,         // 平台佣金比例(0~1)
 *     shippingCost,         // 物流费（元/单）
 *     shippingInsurance,    // 运费险（元/单）
 *     otherCost,            // 其他固定成本（元/单）
 *     returnRate,           // 退货率(0~1)
 *     finalPrice            // 含税售价P
 *   }
 * 返回：{ breakevenAdRate, breakevenROI, feasible, note }
 */
function calculateBreakevenROI(params) {
    try {
        // 1) 读取参数并校验基本范围（为稳健起见）
        const costPrice = Number(params.costPrice) || 0;
        const inputTaxRate = Math.max(0, Number(params.inputTaxRate) || 0);
        const outputTaxRate = Math.max(0, Number(params.outputTaxRate) || 0);
        const salesTaxRate = Math.max(0, Number(params.salesTaxRate) || 0);
        const platformRate = Math.max(0, Number(params.platformRate) || 0);
        const shippingCost = Math.max(0, Number(params.shippingCost) || 0);
        const shippingInsurance = Math.max(0, Number(params.shippingInsurance) || 0);
        const otherCost = Math.max(0, Number(params.otherCost) || 0);
        const returnRate = Math.min(0.9999, Math.max(0, Number(params.returnRate) || 0));
        const finalPrice = Number(params.finalPrice) || 0;

        if (finalPrice <= 0) {
            return { breakevenAdRate: NaN, breakevenROI: NaN, feasible: false, note: '售价无效' };
        }

        // 2) 计算关键中间量
        const effectiveRate = 1 - returnRate;                   // 有效销售率 E
        const effectiveCost = costPrice + costPrice * inputTaxRate; // 实际进货成本 C = 进货价 + 开票成本
        const purchaseVAT = costPrice * outputTaxRate;          // 商品进项税
        const fixedCosts = (shippingCost + shippingInsurance + otherCost) / effectiveRate; // 不可退回固定成本按(1-R)分摊
		const taxFactorOnFinal = salesTaxRate / (1 + salesTaxRate); // 销项税占比
		// 服务业进项税率 v（用于广告与平台佣金的进项抵扣口径展示与推导；当前取 6%）
		const v = 0.06;

		const B = effectiveCost - purchaseVAT + fixedCosts;     // 分子常数项
		// 分母常数项（不含广告）：平台佣金的进项按价内口径 v/(1+v)
		const D = 1 - platformRate - taxFactorOnFinal + (v / (1 + v)) * platformRate;

        // 3) 反解保本所需的广告付费占比 a*
		//    a* = (1-R)/(1 - v) × (D - B/P)
        const term = D - (B / finalPrice);
		const breakevenAdRate = (effectiveRate / (1 - v)) * term; // 可能为负/超1，根据实际情况判断可行性

        // 4) 计算ROI阈值（按有效GMV口径）：
        //    ROI = 有效GMV / 广告费 = E / a*
        let breakevenROI; let feasible = true; let note = '';
        if (breakevenAdRate <= 0) {
            // a*<=0：无需广告即可保本（或价格已经过高），ROI阈值视为∞
            breakevenROI = Infinity;
            note = '无需广告也能保本';
        } else if (!isFinite(breakevenAdRate)) {
            breakevenROI = NaN; feasible = false; note = '参数异常';
        } else {
            breakevenROI = effectiveRate / breakevenAdRate;
            if (breakevenAdRate >= 1) {
                // 需要广告占比≥100%才保本，基本不可行
                note = '不现实：需广告占比≥100%';
            }
        }

        return { breakevenAdRate, breakevenROI, feasible, note };
    } catch (e) {
        return { breakevenAdRate: NaN, breakevenROI: NaN, feasible: false, note: '计算失败' };
    }
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

    // 初始化保本ROI浮窗交互
    try {
        initBreakevenROITooltip();
    } catch (e) {}

    // 初始化“费用设置”中的快速调整拉杆
    try {
        initQuickSliders();
    } catch (e) {}

    // 初始化“批量利润率推演”功能
    try {
        initBatchProfitScenario();
    } catch (e) {}

    // 为所有输入框添加实时计算功能
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            try {
                // 判断当前激活的tab
                const profitTabActive = document.getElementById('profitTab').classList.contains('active');
                const listpriceTabActive = document.getElementById('listpriceTab')?.classList.contains('active');
                
                if (profitTabActive) {
                    // 利润计算tab的实时计算
                    try {
                        calculateProfit();
                    } catch (error) {
                        // 如果输入无效，清空结果区域
                        document.getElementById('result').innerHTML = '';
                    }
                } else {
                    if (listpriceTabActive) {
                        // 标价计算实时
                        try { calculateListPrice(); } catch (_) { document.getElementById('result').innerHTML = ''; }
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
                        calculate();
                    } catch (error) {
                            // 忽略实时计算错误
                        }
                    }
                }
            } catch (error) {
                // 处理任何未预期的错误
                console.error('实时计算错误:', error);
            }
        });
    });

    // 标价页：对内部新增元素使用事件委托，保证动态“满减档位行/勾选”等也能触发实时计算
    try {
        const lpTab = document.getElementById('listpriceTab');
        if (lpTab) {
            const onLPChange = () => {
                if (lpTab.classList.contains('active')) {
                    try { calculateListPrice(); } catch (_) {}
                }
            };
            lpTab.addEventListener('input', onLPChange);
            lpTab.addEventListener('change', onLPChange);
        }
    } catch (_) {}
});

/**
 * 标价计算核心逻辑
 * 目标：给定“目标到手价 P_final”，在可叠加优惠（单品立减 r、满减 T→O）下，反推页面标价 S。
 * 规则：
 * - 单品立减：按比例 r 对标价 S 打折，得到 S1 = S × (1 - r)
 * - 满减：对 S1 按可触发的最大档位扣减固定金额 off，使到手价 P = S1 - off
 * - 叠加顺序：先单品立减，再满减
 * - 反解：对于给定 r 与满减档集合 {(threshold_i, off_i)}，我们要找到 S 使得 P ≈ 目标价
 *   做法：对每个 r，枚举可能的“触发满减档位集合”，将 off 视为常数，解 S = (P + off) / (1 - r)，再检查是否满足 S1 >= threshold_i 的触发条件。
 *   取满足条件且 S>0 的解中，到手价误差最小的一个解，作为该 r 下的建议标价。
 */
function calculateListPrice() {
    // 读取输入
    const targetFinalPrice = validateInput(parseFloat(document.getElementById('targetFinalPrice').value), 0.01, 100000000, '目标到手价');
    const rateValues = Array.from(document.querySelectorAll('.lp-rate')).filter(x => x.checked).map(x => parseFloat(x.value));
    const tiers = Array.from(document.querySelectorAll('#fullReductionList .tier-row')).map(row => ({
        threshold: parseFloat(row.querySelector('.tier-threshold').value),
        off: parseFloat(row.querySelector('.tier-off').value)
    })).filter(t => isFinite(t.threshold) && isFinite(t.off) && t.threshold > 0 && t.off >= 0);

    if (!rateValues.length) throw new Error('请至少选择一个单品立减档位');

    // 若无满减档，按 off=0 处理
    const offCandidates = tiers.length ? tiers.map(t => t.off).sort((a,b)=>a-b) : [0];

    // 对每个立减比例分别给出建议标价
    const results = rateValues.map(r => {
        let best = null; // { price, off, thresholdUsed, finalPrice, diff }
        const k = 1 - r;
        if (k <= 0) return { r, price: NaN, finalPrice: NaN, detail: [], note: '立减过高' };

        // 穷举可能的 off（由各档可触发的最大减额决定）。考虑不触发满减的 off=0 场景
        const candidates = new Set(offCandidates.concat([0]));
        candidates.forEach(off => {
            // 反解标价 S = (P + off)/k
            const S = (targetFinalPrice + off) / k;
            if (!isFinite(S) || S <= 0) return;
            const S1 = S * k; // 立减后价
            // 找到在 S1 下能触发的最大满减档位（若有）
            const available = tiers.filter(t => S1 >= t.threshold);
            const maxOff = available.length ? Math.max(...available.map(t => t.off)) : 0;
            // 验证该解是否自洽：若我们假设的 off 与实际可触发 maxOff 不一致，则该解不成立
            if (Math.abs((off||0) - (maxOff||0)) > 1e-6) return;
            const P = S1 - (maxOff||0);
            const diff = Math.abs(P - targetFinalPrice);
            const candidate = { price: S, off: maxOff||0, thresholdUsed: (function(){
                if (!maxOff) return null;
                const t = available.find(x => x.off === maxOff);
                return t ? t.threshold : null;
            })(), finalPrice: P, diff };
            if (!best || diff < best.diff || (Math.abs(diff - best.diff) < 1e-9 && S < best.price)) {
                best = candidate;
            }
        });
        return { r, price: best? best.price : NaN, finalPrice: best? best.finalPrice : NaN, off: best? best.off : 0, thresholdUsed: best? best.thresholdUsed : null };
    });

    // 渲染结果
    document.getElementById('result').innerHTML = generateListPriceHtml({
        targetFinalPrice,
        tiers,
        results
    });
    try { if (window.__setShareButtonsEnabled) window.__setShareButtonsEnabled(true); } catch (e) {}

    // 绑定建议标价悬浮说明（列出各立减档的到手价）
    try { initSuggestPriceTooltip(tiers); } catch (_) {}

    // 移动端：在表格卡片中也可点击行查看详单（同浮窗内容），便于触摸设备
    try {
        if (window.matchMedia && !window.matchMedia('(hover: hover)').matches) {
            const tapContainer = document.getElementById('result');
            const onTap = (e) => {
                const el = e.target.closest('.lp-price-row');
                if (!el || !tapContainer.contains(el)) return;
                const S = parseFloat(el.getAttribute('data-s'));
                if (!isFinite(S) || S <= 0) return;
                const html = (function(){
                    const discountRates = [0.10, 0.12, 0.15, 0.18, 0.20];
                    const rows = discountRates.map(r => {
                        const k = 1 - r; const s1 = S * k;
                        const avail = (tiers||[]).filter(t => isFinite(t.threshold) && isFinite(t.off) && t.threshold > 0 && t.off >= 0 && s1 >= t.threshold);
                        const off = avail.length ? Math.max(...avail.map(t => t.off)) : 0;
                        const final = s1 - off;
                        return `<div style=\"display:flex;justify-content:space-between;\"><span>${(r*100).toFixed(0)}%</span><b>¥ ${final.toFixed(2)}</b></div>`;
                    }).join('');
                    return `<div style=\"font-weight:600;margin-bottom:8px;\">各立减档到手价</div>${rows}`;
                })();
                // 深色样式面板（对齐桌面端浮窗风格）
                const panel = document.createElement('div');
                panel.style.position = 'fixed'; panel.style.left = '50%'; panel.style.top = '50%';
                panel.style.transform = 'translate(-50%, -50%)';
                panel.style.background = 'rgba(17,24,39,0.95)';
                panel.style.color = '#fff';
                panel.style.borderRadius = '8px';
                panel.style.boxShadow = '0 12px 36px rgba(0,0,0,0.25)';
                panel.style.padding = '12px 14px';
                panel.style.maxWidth = '88%';
                panel.style.zIndex = '10002';
                panel.style.fontSize = '12px';
                panel.style.lineHeight = '1.5';
                panel.innerHTML = `<div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;\"><div style=\"font-weight:600;\">标价 <b>¥ ${S.toFixed(2)}</b></div><button id=\"lpClose\" aria-label=\"关闭\" style=\"border:none;background:rgba(255,255,255,0.12);color:#fff;border-radius:6px;width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;font-size:16px;line-height:1;\">×</button></div>${html}`;
                const mask = document.createElement('div');
                mask.style.position = 'fixed'; mask.style.left = '0'; mask.style.top = '0'; mask.style.right = '0'; mask.style.bottom = '0';
                mask.style.background = 'rgba(0,0,0,0.35)'; mask.style.zIndex = '10001';
                document.body.appendChild(mask); document.body.appendChild(panel);
                const close = () => { try { document.body.removeChild(mask); document.body.removeChild(panel); } catch(_){} };
                mask.addEventListener('click', close);
                panel.querySelector('#lpClose').addEventListener('click', close);
            };
            // 防重复绑定
            tapContainer.removeEventListener('click', tapContainer.__lpTap || (()=>{}));
            tapContainer.__lpTap = onTap;
            tapContainer.addEventListener('click', onTap);
        }
    } catch (_) {}
}

// 标价页：增加/删除一档
function addTierRow() {
    const list = document.getElementById('fullReductionList');
    if (!list) return;
    const row = document.createElement('div');
    row.className = 'tier-row';
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '8px';
    row.style.flexWrap = 'wrap';
    row.innerHTML = '<span style="color:#666; font-size:0.9rem;">满</span>'+
                    '<input type="number" class="tier-threshold" value="199" step="0.01" style="width:120px;max-width:100%;">'+
                    '<span style="color:#666; font-size:0.9rem;">减</span>'+
                    '<input type="number" class="tier-off" value="20" step="0.01" style="width:120px;max-width:100%;">'+
                    '<button type="button" class="save-button" onclick="saveInputs()" style="margin:0;">保存</button>'+
                    '<button type="button" class="batch-modal-btn" onclick="removeTierRow(this)" style="margin:0;">删除</button>';
    list.appendChild(row);
}
function removeTierRow(btn) {
    const row = btn && btn.closest('.tier-row');
    if (row && row.parentNode) row.parentNode.removeChild(row);
}

/**
 * 为“建议标价”列添加悬浮说明：展示给定标价在各立减档位下的到手价
 * 档位固定为 [10%, 12%, 15%, 18%, 20%]
 */
function initSuggestPriceTooltip(tiers) {
    // 统一的浮层节点（复用，避免反复创建）
    let tip = document.getElementById('lpSuggestTooltip');
    if (!tip) {
        tip = document.createElement('div');
        tip.id = 'lpSuggestTooltip';
        Object.assign(tip.style, {
            position: 'fixed', zIndex: 10001, padding: '10px 12px', borderRadius: '8px',
            background: 'rgba(17,24,39,0.95)', color: '#fff', fontSize: '12px',
            lineHeight: '1.5', boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            pointerEvents: 'none', whiteSpace: 'nowrap', opacity: '0', transition: 'opacity .08s ease'
        });
        document.body.appendChild(tip);
    }
    const isHoverDevice = !!(window.matchMedia && window.matchMedia('(hover: hover)').matches);
    const hide = () => { tip.style.opacity = '0'; };
    const show = (html, x, y) => {
        tip.innerHTML = html;
        const offset = 12;
        tip.style.left = `${x + offset}px`;
        tip.style.top = `${y + offset}px`;
        tip.style.opacity = '1';
    };

    const discountRates = [0.10, 0.12, 0.15, 0.18, 0.20];
    const formatYuan = (n) => `¥ ${Number(n).toFixed(2)}`;

    const buildHtml = (S) => {
        try {
            // 给定标价 S 时：先按各档立减得到 S1，再按满减触发的最大减额计算最终到手价
            const rows = discountRates.map(r => {
                const k = 1 - r;
                const s1 = S * k;
                const available = (tiers||[]).filter(t => isFinite(t.threshold) && isFinite(t.off) && t.threshold > 0 && t.off >= 0 && s1 >= t.threshold);
                const off = available.length ? Math.max(...available.map(t => t.off)) : 0;
                const final = s1 - off;
                return `<tr><td style="padding:2px 8px;color:#a7f3d0;">${(r*100).toFixed(0)}%</td><td style="padding:2px 8px;">${formatYuan(final)}</td></tr>`;
            }).join('');
            return `<div style="font-weight:600;margin-bottom:4px;">标价 <b>${formatYuan(S)}</b></div>
                    <div style="font-weight:600;margin-bottom:6px;">各立减档到手价</div>
                    <table style="border-collapse:collapse;">${rows}</table>`;
        } catch (_) {
            return '无法计算';
        }
    };

    // 事件委托到结果容器，避免多次绑定
    const container = document.getElementById('result');
    if (!container) return;
    const onOver = (e) => {
        const el = e.target.closest('.lp-price-row');
        if (!el || !container.contains(el)) return;
        const S = parseFloat(el.getAttribute('data-s'));
        if (!isFinite(S) || S <= 0) return;
        show(buildHtml(S), e.clientX, e.clientY);
    };
    const onMove = (e) => {
        const el = e.target.closest('.lp-price-row');
        if (!el || !container.contains(el)) return hide();
        const S = parseFloat(el.getAttribute('data-s'));
        if (!isFinite(S) || S <= 0) return hide();
        show(buildHtml(S), e.clientX, e.clientY);
    };
    const onLeave = hide;

    // 先移除旧的监听，避免重复
    container.removeEventListener('mouseover', container.__lpOver || (()=>{}));
    container.removeEventListener('mousemove', container.__lpMove || (()=>{}));
    container.removeEventListener('mouseleave', container.__lpLeave || (()=>{}));
    if (isHoverDevice) {
        container.__lpOver = onOver; container.__lpMove = onMove; container.__lpLeave = onLeave;
        container.addEventListener('mouseover', onOver);
        container.addEventListener('mousemove', onMove);
        container.addEventListener('mouseleave', onLeave);
    } else {
        // 触摸设备不绑定 hover 浮窗，避免与点击面板重复
        hide();
    }
}


/**
 * 初始化“营销费用占比、预计退货率”的快速滑杆，支持与数值输入双向同步，并触发实时重算
 * 设计要点：
 * - 两个滑杆仅在利润页“费用设置”模块内；与 `#profitAdRate`、`#profitReturnRate` 双向联动
 * - 统一范围 0~100，步进 0.1；显示当前值百分比
 * - 变更后：更新对应 number 输入 → 保存到 localStorage → 触发利润实时计算
 */
function initQuickSliders() {
    // DOM 引用
    const adInput = document.getElementById('profitAdRate');
    const adSlider = document.getElementById('profitAdRateSlider');
    const adSliderVal = document.getElementById('profitAdRateSliderValue');
    const retInput = document.getElementById('profitReturnRate');
    const retSlider = document.getElementById('profitReturnRateSlider');
    const retSliderVal = document.getElementById('profitReturnRateSliderValue');

    // 容错：若缺少任意一个元素，直接返回
    if (!adInput || !adSlider || !adSliderVal || !retInput || !retSlider || !retSliderVal) return;

    // 初始化滑杆位置与显示
    const syncFromInputs = () => {
        // 统一按整数处理：四舍五入到最近的整数
        const ad = Math.min(100, Math.max(0, Math.round(parseFloat(adInput.value || '0'))));
        const rr = Math.min(100, Math.max(0, Math.round(parseFloat(retInput.value || '0'))));
        adSlider.value = String(ad);
        retSlider.value = String(rr);
        adInput.value = String(ad);
        retInput.value = String(rr);
        adSliderVal.textContent = `${ad}%`;
        retSliderVal.textContent = `${rr}%`;
    };
    syncFromInputs();

    // 滑杆 → 数字输入
    const onSliderChange = () => {
        // 仅当利润页处于激活状态时执行计算，避免切换到售价页时误触
        const profitTabActive = document.getElementById('profitTab')?.classList.contains('active');
        const ad = Math.round(parseFloat(adSlider.value));
        const rr = Math.round(parseFloat(retSlider.value));
        adInput.value = isNaN(ad) ? '0' : String(ad);
        retInput.value = isNaN(rr) ? '0' : String(rr);
        adSliderVal.textContent = `${ad}%`;
        retSliderVal.textContent = `${rr}%`;
        try { saveInputs(); } catch (_) {}
        try { if (profitTabActive) calculateProfit(); } catch (_) {}
    };
    adSlider.addEventListener('input', onSliderChange);
    retSlider.addEventListener('input', onSliderChange);

    // 数字输入 → 滑杆（手动修改 number 后也要同步）
    const onNumberInput = () => {
        syncFromInputs();
    };
    adInput.addEventListener('input', onNumberInput);
    retInput.addEventListener('input', onNumberInput);
}

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
 * 初始化“保本ROI”卡片的浮动说明窗（桌面端hover，移动端点击）
 * - 桌面端：悬停显示，移出隐藏
 * - 移动端：点击卡片打开，点击遮罩或关闭按钮关闭
 */
function initBreakevenROITooltip() {
    const card = document.getElementById('metricBreakevenROICard');
    if (!card) return;

    // 创建浮窗元素（桌面端小气泡 + 移动端全屏弹层共用模板）
    const tooltip = document.createElement('div');
    tooltip.id = 'breakevenRoiTooltip';
    tooltip.style.position = 'fixed';
    tooltip.style.zIndex = '9999';
    tooltip.style.maxWidth = '320px';
    tooltip.style.background = '#ffffff';
    tooltip.style.border = '1px solid #e5e7eb';
    tooltip.style.borderRadius = '8px';
    tooltip.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
    tooltip.style.padding = '12px 14px';
    tooltip.style.fontSize = '12px';
    tooltip.style.lineHeight = '1.6';
    tooltip.style.color = '#333';
    tooltip.style.display = 'none';
    tooltip.style.pointerEvents = 'none';
    tooltip.innerHTML = '<div id="breakevenRoiTooltipContent"></div>';
    document.body.appendChild(tooltip);

    // 移动端遮罩 + 面板
    const overlay = document.createElement('div');
    overlay.id = 'breakevenRoiOverlay';
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.background = 'rgba(0,0,0,0.35)';
    overlay.style.zIndex = '9998';
    overlay.style.display = 'none';

    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.left = '50%';
    panel.style.top = '50%';
    panel.style.transform = 'translate(-50%, -50%)';
    panel.style.width = '88%';
    panel.style.maxWidth = '420px';
    panel.style.maxHeight = '70vh';
    panel.style.overflow = 'auto';
    panel.style.background = '#fff';
    panel.style.borderRadius = '12px';
    panel.style.boxShadow = '0 12px 36px rgba(0,0,0,0.18)';
    panel.style.padding = '16px';
    panel.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><div style="font-weight:600;">保本ROI计算说明</div><button id="breakevenRoiCloseBtn" style="border:none;background:#f5f5f5;border-radius:6px;padding:6px 10px;cursor:pointer;">关闭</button></div><div id="breakevenRoiPanelContent" style="font-size:13px;line-height:1.7;color:#333;"></div>';
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // 工具方法：根据当前输入构造说明HTML
    const buildExplainHtml = (ctx) => {
		const {P, C, purchaseVAT, fixedCosts, E, tOnFinal, platformRate, breakevenAdRate, breakevenROI} = ctx;
		// 服务业进项税率 v（本系统当前取 6%）；用于展示一般形式：(1 - v) 与 v×平台费
		const v = 0.06;
		const D = 1 - platformRate - tOnFinal + v * platformRate;
		// 增补：在浮窗顶部给出“保本 ROI”的通俗定义，便于非技术同学理解
		return (
			'<div>'+
			'<div style="margin-bottom:6px; color:#333;">保本 ROI 的含义是：在考虑退货、平台扣点、销项税、进项抵扣、固定成本之后，利润刚好为 0 时的 ROI。</div>'+
			// 先给出一行“总公式”（一般形式，含税口径）：由 a* = (E/(1−v))×(D − B/P) 与 ROI* = E/a* 推得
			'<div style="margin-bottom:4px; color:#111;">通用计算公式（含税售价 P）：</div>'+
			'<div style="margin-left:12px; margin-bottom:8px;">ROI* = (1 − v) ÷ ( D − B / P )</div>'+
			'<div style="margin-bottom:6px; color:#111;">公式与中间量（ROI=有效GMV÷广告费）：</div>'+
            `<div>• 有效率 E = 1 - 退货率 = ${(E*100).toFixed(1)}%</div>`+
            `<div>• 销项税占比 = 税率/(1+税率) = ${(tOnFinal*100).toFixed(2)}%</div>`+
            `<div>• 分子 B = C - 商品进项税 + 固定成本/E = ${C.toFixed(2)} - ${purchaseVAT.toFixed(2)} + ${fixedCosts.toFixed(2)} = ${(C - purchaseVAT + fixedCosts).toFixed(2)}</div>`+
			`<div>• 常数 D' = 1 - 平台费 - 销项税占比 + v×平台费；当前 v = ${(v*100).toFixed(0)}% → D = ${(1 - platformRate).toFixed(4)} - ${(tOnFinal).toFixed(4)} + ${(v*platformRate).toFixed(4)} = ${(D).toFixed(4)}</div>`+
			`<div>• 保本广告占比 a* = E/(1 - v) × (D - B/P)</div>`+
			`<div style=\"margin-left:12px;\">= ${(E/(1 - v)).toFixed(6)} × ( ${(D).toFixed(6)} - ${(((C - purchaseVAT + fixedCosts) / P) || 0).toFixed(6)} )</div>`+
            `<div style=\"margin-left:12px;\">= ${(breakevenAdRate*100).toFixed(2)}%</div>`+
			`<div>• 保本ROI = E / a* = ${isFinite(breakevenROI)? breakevenROI.toFixed(2): '∞'}</div>`+
			`<div style=\"margin-top:6px; color:#111;\">因此：ROI* = (1 − v) ÷ ( D − B / P )；当前 v = ${(v*100).toFixed(0)}% → ROI* = ${(1 - v).toFixed(2)} ÷ ( D − B / P )</div>`+
            '</div>'
        );
    };

    // 获取当前上下文并构建数据
    const collectContext = () => {
        // 判断当前处于利润页（有实际售价）还是售价页（建议售价）
        const isProfitMode = document.getElementById('profitTab')?.classList.contains('active');
        let costPrice, inputTaxRate, outputTaxRate, salesTaxRate, platformRate, shippingCost, shippingInsurance, otherCost, returnRate, P;
        if (isProfitMode) {
            costPrice = validateInput(parseFloat(document.getElementById('profitCostPrice').value), 0.01, 1000000, '进货价');
            inputTaxRate = validateInput(parseFloat(document.getElementById('profitInputTaxRate').value), 0, 100, '开票成本')/100;
            outputTaxRate = validateInput(parseFloat(document.getElementById('profitOutputTaxRate').value), 0, 100, '商品进项税率')/100;
            // 销项税率直接取输入
            salesTaxRate = validateInput(parseFloat(document.getElementById('profitSalesTaxRate').value), 0, 100, '销项税率')/100;
            platformRate = validateInput(parseFloat(document.getElementById('profitPlatformRate').value), 0, 100, '平台佣金')/100;
            shippingCost = validateInput(parseFloat(document.getElementById('profitShippingCost').value), 0, 10000, '物流费');
            shippingInsurance = validateInput(parseFloat(document.getElementById('profitShippingInsurance').value), 0, 100, '运费险');
            otherCost = validateInput(parseFloat(document.getElementById('profitOtherCost').value), 0, 10000, '其他成本');
            returnRate = validateInput(parseFloat(document.getElementById('profitReturnRate').value), 0, 100, '退货率')/100;
            P = validateInput(parseFloat(document.getElementById('actualPrice').value), 0.01, 1000000, '实际售价');
        } else {
            const inputs = getValidatedInputs();
            costPrice = inputs.costPrice; inputTaxRate = inputs.inputTaxRate; outputTaxRate = inputs.outputTaxRate;
            salesTaxRate = inputs.salesTaxRate; platformRate = inputs.platformRate; shippingCost = inputs.shippingCost;
            shippingInsurance = inputs.shippingInsurance; otherCost = inputs.otherCost; returnRate = inputs.returnRate;
            // 从售价结果区域尝试读建议售价
            const priceText = document.querySelector('.final-price .price-value')?.textContent || '';
            const match = priceText.match(/([\d.]+)/);
            P = match ? parseFloat(match[1]) : NaN;
        }

        const E = 1 - returnRate;
        const C = costPrice + costPrice * inputTaxRate; // 实际进货成本
        const purchaseVAT = costPrice * outputTaxRate;  // 商品进项税
        const fixedCosts = (shippingCost + shippingInsurance + otherCost) / E;
        const tOnFinal = salesTaxRate / (1 + salesTaxRate);
        const roiRes = calculateBreakevenROI({
            costPrice, inputTaxRate, outputTaxRate, salesTaxRate, platformRate,
            shippingCost, shippingInsurance, otherCost, returnRate, finalPrice: P
        });
        return { P, C, purchaseVAT, fixedCosts, E, tOnFinal, platformRate, breakevenAdRate: roiRes.breakevenAdRate, breakevenROI: roiRes.breakevenROI };
    };

    // 桌面端：hover 展示
    let hoverTimer = null;
    const showTooltip = (evt) => {
        try {
            const ctx = collectContext();
            const html = buildExplainHtml(ctx);
            const content = document.getElementById('breakevenRoiTooltipContent');
            if (content) content.innerHTML = html;
            const x = evt.clientX + 12;
            const y = evt.clientY + 12;
            tooltip.style.left = Math.min(x, window.innerWidth - 340) + 'px';
            tooltip.style.top = Math.min(y, window.innerHeight - 200) + 'px';
            tooltip.style.display = 'block';
        } catch (_) {}
    };
    const hideTooltip = () => {
        tooltip.style.display = 'none';
    };
    card.addEventListener('mouseenter', (e) => {
        if (window.matchMedia('(hover: hover)').matches) {
            clearTimeout(hoverTimer);
            showTooltip(e);
        }
    });
    card.addEventListener('mousemove', (e) => {
        if (window.matchMedia('(hover: hover)').matches) {
            showTooltip(e);
        }
    });
    card.addEventListener('mouseleave', () => {
        if (window.matchMedia('(hover: hover)').matches) {
            hoverTimer = setTimeout(hideTooltip, 100);
        }
    });

    // 移动端：点击打开面板
    const openPanel = () => {
        try {
            const ctx = collectContext();
            const html = buildExplainHtml(ctx);
            document.getElementById('breakevenRoiPanelContent').innerHTML = html;
            overlay.style.display = 'block';
        } catch (_) {}
    };
    const closePanel = () => {
        overlay.style.display = 'none';
    };
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closePanel();
    });
    overlay.querySelector('#breakevenRoiCloseBtn').addEventListener('click', closePanel);
    card.addEventListener('click', () => {
        if (!window.matchMedia('(hover: hover)').matches) {
            openPanel();
        }
    });
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
                { label: '全店付费占比', value: Number(adRate||0).toFixed(1), unit: '%' },
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

        // 若标价页激活，则输出标价上下文；否则输出售价上下文
        const listpriceTabActive = document.getElementById('listpriceTab')?.classList.contains('active');
        if (listpriceTabActive) {
            const targetFinalPrice = document.getElementById('targetFinalPrice')?.value;
            const selectedRates = Array.from(document.querySelectorAll('.lp-rate')).filter(x=>x.checked).map(x=>Number(x.value||0));
            const tiers = Array.from(document.querySelectorAll('#fullReductionList .tier-row')).map(row=>({
                threshold: parseFloat(row.querySelector('.tier-threshold').value),
                off: parseFloat(row.querySelector('.tier-off').value)
            }));
            const finalPriceText = document.querySelector('.final-price .price-value')?.textContent || '';
            return {
                mode: 'listprice',
                inputsForBadges: [
                    { label: '目标到手价', value: Number(targetFinalPrice||0).toFixed(2), unit: '元' },
                    { label: '单品立减', value: selectedRates.length? selectedRates.map(r=>`${(r*100).toFixed(0)}%`).join(' / ') : '无' },
                    { label: '满减', value: (tiers && tiers.length) ? tiers.map(t=>`满${Number(t.threshold||0).toFixed(0)}减${Number(t.off||0).toFixed(0)}`).join('，') : '无' }
                ],
                conclusion: finalPriceText ? `目标到手价 ${finalPriceText.replace(/^¥\s?/, '¥ ')}` : ''
            };
        } else {
        return {
            mode: 'price',
            inputsForBadges: [
                { label: '进货价', value: Number(costPrice||0).toFixed(2), unit: '元' },
                { label: '开票成本', value: Number(inputTaxRate||0).toFixed(1), unit: '%' },
                { label: '进项税率', value: Number(outputTaxRate||0).toFixed(1), unit: '%' },
                { label: '销项税率', value: Number(salesTaxRate||0).toFixed(1), unit: '%' },
                { label: '平台佣金', value: Number(platformRate||0).toFixed(1), unit: '%' },
                { label: '全店付费占比', value: Number(adRate||0).toFixed(1), unit: '%' },
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
}


/**
 * 批量利润率推演：初始化入口按钮与浮窗
 * 功能目标：
 * - 在“利润计算”页基于当前参数，批量推演不同“全店付费占比×预计退货率”组合下的利润率
 * - 仅枚举两类档位：
 *   • 全店付费占比：15%、20%、25%、30%
 *   • 预计退货率：8%、12%、15%、18%、20%、25%
 * - 以浮窗表格展示：行=退货率，列=付费占比，单元格=利润率（%）
 */
function initBatchProfitScenario() {
    const btn = document.getElementById('btnBatchScenario');
    if (!btn) return;

    // 懒创建：浮窗DOM（遮罩+面板）
    let overlay = null;
    let panel = null;

    // 生成（或刷新）内容区域HTML
    const buildPanelContent = (overrideBase) => {
        // 读取当前利润页的基础参数；支持覆写（用于弹窗内即时改价）
        const base = overrideBase || getProfitBaseInputs();

        // 固定档位（按需求枚举）
        // 新增 0%：观察“不投广告”情况下在不同退货率下的利润率
        // 付费占比：0%、10%、15%、20%、25%、30%、35%（以小数表示，按从小到大排序）
        const adRates = [0.00, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35];
        // 新增退货率 5% 与 28% 两档 → 共 8 档：5、8、12、15、18、20、25、28（以小数表示）
        const returnRates = [0.05, 0.08, 0.12, 0.15, 0.18, 0.20, 0.25, 0.28];

        // 计算矩阵结果
        const rows = returnRates.map(rr => {
            const cells = adRates.map(ar => {
                const res = computeProfitScenario(base, ar, rr);
                return {
                    adRate: ar,
                    returnRate: rr,
                    profit: res.profit,
                    profitRate: res.profitRate
                };
            });
            return { rr, cells };
        });

        // 渲染表格（使用内联样式，避免侵入全局CSS）
        // 价格相关即时指标：加价倍率、毛利率（按“仅基于价格”的直观口径计算）
        const markup = (base.costPrice > 0 && base.actualPrice > 0) ? (base.actualPrice / base.costPrice) : NaN;
        const grossMargin = (base.actualPrice > 0 && base.costPrice > 0) ? ((base.actualPrice - base.costPrice) / base.actualPrice) : NaN;
        const markupText = isFinite(markup) ? markup.toFixed(2) : '-';
        const grossText = isFinite(grossMargin) ? (grossMargin * 100).toFixed(2) : '-';

        const headerBadges = `
            <div class=\"batch-badges\">
                <label class=\"batch-badge emphasis input\">
                    <span>进货价：</span>
                    <input id=\"batchCostPrice\" type=\"number\" step=\"0.01\" min=\"0.01\" value=\"${base.costPrice.toFixed(2)}\" />
                </label>
                <label class=\"batch-badge emphasis input\">
                    <span>实际售价：</span>
                    <input id=\"batchActualPrice\" type=\"number\" step=\"0.01\" min=\"0.01\" value=\"${base.actualPrice.toFixed(2)}\" />
                </label>
                <label class=\"batch-badge emphasis metric\" title=\"加价倍率 = 实际售价 ÷ 进货价\">加价倍率：<b id=\"badgeMarkupValue\">${markupText}</b></label>
                <label class=\"batch-badge emphasis metric\" title=\"毛利率 = (实际售价 − 进货价) ÷ 实际售价\">毛利率：<b id=\"badgeGrossMarginValue\">${grossText === '-' ? '-' : grossText + '%'}\n</b></label>
            </div>
            <div class="batch-badges">
                <span class="batch-badge">平台佣金：${(base.platformRate*100).toFixed(1)}%</span>
                <span class="batch-badge">销项税率：${(base.salesTaxRate*100).toFixed(1)}%</span>
                <span class="batch-badge">开票成本：${(base.inputTaxRate*100).toFixed(1)}%</span>
                <span class="batch-badge">商品进项税率：${(base.outputTaxRate*100).toFixed(1)}%</span>
                <span class="batch-badge">物流费：¥${base.shippingCost.toFixed(2)}</span>
                <span class="batch-badge">运费险：¥${base.shippingInsurance.toFixed(2)}</span>
                <span class="batch-badge">其他成本：¥${base.otherCost.toFixed(2)}</span>
            </div>`;

        const tableHeader = `
            <tr>
                <th style="position:sticky;left:0;background:#fff;z-index:2;border-bottom:1px solid #eee;text-align:left;padding:8px 10px;color:#666;font-weight:500;">退货率 \\ 付费占比</th>
                ${adRates.map(a => `<th style=\"border-bottom:1px solid #eee;padding:8px 10px;color:#333;font-weight:600;\">${(a*100).toFixed(0)}%</th>`).join('')}
                <!-- 新增列表头：每行（按退货率）对应的“保本ROI/保本推广占比”，与付费占比无关，仅受退货率影响 -->
                <th style="border-bottom:1px solid #eee;padding:8px 10px;color:#333;font-weight:600; white-space:nowrap;">保本ROI/推广占比</th>
            </tr>`;

        const tableRows = rows.map(r => {
            // 行首固定列：退货率
            const firstCol = `<td style=\"position:sticky;left:0;background:#fff;z-index:1;border-right:1px solid #f2f2f2;padding:8px 10px;color:#333;\">${(r.rr*100).toFixed(0)}%</td>`;
            // 单元格：不同付费占比下的利润率/利润
            const tds = r.cells.map(c => {
                // 利润率与利润金额：主副两行展示，利率更醒目，金额次要小一号
                const rate = (c.profitRate*100).toFixed(2);
                const profitText = `¥ ${c.profit.toFixed(2)}`;
                const color = c.profitRate > 0 ? '#2ea44f' : (c.profitRate < 0 ? '#d32f2f' : '#555');
                const bg = c.profitRate > 0 ? 'rgba(46,164,79,0.08)' : (c.profitRate < 0 ? 'rgba(211,47,47,0.08)' : 'transparent');
                // 重点标注：当利润率处于 [9.5%, 10.5%]（含）范围内，视为“最优解候选”
                // 视觉改为“前置小圆标”放在数字前，避免遮挡 %
                const isTarget = (c.profitRate >= 0.095 && c.profitRate <= 0.105);
                const targetStyle = '';
                const targetPrefix = isTarget ? '<span style="display:inline-flex;width:16px;height:16px;border-radius:999px;background:#0ea5e9;color:#fff;align-items:center;justify-content:center;font-size:11px;line-height:1;">✓</span>' : '';
                // 计算“保本 ROI / 保本付费占比”（受退货率影响）
                const roiRes = calculateBreakevenROI({
                    costPrice: base.costPrice,
                    inputTaxRate: base.inputTaxRate,
                    outputTaxRate: base.outputTaxRate,
                    salesTaxRate: base.salesTaxRate,
                    platformRate: base.platformRate,
                    shippingCost: base.shippingCost,
                    shippingInsurance: base.shippingInsurance,
                    otherCost: base.otherCost,
                    returnRate: c.returnRate,
                    finalPrice: base.actualPrice
                });
                const breakevenROIText = isFinite(roiRes.breakevenROI) ? roiRes.breakevenROI.toFixed(2) : '∞';
                const breakevenAdRateText = isFinite(roiRes.breakevenAdRate) ? `${(roiRes.breakevenAdRate*100).toFixed(2)}%` : '-';
                // 自定义悬浮提示：立即显示，无需等待浏览器 title 的延迟
                const tooltipData = `广告占比 ${(c.adRate*100).toFixed(0)}%｜退货率 ${(c.returnRate*100).toFixed(0)}%\n利润 ${profitText}｜利润率 ${rate}%\n保本ROI ${breakevenROIText}｜保本付费占比 ${breakevenAdRateText}`;
                return `<td class="profit-cell" data-tooltip="${tooltipData}" style="padding:8px 10px;text-align:right;color:${color};background:${bg};cursor:help;${targetStyle}">
                             <div style="display:flex;align-items:center;gap:6px;justify-content:flex-end;">
                                 ${targetPrefix}
                                 <div style="font-weight:600;">${rate}%</div>
                             </div>
                             <div style="font-size:12px;opacity:0.9;">${profitText}</div>
                        </td>`;
            }).join('');
            // 新增列：与付费占比无关，仅按本行退货率计算一次保本ROI与保本推广占比
            // 中文注释：该列用于直观看到在当前退货率下，要想保本（利润=0）时的ROI阈值与对应的广告占比阈值
            const rowBreakeven = (function(){
                try{
                    const res = calculateBreakevenROI({
                        costPrice: base.costPrice,
                        inputTaxRate: base.inputTaxRate,
                        outputTaxRate: base.outputTaxRate,
                        salesTaxRate: base.salesTaxRate,
                        platformRate: base.platformRate,
                        shippingCost: base.shippingCost,
                        shippingInsurance: base.shippingInsurance,
                        otherCost: base.otherCost,
                        returnRate: r.rr,
                        finalPrice: base.actualPrice
                    });
                    const roiText = isFinite(res.breakevenROI) ? res.breakevenROI.toFixed(2) : '∞';
                    const adText = isFinite(res.breakevenAdRate) ? `${(res.breakevenAdRate*100).toFixed(2)}%` : '-';
                    return {roiText, adText};
                }catch(_){ return {roiText:'-', adText:'-'} }
            })();
            const extraCol = `<td style=\"padding:8px 10px;text-align:right;color:#333;\"><div style=\"font-weight:600;\">${rowBreakeven.roiText}</div><div style=\"font-size:12px;opacity:0.9;\">${rowBreakeven.adText}</div></td>`;
            return `<tr>${firstCol}${tds}${extraCol}</tr>`;
        }).join('');

        const table = `
            <div class="batch-table-container" style="overflow:auto;max-height:56vh;border:1px solid #eee;border-radius:8px;">
                <table style="border-collapse:separate;border-spacing:0;width:100%;min-width:520px;font-size:13px;">
                    <thead style="position:sticky;top:0;background:#fff;">${tableHeader}</thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>`;

        return `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <div style="font-weight:600;">批量利润率推演</div>
                <div style="display:flex;gap:10px;align-items:center;">
                    <div class="switch-wrapper switch-chip" title="与“费用设置-平台费用-免佣”联动">
                        <span class="switch-label">免佣</span>
                        <label class="switch">
                            <input type="checkbox" id="batchPlatformFreeToggle">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <button id="btnBatchScenarioRefresh" class="batch-modal-btn primary">刷新</button>
                    <button id="btnBatchScenarioClose" class="batch-modal-btn">关闭</button>
                </div>
            </div>
            <div style="color:#666;font-size:12px;margin-bottom:6px;">仅变动“全店付费占比”与“预计退货率”，其余参数沿用当前利润页设置：</div>
            ${headerBadges}
            ${table}
            <div style="margin-top:10px;color:#999;font-size:12px;">提示：绿色为盈利，红色为亏损。单元格悬停可查看对应组合的利润金额与利润率。</div>
        `;
    };

    /**
     * 只生成利润表格内容，用于实时更新而不重新渲染整个弹窗
     * 参数：base - 计算参数
     */
    const buildProfitTable = (base) => {
        // 固定档位（按需求枚举）
        // 新增 0%：观察“不投广告”情况下在不同退货率下的利润率
        // 付费占比：0%、10%、15%、20%、25%、30%、35%（以小数表示，按从小到大排序）
        const adRates = [0.00, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35];
        // 新增退货率 5% 与 28% 两档 → 共 8 档：5、8、12、15、18、20、25、28（以小数表示）
        const returnRates = [0.05, 0.08, 0.12, 0.15, 0.18, 0.20, 0.25, 0.28];

        // 计算矩阵结果
        const rows = returnRates.map(rr => {
            const cells = adRates.map(ar => {
                const res = computeProfitScenario(base, ar, rr);
                return {
                    adRate: ar,
                    returnRate: rr,
                    profit: res.profit,
                    profitRate: res.profitRate
                };
            });
            return { rr, cells };
        });

        // 渲染表格
        const tableHeader = `
            <tr>
                <th style="position:sticky;left:0;background:#fff;z-index:2;border-bottom:1px solid #eee;text-align:left;padding:8px 10px;color:#666;font-weight:500;">退货率 \\ 付费占比</th>
                ${adRates.map(a => `<th style=\"border-bottom:1px solid #eee;padding:8px 10px;color:#333;font-weight:600;\">${(a*100).toFixed(0)}%</th>`).join('')}
                <!-- 新增列表头（同步刷新版本）：保本ROI/保本推广占比 -->
                <th style="border-bottom:1px solid #eee;padding:8px 10px;color:#333;font-weight:600; white-space:nowrap;">保本ROI/推广占比</th>
            </tr>`;

        const tableRows = rows.map(r => {
            // 行首固定列：退货率
            const firstCol = `<td style=\"position:sticky;left:0;background:#fff;z-index:1;border-right:1px solid #f2f2f2;padding:8px 10px;color:#333;\">${(r.rr*100).toFixed(0)}%</td>`;
            // 单元格：不同付费占比下的利润率/利润
            const tds = r.cells.map(c => {
                // 利润率与利润金额：主副两行展示，利率更醒目，金额次要小一号
                const rate = (c.profitRate*100).toFixed(2);
                const profitText = `¥ ${c.profit.toFixed(2)}`;
                const color = c.profitRate > 0 ? '#2ea44f' : (c.profitRate < 0 ? '#d32f2f' : '#555');
                const bg = c.profitRate > 0 ? 'rgba(46,164,79,0.08)' : (c.profitRate < 0 ? 'rgba(211,47,47,0.08)' : 'transparent');
                // 重点标注范围：[9.5%, 10.5%]（含），改为“数字前小圆标”避免遮挡
                const isTarget = (c.profitRate >= 0.095 && c.profitRate <= 0.105);
                const targetStyle = '';
                const targetPrefix = isTarget ? '<span style="display:inline-flex;width:16px;height:16px;border-radius:999px;background:#0ea5e9;color:#fff;align-items:center;justify-content:center;font-size:11px;line-height:1;">✓</span>' : '';
                const title = `广告占比 ${(c.adRate*100).toFixed(0)}%｜退货率 ${(c.returnRate*100).toFixed(0)}%\n利润 ${profitText}｜利润率 ${rate}%`;
                return `<td title="${title}" style="padding:8px 10px;text-align:right;color:${color};background:${bg};${targetStyle}">
                            <div style="display:flex;align-items:center;gap:6px;justify-content:flex-end;">
                                ${targetPrefix}
                                <div style="font-weight:600;">${rate}%</div>
                            </div>
                            <div style="font-size:12px;opacity:0.9;">${profitText}</div>
                        </td>`;
            }).join('');
            // 新增列（同步版本）：仅按本行退货率计算一次保本ROI/保本推广占比
            // 中文注释：本列不依赖“付费占比”，数值随退货率变化
            const rowBreakeven = (function(){
                try{
                    const res = calculateBreakevenROI({
                        costPrice: base.costPrice,
                        inputTaxRate: base.inputTaxRate,
                        outputTaxRate: base.outputTaxRate,
                        salesTaxRate: base.salesTaxRate,
                        platformRate: base.platformRate,
                        shippingCost: base.shippingCost,
                        shippingInsurance: base.shippingInsurance,
                        otherCost: base.otherCost,
                        returnRate: r.rr,
                        finalPrice: base.actualPrice
                    });
                    const roiText = isFinite(res.breakevenROI) ? res.breakevenROI.toFixed(2) : '∞';
                    const adText = isFinite(res.breakevenAdRate) ? `${(res.breakevenAdRate*100).toFixed(2)}%` : '-';
                    return {roiText, adText};
                }catch(_){ return {roiText:'-', adText:'-'} }
            })();
            const extraCol = `<td style=\"padding:8px 10px;text-align:right;color:#333;\"><div style=\"font-weight:600;\">${rowBreakeven.roiText}</div><div style=\"font-size:12px;opacity:0.9;\">${rowBreakeven.adText}</div></td>`;
            return `<tr>${firstCol}${tds}${extraCol}</tr>`;
        }).join('');

        return `
            <table style="border-collapse:separate;border-spacing:0;width:100%;min-width:520px;font-size:13px;">
                <thead style="position:sticky;top:0;background:#fff;">${tableHeader}</thead>
                <tbody>${tableRows}</tbody>
            </table>
        `;
    };

    const ensureOverlay = () => {
        if (overlay && panel) return;
        overlay = document.createElement('div');
        overlay.id = 'batchScenarioOverlay';
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.background = 'rgba(0,0,0,0.35)';
        overlay.style.zIndex = '10000';
        overlay.style.display = 'none';

        panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.left = '50%';
        panel.style.top = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.width = '92%';
        panel.style.maxWidth = '860px';
        panel.style.maxHeight = '80vh';
        panel.style.overflow = 'auto';
        panel.style.background = '#fff';
        panel.style.borderRadius = '12px';
        panel.style.boxShadow = '0 12px 36px rgba(0,0,0,0.18)';
        panel.style.padding = '16px';
        overlay.appendChild(panel);

        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        document.body.appendChild(overlay);
    };

    const open = () => {
        ensureOverlay();
        try {
            panel.innerHTML = buildPanelContent();
        } catch (e) {
            panel.innerHTML = `<div style="color:#d32f2f;">${e && e.message ? e.message : '参数无效，无法推演'}</div>`;
        }
        overlay.style.display = 'block';
        // 绑定事件（抽成函数，便于刷新后重新绑定）
        const wireEvents = () => {
            const btnClose = panel.querySelector('#btnBatchScenarioClose');
            if (btnClose) btnClose.addEventListener('click', close);
            const btnRefresh = panel.querySelector('#btnBatchScenarioRefresh');
            if (btnRefresh) btnRefresh.addEventListener('click', () => {
                try {
                    // 刷新时优先保留弹窗里的“进货价/实际售价”输入，不回退到外部输入
                    const base = getProfitBaseInputs();
                    const ci = panel.querySelector('#batchCostPrice');
                    const ai = panel.querySelector('#batchActualPrice');
                    const cVal = parseFloat(ci && ci.value || '');
                    const aVal = parseFloat(ai && ai.value || '');
                    if (isFinite(cVal) && cVal > 0) base.costPrice = cVal;
                    if (isFinite(aVal) && aVal > 0) base.actualPrice = aVal;
                    panel.innerHTML = buildPanelContent(base);
                    wireEvents();
                } catch (e) { showToast(e && e.message ? e.message : '刷新失败'); }
            });

            // 悬停提示：委托到表格容器，悬停即显
            // 说明：使用事件委托以适配表格的局部刷新（只更新 .batch-table-container 内部 HTML），避免丢失事件绑定
            const attachTooltipDelegation = () => {
                const container = panel.querySelector('.batch-table-container');
                if (!container) return;

                // 创建（或复用）提示元素，使用内联样式，避免侵入全局 CSS
                let tooltip = document.querySelector('.custom-tooltip');
                if (!tooltip) {
                    tooltip = document.createElement('div');
                    tooltip.className = 'custom-tooltip';
                    // 自定义提示样式：深色背景，白字，圆角，阴影；white-space: pre 以支持换行
                    Object.assign(tooltip.style, {
                        position: 'fixed',
                        zIndex: '10001',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        background: 'rgba(17,24,39,0.92)',
                        color: '#fff',
                        fontSize: '12px',
                        lineHeight: '1.4',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                        pointerEvents: 'none',
                        whiteSpace: 'pre',
                        transition: 'opacity .08s ease',
                        opacity: '0'
                    });
                    document.body.appendChild(tooltip);
                }

                const showTooltip = (text, x, y) => {
                    // 即显：不做延时，直接更新位置与内容
                    tooltip.textContent = text;
                    const offset = 12;
                    tooltip.style.left = `${x + offset}px`;
                    tooltip.style.top = `${y + offset}px`;
                    tooltip.style.opacity = '1';
                };
                const hideTooltip = () => { tooltip.style.opacity = '0'; };

                // 事件委托：mouseover/mousemove/mouseleave
                const onOver = (e) => {
                    const cell = e.target.closest('.profit-cell');
                    if (!cell || !container.contains(cell)) return;
                    const text = cell.getAttribute('data-tooltip');
                    if (text) showTooltip(text, e.clientX, e.clientY);
                };
                const onMove = (e) => {
                    const cell = e.target.closest('.profit-cell');
                    if (!cell || !container.contains(cell)) return hideTooltip();
                    const text = cell.getAttribute('data-tooltip');
                    if (text) showTooltip(text, e.clientX, e.clientY);
                };
                const onLeave = () => hideTooltip();

                container.addEventListener('mouseover', onOver);
                container.addEventListener('mousemove', onMove);
                container.addEventListener('mouseleave', onLeave);
            };
            attachTooltipDelegation();

            // 输入框：修改进货价/实际售价后，延迟刷新矩阵，保持光标位置，并不改动主页面值（只影响本次推演）
            const costInput = panel.querySelector('#batchCostPrice');
            const actualInput = panel.querySelector('#batchActualPrice');
            
            // 即时更新“加价倍率/毛利率”徽章（仅更新文本，不重绘DOM，保证不失焦）
            const updateHeaderMetrics = () => {
                try {
                    const cost = parseFloat(costInput?.value || '');
                    const price = parseFloat(actualInput?.value || '');
                    const elMarkup = panel.querySelector('#badgeMarkupValue');
                    const elGross = panel.querySelector('#badgeGrossMarginValue');
                    if (!elMarkup || !elGross) return;
                    if (!isFinite(cost) || cost <= 0 || !isFinite(price) || price <= 0) {
                        elMarkup.textContent = '-';
                        elGross.textContent = '-';
                        return;
                    }
                    const m = price / cost;
                    const g = (price - cost) / price * 100;
                    elMarkup.textContent = m.toFixed(2);
                    elGross.textContent = g.toFixed(2) + '%';
                } catch(_) {}
            };

            // 防抖函数：延迟执行重算，只更新表格内容，保持输入框焦点
            let debounceTimer = null;
            const debouncedRecalculate = (base) => {
                if (debounceTimer) clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    try {
                        // 只更新表格内容，不重新渲染整个弹窗，保持输入框焦点
                        const tableContainer = panel.querySelector('.batch-table-container');
                        if (tableContainer) {
                            const newTableContent = buildProfitTable(base);
                            tableContainer.innerHTML = newTableContent;
                        }
                    } catch (_) {}
                }, 500); // 500ms延迟，给用户足够时间完成输入
            };
            
            const onInlineChange = () => {
                // 先即时更新头部“加价倍率/毛利率”展示
                updateHeaderMetrics();
                const cost = parseFloat(costInput?.value || '');
                const price = parseFloat(actualInput?.value || '');
                if (!isFinite(cost) || cost <= 0 || !isFinite(price) || price <= 0) return;
                
                // 临时覆写基础参数，用以生成新矩阵
                const base = getProfitBaseInputs();
                base.costPrice = cost;
                base.actualPrice = price;
                
                // 使用防抖重算，保持光标位置
                debouncedRecalculate(base);
            };
            
            if (costInput) costInput.addEventListener('input', onInlineChange);
            if (actualInput) actualInput.addEventListener('input', onInlineChange);
            // 打开弹窗后，初始化一次头部指标，确保显示与输入同步
            updateHeaderMetrics();

            // 免佣联动：与利润页顶部/费用设置中的免佣开关保持同步；切换后即时重算表格
            const batchToggle = panel.querySelector('#batchPlatformFreeToggle');
            if (batchToggle) {
                try {
                    const topToggle = document.getElementById('profitPlatformFreeToggleTop');
                    const mainToggle = document.getElementById('profitPlatformFreeToggle');
                    const currentOn = !!(topToggle?.checked || mainToggle?.checked);
                    batchToggle.checked = currentOn;
                } catch (_) {}
                batchToggle.addEventListener('change', () => {
                    try {
                        const topToggle = document.getElementById('profitPlatformFreeToggleTop');
                        const mainToggle = document.getElementById('profitPlatformFreeToggle');
                        if (topToggle) {
                            topToggle.checked = batchToggle.checked;
                            topToggle.dispatchEvent(new Event('change', { bubbles: true }));
                        } else if (mainToggle) {
                            mainToggle.checked = batchToggle.checked;
                            mainToggle.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    } catch (_) {}
                    // 切换后立即按最新参数重绘内容：优先保留弹窗内的“进货价/实际售价”
                    try {
                        const base = getProfitBaseInputs();
                        const ci = panel.querySelector('#batchCostPrice');
                        const ai = panel.querySelector('#batchActualPrice');
                        const cVal = parseFloat(ci && ci.value || '');
                        const aVal = parseFloat(ai && ai.value || '');
                        if (isFinite(cVal) && cVal > 0) base.costPrice = cVal;
                        if (isFinite(aVal) && aVal > 0) base.actualPrice = aVal;
                        panel.innerHTML = buildPanelContent(base);
                        wireEvents();
                    } catch (_) {}
                });
            }
        };
        wireEvents();
    };

    const close = () => { if (overlay) overlay.style.display = 'none'; };

    btn.addEventListener('click', () => {
        // 仅当利润页激活时开放；避免切到“售价计算”页时的误操作
        const profitTabActive = document.getElementById('profitTab')?.classList.contains('active');
        if (!profitTabActive) { showToast('请先切换到“利润计算”页'); return; }
        open();
    });
}

/**
 * 读取利润页基础输入（用于批量推演），并做范围校验
 * 返回：一组标准化参数（百分比转小数）
 */
function getProfitBaseInputs() {
    const base = {
        costPrice: validateInput(parseFloat(document.getElementById('profitCostPrice').value), 0.01, 1000000, '进货价'),
        actualPrice: validateInput(parseFloat(document.getElementById('actualPrice').value), 0.01, 1000000, '实际售价'),
        inputTaxRate: validateInput(parseFloat(document.getElementById('profitInputTaxRate').value), 0, 100, '开票成本') / 100,
        outputTaxRate: validateInput(parseFloat(document.getElementById('profitOutputTaxRate').value), 0, 100, '商品进项税率') / 100,
        salesTaxRate: validateInput(parseFloat(document.getElementById('profitSalesTaxRate').value), 0, 100, '销项税率') / 100,
        platformRate: validateInput(parseFloat(document.getElementById('profitPlatformRate').value), 0, 100, '平台抽佣比例') / 100,
        shippingCost: validateInput(parseFloat(document.getElementById('profitShippingCost').value), 0, 10000, '物流费'),
        shippingInsurance: validateInput(parseFloat(document.getElementById('profitShippingInsurance').value), 0, 100, '运费险'),
        otherCost: validateInput(parseFloat(document.getElementById('profitOtherCost').value), 0, 10000, '其他成本')
    };
    return base;
}

/**
 * 基于利润页口径，计算给定“广告占比/退货率”组合下的利润与利润率（复用 calculateProfit 的口径）
 * 参数：
 * - base：getProfitBaseInputs() 返回的固定参数
 * - adRate：全店付费占比（0~1 小数）
 * - returnRate：预计退货率（0~1 小数）
 * 返回：{ profit, profitRate }，其中 profitRate 为小数（如 0.123 表示 12.3%）
 */
function computeProfitScenario(base, adRate, returnRate) {
    // 进货成本相关
    const invoiceCost = base.costPrice * base.inputTaxRate;            // 开票成本
    const totalPurchaseCost = base.costPrice + invoiceCost;            // 总进货成本
    const purchaseVAT = base.costPrice * base.outputTaxRate;           // 商品进项税
    const effectiveCost = totalPurchaseCost;                           // 实际成本

    // 有效率与按(1-退货率)分摊的费用
    const effectiveRate = 1 - returnRate;                              // 有效销售率
    const platformFee = base.actualPrice * base.platformRate;          // 平台佣金（可退回）
    const adCost = base.actualPrice * adRate;                          // 广告费（不可退回，需分摊）
    const adCostEffective = adCost / effectiveRate;                    // 广告费分摊
    const adVAT = adCostEffective * 0.06;                              // 广告费进项税抵扣（6%）

    const shippingCostEffective = base.shippingCost / effectiveRate;   // 物流费分摊
    const insuranceCostEffective = base.shippingInsurance / effectiveRate; // 运费险分摊
    const otherCostEffective = base.otherCost / effectiveRate;         // 其他成本分摊

    // 销项税相关
    const netPrice = base.actualPrice / (1 + base.salesTaxRate);       // 不含税售价
    const outputVAT = netPrice * base.salesTaxRate;                    // 销项税额

    // 进项抵扣合计（商品 + 广告费 + 平台佣金）
    const totalVATDeduction = purchaseVAT + adVAT + (platformFee * 0.06);
    const actualVAT = outputVAT - totalVATDeduction;                   // 实缴税费

    // 总成本与利润
    const totalCost = effectiveCost + platformFee + adCostEffective + shippingCostEffective + insuranceCostEffective + otherCostEffective + actualVAT;
    const profit = base.actualPrice - totalCost;
    const profitRate = profit / base.actualPrice;                      // 小数

    return { profit, profitRate };
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
