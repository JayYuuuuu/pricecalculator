// 价格指标计算过程浮窗函数（主页面价格指标专用）
function showPriceMetricTooltip(event, metricType) {
    // 移除已存在的浮层
    hidePriceMetricTooltip();
    
    // 获取当前价格指标的计算数据
    const costPrice = parseFloat(document.getElementById('profitCostPrice')?.value || '0');
    const actualPrice = parseFloat(document.getElementById('actualPrice')?.value || '0');
    const inputTaxRate = parseFloat(document.getElementById('profitInputTaxRate')?.value || '0') / 100;
    
    if (!costPrice || !actualPrice) {
        return; // 如果没有有效数据，不显示浮窗
    }
    
    // 计算进货实际成本
    const invoiceCost = costPrice * inputTaxRate;
    const effectiveCost = costPrice + invoiceCost;
    
    // 根据指标类型生成不同的计算过程说明
    let tooltipContent = '';
    let tooltipTitle = '';
    
    if (metricType === 'multiple') {
        tooltipTitle = '加价倍率计算过程';
        tooltipContent = `加价倍率 = 含税售价 ÷ 进货实际成本

具体计算：
• 含税售价：¥${actualPrice.toFixed(2)}
• 进货价（不含税）：¥${costPrice.toFixed(2)}
• 开票成本：¥${costPrice.toFixed(2)} × ${(inputTaxRate * 100).toFixed(1)}% = ¥${invoiceCost.toFixed(2)}
• 进货实际成本：¥${costPrice.toFixed(2)} + ¥${invoiceCost.toFixed(2)} = ¥${effectiveCost.toFixed(2)}

加价倍率 = ¥${actualPrice.toFixed(2)} ÷ ¥${effectiveCost.toFixed(2)} = ${(actualPrice / effectiveCost).toFixed(2)}倍`;
    } else if (metricType === 'gross') {
        tooltipTitle = '毛利率计算过程';
        tooltipContent = `毛利率 = (含税售价 - 进货实际成本) ÷ 含税售价 × 100%

具体计算：
• 含税售价：¥${actualPrice.toFixed(2)}
• 进货价（不含税）：¥${costPrice.toFixed(2)}
• 开票成本：¥${costPrice.toFixed(2)} × ${(inputTaxRate * 100).toFixed(1)}% = ¥${invoiceCost.toFixed(2)}
• 进货实际成本：¥${costPrice.toFixed(2)} + ¥${invoiceCost.toFixed(2)} = ¥${effectiveCost.toFixed(2)}

毛利率 = (¥${actualPrice.toFixed(2)} - ¥${effectiveCost.toFixed(2)}) ÷ ¥${actualPrice.toFixed(2)} × 100%
      = ¥${(actualPrice - effectiveCost).toFixed(2)} ÷ ¥${actualPrice.toFixed(2)} × 100%
      = ${(((actualPrice - effectiveCost) / actualPrice) * 100).toFixed(2)}%`;
    }
    
    // 创建浮层元素，使用与税费占比浮窗相同的样式
    const tooltip = document.createElement('div');
    tooltip.id = 'price-metric-tooltip';
    
    // 使用与税费占比浮窗完全相同的样式
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
        opacity: '0',
        maxWidth: '400px'
    });
    
    // 设置浮窗内容
    tooltip.innerHTML = `${tooltipTitle}

${tooltipContent}`;
    
    // 添加到页面
    document.body.appendChild(tooltip);
    
    // 显示浮窗并设置初始位置
    displayPriceMetricTooltip(event, tooltip);
    
    // 为当前元素添加鼠标移动事件，实现跟随鼠标移动
    const currentElement = event.currentTarget;
    
    // 鼠标移动事件（更新浮层位置）
    const mousemoveHandler = (e) => {
        updatePriceMetricTooltipPosition(e, tooltip);
    };
    
    // 鼠标离开事件
    const mouseleaveHandler = () => {
        hidePriceMetricTooltip();
        // 清理事件监听器
        currentElement.removeEventListener('mousemove', mousemoveHandler);
        currentElement.removeEventListener('mouseleave', mouseleaveHandler);
    };
    
    // 添加事件监听器
    currentElement.addEventListener('mousemove', mousemoveHandler);
    currentElement.addEventListener('mouseleave', mouseleaveHandler);
}

// 显示价格指标浮窗
function displayPriceMetricTooltip(event, tooltip) {
    // 检查tooltip参数是否存在
    if (!tooltip) {
        console.warn('displayPriceMetricTooltip: tooltip参数为空');
        return;
    }
    // 即显：不做延时，直接更新位置与内容
    updatePriceMetricTooltipPosition(event, tooltip);
    tooltip.style.opacity = '1';
}

// 隐藏价格指标浮窗
function hidePriceMetricTooltip() {
    const tooltip = document.getElementById('price-metric-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
        // 延迟移除DOM元素，确保过渡动画完成
        setTimeout(() => {
            if (tooltip && tooltip.parentNode) {
                tooltip.remove();
            }
        }, 80);
    }
}

// 更新价格指标浮窗位置
function updatePriceMetricTooltipPosition(event, tooltip) {
    // 检查参数是否存在
    if (!event || !tooltip) {
        console.warn('updatePriceMetricTooltipPosition: 参数为空', { event: !!event, tooltip: !!tooltip });
        return;
    }
    
    const offset = 12;
    tooltip.style.left = `${event.clientX + offset}px`;
    tooltip.style.top = `${event.clientY + offset}px`;
}

// 自定义浮层提示函数（商品清单利润推演专用）
function showCatalogTooltip(text, x, y) {
	// 移除已存在的浮层
	hideCatalogTooltip();
	
	// 创建浮层元素
	const tooltip = document.createElement('div');
	tooltip.id = 'catalog-tooltip';
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
		opacity: '1',
		maxWidth: '360px'
	});
	tooltip.textContent = text;
	
	    // 添加到页面
    document.body.appendChild(tooltip);
    
    // 初始状态隐藏浮层
    tooltip.style.display = 'none';
	
	// 基于鼠标位置定位浮层
	const offset = 12;
	tooltip.style.left = `${x + offset}px`;
	tooltip.style.top = `${y + offset}px`;
}

function hideCatalogTooltip() {
	const tooltip = document.getElementById('catalog-tooltip');
	if (tooltip) {
		tooltip.remove();
	}
}

// 统一的利润计算函数（与利润率计算tab完全一致）
function calculateProfitUnified(inputs) {
    try {
        const {
            costPrice,           // 进货价（不含税）
            actualPrice,         // 实际售价（含税）
            inputTaxRate,        // 开票成本比例
            outputTaxRate,       // 商品进项税率
            salesTaxRate,        // 销项税率
            platformRate,        // 平台佣金比例
            shippingCost,        // 物流费
            shippingInsurance,   // 运费险
            adRate,              // 广告费占比
            otherCost,           // 其他成本
            returnRate           // 退货率
        } = inputs;

        // 计算进货成本（与利润率计算tab完全一致）
        const invoiceCost = costPrice * inputTaxRate; // 开票成本
        const totalPurchaseCost = costPrice + invoiceCost; // 总进货成本（实际支付给供应商的金额）
        const purchaseVAT = costPrice * outputTaxRate; // 进项税额（用于抵减销项税）
        const effectiveCost = totalPurchaseCost; // 实际成本就是进货价+开票费用

        // 计算有效销售率
        const effectiveRate = 1 - returnRate;

        // 计算销售相关费用（考虑退货率，与利润率计算tab完全一致）
        const platformFee = actualPrice * platformRate; // 平台佣金（可退回）
        const adCost = actualPrice * adRate; // 广告费（不可退回，需分摊）
        const adCostEffective = adCost / effectiveRate; // 分摊后的广告费
        const adVAT = adCostEffective * 0.06 / 1.06; // 广告费可抵扣进项税（6%）：从含税金额中剥离税额
        
        // 运营成本（不可退回，需分摊）
        const operationalCostBase = shippingCost + shippingInsurance + otherCost;
        const operationalCost = operationalCostBase / effectiveRate;

        // 计算销项税
        const netPrice = actualPrice / (1 + salesTaxRate); // 不含税售价
        const outputVAT = netPrice * salesTaxRate; // 销项税额

        // 计算总可抵扣进项税（与利润率计算tab完全一致）
        const totalVATDeduction = purchaseVAT + adVAT + (platformFee * 0.06 / 1.06); // 商品+广告+平台佣金的进项税：平台佣金从含税金额中剥离税额
        const actualVAT = outputVAT - totalVATDeduction; // 实际应缴税额

        // 计算总成本（分别计算各项不可退回成本的分摊，与利润率计算tab完全一致）
        const shippingCostEffective = shippingCost / effectiveRate;  // 物流费分摊
        const insuranceCostEffective = shippingInsurance / effectiveRate;  // 运费险分摊
        const otherCostEffective = otherCost / effectiveRate;  // 其他成本分摊
        const totalCost = effectiveCost + platformFee + adCostEffective + shippingCostEffective + insuranceCostEffective + otherCostEffective + actualVAT;

        // 计算利润
        const profit = actualPrice - totalCost;
        const profitRate = profit / actualPrice;

        return {
            profit,
            profitRate,
            totalCost,
            actualVAT,
            totalVATDeduction,
            purchaseVAT,
            adVAT,
            platformVAT: platformFee * 0.06 / 1.06,
            effectiveCost,
            platformFee,
            adCostEffective,
            shippingCostEffective,
            insuranceCostEffective,
            otherCostEffective,
            netPrice,
            outputVAT
        };
    } catch (error) {
        console.error('统一利润计算函数错误:', error);
        return {
            profit: NaN,
            profitRate: NaN,
            totalCost: NaN,
            actualVAT: NaN,
            totalVATDeduction: NaN,
            purchaseVAT: NaN,
            adVAT: NaN,
            platformVAT: NaN,
            effectiveCost: NaN,
            platformFee: NaN,
            adCostEffective: NaN,
            shippingCostEffective: NaN,
            insuranceCostEffective: NaN,
            otherCostEffective: NaN,
            netPrice: NaN,
            outputVAT: NaN
        };
    }
}



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
    // 分享功能已移除
    // 针对商品清单页隐藏结果与分享模块，其它页面恢复显示
    try {
        const resultEl = document.getElementById('result');
        if (tabName === 'catalog' || tabName === 'listprice' || tabName === 'takehome') {
            if (resultEl) resultEl.style.display = 'none';
        } else {
            if (resultEl) resultEl.style.display = '';
        }
    } catch (_) {}

    // 若切到标价页，初始化立减档位并计算
    try {
        if (tabName === 'listprice') {
            // 初始化默认立减档位
            initDiscountRates();
            // 延迟一小段时间后计算，确保DOM更新完成
            setTimeout(() => {
                try {
                    calculateListPrice();
                } catch (error) {
                    console.warn('标价计算自动计算失败:', error);
                }
            }, 100);
        }
        // 若切到售价计算页，自动计算并显示结果
        if (tabName === 'price') {
            setTimeout(() => {
                try {
                    calculate();
                } catch (error) {
                    console.warn('售价计算自动计算失败:', error);
                }
            }, 100);
        }
        // 若切到利润计算页，自动计算并显示结果
        if (tabName === 'profit') {
            setTimeout(() => {
                try {
                    calculateProfit();
                } catch (error) {
                    console.warn('利润计算自动计算失败:', error);
                }
            }, 100);
        }
        // 若切到到手价推演页，初始化参数并尝试实时计算
        if (tabName === 'takehome') {
            console.log('切换到到手价推演tab');
            
            // 立即显示加载提示
            const takehomeTab = document.getElementById('takehomeTab');
            if (takehomeTab) {
                const loadingDiv = document.createElement('div');
                loadingDiv.id = 'takehomeLoading';
                loadingDiv.innerHTML = `
                    <div style="text-align:center; padding:40px; color:#6b7280;">
                        <div style="font-size:24px; margin-bottom:16px;">⏳</div>
                        <div style="font-size:16px; margin-bottom:8px;">正在加载推演数据...</div>
                        <div style="font-size:14px; color:#9ca3af;">请稍候</div>
                    </div>
                `;
                takehomeTab.appendChild(loadingDiv);
            }
            
            try { 
                // 减少延迟时间，提高响应速度
                setTimeout(() => {
                    console.log('开始初始化到手价推演tab');
                    if (typeof initTakeHomeTab === 'function') {
                        console.log('initTakeHomeTab函数存在，开始执行');
                        initTakeHomeTab(); 
                        
                        // 移除加载提示
                        const loadingDiv = document.getElementById('takehomeLoading');
                        if (loadingDiv) {
                            loadingDiv.remove();
                        }
                    } else {
                        console.warn('initTakeHomeTab函数未定义，请检查JavaScript加载');
                        console.log('可用函数:', Object.keys(window).filter(key => typeof window[key] === 'function' && key.includes('TakeHome')));
                        
                        // 移除加载提示并显示错误信息
                        const loadingDiv = document.getElementById('takehomeLoading');
                        if (loadingDiv) {
                            loadingDiv.innerHTML = `
                                <div style="text-align:center; padding:40px; color:#dc2626;">
                                    <div style="font-size:24px; margin-bottom:16px;">⚠️</div>
                                    <div style="font-size:16px; margin-bottom:8px;">初始化失败</div>
                                    <div style="font-size:14px; color:#9ca3af;">请刷新页面重试</div>
                                </div>
                            `;
                        }
                    }
                }, 300); // 减少延迟时间到300毫秒
            } catch (error) {
                console.error('到手价推演tab初始化失败:', error);
                
                // 移除加载提示并显示错误信息
                const loadingDiv = document.getElementById('takehomeLoading');
                if (loadingDiv) {
                    loadingDiv.innerHTML = `
                        <div style="text-align:center; padding:40px; color:#dc2626;">
                            <div style="font-size:24px; margin-bottom:16px;">❌</div>
                            <div style="font-size:16px; margin-bottom:8px;">初始化失败</div>
                            <div style="font-size:14px; color:#9ca3af;">${error.message}</div>
                        </div>
                    `;
                }
            }
        }
        // 若切到商品清单页，初始化并渲染（不影响其他页逻辑）
        if (tabName === 'catalog') {
            try { initCatalogTab(); } catch (_) {}
            try { renderCatalogTable(); } catch (_) {}
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
        // ===== 重构说明 =====
        // 本函数已重构为使用统一的利润计算函数 calculateProfitUnified()
        // 确保与商品清单利润推演弹窗的计算结果完全一致
        // 统一参数接口，消除计算差异
        // ===================
        
        // 获取基础输入并转换为统一参数格式
        const inputs = {
            costPrice: validateInput(parseFloat(document.getElementById('profitCostPrice').value), 0.01, 1000000, "进货价"),
            actualPrice: validateInput(parseFloat(document.getElementById('actualPrice').value), 0.01, 1000000, "实际售价"),
            inputTaxRate: validateInput(parseFloat(document.getElementById('profitInputTaxRate').value), 0, 100, "开票成本") / 100,
            outputTaxRate: validateInput(parseFloat(document.getElementById('profitOutputTaxRate').value), 0, 100, "商品进项税率") / 100,
            salesTaxRate: validateInput(parseFloat(document.getElementById('profitSalesTaxRate').value), 0, 100, "销项税率") / 100,
            platformRate: validateInput(parseFloat(document.getElementById('profitPlatformRate').value), 0, 100, "平台抽佣比例") / 100,
            shippingCost: validateInput(parseFloat(document.getElementById('profitShippingCost').value), 0, 10000, "物流费"),
            shippingInsurance: validateInput(parseFloat(document.getElementById('profitShippingInsurance').value), 0, 100, "运费险"),
            adRate: validateInput(parseFloat(document.getElementById('profitAdRate').value), 0, 100, "全店付费占比") / 100,
            otherCost: validateInput(parseFloat(document.getElementById('profitOtherCost').value), 0, 10000, "其他成本"),
            returnRate: validateInput(parseFloat(document.getElementById('profitReturnRate').value), 0, 100, "退货率") / 100
        };

        // 使用统一的利润计算函数，确保与商品清单利润推演弹窗结果完全一致
        const result = calculateProfitUnified(inputs);
        
        // 从统一计算结果中提取需要的变量，保持原有逻辑的兼容性
        const {
            profit,
            profitRate: profitRateDecimal,
            totalCost,
            actualVAT,
            totalVATDeduction,
            purchaseVAT,
            adVAT,
            effectiveCost,
            platformFee,
            adCostEffective,
            shippingCostEffective,
            insuranceCostEffective,
            otherCostEffective,
            netPrice,
            outputVAT
        } = result;
        
        // 计算有效销售率（用于后续计算）
        const effectiveRate = 1 - inputs.returnRate;
        
        // 计算开票成本（用于显示）
        const invoiceCost = inputs.costPrice * inputs.inputTaxRate;
        
        // 转换利润率为百分比格式
        const profitRate = (profitRateDecimal * 100).toFixed(2);

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

        // 计算并显示税费占比
        const taxRatio = (actualVAT / inputs.actualPrice * 100).toFixed(2);
        const taxRatioInput = document.getElementById('taxRatio');
        const taxRatioPercent = document.getElementById('taxRatioPercent');
        
        if (taxRatioInput && taxRatioPercent) {
            taxRatioInput.value = `¥ ${actualVAT.toFixed(2)}`;
            taxRatioPercent.textContent = `${taxRatio}%`;
            
            // 设置税费占比的样式
            if (actualVAT < 0) {
                taxRatioInput.className = 'tax-negative';
                taxRatioPercent.style.color = '#2ea44f'; // 绿色，表示退税
            } else {
                taxRatioInput.className = 'tax-positive';
                taxRatioPercent.style.color = '#e65100'; // 橙色，表示缴税
            }
            
            // 添加鼠标悬停显示详细税费计算过程的功能
            addTaxTooltip(taxRatioInput, {
                actualVAT,
                outputVAT,
                totalVATDeduction,
                purchaseVAT,
                adVAT,
                platformVAT: platformFee * 0.06 / 1.06,
                actualPrice: inputs.actualPrice,
                salesTaxRate: inputs.salesTaxRate * 100,  // 修复：使用inputs.salesTaxRate，并转换为百分比
                inputTaxRate: inputs.outputTaxRate * 100  // 商品进项税率，从inputs中获取，转换为百分比
            });
        }

        // 计算并更新价格指标（支持含税/不含税口径切换）
        try {
            // 获取当前口径设置
            const isTaxInclusive = !document.getElementById('taxViewToggle')?.checked;
            
            let metricMultiple, metricGrossMargin;
            
            if (isTaxInclusive) {
                // 含税口径：含税售价 vs 进货实际成本（不含进项税）
                // 使用从统一函数结果中提取的effectiveCost
                
                // 加价倍率：含税售价 ÷ 进货实际成本（含税）
                metricMultiple = (inputs.actualPrice / effectiveCost).toFixed(2); // 加价倍率 = 含税售价 ÷ 进货实际成本
                
                // 毛利率：(含税售价 - 进货实际成本) ÷ 含税售价
                metricGrossMargin = (((inputs.actualPrice - effectiveCost) / inputs.actualPrice) * 100).toFixed(2) + '%'; // 毛利率（基于含税口径）
            } else {
                // 不含税口径：不含税售价 vs 不含税进价
                // 使用从统一函数结果中提取的netPrice
                
                // 加价倍率：不含税售价 ÷ 不含税进价
                metricMultiple = (netPrice / inputs.costPrice).toFixed(2); // 加价倍率 = 不含税售价 ÷ 不含税进价
                
                // 毛利率：(不含税售价 - 不含税进价) ÷ 不含税售价
                metricGrossMargin = (((netPrice - inputs.costPrice) / netPrice) * 100).toFixed(2) + '%'; // 毛利率（基于不含税口径）
            }

            const elMultiple = document.getElementById('metricMultiple');
            const elGross = document.getElementById('metricGrossMargin');
            if (elMultiple) elMultiple.textContent = `${metricMultiple}倍`;
            if (elGross) elGross.textContent = metricGrossMargin;

            // 计算并展示保本ROI（利润=0时所需的GMV/广告费）
            const roiRes = calculateBreakevenROI({
                costPrice: inputs.costPrice,
                inputTaxRate: inputs.inputTaxRate,
                outputTaxRate: inputs.outputTaxRate,
                salesTaxRate: inputs.salesTaxRate,
                platformRate: inputs.platformRate,
                shippingCost: inputs.shippingCost,
                shippingInsurance: inputs.shippingInsurance,
                otherCost: inputs.otherCost,
                returnRate: inputs.returnRate,
                finalPrice: inputs.actualPrice
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
                costPrice: inputs.costPrice,
                actualPrice: inputs.actualPrice,
                inputTaxRate: inputs.inputTaxRate,
                outputTaxRate: inputs.outputTaxRate,
                salesTaxRate: inputs.salesTaxRate,
                platformRate: inputs.platformRate,
                shippingCost: inputs.shippingCost,
                shippingInsurance: inputs.shippingInsurance,
                adRate: inputs.adRate,
                otherCost: inputs.otherCost,
                returnRate: inputs.returnRate
            },
            purchase: {
                invoiceCost,
                totalPurchaseCost: effectiveCost, // 使用从统一函数结果中提取的值
                effectiveCost,
                purchaseVAT
            },
            rates: { effectiveRate },
            fees: {
                platformFee,
                adCost: inputs.actualPrice * inputs.adRate, // 重新计算以保持兼容性
                adCostEffective,
                shippingCostEffective,
                insuranceCostEffective,
                otherCostEffective,
                operationalCostBase: inputs.shippingCost + inputs.shippingInsurance + inputs.otherCost,
                operationalCost: (inputs.shippingCost + inputs.shippingInsurance + inputs.otherCost) / effectiveRate
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
                totalPurchaseCost: effectiveCost, // 使用从统一函数结果中提取的值
                effectiveCost,
                purchasePrice: inputs.costPrice,
                invoiceCost,
                purchaseVAT
            },
            salesCost: {
                operationalCosts: {
                    shipping: shippingCostEffective,
                    insurance: insuranceCostEffective,
                    advertising: adCostEffective,
                    other: otherCostEffective
                },
                adVAT,
                totalOperationalCost: (inputs.shippingCost + inputs.shippingInsurance + inputs.otherCost) / effectiveRate,
                totalVATDeduction,
                returnRate: inputs.returnRate,
                effectiveRate
            },
            priceInfo: {
                netPrice,
                finalPrice: inputs.actualPrice,
                platformFee,
                outputVAT,
                actualVAT,
                profit,
                profitRate,
                adCost: inputs.actualPrice * inputs.adRate,
                fixedCosts: (inputs.shippingCost + inputs.shippingInsurance + inputs.otherCost) / effectiveRate,
                adVAT,
                totalVATDeduction,
                effectiveNonReturnableCost: (inputs.shippingCost + inputs.shippingInsurance + inputs.otherCost + inputs.actualPrice * inputs.adRate) / effectiveRate,
                effectiveCostTotal: effectiveCost + (inputs.shippingCost + inputs.shippingInsurance + inputs.otherCost + inputs.actualPrice * inputs.adRate) / effectiveRate,
                taxFactorOnFinal: inputs.salesTaxRate / (1 + inputs.salesTaxRate),
                adFactorEffective: inputs.adRate / effectiveRate,
                adVatCreditFactor: 0.06 * (inputs.adRate / effectiveRate),
                profitFactorEffective: profit / inputs.actualPrice,
                platformVatCreditFactor: 0.06 * inputs.platformRate
            },
            inputs: {
                platformRate: inputs.platformRate,
                adRate: inputs.adRate,
                outputTaxRate: inputs.outputTaxRate,
                inputTaxRate: inputs.inputTaxRate,
                shippingCost: inputs.shippingCost,
                shippingInsurance: inputs.shippingInsurance,
                otherCost: inputs.otherCost,
                returnRate: inputs.returnRate
            }
        });
        // 启用分享按钮
        // 分享功能已移除

        // 计算保本建议售价（利润率=0），沿用售价联立口径
        try {
            const breakevenInputs = {
                costPrice: inputs.costPrice,
                inputTaxRate: inputs.inputTaxRate,
                outputTaxRate: inputs.salesTaxRate, // 商品税率=销项税率
                salesTaxRate: inputs.salesTaxRate,
                platformRate: inputs.platformRate,
                shippingCost: inputs.shippingCost,
                otherCost: inputs.otherCost,
                adRate: inputs.adRate,
                shippingInsurance: inputs.shippingInsurance,
                returnRate: inputs.returnRate,
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
                if (toggleOn || inputs.platformRate === 0) {
                    elNote.textContent = '免佣金价格';
                } else {
                    elNote.textContent = `包含平台佣金 ${(inputs.platformRate * 100).toFixed(1)}%`;
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
        targetFinalPrice: (function(){
            try {
                const firstInput = document.querySelector('#targetPriceList .target-price-input');
                return firstInput ? firstInput.value : '59';
            } catch(_) { return '59'; }
        })(),
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

        // 恢复标价页：目标到手价、立减勾选、满减档位
        try {
            if (inputs.targetFinalPrice && inputs.targetFinalPrice !== '59') {
                const firstInput = document.querySelector('#targetPriceList .target-price-input');
                if (firstInput) {
                    firstInput.value = inputs.targetFinalPrice;
                }
            }
        } catch (_) {}
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
    // 否则会导致解出的建议售价在带入利润页时多出"进货不含税×商品税率"的利润。
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
    // 注：虽然在联立分子里已经扣除了"商品进项税"作为常数项，但实际缴税仍需抵扣商品进项税，
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
 * 计算"保本ROI"阈值（GMV ÷ 广告费），在利润=0时所需的最低ROI。
 *
 * 定义与假设（与本项目口径一致）：
 * - ROI 定义：GMV(含税售价) / 广告费（按全店付费占比计提的广告总额）
 * - 广告费在利润模型中视为"不可退回成本"，按有效销售率(1-退货率)分摊；
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
        // 分享功能已移除
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
    // 启动全局自动输入记忆（数字输入自动保存）
    try { initAutoInputMemory(); } catch (e) { console.warn('初始化自动输入记忆失败:', e); }
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
        // 分享功能已移除
    } catch (e) {}

    // 初始化保本ROI浮窗交互
    try {
        initBreakevenROITooltip();
    } catch (e) {}

    // 初始化"费用设置"中的快速调整拉杆
    try {
        initQuickSliders();
    } catch (e) {}

    // 初始化"批量利润率推演"功能
    try {
        initBatchProfitScenario();
    } catch (e) {}

    // 初始化"价格推演"功能
    try {
        initPriceExploration();
    } catch (e) {}

    // 为所有输入框添加实时计算功能（排除到手价推演tab的输入框，因为它们有专用的实时计算逻辑）
    document.querySelectorAll('input').forEach(input => {
        // 排除到手价推演tab的输入框，避免冲突
        if (input.id && input.id.startsWith('takehome')) {
            return; // 跳过到手价推演tab的输入框
        }
        
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

    // 标价页：对内部新增元素使用事件委托，保证动态"满减档位行/勾选"等也能触发实时计算
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
            
            // 为标价计算页面的所有输入框添加实时计算
            const addRealTimeCalculation = () => {
                // 目标到手价输入框
                const targetPriceInputs = document.querySelectorAll('#targetPriceList .target-price-input');
                targetPriceInputs.forEach(input => {
                    input.addEventListener('input', onLPChange);
                    input.addEventListener('change', onLPChange);
                });
                
                // 立减比例输入框
                const rateInputs = document.querySelectorAll('.discount-rate-input');
                rateInputs.forEach(input => {
                    input.addEventListener('input', onLPChange);
                    input.addEventListener('change', onLPChange);
                });
                
                // 满减规则输入框
                const tierInputs = document.querySelectorAll('#fullReductionList .tier-threshold, #fullReductionList .tier-off');
                tierInputs.forEach(input => {
                    input.addEventListener('input', onLPChange);
                    input.addEventListener('change', onLPChange);
                });
            };
            
            // 初始绑定
            addRealTimeCalculation();
            
            // 监听DOM变化，为新添加的输入框绑定事件
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // 检查新添加的目标到手价输入框
                                const newTargetInputs = node.querySelectorAll && node.querySelectorAll('.target-price-input');
                                if (newTargetInputs) {
                                    newTargetInputs.forEach(input => {
                                        input.addEventListener('input', onLPChange);
                                        input.addEventListener('change', onLPChange);
                                    });
                                }
                                
                                // 检查新添加的立减比例输入框
                                const newRateInputs = node.querySelectorAll && node.querySelectorAll('.discount-rate-input');
                                if (newRateInputs) {
                                    newRateInputs.forEach(input => {
                                        input.addEventListener('input', onLPChange);
                                        input.addEventListener('change', onLPChange);
                                    });
                                }

                                // 检查新添加的满减规则输入框
                                const newTierInputs = node.querySelectorAll && node.querySelectorAll('.tier-threshold, .tier-off');
                                if (newTierInputs) {
                                    newTierInputs.forEach(input => {
                                        input.addEventListener('input', onLPChange);
                                        input.addEventListener('change', onLPChange);
                                    });
                                }
                            }
                        });
                    }
                });
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
        }
    } catch (_) {}
});
// ===== 精度安全工具（避免浮点误差） =====
// 把金额(元)转为“分”的整数；支持字符串/数字，最多两位小数，超出部分截断
function yuanToCents(x) {
    const s = String(x ?? '').trim();
    if (!s) return 0;
    const m = s.match(/^(-?\d+)(?:\.(\d{0,}))?$/);
    if (!m) return Math.round(Number(x) * 100); // 兜底
    const int = parseInt(m[1], 10);
    const dec = (m[2] || '').padEnd(2, '0').slice(0, 2);
    const sign = int < 0 ? -1 : 1;
    return sign * (Math.abs(int) * 100 + parseInt(dec || '0', 10));
}
// “分”转元（Number，保留2位）
function centsToYuan(c) { return Number((c / 100).toFixed(2)); }
// 最大公约数
function __gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; }
// 将十进制小数(如0.90, 0.88)稳定地转为最简分数 num/den
function decimalToFractionSafe(d) {
    // 用字符串避免0.3000000004这类二进制误差
    const str = String(d);
    if (!str.includes('.')) return { num: Number(str), den: 1 };
    const [i, frac] = str.split('.');
    const den = Math.pow(10, frac.length);
    const num = Math.round(Number(str) * den);
    const g = __gcd(num, den);
    return { num: num / g, den: den / g };
}
// 在“厘”(0.001元)精度下乘以分数 (priceCents × num/den)，结果返回“厘”的整数
function mulCentsByFractionToMils(priceCents, num, den) {
    // 先把分换算成厘(×10)，再乘分数并向下取整，确保不过冲
    return Math.floor((priceCents * 10 * num) / den);
}
// 计算给定S（分）在折扣后触发的最大满减off（分）与阈值（分）；tiers为{threshold, off}的数组(单位：元)
function calcTierForPriceCents(priceCents, kNum, kDen, tiers) {
    if (!tiers || !tiers.length) return { maxOffCents: 0, usedThresholdCents: null };
    // 用“分”的保守口径判断触发：向下取整到分，避免把临界值算成已达标
    const afterDiscountCents = Math.floor((priceCents * kNum) / kDen);
    let maxOffCents = 0;
    let usedThresholdCents = null;
    for (const t of tiers) {
        const thrC = yuanToCents(t.threshold);
        const offC = yuanToCents(t.off);
        if (afterDiscountCents >= thrC && offC >= maxOffCents) {
            maxOffCents = offC;
            usedThresholdCents = thrC;
        }
    }
    return { maxOffCents, usedThresholdCents };
}

/**
 * 标价计算核心逻辑
 * 目标：给定"目标到手价 P_final"，在可叠加优惠（单品立减 r、满减 T→O）下，反推页面标价 S。
 * 规则：
 * - 单品立减：按比例 r 对标价 S 打折，得到 S1 = S × (1 - r)
 * - 满减：对 S1 按可触发的最大档位扣减固定金额 off，使到手价 P = S1 - off
 * - 叠加顺序：先单品立减，再满减
 * - 反解：对于给定 r 与满减档集合 {(threshold_i, off_i)}，我们要找到 S 使得 P ≈ 目标价
 *   做法：对每个 r，枚举可能的"触发满减档位集合"，将 off 视为常数，解 S = (P + off) / (1 - r)，再检查是否满足 S1 >= threshold_i 的触发条件。
 *   取满足条件且 S>0 的解中，到手价误差最小的一个解，作为该 r 下的建议标价。
 */
function calculateListPrice() {
    // 读取输入：支持多个到手价目标
    const targetPriceInputs = document.querySelectorAll('#targetPriceList .target-price-input');
    const targetFinalPrices = Array.from(targetPriceInputs)
        .map(input => parseFloat(input.value))
        .filter(price => isFinite(price) && price > 0);
    
    if (targetFinalPrices.length === 0) {
        throw new Error('请至少设置一个有效的目标到手价');
    }
    
    // 获取自定义立减比例
    const rateInputs = document.querySelectorAll('.discount-rate-input');
    const rateValues = Array.from(rateInputs)
        .map(input => parseFloat(input.value) / 100)
        .filter(rate => isFinite(rate) && rate > 0 && rate < 1);
    const tiers = Array.from(document.querySelectorAll('#fullReductionList .tier-row')).map(row => ({
        threshold: parseFloat(row.querySelector('.tier-threshold').value),
        off: parseFloat(row.querySelector('.tier-off').value)
    })).filter(t => isFinite(t.threshold) && isFinite(t.off) && t.threshold > 0 && t.off >= 0);

    if (!rateValues.length) throw new Error('请至少设置一个有效的单品立减比例（1%-95%）');

    // 若无满减档，按 off=0 处理
    const offCandidates = tiers.length ? tiers.map(t => t.off).sort((a,b)=>a-b) : [0];

    // 对每个到手价目标分别计算
    const allResults = targetFinalPrices.map(targetFinalPrice => {
        // 对每个立减比例分别给出建议标价
        const results = rateValues.map(r => {
            if (1 - r <= 0) return { r, price: NaN, finalPrice: NaN, detail: [], note: '立减过高' };

            // 使用精度安全整数口径 + 保守回推
            const k = 1 - r;
            const { num: kNum, den: kDen } = decimalToFractionSafe(k);

            const targetCents = yuanToCents(targetFinalPrice);
            // 穷举可能的 off（已有 candidates 集合），此处循环体里已拿到 off（元）
            const offCentsFixed = yuanToCents(offCandidates[0]);
            // 反解理论标价（分）：S* ≈ (P + off) / k = (P+off) * kDen / kNum
            // 但我们要穷举所有 off 候选
            let best = null;
            for (const off of new Set(offCandidates.concat([0]))) {
                const offCentsFixed = yuanToCents(off);
                const exactCents = ((targetCents + offCentsFixed) * kDen) / kNum;
                // 只考察上下两侧的“分”候选，再必要时向下微调
                const seedCandidates = [Math.floor(exactCents + 1e-9), Math.ceil(exactCents - 1e-9)];
                const targetMils = targetCents * 10; // 目标到手价(厘)
                function evaluate(priceCents) {
                    if (!isFinite(priceCents) || priceCents <= 0) return null;
                    // 计算折后价（厘，不四舍五入，向下取整，防止过冲）
                    const afterDiscountMils = mulCentsByFractionToMils(priceCents, kNum, kDen);
                    // 触发的满减（分）
                    const { maxOffCents, usedThresholdCents } = calcTierForPriceCents(priceCents, kNum, kDen, tiers);
                    // 自洽校验：与假设的 off 一致才成立
                    if (Math.abs(maxOffCents - offCentsFixed) > 0) return null;
                    const finalMils = afterDiscountMils - offCentsFixed * 10;
                    return { priceCents, finalMils, usedThresholdCents };
                }
                // 1) 先评估floor/ceil两个种子
                let localBest = null;
                for (const c of seedCandidates) {
                    const res = evaluate(c);
                    if (!res) continue;
                    // 要求：不超过目标价（以厘为准）
                    if (res.finalMils <= targetMils) {
                        const diff = targetMils - res.finalMils; // 越小越接近
                        if (!localBest || diff < localBest.diff || (diff === localBest.diff && c < localBest.priceCents)) {
                            localBest = { ...res, diff };
                        }
                    }
                }
                // 2) 若两个都“超过”目标或不自洽，则从较小的那一个开始，每次下调1分尝试（通常一次即可）
                if (!localBest) {
                    let c = Math.min(...seedCandidates.filter(x => isFinite(x)));
                    for (let i = 0; i < 6; i++) { // 最多回退6分，足够覆盖边界
                        const res = evaluate(c);
                        if (res && res.finalMils <= targetMils) {
                            localBest = { ...res, diff: targetMils - res.finalMils };
                            break;
                        }
                        c -= 1; // 下调1分
                    }
                }
                if (localBest) {
                    // 记录最优解
                    if (!best || localBest.diff < best.diff || (localBest.diff === best.diff && localBest.priceCents < best.priceCents)) {
                        best = {
                            priceCents: localBest.priceCents,
                            finalMils: localBest.finalMils,
                            thresholdUsed: localBest.usedThresholdCents,
                            offCentsFixed,
                            r
                        };
                    }
                }
            }
            if (best) {
                const finalPriceYuan = Number((best.finalMils / 1000).toFixed(2));
                return {
                    r,
                    price: centsToYuan(best.priceCents),
                    finalPrice: finalPriceYuan,
                    off: centsToYuan(best.offCentsFixed),
                    thresholdUsed: best.thresholdUsed ? centsToYuan(best.thresholdUsed) : null
                };
            } else {
                return { r, price: NaN, finalPrice: NaN, detail: [], note: '无法找到自洽解' };
            }
        });

        return {
            targetFinalPrice,
            results
        };
    });

    // 渲染结果到新的结果区域
    const resultHtml = generateBatchListPriceHtml({
        allResults,
        tiers
    });

    const resultContainer = document.getElementById('listpriceResult');
    if (resultContainer) {
        resultContainer.innerHTML = resultHtml;
    } else {
        // 降级到原来的result区域
        document.getElementById('result').innerHTML = resultHtml;
    }

    // 分享功能已移除

    // 绑定建议标价悬浮说明（列出各立减档的到手价）
    try { initSuggestPriceTooltip(tiers); } catch (_) {}

    // 移动端：在表格卡片中也可点击行查看详单（同浮窗内容），便于触摸设备
    try {
        if (window.matchMedia && !window.matchMedia('(hover: hover)').matches) {
            const tapContainer = document.getElementById('listpriceResult');
            const onTap = (e) => {
                const el = e.target.closest('.result-item');
                if (!el || !tapContainer.contains(el)) return;
                // 从立减比例中提取标价信息
                const discountRate = el.querySelector('.discount-rate')?.textContent;
                const priceText = el.querySelector('.price-value.green')?.textContent;
                if (!discountRate || !priceText) return;
                const S = parseFloat(priceText.replace('¥', ''));
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
                    '<input type="number" class="tier-threshold" value="0" step="0.01" style="width:120px;max-width:100%;">'+
                    '<span style="color:#666; font-size:0.9rem;">减</span>'+
                    '<input type="number" class="tier-off" value="0" step="0.01" style="width:120px;max-width:100%;">'+
                    '<button type="button" class="save-button" onclick="saveInputs()" style="margin:0;">保存</button>'+
                    '<button type="button" class="batch-modal-btn" onclick="removeTierRow(this)" style="margin:0;">删除</button>';
    list.appendChild(row);
    
    // 为新添加的满减输入框绑定实时计算事件
    const newThresholdInput = row.querySelector('.tier-threshold');
    const newOffInput = row.querySelector('.tier-off');
    
    if (newThresholdInput) {
        newThresholdInput.addEventListener('input', () => {
            if (document.getElementById('listpriceTab').classList.contains('active')) {
                try { calculateListPrice(); } catch (_) {}
            }
        });
        newThresholdInput.addEventListener('change', () => {
            if (document.getElementById('listpriceTab').classList.contains('active')) {
                try { calculateListPrice(); } catch (_) {}
            }
        });
    }
    
    if (newOffInput) {
        newOffInput.addEventListener('input', () => {
            if (document.getElementById('listpriceTab').classList.contains('active')) {
                try { calculateListPrice(); } catch (_) {}
            }
        });
        newOffInput.addEventListener('change', () => {
            if (document.getElementById('listpriceTab').classList.contains('active')) {
                try { calculateListPrice(); } catch (_) {}
            }
        });
    }
    
    // 添加完成后立即触发计算
    if (document.getElementById('listpriceTab').classList.contains('active')) {
        try { calculateListPrice(); } catch (_) {}
    }
}
function removeTierRow(btn) {
    const row = btn && btn.closest('.tier-row');
    if (row && row.parentNode) {
        row.parentNode.removeChild(row);
        
        // 删除完成后立即触发计算
        if (document.getElementById('listpriceTab').classList.contains('active')) {
            try { calculateListPrice(); } catch (_) {}
        }
    }
}

// 添加自定义立减档位
function addDiscountRate() {
    const container = document.getElementById('rateOptions');
    if (!container) return;

    // 限制最多10个立减档位
    const existingRates = container.querySelectorAll('.discount-rate-row');
    if (existingRates.length >= 10) {
        alert('最多只能设置10个立减档位');
        return;
    }

    const row = document.createElement('div');
    row.className = 'discount-rate-row';
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '8px';
    row.style.flexWrap = 'wrap';

    // 计算默认值：基于现有档位递增
    const existingValues = Array.from(existingRates)
        .map(row => parseFloat(row.querySelector('.discount-rate-input').value))
        .filter(val => isFinite(val) && val > 0);
    const lastValue = existingValues.length > 0 ? Math.max(...existingValues) : 10;
    const defaultValue = Math.min(lastValue + 2, 95); // 默认递增2%，最大95%

    row.innerHTML = '<span style="color:#666; font-size:0.9rem;">立减</span>' +
                    '<input type="number" class="discount-rate-input" value="' + defaultValue + '" step="1" min="0" max="95" style="width:80px;text-align:center;">' +
                    '<span style="color:#666; font-size:0.9rem;">%</span>' +
                    '<button type="button" class="save-button" onclick="saveInputs()" style="margin:0;">保存</button>' +
                    '<button type="button" class="batch-modal-btn" onclick="removeDiscountRate(this)" style="margin:0;">删除</button>';

    container.appendChild(row);

    // 为新添加的输入框绑定实时计算事件
    const newInput = row.querySelector('.discount-rate-input');
    if (newInput) {
        newInput.addEventListener('input', () => {
            if (document.getElementById('listpriceTab').classList.contains('active')) {
                try { calculateListPrice(); } catch (_) {}
            }
        });
        newInput.addEventListener('change', () => {
            if (document.getElementById('listpriceTab').classList.contains('active')) {
                try { calculateListPrice(); } catch (_) {}
            }
        });
    }
    
    // 添加完成后立即触发计算
    if (document.getElementById('listpriceTab').classList.contains('active')) {
        try { calculateListPrice(); } catch (_) {}
    }
}

// 删除立减档位
function removeDiscountRate(btn) {
    const row = btn && btn.closest('.discount-rate-row');
    if (row && row.parentNode) {
        // 确保至少保留一个立减档位
        const container = document.getElementById('rateOptions');
        if (container && container.children.length > 1) {
            row.parentNode.removeChild(row);
            
            // 删除完成后立即触发计算
            if (document.getElementById('listpriceTab').classList.contains('active')) {
                try { calculateListPrice(); } catch (_) {}
            }
        } else {
            alert('至少需要保留一个立减档位');
        }
    }
}

// 初始化立减档位（默认10%）
function initDiscountRates() {
    const container = document.getElementById('rateOptions');
    if (!container) return;

    // 清空现有内容
    container.innerHTML = '';

    // 创建默认的10%立减档位
    const row = document.createElement('div');
    row.className = 'discount-rate-row';
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '8px';
    row.style.flexWrap = 'wrap';

    row.innerHTML = '<span style="color:#666; font-size:0.9rem;">立减</span>' +
                    '<input type="number" class="discount-rate-input" value="10" step="1" min="0" max="95" style="width:80px;text-align:center;">' +
                    '<span style="color:#666; font-size:0.9rem;">%</span>' +
                    '<button type="button" class="save-button" onclick="saveInputs()" style="margin:0;">保存</button>' +
                    '<button type="button" class="batch-modal-btn" onclick="removeDiscountRate(this)" style="margin:0;">删除</button>';

    container.appendChild(row);

    // 为默认输入框绑定实时计算事件
    const defaultInput = row.querySelector('.discount-rate-input');
    if (defaultInput) {
        defaultInput.addEventListener('input', () => {
            if (document.getElementById('listpriceTab').classList.contains('active')) {
                try { calculateListPrice(); } catch (_) {}
            }
        });
        defaultInput.addEventListener('change', () => {
            if (document.getElementById('listpriceTab').classList.contains('active')) {
                try { calculateListPrice(); } catch (_) {}
            }
        });
    }
    
    // 初始化完成后立即触发计算
    if (document.getElementById('listpriceTab').classList.contains('active')) {
        try { calculateListPrice(); } catch (_) {}
    }
}

// 标价页：增加/删除到手价目标
function addTargetPrice() {
    const list = document.getElementById('targetPriceList');
    if (!list) return;
    
    // 限制最多10个目标价
    if (list.children.length >= 10) {
        alert('最多只能设置10个目标到手价');
        return;
    }
    
    const row = document.createElement('div');
    row.className = 'target-price-row';
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '8px';
    row.style.flexWrap = 'wrap';
    
    // 计算默认值：基于上一个价格递增
    const existingPrices = Array.from(list.querySelectorAll('.target-price-input'))
        .map(input => parseFloat(input.value))
        .filter(price => isFinite(price) && price > 0);
    const lastPrice = existingPrices.length > 0 ? Math.max(...existingPrices) : 59;
    const defaultPrice = lastPrice + 10; // 默认递增10元
    
    row.innerHTML = '<div class="price-input-group">' +
                    '<input type="number" class="target-price-input" value="' + defaultPrice + '" step="0.01" placeholder="输入目标到手价">' +
                    '<button class="save-btn" onclick="saveInputs()">' +
                    '<span class="save-icon">✓</span>' +
                    '</button>' +
                    '<button type="button" class="action-btn secondary" onclick="removeTargetPrice(this)">删除</button>' +
                    '</div>';
    list.appendChild(row);
    
    // 为新添加的输入框绑定实时计算事件
    const newInput = row.querySelector('.target-price-input');
    if (newInput) {
        newInput.addEventListener('input', () => {
            if (document.getElementById('listpriceTab').classList.contains('active')) {
                try { calculateListPrice(); } catch (_) {}
            }
        });
        newInput.addEventListener('change', () => {
            if (document.getElementById('listpriceTab').classList.contains('active')) {
                try { calculateListPrice(); } catch (_) {}
            }
        });
    }
    
    // 添加完成后立即触发计算
    if (document.getElementById('listpriceTab').classList.contains('active')) {
        try { calculateListPrice(); } catch (_) {}
    }
}

function removeTargetPrice(btn) {
    const row = btn && btn.closest('.target-price-row');
    if (row && row.parentNode) {
        // 确保至少保留一个目标价输入框
        const list = document.getElementById('targetPriceList');
        if (list && list.children.length > 1) {
            row.parentNode.removeChild(row);
            
            // 删除完成后立即触发计算
            if (document.getElementById('listpriceTab').classList.contains('active')) {
                try { calculateListPrice(); } catch (_) {}
            }
        } else {
            alert('至少需要保留一个目标到手价');
        }
    }
}

function clearAllTargetPrices() {
    const list = document.getElementById('targetPriceList');
    if (!list) return;
    
    if (confirm('确定要清空所有目标到手价吗？')) {
        // 保留第一个，清空其他
        const rows = list.querySelectorAll('.target-price-row');
        for (let i = 1; i < rows.length; i++) {
            rows[i].remove();
        }
        // 重置第一个的价格为默认值
        const firstInput = list.querySelector('.target-price-input');
        if (firstInput) {
            firstInput.value = '59';
        }
        
        // 清空完成后立即触发计算
        if (document.getElementById('listpriceTab').classList.contains('active')) {
            try { calculateListPrice(); } catch (_) {}
        }
    }
}

/**
 * 为"建议标价"列添加悬浮说明：展示给定标价在各立减档位下的到手价
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
    // 新增：5位小数格式化
    const formatYuan5 = (n) => `¥ ${Number(n).toFixed(5)}`;

    const buildHtml = (S, el) => {
        try {
            // 从新的HTML结构中获取基础信息
            const discountRateText = el ? el.querySelector('.discount-rate')?.textContent : null;
            const targetPriceText = el ? el.closest('.target-result-section')?.querySelector('h4')?.textContent : null;
            
            // 解析立减比例（从"10%立减"中提取10）
            const r = discountRateText ? parseFloat(discountRateText.match(/(\d+)%/)?.[1] || '10') / 100 : 0.10;
            
            // 解析目标到手价（从"目标到手价 ¥59.00 的标价建议"中提取59.00）
            const targetPrice = targetPriceText ? parseFloat(targetPriceText.match(/¥([\d.]+)/)?.[1] || '0') : null;

            // 计算立减后的价格
            const afterDiscount = S * (1 - r);

            // 计算满减
            let fullReduction = 0;
            let usedThreshold = null;
            if (tiers && tiers.length > 0) {
                const available = tiers.filter(t =>
                    isFinite(t.threshold) && isFinite(t.off) &&
                    t.threshold > 0 && t.off >= 0 &&
                    afterDiscount >= t.threshold
                );
                if (available.length > 0) {
                    fullReduction = Math.max(...available.map(t => t.off));
                    const first = available.find(t => t.off === fullReduction);
                    usedThreshold = first ? first.threshold : null;
                }
            }

            // 计算最终到手价
            const finalPrice = afterDiscount - fullReduction;

            // 计算标价+0.01后的到手价
            const S_plus = S + 0.01;
            const afterDiscount_plus = S_plus * (1 - r);
            let fullReduction_plus = 0;
            if (tiers && tiers.length > 0) {
                const available_plus = tiers.filter(t =>
                    isFinite(t.threshold) && isFinite(t.off) &&
                    t.threshold > 0 && t.off >= 0 &&
                    afterDiscount_plus >= t.threshold
                );
                if (available_plus.length > 0) {
                    fullReduction_plus = Math.max(...available_plus.map(t => t.off));
                }
            }
            const finalPrice_plus = afterDiscount_plus - fullReduction_plus;

            // 格式化函数（4位小数）
            const formatYuan4 = (n) => `¥ ${Number(n).toFixed(4)}`;

            return `<div style="font-weight:600;margin-bottom:8px;">标价验证</div>
                    <div>系统标价：<b>${formatYuan4(S)}</b></div>
                    ${targetPrice ? `<div>目标到手价：${formatYuan4(parseFloat(targetPrice))}</div>` : ''}
                    <div style="margin:8px 0; padding:8px; background:rgba(255,255,255,0.1); border-radius:4px;">
                        <div style="font-weight:600; margin-bottom:4px;">反推计算过程：</div>
                        <div>立减比例：${(r*100).toFixed(0)}%</div>
                        <div>立减后价格：${formatYuan4(S)} × (1 - ${r.toFixed(2)}) = ${formatYuan4(afterDiscount)}</div>
                        ${usedThreshold ?
                            `<div>触发满减：满 ${formatYuan4(usedThreshold)} 减 ${formatYuan4(fullReduction)}</div>` :
                            `<div>未触发满减</div>`
                        }
                        <div style="border-top:1px solid rgba(255,255,255,0.3); padding-top:4px; margin-top:4px;">
                            <div><b>最终到手价：${formatYuan4(finalPrice)}</b></div>
                        </div>
                    </div>

                    <div style="margin:8px 0; padding:8px; background:rgba(255,255,255,0.05); border-radius:4px; border-left:3px solid #fbbf24;">
                        <div style="font-weight:600; margin-bottom:4px; color:#fbbf24;">上调验证（+0.01）：</div>
                        <div>上调后标价：${formatYuan4(S_plus)}</div>
                        <div>立减后价格：${formatYuan4(S_plus)} × (1 - ${r.toFixed(2)}) = ${formatYuan4(afterDiscount_plus)}</div>
                        ${(() => {
                            if (tiers && tiers.length > 0) {
                                const available_plus = tiers.filter(t =>
                                    isFinite(t.threshold) && isFinite(t.off) &&
                                    t.threshold > 0 && t.off >= 0 &&
                                    afterDiscount_plus >= t.threshold
                                );
                                if (available_plus.length > 0) {
                                    const maxOff = Math.max(...available_plus.map(t => t.off));
                                    const first = available_plus.find(t => t.off === maxOff);
                                    return `<div>触发满减：满 ${formatYuan4(first.threshold)} 减 ${formatYuan4(maxOff)}</div>`;
                                }
                            }
                            return `<div>未触发满减</div>`;
                        })()}
                        <div style="border-top:1px solid rgba(255,255,255,0.2); padding-top:4px; margin-top:4px;">
                            <div><b>上调后到手价：${formatYuan4(finalPrice_plus)}</b></div>
                            <div style="font-size:11px; color:#fbbf24; margin-top:2px;">
                                差值：${finalPrice_plus > finalPrice ? '+' : ''}${formatYuan4(finalPrice_plus - finalPrice)}
                            </div>
                        </div>
                    </div>

                    <div style="font-size:11px; color:#ccc; margin-top:4px;">
                        注：所有金额精确到小数点后4位
                    </div>`;
        } catch (_) {
            return '验证计算错误';
        }
    };

    // 事件委托到结果容器，避免多次绑定
    const container = document.getElementById('listpriceResult');
    if (!container) return;
    const onOver = (e) => {
        const el = e.target.closest('.result-item');
        if (!el || !container.contains(el)) return hide();
        // 从立减比例中提取标价信息
        const discountRate = el.querySelector('.discount-rate')?.textContent;
        const priceText = el.querySelector('.price-value.green')?.textContent;
        if (!discountRate || !priceText) return hide();
        const S = parseFloat(priceText.replace('¥', ''));
        if (!isFinite(S) || S <= 0) return hide();
        show(buildHtml(S, el), e.clientX, e.clientY);
    };
    const onMove = (e) => {
        const el = e.target.closest('.result-item');
        if (!el || !container.contains(el)) return hide();
        // 从立减比例中提取标价信息
        const discountRate = el.querySelector('.discount-rate')?.textContent;
        const priceText = el.querySelector('.price-value.green')?.textContent;
        if (!discountRate || !priceText) return hide();
        const S = parseFloat(priceText.replace('¥', ''));
        if (!isFinite(S) || S <= 0) return hide();
        show(buildHtml(S, el), e.clientX, e.clientY);
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
 * 初始化"营销费用占比、预计退货率"的快速滑杆，支持与数值输入双向同步，并触发实时重算
 * 设计要点：
 * - 两个滑杆仅在利润页"费用设置"模块内；与 `#profitAdRate`、`#profitReturnRate` 双向联动
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
// 分享功能已移除
// 之前的分享功能代码已被删除

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
 * 初始化"保本ROI"卡片的浮动说明窗（桌面端hover，移动端点击）
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
		// 增补：在浮窗顶部给出"保本 ROI"的通俗定义，便于非技术同学理解
		return (
			'<div>'+
			'<div style="margin-bottom:6px; color:#333;">保本 ROI 的含义是：在考虑退货、平台扣点、销项税、进项抵扣、固定成本之后，利润刚好为 0 时的 ROI。</div>'+
			// 先给出一行"总公式"（一般形式，含税口径）：由 a* = (E/(1−v))×(D − B/P) 与 ROI* = E/a* 推得
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
// 分享功能已移除，collectShareContext函数已被删除
function collectShareContext() {
    return null; // 分享功能已移除
}


/**
 * 批量利润率推演：初始化入口按钮与浮窗
 * 功能目标：
 * - 在"利润计算"页基于当前参数，批量推演不同"全店付费占比×预计退货率"组合下的利润率
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
        // 新增 0%：观察"不投广告"情况下在不同退货率下的利润率
        // 付费占比：0%、10%、15%、20%、25%、30%、35%（以小数表示，按从小到大排序）
        const adRates = [0.00, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35];
        // 新增退货率 5%、8%、10%、12%、15%、18%、20%、25%、28（以小数表示）
        const returnRates = [0.05, 0.08, 0.10, 0.12, 0.15, 0.18, 0.20, 0.25, 0.28];

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
        // 价格相关即时指标：加价倍率、毛利率（使用统一利润计算函数，与主页面完全一致）
        // 使用统一的利润计算函数计算价格指标，确保与主页面结果完全一致
        // 注意：getProfitBaseInputs() 返回的税率已经是小数格式，不需要再除以100
        const unifiedResult = calculateProfitUnified({
            costPrice: base.costPrice,
            actualPrice: base.actualPrice,
            inputTaxRate: base.inputTaxRate, // 已经是小数格式
            outputTaxRate: base.outputTaxRate, // 已经是小数格式
            salesTaxRate: base.salesTaxRate, // 已经是小数格式
            platformRate: base.platformRate, // 已经是小数格式
            shippingCost: base.shippingCost,
            shippingInsurance: base.shippingInsurance,
            adRate: 0, // 推演弹窗中广告费为0，不影响基础价格指标
            otherCost: base.otherCost,
            returnRate: 0 // 推演弹窗中退货率为0，不影响基础价格指标
        });
        
        // 从统一计算结果中提取价格指标（与主页面完全一致）
        const effectiveCost = unifiedResult.effectiveCost; // 进货实际成本
        const netPrice = unifiedResult.netPrice; // 不含税售价
        
        // 计算加价倍率和毛利率（基于含税口径，与主页面完全一致）
        const markup = (effectiveCost > 0 && base.actualPrice > 0) ? (base.actualPrice / effectiveCost) : NaN;
        const grossMargin = (effectiveCost > 0 && base.actualPrice > 0) ? ((base.actualPrice - effectiveCost) / base.actualPrice) : NaN;
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
                <label class=\"batch-badge emphasis metric\" title=\"加价倍率 = 含税售价 ÷ 进货实际成本（与主页面口径一致）\">加价倍率：<b id=\"badgeMarkupValue\">${markupText}</b></label>
                <label class=\"batch-badge emphasis metric\" title=\"毛利率 = (含税售价 − 进货实际成本) ÷ 含税售价（与主页面口径一致）\">毛利率：<b id=\"badgeGrossMarginValue\">${grossText === '-' ? '-' : grossText + '%'}\n</b></label>
            </div>
            <div class="batch-badges">
                <span class="batch-badge">平台佣金：${(base.platformRate*100).toFixed(1)}%</span>
                <span class="batch-badge">销项税率：${(base.salesTaxRate*100).toFixed(1)}%</span>
                <span class="batch-badge">开票成本：${(base.inputTaxRate*100).toFixed(1)}%</span>
                <span class="batch-badge">商品进项税率：${(base.outputTaxRate*100).toFixed(1)}%</span>
                <span class="batch-badge">物流费：¥${base.shippingCost.toFixed(2)}</span>
                <span class="batch-badge">运费险：¥${base.shippingInsurance.toFixed(2)}</span>
                <span class="batch-badge">其他成本：¥${base.otherCost.toFixed(2)}</span>
            </div>
            <div style="color:#10b981; font-size:0.85rem; margin-top:8px; padding:8px; background:#f0fdf4; border-radius:6px; border-left:3px solid #10b981;">
                ✓ 价格指标已与主页面统一：使用相同的计算逻辑和口径，确保结果完全一致
            </div>`;

        const tableHeader = `
            <tr>
                <th style="position:sticky;left:0;background:#fff;z-index:2;border-bottom:1px solid #eee;text-align:left;padding:8px 10px;color:#666;font-weight:500;">退货率 \\ 付费占比</th>
                ${adRates.map(a => `<th style=\"border-bottom:1px solid #eee;padding:8px 10px;color:#333;font-weight:600;\">${(a*100).toFixed(0)}%</th>`).join('')}
                <!-- 新增列表头：每行（按退货率）对应的"保本ROI/保本推广占比"，与付费占比无关，仅受退货率影响 -->
                <th style="border-bottom:1px solid #eee;padding:8px 10px;color:#333;font-weight:600; white-space:nowrap;">保本ROI/推广占比</th>
            </tr>`;

        const tableRows = rows.map(r => {
            // 行首固定列：退货率
            const firstCol = `<td style=\"position:sticky;left:0;background:#fff;z-index:1;border-right:1px solid #f2f2f2;padding:8px 10px;color:#333;\">${(r.rr*100).toFixed(0)}%</td>`;
            // 单元格：不同付费占比下的利润率/利润金额
            const tds = r.cells.map(c => {
                // 利润率与利润金额：主副两行展示，利率更醒目，金额次要小一号
                const rate = (c.profitRate*100).toFixed(2);
                const profitText = `¥ ${c.profit.toFixed(2)}`;
                const color = c.profitRate > 0 ? '#2ea44f' : (c.profitRate < 0 ? '#d32f2f' : '#555');
                const bg = c.profitRate > 0 ? 'rgba(46,164,79,0.08)' : (c.profitRate < 0 ? 'rgba(211,47,47,0.08)' : 'transparent');
                // 重点标注：当利润率处于 [9.5%, 10.5%]（含）范围内，视为"最优解候选"
                // 视觉改为"前置小圆标"放在数字前，避免遮挡 %
                const isTarget = (c.profitRate >= 0.095 && c.profitRate <= 0.105);
                const targetStyle = '';
                const targetPrefix = isTarget ? '<span style="display:inline-flex;width:16px;height:16px;border-radius:999px;background:#0ea5e9;color:#fff;align-items:center;justify-content:center;font-size:11px;line-height:1;">✓</span>' : '';
                // 计算"保本 ROI / 保本付费占比"（受退货率影响）
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
                    // 为保本广告占比添加危险标识
                    let adText = '-';
                    if (isFinite(res.breakevenAdRate)) {
                        const adRate = res.breakevenAdRate;
                        const isDanger = adRate > 0 && adRate < 0.21;
                        const dangerStyle = isDanger ? 'background:#dc2626; color:#fff; padding:1px 4px; border-radius:3px; font-weight:700;' : '';
                        const dangerIcon = isDanger ? '⚠️' : '';
                        adText = `<div style="display:inline-block; ${dangerStyle}">${dangerIcon}${(adRate*100).toFixed(2)}%</div>`;
                    }
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
                    <div class="switch-wrapper switch-chip" title="与"费用设置-平台费用-免佣"联动">
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
            <div style="color:#666;font-size:12px;margin-bottom:6px;">仅变动"全店付费占比"与"预计退货率"，其余参数沿用当前利润页设置：</div>
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
        // 新增 0%：观察"不投广告"情况下在不同退货率下的利润率
        // 付费占比：0%、10%、15%、20%、25%、30%、35%（以小数表示，按从小到大排序）
        const adRates = [0.00, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35];
        // 新增退货率 5%、8%、10%、12%、15%、18%、20%、25%、28（以小数表示）
        const returnRates = [0.05, 0.08, 0.10, 0.12, 0.15, 0.18, 0.20, 0.25, 0.28];

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
                // 重点标注范围：[9.5%, 10.5%]（含），改为"数字前小圆标"避免遮挡
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
            // 中文注释：本列不依赖"付费占比"，数值随退货率变化
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
                    // 为保本广告占比添加危险标识
                    let adText = '-';
                    if (isFinite(res.breakevenAdRate)) {
                        const adRate = res.breakevenAdRate;
                        const isDanger = adRate > 0 && adRate < 0.21;
                        const dangerStyle = isDanger ? 'background:#dc2626; color:#fff; padding:1px 4px; border-radius:3px; font-weight:700;' : '';
                        const dangerIcon = isDanger ? '⚠️' : '';
                        adText = `<div style="display:inline-block; ${dangerStyle}">${dangerIcon}${(adRate*100).toFixed(2)}%</div>`;
                    }
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
                    // 刷新时优先保留弹窗里的"进货价/实际售价"输入，不回退到外部输入
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
            
            // 即时更新"加价倍率/毛利率"徽章（仅更新文本，不重绘DOM，保证不失焦）
            // 使用与主页面完全一致的计算逻辑，确保结果一致性
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
                    
                    // 使用与主页面完全一致的计算逻辑
                    // 获取当前基础参数（税率等）
                    const base = getProfitBaseInputs();
                    // 临时更新进货价和售价
                    base.costPrice = cost;
                    base.actualPrice = price;
                    
                    // 使用统一的利润计算函数计算价格指标
                    const unifiedResult = calculateProfitUnified({
                        costPrice: base.costPrice,
                        actualPrice: base.actualPrice,
                        inputTaxRate: base.inputTaxRate,
                        outputTaxRate: base.outputTaxRate,
                        salesTaxRate: base.salesTaxRate,
                        platformRate: base.platformRate,
                        shippingCost: base.shippingCost,
                        shippingInsurance: base.shippingInsurance,
                        adRate: 0, // 不影响基础价格指标
                        otherCost: base.otherCost,
                        returnRate: 0 // 不影响基础价格指标
                    });
                    
                    // 使用与主页面完全一致的计算结果
                    const effectiveCost = unifiedResult.effectiveCost;
                    const m = (price / effectiveCost).toFixed(2);
                    const g = (((price - effectiveCost) / price) * 100).toFixed(2);
                    elMarkup.textContent = m;
                    elGross.textContent = g + '%';
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
                // 先即时更新头部"加价倍率/毛利率"展示
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
                    // 切换后立即按最新参数重绘内容：优先保留弹窗内的"进货价/实际售价"
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
        // 仅当利润页激活时开放；避免切到"售价计算"页时的误操作
        const profitTabActive = document.getElementById('profitTab')?.classList.contains('active');
        if (!profitTabActive) { showToast('请先切换到"利润计算"页'); return; }
        open();
    });
}
/**
 * 价格推演：在利润计算页，固定成本/税率/费率等参数，仅变动：
 *   - 含税售价（候选集合或单值）
 *   - 预计退货率（多档）
 *   - 全店付费占比（多档）
 * 以热力矩阵展示利润率与利润金额，并支持导出CSV。
 */
function initPriceExploration() {
    const btn = document.getElementById('btnPriceExploration');
    if (!btn) return;

    // 懒创建弹窗节点
    let overlay = null;
    let panel = null;

    // 工具：将任意价格"向上"调整为最接近的以 9.8 结尾的心理价（如 59.8、69.8、79.8、99.8…）
    // 说明：
    // - 非四舍五入，而是向上取整到最近的 x9.8
    // - 避免出现 80、90 等整数价，优先让用户感知"低于整数位"
    const adjustToPsychPriceUp = (price) => {
        try {
            const p = Math.max(0, Number(price) || 0);
            const tens = Math.floor(p / 10);
            const candidate = tens * 10 + 9.8;
            if (p <= candidate) return candidate;
            return (tens + 1) * 10 + 9.8;
        } catch(_) { return price; }
    };

    // 组合装适配：基于 state.combo2 对固定参数做一次性口径调整
    // - 两件组合装：成本口径
    //   • 进货价（含开票与商品进项税的基数）按 2 倍计
    //   • 其他成本按 1.5 倍计
    //   • 物流费、运费险不变（一个包裹）
    const applyComboAdjustments = (fixed, state) => {
        if (!state || !state.combo2) return fixed;
        const adjusted = Object.assign({}, fixed);
        adjusted.costPrice = fixed.costPrice * 2;
        adjusted.otherCost = fixed.otherCost * 1.5;
        return adjusted;
    };

    // 计算某一组合：固定其他参数，给定售价S、退货率R、广告占比A，返回利润与利润率
    const computeProfitForPrice = (fixed, price, adRate, returnRate) => {
        // 复制固定参数，替换变化项
        const base = Object.assign({}, fixed, { actualPrice: price });
        // 现在 computeProfitScenario 已重构为使用统一函数，直接调用即可
        // 为了支持详细的 tooltip 显示，返回完整的计算结果
        const result = computeProfitScenario(base, adRate, returnRate);
        return result;
    };

    // 计算"躺卖价"（保本最低售价）：仅考虑固定成本与税费，不投广告；
    // 平台佣金按现有"免佣"开关决定是否计入（默认计入，免佣开启则为0）。
    // 推导公式：
    // 设有效销售率 e = 1 - R；平台佣金费率 pr，销项税率 st，平台佣金可抵扣进项税按 6% 抵扣
    // 总成本 TC = 进货总成本(含开票成本) + 平台佣金 + 各项分摊固定成本 + 实缴税费
    // 实缴税费 = 销项税 - (商品进项税 + 平台佣金进项税抵扣)
    // 将售价 S 代入并整理，可得：
    //   利润 P = S - TC = S*(1 - [ pr*(1-0.06) + st/(1+st) ]) - C0
    //   其中 C0 = 进货价 + 开票成本 - 商品进项税 + (物流费+运费险+其他成本)/e
    // 令 P = 0，可解得： S = C0 / (1 - [ pr*(1-0.06) + st/(1+st) ])
    // targetProfitRate 为目标利润率（小数，例如 0.05 表示 5%）
    const computeLyingPrice = (fixed, returnRate, targetProfitRate = 0) => {
        try {
            // 有效销售率，避免除以0
            const effectiveRate = Math.max(1e-6, 1 - returnRate);
            // 进货相关成本
            const invoiceCost = fixed.costPrice * fixed.inputTaxRate;     // 开票成本
            const purchaseVAT = fixed.costPrice * fixed.outputTaxRate;    // 商品进项税（可抵扣）
            // 分摊固定成本（不可退回，需按有效销售率分摊）
            const shippingCostEffective = fixed.shippingCost / effectiveRate;
            const insuranceCostEffective = fixed.shippingInsurance / effectiveRate;
            const otherCostEffective = fixed.otherCost / effectiveRate;
            const fixedCostEffective = shippingCostEffective + insuranceCostEffective + otherCostEffective;
            // 常数项 C0
            const C0 = (fixed.costPrice + invoiceCost - purchaseVAT) + fixedCostEffective;
            // 系数 a = pr*(1-0.06) + st/(1+st)
            // 说明：与现有利润口径一致，平台佣金不按退货率分摊（可退回），但会产生6%进项税抵扣
            // pr 取自固定参数（若免佣开关开启，则 pr 已为 0）
            const pr = fixed.platformRate;
            const st = fixed.salesTaxRate;
            const a = pr * (1 - 0.06) + (st / (1 + st));
            const t = Math.max(0, Number(targetProfitRate) || 0);
            const denom = 1 - a - t;
            if (!(denom > 0)) return Infinity; // 理论上无穷大/不可达保本
            const S = C0 / denom;
            return S;
        } catch (_) {
            return NaN;
        }
    };

    // 构造：候选价 Chips HTML
    const buildPriceChipsHtml = (fixed, state) => {
        return state.prices.map((p,i)=>{
            const denom = fixed.costPrice * (state && state.combo2 ? 2 : 1);
            const mul = denom > 0 ? (p / denom) : NaN;
            const mulText = isFinite(mul) ? `${mul.toFixed(2)}倍` : '-';
            return `
            <label style="display:inline-flex;align-items:center;justify-content:center;gap:6px;height:36px;padding:0 14px;border:2px solid ${i===state.activeIndex?'#3b82f6':'#e5e7eb'};border-radius:999px;cursor:pointer;background:${i===state.activeIndex?'#3b82f6':'#f3f4f6'};color:${i===state.activeIndex?'#ffffff':'#1f2937'};font-size:14px;line-height:1;font-weight:${i===state.activeIndex?'600':'400'};box-shadow:${i===state.activeIndex?'0 2px 8px rgba(59,130,246,0.25)':'none'};">
                <input type="radio" name="expPrice" value="${p}" ${i===state.activeIndex?'checked':''} style="display:none;">
                <span>¥${p.toFixed(2)}（${mulText}）</span>
            </label>`;
        }).join(' ');
    };

    // 构造：矩阵表格 HTML（仅表格内容，不含外层容器）
    const buildPriceTableHtml = (fixed, state) => {
        const adRates = state.adRates;
        const returnRates = state.returnRates;
        const priceCandidates = state.prices;
        const thead = `
            <tr>
                <th style="position:sticky;left:0;background:#fff;z-index:2;border-bottom:1px solid #eee;text-align:left;padding:8px 10px;color:#666;font-weight:500;">退货率 \\ 付费占比</th>
                ${adRates.map(a=>`<th style=\"border-bottom:1px solid #eee;padding:8px 10px;color:#333;font-weight:600;\">${(a*100).toFixed(0)}%</th>`).join('')}
                <th style="border-bottom:1px solid #eee;padding:8px 10px;color:#333;font-weight:600; white-space:nowrap;">保本ROI/推广占比</th>
            </tr>`;
        const rowsHtml = returnRates.map(rr => {
            const firstCol = `<td style=\"position:sticky;left:0;background:#fff;z-index:1;border-right:1px solid #f2f2f2;padding:8px 10px;color:#333;\">${(rr*100).toFixed(0)}%</td>`;
            const tds = adRates.map(ar => {
                const r = computeProfitForPrice(fixed, priceCandidates[state.activeIndex], ar, rr);
                const rate = (r.profitRate*100).toFixed(2);
                const profitText = `¥ ${r.profit.toFixed(2)}`;
                const color = r.profitRate > 0 ? '#2ea44f' : (r.profitRate < 0 ? '#d32f2f' : '#555');
                const bg = r.profitRate > 0 ? 'rgba(46,164,79,0.08)' : (r.profitRate < 0 ? 'rgba(211,47,47,0.08)' : 'transparent');

                // 计算明细：用于 tooltip 展示（使用统一函数的结果）
                const tooltipData = `售价：¥${priceCandidates[state.activeIndex].toFixed(2)}\n退货率：${(rr*100).toFixed(0)}%\n付费占比：${(ar*100).toFixed(0)}%\n\n成本明细：\n• 进货成本：¥${r.effectiveCost ? r.effectiveCost.toFixed(2) : '-'}\n• 平台佣金：¥${r.platformFee ? r.platformFee.toFixed(2) : '-'}\n• 广告费（分摊）：¥${r.adCostEffective ? r.adCostEffective.toFixed(2) : '-'}\n• 物流费（分摊）：¥${r.shippingCostEffective ? r.shippingCostEffective.toFixed(2) : '-'}\n• 运费险（分摊）：¥${r.insuranceCostEffective ? r.insuranceCostEffective.toFixed(2) : '-'}\n• 其他成本（分摊）：¥${r.otherCostEffective ? r.otherCostEffective.toFixed(2) : '-'}\n• 销项税：¥${r.outputVAT ? r.outputVAT.toFixed(2) : '-'}\n• 进项抵扣：¥${r.totalVATDeduction ? r.totalVATDeduction.toFixed(2) : '-'}\n• 实际税负：¥${r.actualVAT ? r.actualVAT.toFixed(2) : '-'}\n\n总成本：¥${r.totalCost ? r.totalCost.toFixed(2) : '-'}\n利润：¥${r.profit.toFixed(2)}\n利润率：${rate}%`;

                return `<td class=\"price-exp-cell\" data-tooltip=\"${tooltipData}\" style=\"padding:8px 10px;text-align:right;color:${color};background:${bg};cursor:help;\"><div style=\\"font-weight:600;\\">${rate}%</div><div style=\\"font-size:12px;opacity:0.9;\\">${profitText}</div></td>`;
            }).join('');
            const roiRes = calculateBreakevenROI({
                costPrice: fixed.costPrice,
                inputTaxRate: fixed.inputTaxRate,
                outputTaxRate: fixed.outputTaxRate,
                salesTaxRate: fixed.salesTaxRate,
                platformRate: fixed.platformRate,
                shippingCost: fixed.shippingCost,
                shippingInsurance: fixed.shippingInsurance,
                otherCost: fixed.otherCost,
                returnRate: rr,
                finalPrice: priceCandidates[state.activeIndex]
            });
            const roiText = isFinite(roiRes.breakevenROI) ? roiRes.breakevenROI.toFixed(2) : '∞';
            // 为保本广告占比添加危险标识
            let adText = '-';
            if (isFinite(roiRes.breakevenAdRate)) {
                const adRate = roiRes.breakevenAdRate;
                const isDanger = adRate > 0 && adRate < 0.21;
                const dangerStyle = isDanger ? 'background:#dc2626; color:#fff; padding:1px 4px; border-radius:3px; font-weight:700;' : '';
                const dangerIcon = isDanger ? '⚠️' : '';
                adText = `<div style="display:inline-block; ${dangerStyle}">${dangerIcon}${(adRate*100).toFixed(2)}%</div>`;
            }
            const extraCol = `<td style=\"padding:8px 10px;text-align:right;color:#333;\"><div style=\"font-weight:600;\">${roiText}</div><div style=\"font-size:12px;opacity:0.9;\">${adText}</div></td>`;
            return `<tr>${firstCol}${tds}${extraCol}</tr>`;
        }).join('');
        return `<table style="border-collapse:separate;border-spacing:0;width:100%;min-width:520px;font-size:13px;"><thead style="position:sticky;top:0;background:#fff;">${thead}</thead><tbody>${rowsHtml}</tbody></table>`;
    };

    // 构造："躺卖价"表格 HTML（不投广告；佣金遵循免佣开关；固定成本按有效销售率分摊）
    const buildLyingTableHtml = (fixed, state) => {
        const returnRates = state.returnRates;
        const targets = [
            { label: '保本(0%)', rate: 0.00 },
            { label: '利润5%', rate: 0.05 },
            { label: '利润10%', rate: 0.10 },
            { label: '利润15%', rate: 0.15 },
            { label: '利润20%', rate: 0.20 }
        ];
        const thead = `
            <tr>
                <th style="position:sticky;left:0;background:#fff;z-index:2;border-bottom:1px solid #eee;text-align:left;padding:8px 10px;color:#666;font-weight:500;">退货率</th>
                ${targets.map(t=>`<th style=\"border-bottom:1px solid #eee;padding:8px 10px;color:#333;font-weight:600;\">${t.label}</th>`).join('')}
                <th style="border-bottom:1px solid #eee;padding:8px 10px;color:#333;font-weight:600; white-space:nowrap;">说明</th>
            </tr>`;
        const rowsHtml = returnRates.map(rr => {
            const firstCol = `<td style="position:sticky;left:0;background:#fff;z-index:1;border-right:1px solid #f2f2f2;padding:8px 10px;color:#333;">${(rr*100).toFixed(0)}%</td>`;
            const priceCols = targets.map(t => {
                const S = computeLyingPrice(fixed, rr, t.rate);
                const hasPrice = isFinite(S) && S > 0;
                if (!hasPrice) return `<td style=\"padding:8px 10px;text-align:right;color:#999;\">—</td>`;
                const effectiveRate = Math.max(1e-6, 1 - rr);
                const invoiceCost = fixed.costPrice * fixed.inputTaxRate;
                const purchaseCost = fixed.costPrice + invoiceCost;
                const platformFee = S * fixed.platformRate;
                const adCostEffective = 0;
                const adVAT = 0;
                const shippingCostEffective = fixed.shippingCost / effectiveRate;
                const insuranceCostEffective = fixed.shippingInsurance / effectiveRate;
                const otherCostEffective = fixed.otherCost / effectiveRate;
                const netPrice = S / (1 + fixed.salesTaxRate);
                const outputVAT = netPrice * fixed.salesTaxRate;
                const purchaseVAT = fixed.costPrice * fixed.outputTaxRate;
                const totalVATDeduction = purchaseVAT + adVAT + (platformFee * 0.06 / 1.06); // 平台佣金进项税：从含税金额中剥离税额
                const actualVAT = outputVAT - totalVATDeduction;
                const totalCost = purchaseCost + platformFee + adCostEffective + shippingCostEffective + insuranceCostEffective + otherCostEffective + actualVAT;
                const profit = S - totalCost;
                const tooltipData = `目标利润率：${(t.rate*100).toFixed(0)}%\n售价：¥${S.toFixed(2)}\n退货率：${(rr*100).toFixed(0)}%\n\n成本明细：\n• 进货成本：¥${purchaseCost.toFixed(2)}\n• 平台佣金：¥${platformFee.toFixed(2)}\n• 广告费（分摊）：¥${adCostEffective.toFixed(2)}\n• 物流费（分摊）：¥${shippingCostEffective.toFixed(2)}\n• 运费险（分摊）：¥${insuranceCostEffective.toFixed(2)}\n• 其他成本（分摊）：¥${otherCostEffective.toFixed(2)}\n• 销项税：¥${outputVAT.toFixed(2)}\n• 进项抵扣：¥${totalVATDeduction.toFixed(2)}\n• 实际税负：¥${actualVAT.toFixed(2)}\n\n核对利润：¥${profit.toFixed(2)}（${((profit/S)*100).toFixed(2)}%）`;
                return `<td class=\"price-exp-cell\" data-tooltip=\"${tooltipData}\" style=\"padding:8px 10px;text-align:right;color:#111;font-weight:700;cursor:help;\">¥ ${S.toFixed(2)}</td>`;
            }).join('');
            const tipCol = `<td style=\"padding:8px 10px;color:#666;\">不投广告，仅固定成本与税费口径；每个退货率对应的售价为保本点。</td>`;
            return `<tr>${firstCol}${priceCols}${tipCol}</tr>`;
        }).join('');
        return `<table style="border-collapse:separate;border-spacing:0;width:100%;min-width:420px;font-size:13px;"><thead style="position:sticky;top:0;background:#fff;">${thead}</thead><tbody>${rowsHtml}</tbody></table>`;
    };

    // 构造或刷新弹窗内容
    const buildPanelContent = (fixed, state) => {
        const chips = buildPriceChipsHtml(fixed, state);
        const isLying = state.mode === 'lying';
        const adjustedFixed = applyComboAdjustments(fixed, state);
        const tableHtml = isLying ? buildLyingTableHtml(adjustedFixed, state) : buildPriceTableHtml(adjustedFixed, state);

        return `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <div style="font-weight:600;">${isLying ? '躺卖价（保本最低售价）' : '价格推演'}</div>
                <div style="display:flex;gap:10px;align-items:center;">
                    <div class="switch-wrapper switch-chip" title="与"费用设置-平台费用-免佣"联动">
                        <span class="switch-label">免佣</span>
                        <label class="switch">
                            <input type="checkbox" id="priceExpPlatformFreeToggle">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <button id="btnPriceExpToggleLying" class="batch-modal-btn" style="margin-left:8px;">${isLying ? '返回矩阵' : '躺卖价'}</button>
                    <button id="btnPriceExplorationExport" class="batch-modal-btn">导出CSV</button>
                    <button id="btnPriceExplorationClose" class="batch-modal-btn">关闭</button>
                </div>
            </div>
            <div style="margin-bottom:16px;display:flex;flex-direction:column;gap:12px;">
                <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
                    <div style="display:inline-flex;align-items:center;gap:10px;background:#0b63ce;color:#fff;border-radius:999px;padding:6px 10px;">
                        <span style="font-weight:600;">进货价：</span>
                        <input type="number" id="priceExpCostPrice" value="${fixed.costPrice.toFixed(2)}" step="0.01" min="0.01" style="width:120px;padding:6px 10px;border-radius:10px;border:1px solid rgba(255,255,255,0.75);background:#eef2ff;color:#111;outline:none;font-weight:700;font-size:16px;">
                    </div>
                    <label for="priceExpCombo2Toggle" class="switch-chip" style="display:inline-flex;align-items:center;gap:8px;background:${state.combo2?'#3b82f6':'#f3f4f6'};color:${state.combo2?'#fff':'#111'};border-radius:999px;padding:6px 10px;cursor:pointer;">
                        <input type="checkbox" id="priceExpCombo2Toggle" ${state.combo2?'checked':''} style="width:16px;height:16px;margin:0;">
                        <span style="font-weight:600;user-select:none;">两件组合装</span>
                    </label>
                    <span id="combo2CostText" class="batch-badge" style="display:${state.combo2?'inline-flex':'none'};">组合装进货价：¥${(fixed.costPrice*2).toFixed(2)}</span>
                </div>
                ${isLying ? '' : `
                <div style="display:flex;align-items:center;gap:12px;">
                    <span class="batch-badge emphasis" style="flex-shrink:0;">含税售价候选：</span>
                    <div id="priceExpChips" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">${chips}</div>
                </div>`}
            </div>
            <div class="batch-badges" style="margin-bottom:12px;">
                <span class="batch-badge" id="badgePlatformRate">平台佣金：${(adjustedFixed.platformRate*100).toFixed(1)}%</span>
                <span class="batch-badge">销项税率：${(adjustedFixed.salesTaxRate*100).toFixed(1)}%</span>
                <span class="batch-badge">开票成本：${(adjustedFixed.inputTaxRate*100).toFixed(1)}%</span>
                <span class="batch-badge">商品进项税率：${(adjustedFixed.outputTaxRate*100).toFixed(1)}%</span>
                <span class="batch-badge">物流费：¥${adjustedFixed.shippingCost.toFixed(2)}</span>
                <span class="batch-badge">运费险：¥${adjustedFixed.shippingInsurance.toFixed(2)}</span>
                <span class="batch-badge" id="badgeOtherCost">其他成本：¥${adjustedFixed.otherCost.toFixed(2)}</span>
            </div>
            <div id="priceExpTable" class="batch-table-container" style="overflow:auto;max-height:56vh;border:1px solid #eee;border-radius:8px;">${tableHtml}</div>
            <div style="margin-top:10px;color:#999;font-size:12px;">${isLying ? '说明：不投广告，仅固定成本与税费口径；每个退货率对应的售价为保本点。' : '提示：绿色为盈利，红色为亏损。切换上方售价Chip可对比不同定价下的盈亏区间。'}</div>
        `;
    };

    // 创建DOM（仅一次）
    const ensureOverlay = () => {
        if (overlay && panel) return;
        overlay = document.createElement('div');
        overlay.id = 'priceExplorationOverlay';
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
        // 固定参数快照
        const fixed = getProfitBaseInputs();
        // 优先使用已保存的弹窗进货价（记忆值），若不存在则使用利润页当前进货价
        try {
            const saved = localStorage.getItem('priceCalculatorInputs');
            if (saved) {
                const obj = JSON.parse(saved);
                const remembered = parseFloat(obj.priceExpCostPrice);
                if (isFinite(remembered) && remembered > 0) {
                    fixed.costPrice = remembered;
                }
            }
        } catch (_) {}
        // 候选售价：按倍率从进货价推导并应用"9.8心理价"规则向上调整
        // 倍率集合：1.5、1.8、2.0、2.1、2.2、2.3、2.4、2.5、2.6、2.7、2.8
        const multipliers = [1.5, 1.8, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8];
        const derived = multipliers
            .map(m => fixed.costPrice * m)
            .map(s => adjustToPsychPriceUp(s));
        // 去重+升序
        const prices = Array.from(new Set(derived.map(v => Number(v.toFixed(1)))))
            .sort((a,b)=>a-b);
        // 退货率/付费占比：沿用"批量利润率推演"弹窗的默认档位
        const adRates = [0.00, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35];
        const returnRates = [0.05, 0.08, 0.10, 0.12, 0.15, 0.18, 0.20, 0.25, 0.28];
        const state = { prices, adRates, returnRates, activeIndex: 0, mode: 'matrix', combo2: false };
        panel.innerHTML = buildPanelContent(fixed, state);

        const wire = () => {
            const btnClose = panel.querySelector('#btnPriceExplorationClose');
            if (btnClose) btnClose.addEventListener('click', close);

            // 免佣联动：同步到利润页两个开关并触发重算
            const toggle = panel.querySelector('#priceExpPlatformFreeToggle');
            if (toggle) {
                try {
                    const topToggle = document.getElementById('profitPlatformFreeToggleTop');
                    const mainToggle = document.getElementById('profitPlatformFreeToggle');
                    const currentOn = !!(topToggle?.checked || mainToggle?.checked);
                    toggle.checked = currentOn;
                } catch (_) {}
                toggle.addEventListener('change', () => {
                    try {
                        const topToggle = document.getElementById('profitPlatformFreeToggleTop');
                        const mainToggle = document.getElementById('profitPlatformFreeToggle');
                        if (topToggle) { topToggle.checked = toggle.checked; topToggle.dispatchEvent(new Event('change', { bubbles:true })); }
                        else if (mainToggle) { mainToggle.checked = toggle.checked; mainToggle.dispatchEvent(new Event('change', { bubbles:true })); }
                    } catch (_) {}
                    // 同步后根据最新参数，局部重绘 chips 与表格
                    // 关键修复：若弹窗内手动改了进货价，需用弹窗内的最新值覆写，而不是回落到页面默认值
                    const fixed2 = getProfitBaseInputs();
                    const costInput = panel.querySelector('#priceExpCostPrice');
                    const currentCostPrice = costInput ? parseFloat(costInput.value) : fixed2.costPrice;
                    if (isFinite(currentCostPrice) && currentCostPrice > 0) fixed2.costPrice = currentCostPrice;
                    // 不改动候选售价与当前选中，避免切换免佣导致选中Chip丢失
                    const chipsEl = panel.querySelector('#priceExpChips');
                    const tableEl = panel.querySelector('#priceExpTable');
                    const badgePlatform = panel.querySelector('#badgePlatformRate');
                    const badgeOther = panel.querySelector('#badgeOtherCost');
                    const combo2CostText = panel.querySelector('#combo2CostText');
                    const adjusted = applyComboAdjustments(fixed2, state);
                    if (tableEl) tableEl.innerHTML = (state.mode === 'lying' ? buildLyingTableHtml(adjusted, state) : buildPriceTableHtml(adjusted, state));
                    if (badgePlatform) badgePlatform.textContent = `平台佣金：${(adjusted.platformRate*100).toFixed(1)}%`;
                    if (badgeOther) badgeOther.textContent = `其他成本：¥${adjusted.otherCost.toFixed(2)}`;
                    if (combo2CostText) combo2CostText.textContent = `组合装进货价：¥${(fixed2.costPrice*2).toFixed(2)}`;
                });
            }

            // 候选价：使用事件委托，避免替换DOM导致监听丢失
            const chipsWrap = panel.querySelector('#priceExpChips');
            if (chipsWrap) {
                chipsWrap.addEventListener('change', (e) => {
                    const target = e.target;
                    if (!(target && target.name === 'expPrice')) return;
                    const value = parseFloat(target.value);
                    const idx = state.prices.findIndex(p => Number(p.toFixed(2)) === Number(value.toFixed(2)));
                    if (idx >= 0) state.activeIndex = idx;
                    
                    // 获取弹窗内最新的进货价，而不是页面上的默认值
                    const costInput = panel.querySelector('#priceExpCostPrice');
                    const currentCostPrice = costInput ? parseFloat(costInput.value) : fixed.costPrice;
                    const fixed2 = getProfitBaseInputs();
                    fixed2.costPrice = currentCostPrice; // 使用弹窗内的最新进货价
                    
                    // 局部更新 chips 与 表格
                    chipsWrap.innerHTML = buildPriceChipsHtml(fixed2, state);
                    const tableEl = panel.querySelector('#priceExpTable');
                    const adjusted = applyComboAdjustments(fixed2, state);
                    if (tableEl) tableEl.innerHTML = (state.mode === 'lying' ? buildLyingTableHtml(adjusted, state) : buildPriceTableHtml(adjusted, state));
                    const badgePlatform = panel.querySelector('#badgePlatformRate');
                    const badgeOther = panel.querySelector('#badgeOtherCost');
                    if (badgePlatform) badgePlatform.textContent = `平台佣金：${(adjusted.platformRate*100).toFixed(1)}%`;
                    if (badgeOther) badgeOther.textContent = `其他成本：¥${adjusted.otherCost.toFixed(2)}`;
                });
            }

            // 组合装：开关联动计算
            const comboToggle = panel.querySelector('#priceExpCombo2Toggle');
            if (comboToggle) {
                comboToggle.addEventListener('change', () => {
                    state.combo2 = !!comboToggle.checked;
                    // 读取弹窗内最新的进货价并带入
                    const fixed2 = getProfitBaseInputs();
                    const costInput = panel.querySelector('#priceExpCostPrice');
                    const currentCostPrice = costInput ? parseFloat(costInput.value) : fixed2.costPrice;
                    if (isFinite(currentCostPrice) && currentCostPrice > 0) fixed2.costPrice = currentCostPrice;

                    // 更新徽章（其他成本可能因为组合装变为1.5倍）
                    const adjusted = applyComboAdjustments(fixed2, state);
                    const badgePlatform = panel.querySelector('#badgePlatformRate');
                    const badgeOther = panel.querySelector('#badgeOtherCost');
                    if (badgePlatform) badgePlatform.textContent = `平台佣金：${(adjusted.platformRate*100).toFixed(1)}%`;
                    if (badgeOther) badgeOther.textContent = `其他成本：¥${adjusted.otherCost.toFixed(2)}`;
                    const combo2CostText = panel.querySelector('#combo2CostText');
                    if (combo2CostText) combo2CostText.style.display = state.combo2 ? 'inline-flex' : 'none';
                    if (combo2CostText) combo2CostText.textContent = `组合装进货价：¥${(fixed2.costPrice*2).toFixed(2)}`;

                    // 重新生成候选售价（按组合装成本口径：cost*2）
                    const multipliers = [1.5, 1.8, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8];
                    const baseCost = currentCostPrice * (state.combo2 ? 2 : 1);
                    const derived = multipliers.map(m => baseCost * m).map(s => adjustToPsychPriceUp(s));
                    const newPrices = Array.from(new Set(derived.map(v => Number(v.toFixed(1))))).sort((a,b)=>a-b);
                    state.prices = newPrices;
                    state.activeIndex = 0;

                    // 局部更新 chips 与 表格
                    const chipsEl = panel.querySelector('#priceExpChips');
                    const tableEl = panel.querySelector('#priceExpTable');
                    if (chipsEl) chipsEl.innerHTML = buildPriceChipsHtml(fixed2, state);
                    if (tableEl) tableEl.innerHTML = (state.mode === 'lying' ? buildLyingTableHtml(adjusted, state) : buildPriceTableHtml(adjusted, state));
                });
            }

            // 导出CSV
            const btnExport = panel.querySelector('#btnPriceExplorationExport');
            if (btnExport) btnExport.addEventListener('click', () => {
                try {
                    const rows = [];
                    if (state.mode === 'lying') {
                        // 躺卖价模式导出：退货率, 躺卖价（不投广告）
                        let fixedCsv = getProfitBaseInputs();
                        // 读取弹窗内最新进货价
                        const costInput = panel.querySelector('#priceExpCostPrice');
                        const currentCostPrice = costInput ? parseFloat(costInput.value) : fixedCsv.costPrice;
                        fixedCsv.costPrice = isFinite(currentCostPrice) && currentCostPrice > 0 ? currentCostPrice : fixedCsv.costPrice;
                        // 应用组合装
                        fixedCsv = applyComboAdjustments(fixedCsv, state);
                        rows.push(['退货率', '躺卖价（保本，未投广告）']);
                        state.returnRates.forEach(rr => {
                            const s = computeLyingPrice(fixedCsv, rr);
                            rows.push([(rr*100).toFixed(0)+'%', isFinite(s) ? s.toFixed(2) : '—']);
                        });
                    } else {
                        // 矩阵模式导出
                        rows.push(['价格', '退货率', ...state.adRates.map(a=>`付费${(a*100).toFixed(0)}%`), '保本ROI', '保本广告占比']);
                        state.returnRates.forEach(rr => {
                            const line = [];
                            line.push(state.prices[state.activeIndex].toFixed(2));
                            line.push((rr*100).toFixed(0)+'%');
                            state.adRates.forEach(ar => {
                                const baseCsv = applyComboAdjustments(getProfitBaseInputs(), state);
                                const r = computeProfitForPrice(baseCsv, state.prices[state.activeIndex], ar, rr);
                                line.push(((r.profitRate*100)).toFixed(2)+'%');
                            });
                            const fixedCsv = applyComboAdjustments(getProfitBaseInputs(), state);
                            const roiRes = calculateBreakevenROI({
                                costPrice: fixedCsv.costPrice,
                                inputTaxRate: fixedCsv.inputTaxRate,
                                outputTaxRate: fixedCsv.outputTaxRate,
                                salesTaxRate: fixedCsv.salesTaxRate,
                                platformRate: fixedCsv.platformRate,
                                shippingCost: fixedCsv.shippingCost,
                                shippingInsurance: fixedCsv.shippingInsurance,
                                otherCost: fixedCsv.otherCost,
                                returnRate: rr,
                                finalPrice: state.prices[state.activeIndex]
                            });
                            const roiText = isFinite(roiRes.breakevenROI) ? roiRes.breakevenROI.toFixed(2) : '∞';
                            const adText = isFinite(roiRes.breakevenAdRate) ? (roiRes.breakevenAdRate*100).toFixed(2)+'%' : '-';
                            line.push(roiText);
                            line.push(adText);
                            rows.push(line);
                        });
                    }
                    const csv = rows.map(r=>r.map(x=>`"${String(x).replace(/"/g,'""')}"`).join(',')).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = '价格推演.csv';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } catch (e) { showToast(e && e.message ? e.message : '导出失败'); }
            });

            // "躺卖价"切换按钮：一键切换矩阵/躺卖模式
            const btnToggle = panel.querySelector('#btnPriceExpToggleLying');
            if (btnToggle) btnToggle.addEventListener('click', () => {
                // 读取弹窗内最新的进货价并带入
                const fixed2 = getProfitBaseInputs();
                const costInput = panel.querySelector('#priceExpCostPrice');
                const currentCostPrice = costInput ? parseFloat(costInput.value) : fixed2.costPrice;
                if (isFinite(currentCostPrice) && currentCostPrice > 0) fixed2.costPrice = currentCostPrice;
                const nextMode = state.mode === 'lying' ? 'matrix' : 'lying';
                // 保留 combo2 状态不变，仅切换模式
                state.mode = nextMode;
                panel.innerHTML = buildPanelContent(fixed2, state);
                wire();
            });

            // 进货价编辑：实时更新候选价与矩阵（防抖，且仅局部重绘，保证输入不失焦）
            (function attachCostInputRealtime(){
                const costInput = panel.querySelector('#priceExpCostPrice');
                if (!costInput) return;
                let timer = null;
                const recalc = () => {
                    try {
                        const newCost = parseFloat(costInput.value);
                        if (!isFinite(newCost) || newCost <= 0) return;
                        const fixed2 = getProfitBaseInputs();
                        fixed2.costPrice = newCost;
                        const multipliers = [1.5, 1.8, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8];
                        const baseCost = newCost * (state.combo2 ? 2 : 1);
                        const derived = multipliers.map(m => baseCost * m).map(s => adjustToPsychPriceUp(s));
                        const newPrices = Array.from(new Set(derived.map(v => Number(v.toFixed(1))))).sort((a,b)=>a-b);
                        state.prices = newPrices;
                        state.activeIndex = 0;
                        // 局部更新 chips 与 表格，避免输入框失焦
                        const chipsEl = panel.querySelector('#priceExpChips');
                        const tableEl = panel.querySelector('#priceExpTable');
                        const badge = panel.querySelector('#badgePlatformRate');
                        if (chipsEl) chipsEl.innerHTML = buildPriceChipsHtml(fixed2, state);
                        const adjusted = applyComboAdjustments(fixed2, state);
                        if (tableEl) tableEl.innerHTML = (state.mode === 'lying' ? buildLyingTableHtml(adjusted, state) : buildPriceTableHtml(adjusted, state));
                        if (badge) badge.textContent = `平台佣金：${(adjusted.platformRate*100).toFixed(1)}%`;
                        const combo2CostText = panel.querySelector('#combo2CostText');
                        if (combo2CostText) combo2CostText.textContent = `组合装进货价：¥${(newCost*2).toFixed(2)}`;
                    } catch(_) {}
                };
                costInput.addEventListener('input', () => {
                    if (timer) clearTimeout(timer);
                    timer = setTimeout(recalc, 250);
                });
            })();

            // 悬浮提示：委托到表格容器，悬停即显
            (function attachTooltipDelegation(){
                const container = panel.querySelector('.batch-table-container');
                if (!container) return;

                let tooltip = document.querySelector('.price-exp-tooltip');
                if (!tooltip) {
                    tooltip = document.createElement('div');
                    tooltip.className = 'price-exp-tooltip';
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
                        opacity: '0',
                        maxWidth: '360px'
                    });
                    document.body.appendChild(tooltip);
                }

                const showTooltip = (text, x, y) => {
                    tooltip.textContent = text;
                    const offset = 12;
                    tooltip.style.left = `${x + offset}px`;
                    tooltip.style.top = `${y + offset}px`;
                    tooltip.style.opacity = '1';
                };
                const hideTooltip = () => { tooltip.style.opacity = '0'; };

                const onOver = (e) => {
                    const cell = e.target.closest('.price-exp-cell');
                    if (!cell || !container.contains(cell)) return;
                    const text = cell.getAttribute('data-tooltip');
                    if (text) showTooltip(text, e.clientX, e.clientY);
                };
                const onMove = (e) => {
                    const cell = e.target.closest('.price-exp-cell');
                    if (!cell || !container.contains(cell)) return hideTooltip();
                    const text = cell.getAttribute('data-tooltip');
                    if (text) showTooltip(text, e.clientX, e.clientY);
                };
                const onLeave = () => hideTooltip();

                container.addEventListener('mouseover', onOver);
                container.addEventListener('mousemove', onMove);
                container.addEventListener('mouseleave', onLeave);
            })();
        };
        wire();
        overlay.style.display = 'block';
    };

    const close = () => { if (overlay) overlay.style.display = 'none'; };

    btn.addEventListener('click', () => {
        const profitTabActive = document.getElementById('profitTab')?.classList.contains('active');
        if (!profitTabActive) { showToast('请先切换到"利润计算"页'); return; }
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
 * 基于利润页口径，计算给定"广告占比/退货率"组合下的利润与利润率（重构为使用统一函数）
 * 参数：
 * - base：getProfitBaseInputs() 返回的固定参数
 * - adRate：全店付费占比（0~1 小数）
 * - returnRate：预计退货率（0~1 小数）
 * 返回：{ profit, profitRate }，其中 profitRate 为小数（如 0.123 表示 12.3%）
 * 
 * 重构说明：现在使用统一的 calculateProfitUnified() 函数，确保与主页面利润率计算tab结果完全一致
 */
function computeProfitScenario(base, adRate, returnRate) {
    try {
        // 构建统一参数格式，调用统一的利润计算函数
        const inputs = {
            costPrice: base.costPrice,
            actualPrice: base.actualPrice,
            inputTaxRate: base.inputTaxRate,
            outputTaxRate: base.outputTaxRate,
            salesTaxRate: base.salesTaxRate,
            platformRate: base.platformRate,
            shippingCost: base.shippingCost,
            shippingInsurance: base.shippingInsurance,
            adRate: adRate,
            otherCost: base.otherCost,
            returnRate: returnRate
        };

        // 使用统一的利润计算函数，确保计算逻辑完全一致
        const result = calculateProfitUnified(inputs);
        
        // 返回需要的字段，保持原有接口兼容性
        // 同时返回详细的计算结果，支持 tooltip 显示
        return {
            profit: result.profit,
            profitRate: result.profitRate,
            // 添加详细字段，支持 tooltip 显示
            totalCost: result.totalCost,
            actualVAT: result.actualVAT,
            totalVATDeduction: result.totalVATDeduction,
            purchaseVAT: result.purchaseVAT,
            adVAT: result.adVAT,
            effectiveCost: result.effectiveCost,
            platformFee: result.platformFee,
            adCostEffective: result.adCostEffective,
            shippingCostEffective: result.shippingCostEffective,
            insuranceCostEffective: result.insuranceCostEffective,
            otherCostEffective: result.otherCostEffective,
            netPrice: result.netPrice,
            outputVAT: result.outputVAT
        };
    } catch (error) {
        console.error('computeProfitScenario 计算错误:', error);
        // 错误时返回默认值，保持系统稳定性
        return {
            profit: NaN,
            profitRate: NaN
        };
    }
}
/**
 * 初始化"平台免佣"开关，并与输入框联动
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

// 自动保存单个输入值到 localStorage（无提示版）
function autoSaveSingleInput(inputId, value) {
	try {
		const key = 'priceCalculatorInputs';
		let saved = localStorage.getItem(key);
		let obj = {};
		try { obj = saved ? JSON.parse(saved) : {}; } catch (_) { obj = {}; }
		obj[inputId] = value;
		localStorage.setItem(key, JSON.stringify(obj));
	} catch (e) {
		console.warn('自动保存失败:', inputId, e);
	}
}
// 初始化全站输入记忆：
// - 对所有 number 类型输入框进行自动保存（页面与弹窗都生效）
// - 采用捕获阶段监听，保证对子节点与动态弹窗输入同样有效
function initAutoInputMemory() {
	const onNumberInput = (e) => {
		const el = e.target;
		if (!el || !(el.tagName === 'INPUT')) return;
		if ((el.type || '').toLowerCase() !== 'number') return;

		// 处理有ID的输入框
		if (el.id) {
			autoSaveSingleInput(el.id, el.value);
			return;
		}

		// 特殊处理目标到手价输入框（没有ID）
		if (el.classList.contains('target-price-input')) {
			autoSaveTargetPrice(el.value);
		}
	};
	// input 事件：实时写入
	document.addEventListener('input', onNumberInput, true);
	// change 兜底：防止某些浏览器仅在 change 才更新值
	document.addEventListener('change', onNumberInput, true);
}

// 自动保存目标到手价到 localStorage
function autoSaveTargetPrice(value) {
	try {
		const key = 'priceCalculatorInputs';
		let saved = localStorage.getItem(key);
		let obj = {};
		try { obj = saved ? JSON.parse(saved) : {}; } catch (_) { obj = {}; }
		obj.targetFinalPrice = value;
		localStorage.setItem(key, JSON.stringify(obj));
	} catch (e) {
		console.warn('自动保存目标到手价失败:', e);
	}
}

// ------------------------------
// 商品清单（Catalog）模块
// ------------------------------

/**
 * catalogState：维护商品清单的内存状态与脏标记
 * - rows: 行数据数组
 * - dirty: 是否有未保存更改
 * - lastImportBackup: 最近一次导入前的备份（支持一次撤销）
 * 说明：行对象字段与CSV表头一致；结果列缓存到 `__result` 字段
 */
const catalogState = {
	rows: [],
	dirty: false,
	lastImportBackup: null,
	version: 1
};

// 平台预设：用于在清单中选择平台时，自动应用对应的默认佣金（平台费率）
function getPlatformPresets() {
	const wanted = [
		{ name: '淘宝', rate: 0.00 },
		{ name: '天猫', rate: 0.055 },
		{ name: '抖音', rate: 0.05 }
	];
	try {
		const raw = localStorage.getItem('priceCalculatorPlatformPresets');
		if (raw) {
			const list = JSON.parse(raw);
			if (Array.isArray(list)) {
				let changed = false;
				wanted.forEach(w => {
					const idx = list.findIndex(x => x && x.name === w.name);
					if (idx >= 0) {
						const r = Number(list[idx].rate);
						if (!isFinite(r) || Math.abs(r - w.rate) > 1e-9) { list[idx].rate = w.rate; changed = true; }
					} else { list.push({ name: w.name, rate: w.rate }); changed = true; }
				});
				if (changed) savePlatformPresets(list);
				return list;
			}
		}
	} catch (_) {}
	// 没有存储时返回内置默认
	return wanted;
}
function savePlatformPresets(list) { try { localStorage.setItem('priceCalculatorPlatformPresets', JSON.stringify(list||[])); } catch (_) {} }
function getPlatformRateByName(name) {
	if (!name) return NaN;
	const list = getPlatformPresets();
	const item = list.find(x => x && x.name === name);
	return item && isFinite(Number(item.rate)) ? Number(item.rate) : NaN;
}

// 平台设置弹窗（简单版）：可增删改平台与默认佣金
function openPlatformSettingsModal() {
	const presets = getPlatformPresets();
	const overlay = document.createElement('div');
	overlay.style.position='fixed'; overlay.style.inset='0'; overlay.style.background='rgba(0,0,0,.35)'; overlay.style.zIndex='9999'; overlay.style.display='flex'; overlay.style.alignItems='center'; overlay.style.justifyContent='center';
	const panel = document.createElement('div');
	panel.style.background='#fff'; panel.style.borderRadius='12px'; panel.style.width='520px'; panel.style.maxWidth='94vw'; panel.style.maxHeight='88vh'; panel.style.overflow='auto'; panel.style.boxShadow='0 12px 34px rgba(0,0,0,.18)'; panel.style.padding='16px';
	panel.innerHTML = `
		<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
			<div style="font-weight:700; font-size:16px;">平台设置</div>
			<button id="platClose" class="batch-modal-btn">关闭</button>
		</div>
		<div id="platBody"></div>
		<div style="margin-top:10px; display:flex; gap:8px;">
			<button id="platAdd" class="batch-modal-btn">新增平台</button>
			<button id="platSave" class="batch-modal-btn primary">保存</button>
		</div>
	`;
	overlay.appendChild(panel); document.body.appendChild(overlay);
	const render = () => {
		const body = panel.querySelector('#platBody');
		body.innerHTML = presets.map((p,i)=>`
			<div style="display:flex; align-items:center; gap:8px; margin:6px 0;">
				<input type="text" value="${p.name}" data-i="${i}" data-k="name" style="flex:1; padding:6px 8px; border:1px solid #e5e7eb; border-radius:8px; background:#fafafa;">
				<input type="number" min="0" step="0.01" value="${(Number(p.rate)*100).toFixed(2)}" data-i="${i}" data-k="rate" style="width:120px; padding:6px 8px; border:1px solid #e5e7eb; border-radius:8px; background:#fafafa;">%
				<button class="batch-modal-btn" data-i="${i}" data-k="del" style="background:#fee2e2; border-color:#fecaca; color:#ef4444;">删除</button>
			</div>
		`).join('');
		body.querySelectorAll('input').forEach(inp=>{
			inp.addEventListener('input', (e)=>{
				const i = Number(e.target.getAttribute('data-i')); const k = e.target.getAttribute('data-k');
				if (k==='name') presets[i].name = e.target.value || '';
				if (k==='rate') presets[i].rate = Math.max(0, Number(e.target.value||'0'))/100;
			});
		});
		body.querySelectorAll('button[data-k="del"]').forEach(btn=>{
			btn.addEventListener('click', (e)=>{ const i = Number(btn.getAttribute('data-i')); presets.splice(i,1); render(); });
		});
	};
	render();
	panel.querySelector('#platAdd').addEventListener('click', ()=>{ presets.push({ name:'', rate:0 }); render(); });
	panel.querySelector('#platSave').addEventListener('click', ()=>{ savePlatformPresets(presets); showToast && showToast('平台预设已保存'); try { renderCatalogTable(); } catch(_){} document.body.removeChild(overlay); });
	panel.querySelector('#platClose').addEventListener('click', ()=>{ try { document.body.removeChild(overlay); } catch(_){} });
}

// 解析百分比为[0,1]
function parsePercent(val) {
	if (val === null || val === undefined) return NaN;
	if (typeof val === 'string') {
		const s = val.trim();
		if (!s) return NaN;
		if (s.endsWith('%')) { const n = parseFloat(s.slice(0,-1)); return isNaN(n) ? NaN : n/100; }
		const n = parseFloat(s); if (isNaN(n)) return NaN; return n>1 ? n/100 : n;
	}
	const n = Number(val); if (!isFinite(n)) return NaN; return n>1 ? n/100 : n;
}

// 百分比/金额格式化
function formatPercent(p) { if (!isFinite(p)) return '-'; return (p*100).toFixed(2)+'%'; }
function formatMoney(n) { if (!isFinite(n)) return '-'; return '¥ ' + Number(n).toFixed(2); }

// 根据显示索引获取正确的行数据（支持筛选后的表格）
function getRowByDisplayIndex(displayIndex) {
	// 如果有筛选且筛选数据存在，使用筛选后的数据；否则使用原始数据
	const rows = catalogFilterState.filteredRows && catalogFilterState.filteredRows.length > 0 
		? catalogFilterState.filteredRows 
		: catalogState.rows;
	return rows[displayIndex] || null;
}

// 读取全局默认（只取与本页相关字段）
function getGlobalDefaultsForCatalog() {
	try {
		const g = getValidatedInputs();
		return { inputTaxRate:g.inputTaxRate, outputTaxRate:g.outputTaxRate, salesTaxRate:g.salesTaxRate, platformRate:g.platformRate, shippingCost:g.shippingCost, shippingInsurance:g.shippingInsurance, otherCost:g.otherCost, adRate:g.adRate, returnRate:g.returnRate };
	} catch (_) {
		return { inputTaxRate:0.06, outputTaxRate:0.13, salesTaxRate:0.13, platformRate:0.05, shippingCost:0, shippingInsurance:0, otherCost:0, adRate:0.2, returnRate:0.1 };
	}
}

// 合并行覆盖与全局，统一为数值/小数
function mergeGlobalsWithRow(row, globals) {
	const pick = (key, parser) => {
		const v = row[key];
		if (key === 'salePrice') { 
			const n = Number(v); 
			// 修复：允许salePrice为0（用于多档售价场景），但必须是非负数
			return isFinite(n) && n >= 0 ? n : NaN; 
		}
		if (key === 'costMin' || key === 'costMax') { const n = Number(v); return isFinite(n)&&n>=0 ? n : NaN; }
		if (parser === parsePercent) { const p = parsePercent(v); return isFinite(p) ? p : globals[key]; }
		if (typeof v === 'number') return isFinite(v) ? v : globals[key];
		if (typeof v === 'string' && v.trim()!=='') { const n = Number(v); return isFinite(n) ? n : globals[key]; }
		return globals[key];
	};
	// 注意：以下参数在表格中已删除列，强制使用全局值，忽略行内残留覆盖
	const forceGlobal = {
		inputTaxRate: globals.inputTaxRate,
		outputTaxRate: globals.outputTaxRate,
		salesTaxRate: globals.salesTaxRate,
		shippingCost: globals.shippingCost,
		shippingInsurance: globals.shippingInsurance,
		otherCost: globals.otherCost,
	};
	return {
		name: row.name||'', sku: row.sku||'', platform: row.platform||'',
		salePrice: pick('salePrice'),
		costMin: pick('costMin'),
		costMax: isFinite(Number(row.costMax)) ? pick('costMax') : pick('costMin'),
		inputTaxRate: forceGlobal.inputTaxRate,
		outputTaxRate: forceGlobal.outputTaxRate,
		salesTaxRate: forceGlobal.salesTaxRate,
		// 平台佣金：优先使用行内指定，其次根据平台名称获取，最后回退全局
		platformRate: (function(){
			// 1. 优先使用行内明确指定的平台佣金
			const p = parsePercent(row.platformRate);
			if (isFinite(p)) return p;
			
			// 2. 如果行内没有指定，根据平台名称获取对应佣金率
			if (row.platform) {
				const platformRate = getPlatformRateByName(row.platform);
				if (isFinite(platformRate)) return platformRate;
			}
			
			// 3. 最后回退到全局默认佣金率
			return globals.platformRate;
		})(),
		shippingCost: forceGlobal.shippingCost,
		shippingInsurance: forceGlobal.shippingInsurance,
		otherCost: forceGlobal.otherCost,
		adRate: pick('adRate', parsePercent),
		returnRate: pick('returnRate', parsePercent)
	};
}

// 行级计算（固定 cost）
function computeRowWithCost(rowStd, costPrice) {
	const inputs = { costPrice, inputTaxRate:rowStd.inputTaxRate, outputTaxRate:rowStd.outputTaxRate, salesTaxRate:rowStd.salesTaxRate, platformRate:rowStd.platformRate, shippingCost:rowStd.shippingCost, shippingInsurance:rowStd.shippingInsurance, otherCost:rowStd.otherCost, adRate:rowStd.adRate, returnRate:rowStd.returnRate, targetProfitRate:0 };
	const purchaseCost = calculatePurchaseCost(inputs);
	const salesCost = calculateSalesCost(inputs, 0, purchaseCost);
	const P = rowStd.salePrice;
	const netPrice = P / (1 + inputs.salesTaxRate);
	const platformFee = P * inputs.platformRate;
	const adCost = P * inputs.adRate;
	const outputVAT = netPrice * inputs.salesTaxRate;
	const VAT_RATE = 0.06;
	const adVAT = (adCost / salesCost.effectiveRate) * VAT_RATE;
	const totalVATDeduction = purchaseCost.purchaseVAT + adVAT + (platformFee * VAT_RATE);
	const actualVAT = outputVAT - totalVATDeduction;
	const fixedCosts = (inputs.shippingCost + inputs.shippingInsurance + inputs.otherCost) / salesCost.effectiveRate;
	const totalCost = purchaseCost.effectiveCost + platformFee + (adCost / salesCost.effectiveRate) + fixedCosts + actualVAT;
	const profit = P - totalCost;
	const roiRes = calculateBreakevenROI({ costPrice, inputTaxRate:inputs.inputTaxRate, outputTaxRate:inputs.outputTaxRate, salesTaxRate:inputs.salesTaxRate, platformRate:inputs.platformRate, shippingCost:inputs.shippingCost, shippingInsurance:inputs.shippingInsurance, otherCost:inputs.otherCost, returnRate:inputs.returnRate, finalPrice:P });
	return { profit, profitRate: profit / P, breakevenROI: roiRes.breakevenROI, breakevenAdRate: roiRes.breakevenAdRate };
}
// 行级计算（支持区间）
function computeRow(row) {
	const globals = getGlobalDefaultsForCatalog();
	const std = mergeGlobalsWithRow(row, globals);
	const errors = [];
	if (!std.name || !std.sku || !std.platform) errors.push('名称/货号/平台为必填');

	// 支持"多档售价"输入：row.salePriceTiers = [price1, price2, ...]
	const salePriceTiers = Array.isArray(row.salePriceTiers) ? row.salePriceTiers.filter(v => isFinite(Number(v)) && Number(v) > 0).map(Number) : [];
	
	// 如果没有设置售价区间，检查单一售价
	if (salePriceTiers.length === 0) {
		if (!isFinite(std.salePrice) || std.salePrice <= 0) errors.push('含税售价P必填且>0');
	} else {
		// 如果启用了多档售价，含税售价P可以为0（表示只使用多档售价），但必须是非负数
		if (!isFinite(std.salePrice) || std.salePrice < 0) errors.push('含税售价P不能为负数');
		// 注意：当启用多档售价时，含税售价P为0是合法的，表示只使用多档售价
	}

	// 支持"多档进货价"输入：row.costTiers = [cost1, cost2, ...]
	const costTiers = Array.isArray(row.costTiers) ? row.costTiers.filter(v => isFinite(Number(v)) && Number(v) >= 0).map(Number) : [];
	
	// 若"售价多档"和"进货价多档"同时存在：严格 1:1 配对逐行计算
	if (salePriceTiers.length > 0 && costTiers.length > 0) {
		if (errors.length) return { __result: { errors } };
		if (salePriceTiers.length !== costTiers.length) {
			errors.push('启用含税售价（多档）时，进货价（多档）需与之等量配对');
			return { __result: { errors } };
		}
		const list = salePriceTiers.map((price, i) => {
			const cost = costTiers[i];
			// 关键修复：使用多档售价的价格，而不是可能为0的含税售价P
			const rowWithPrice = { ...std, salePrice: price };
			const r = computeRowWithCost(rowWithPrice, cost);
			return { cost, price, ...r };
		});
		return { __result: { list, errors: [] } };
	}
	
	// 如果只有售价区间：要求进货价也启用多档并与之等量配对
	if (salePriceTiers.length > 0) {
		if (errors.length) return { __result: { errors } };
		if (costTiers.length === 0) { errors.push('已启用含税售价（多档），请在"进货价（多档）"中提供等量档位'); return { __result: { errors } }; }
		if (salePriceTiers.length !== costTiers.length) { errors.push('含税售价（多档）与进货价（多档）档数需一致'); return { __result: { errors } }; }
		const list = salePriceTiers.map((price, i) => {
			const cost = costTiers[i];
			// 使用多档售价的价格，而不是可能为0的含税售价P
			const rowWithPrice = { ...std, salePrice: price };
			const r = computeRowWithCost(rowWithPrice, cost);
			return { cost, price, ...r };
		});
		return { __result: { list, errors: [] } };
	}

	// 如果只有多档成本（按逐档展示）
	if (costTiers.length > 0) {
		if (errors.length) return { __result: { errors } };
		// 如果有启用多档售价，使用多档售价的价格；否则使用单一售价
		if (salePriceTiers.length > 0) {
			// 多档售价 + 多档成本：1:1配对计算
			if (salePriceTiers.length !== costTiers.length) {
				errors.push('多档售价与多档成本数量不一致');
				return { __result: { errors } };
			}
			const list = salePriceTiers.map((price, i) => {
				const cost = costTiers[i];
				const rowWithPrice = { ...std, salePrice: price };
				const r = computeRowWithCost(rowWithPrice, cost);
				return { cost, price, ...r };
			});
			return { __result: { list, errors: [] } };
		} else {
			// 单一售价 + 多档成本：逐档计算
			const list = costTiers.map(cost => { 
				const r = computeRowWithCost(std, cost); 
				return { cost, ...r }; 
			});
			return { __result: { list, errors: [] } };
		}
	}

	// 新规则：进货价必填，支持单值或多档
	if (!isFinite(std.costMin) && !isFinite(std.costMax) && (!Array.isArray(std.costTiers) || std.costTiers.length === 0)) {
		errors.push('进货价为必填（支持单值或多档）');
		return { __result: { errors } };
	}
	
	// 处理进货价：优先使用多档，否则使用单值
	let costValues = [];
	if (Array.isArray(std.costTiers) && std.costTiers.length > 0) {
		costValues = std.costTiers;
	} else {
		const singleCost = isFinite(std.costMin) ? std.costMin : std.costMax;
		if (isFinite(singleCost)) {
			costValues = [singleCost];
		}
	}
	
	if (costValues.length === 0) {
		errors.push('进货价数据无效');
		return { __result: { errors } };
	}
	
	// 计算每个成本档位的结果
	const results = costValues.map(cost => {
		// 如果有启用多档售价，使用多档售价的价格；否则使用单一售价
		if (salePriceTiers.length > 0) {
			// 多档售价 + 单值成本：使用第一个售价档位
			const price = salePriceTiers[0];
			const rowWithPrice = { ...std, salePrice: price };
			const r = computeRowWithCost(rowWithPrice, cost);
			return { cost, price, ...r };
		} else {
			// 单一售价 + 单值成本：正常计算
			const r = computeRowWithCost(std, cost);
			return { cost, ...r };
		}
	});
	
	return { __result: { list: results, errors: [] } };
}

// 辅助函数：计算区间结果
function computeRangeResults(resMin, resMax) {
	const range = (a,b) => { 
		if (!isFinite(a)&&!isFinite(b)) return '-'; 
		if (Math.abs(a-b)<1e-9) return a; 
		return {min:Math.min(a,b), max:Math.max(a,b)}; 
	};
	return {
		profit: range(resMin.profit, resMax.profit),
		profitRate: range(resMin.profitRate, resMax.profitRate),
		breakevenROI: range(resMin.breakevenROI, resMax.breakevenROI),
		breakevenAdRate: range(resMin.breakevenAdRate, resMax.breakevenAdRate)
	};
}
// 渲染表格
function renderCatalogTable() {
	const container = document.getElementById('catalogTableContainer'); if (!container) return;
	
	// 使用筛选后的数据或原始数据
	const rows = catalogFilterState.filteredRows.length > 0 ? catalogFilterState.filteredRows : (catalogState.rows || []);
	const thead = '<thead><tr>'+
		'<th style="width:36px; text-align:center;"><input id="catalogCheckAll" type="checkbox"></th>'+
		'<th style="width:120px;">商品名称</th><th style="width:100px;">货号</th><th style="width:80px;">平台</th><th class="lp-col-right" style="width:80px;">含税售价P</th><th class="lp-col-right" style="width:180px;">含税售价（多档）</th>'+
		'<th class="lp-col-right" style="width:140px;">进货价（多档）</th><th class="lp-col-right" style="width:70px;">退货率 <button id="returnRateToggle" type="button" title="点击隐藏/显示退货率列" style="margin-left:4px; width:16px; height:16px; line-height:16px; padding:0; display:inline-flex; align-items:center; justify-content:center; border-radius:4px; background:#f3f4f6; color:#6b7280; font-weight:700; white-space:nowrap; border:none; cursor:pointer; font-size:12px;">👁</button></th>'+
		'<th class="lp-col-right" style="width:100px; white-space:nowrap;">保本ROI</th><th class="lp-col-right" style="width:120px; white-space:nowrap;">保本广告占比</th>'+
		'<th class="lp-col-right" style="width:100px; white-space:nowrap;">利润率(20%付费)</th>'+
		'<th class="lp-col-center" style="width:140px;">操作</th>'+
		'</tr></thead>';
	const buildCellInput = (row, key, type, placeholder) => { 
		const val = row[key] ?? ''; 
		const cls='catalog-input'; 
		const step = (type==='number') ? ' step="0.01"' : ''; 
		// 根据字段类型设置合适的宽度
		let width = '80px';
		if (key === 'name') width = '120px';      // 商品名称稍宽
		if (key === 'sku') width = '100px';       // SKU适中
		if (key === 'platform') width = '120px';   // 平台名称
		if (key === 'salePrice') width = '80px';  // 售价
		if (key === 'returnRate') width = '70px'; // 退货率
		// 已移除"付费占比"作为输入列
		// 当已使用"售价（多档）"时，单一售价可选但不必填，为避免误解将其置为可视但禁用输入
		const disabled = (key==='salePrice' && Array.isArray(row.salePriceTiers) && row.salePriceTiers.length>0) ? ' disabled title="已填写多档售价时，单一售价仅作参考，可留空"' : '';
		// 为禁用的售价输入框添加明显的视觉提示
		if (key === 'salePrice' && Array.isArray(row.salePriceTiers) && row.salePriceTiers.length > 0) {
			return `<div style="display:flex; flex-direction:column; gap:4px;">
				<input data-key="${key}" class="${cls}" type="${type}" value="${val === undefined ? '' : String(val)}" placeholder="${placeholder||''}"${step} disabled style="width:${width}; background-color:#f3f4f6; border-color:#d1d5db; color:#9ca3af; cursor:not-allowed; opacity:0.6;" title="已启用多档售价，此输入框禁用">
				<div style="color:#6b7280; font-size:11px; font-style:italic; text-align:center; background:#f9fafb; padding:2px 4px; border-radius:4px; border:1px dashed #d1d5db;">已启用多档售价，此输入框禁用</div>
			</div>`;
		}
		// 平台字段改为下拉选择，选中后自动应用默认佣金
		if (key === 'platform') {
			const presets = getPlatformPresets();
			const opts = presets.map(p=>`<option value="${p.name}"${String(val||'')===p.name?' selected':''}>${p.name}</option>`).join('');
			return `<select data-key="platform" class="${cls}" style="width:${width};">`+
				`<option value=""${!val?' selected':''}>请选择平台</option>`+opts+
			`</select>`;
		}
			// 退货率字段特殊处理：显示为百分比格式，但存储为小数值
	if (key === 'returnRate') {
		const displayValue = (() => {
			if (val === undefined || val === null || val === '') return '';
			const num = Number(val);
			if (isFinite(num)) {
				// 如果是小数值（0-1之间），转换为百分比显示
				if (num >= 0 && num <= 1) {
					return (num * 100).toFixed(2) + '%';
				}
				// 如果已经是百分比数值（>1），直接显示
				return num.toFixed(2) + '%';
			}
			// 如果已经是字符串格式（如"12%"），直接显示
			return String(val);
		})();
		return `<input data-key="${key}" class="${cls}" type="text" value="${displayValue}" placeholder="输入数字自动添加%" style="width:${width};" title="直接输入数字即可，系统自动添加%号，如：12">`;
	}
		return `<input data-key="${key}" class="${cls}" type="${type}" value="${val === undefined ? '' : String(val)}" placeholder="${placeholder||''}"${step}${disabled} style="width:${width};">`; 
	};
	const fmtRange = (v, asPercent, asMoney, clampZero) => {
		const show = (x) => {
			if (!isFinite(x)) return '-';
			if (asPercent) {
				if (clampZero && x <= 0) return '0%';
				return (x*100).toFixed(2)+'%';
			}
			return asMoney ? ('¥ ' + Number(x).toFixed(2)) : Number(x).toFixed(2);
		};
		if (v && typeof v==='object' && 'min' in v) { return `${show(v.min)} ~ ${show(v.max)}`; }
		return show(v);
	};
	// 生成"进货价（多档）"编辑区 HTML
	function buildCostTiers(row) {
		const tiers = Array.isArray(row.costTiers) ? row.costTiers : [];
		const hasPriceTiers = Array.isArray(row.salePriceTiers) && row.salePriceTiers.length>0;
		const hasCostTiers = Array.isArray(row.costTiers) && row.costTiers.length>0;
		const mismatch = hasPriceTiers && (!hasCostTiers || row.salePriceTiers.length !== row.costTiers.length);
		const items = tiers.map((v,i)=>`<div style="display:flex; gap:6px; align-items:center; margin:2px 0;">
			<input type="number" class="catalog-cost-tier" data-tier-index="${i}" value="${(v!==''&&v!==null&&v!==undefined&&isFinite(Number(v)))?Number(v):''}" step="0.01" style="width:80px; ${mismatch?'border-color:#ef4444; background:#fff1f2;':''}">
			<button type="button" class="catalog-tier-remove" data-action="removeTier" data-tier-index="${i}" title="删除" aria-label="删除" style="margin:0; width:24px; height:24px; line-height:24px; padding:0; display:inline-flex; align-items:center; justify-content:center; border-radius:8px; background:#fecaca; color:#dc2626; font-weight:700; white-space:nowrap; box-shadow:0 1px 3px rgba(0,0,0,0.1);">×</button>
		</div>`).join('');
		if (tiers.length === 0) {
			return `<div style="display:flex; flex-direction:column; align-items:center;">`
				+ `<button type="button" class="catalog-tier-add" data-action="addTier" title="新增一档" aria-label="新增一档" style="width:24px; height:24px; line-height:24px; padding:0; display:inline-flex; align-items:center; justify-content:center; border-radius:8px; background:#bfdbfe; color:#2563eb; font-weight:700; white-space:nowrap; box-shadow:0 1px 3px rgba(0,0,0,0.1);">+</button>`
				+ (mismatch?`<div style=\"color:#e11d48; font-size:12px; margin-top:4px;\">需与"含税售价（多档）"等量</div>`:'')
				+ `</div>`;
		}
		return `<div style="display:flex; flex-direction:column; align-items:flex-start; gap:4px;"><div style="display:flex; align-items:center; gap:8px;"><button type="button" class="catalog-tier-add" data-action="addTier" title="新增一档" aria-label="新增一档" style="width:24px; height:24px; line-height:24px; padding:0; display:inline-flex; align-items:center; justify-content:center; border-radius:8px; background:#bfdbfe; color:#2563eb; font-weight:700; white-space:nowrap; box-shadow:0 1px 3px rgba(0,0,0,0.1); margin-right:4px;">+</button><div>${items}</div></div>${mismatch?`<div style=\"color:#e11d48; font-size:12px;\">与"含税售价（多档）"档数不一致</div>`:''}</div>`;
	}
	// 生成"含税售价（多档）"编辑区 HTML
	function buildPriceTiers(row) {
		const tiers = Array.isArray(row.salePriceTiers) ? row.salePriceTiers : [];
		const hasPriceTiers = Array.isArray(row.salePriceTiers) && row.salePriceTiers.length>0;
		const hasCostTiers = Array.isArray(row.costTiers) && row.costTiers.length>0;
		const mismatch = hasPriceTiers && (!hasCostTiers || row.salePriceTiers.length !== row.costTiers.length);
		const items = tiers.map((v,i)=>`<div style="display:flex; gap:6px; align-items:center; margin:2px 0;">
			<input type="number" class="catalog-price-tier" data-price-tier-index="${i}" value="${(v!==''&&v!==null&&v!==undefined&&isFinite(Number(v)))?Number(v):''}" step="0.01" style="width:80px; ${mismatch?'border-color:#ef4444; background:#fff1f2;':''}">
			<button type="button" class="catalog-price-tier-remove" data-action="removePriceTier" data-price-tier-index="${i}" title="删除" aria-label="删除" style="margin:0; width:24px; height:24px; line-height:24px; padding:0; display:inline-flex; align-items:center; justify-content:center; border-radius:8px; background:#fecaca; color:#dc2626; font-weight:700; white-space:nowrap; box-shadow:0 1px 3px rgba(0,0,0,0.1);">×</button>
		</div>`).join('');
		if (tiers.length === 0) {
			return `<div style="display:flex; flex-direction:column; align-items:center;">`
				+ `<button type="button" class="catalog-price-tier-add" data-action="addPriceTier" title="新增一档" aria-label="新增一档" style="width:24px; height:24px; line-height:24px; padding:0; display:inline-flex; align-items:center; justify-content:center; border-radius:8px; background:#bfdbfe; color:#2563eb; font-weight:700; white-space:nowrap; box-shadow:0 1px 3px rgba(0,0,0,0.1);">+</button>`
				+ (mismatch?`<div style=\"color:#e11d48; font-size:12px; margin-top:4px;\">需与"进货价（多档）"档数不一致</div>`:'')
				+ `</div>`;
		}
		return `<div style="display:flex; flex-direction:column; align-items:flex-start; gap:4px;"><div style="display:flex; align-items:center; gap:8px;"><button type="button" class="catalog-price-tier-add" data-action="addPriceTier" title="新增一档" aria-label="新增一档" style="width:24px; height:24px; line-height:24px; padding:0; display:inline-flex; align-items:center; justify-content:center; border-radius:8px; background:#bfdbfe; color:#2563eb; font-weight:700; white-space:nowrap; box-shadow:0 1px 3px rgba(0,0,0,0.1); margin-right:4px;">+</button><div>${items}</div></div>${mismatch?`<div style=\"color:#e11d48; font-size:12px;\">与"进货价（多档）"档数不一致</div>`:''}</div>`;
	}
	const buildAdCell = (v) => {
		const text = fmtRange(v, true, false, true);
		let over1 = false;
		let isDanger = false;
		
		if (v && typeof v==='object' && 'min' in v) { 
			over1 = isFinite(v.min) && v.min >= 1; 
			isDanger = isFinite(v.min) && v.min > 0 && v.min < 0.21;
		} else { 
			over1 = isFinite(v) && v >= 1; 
			isDanger = isFinite(v) && v > 0 && v < 0.21;
		}
		
		// 实时预警标识样式：红色背景、白色文字、加粗显示、闪烁动画
		const dangerStyle = isDanger ? 'background:#dc2626; color:#fff; padding:2px 6px; border-radius:4px; font-weight:700; animation:pulse-warning 2s infinite;' : '';
		const dangerIcon = isDanger ? '⚠️ ' : '';
		
		if (!over1) {
			return `<div style="display:inline-block; ${dangerStyle}">${dangerIcon}${text}</div>`;
		}
		return `<div style="position:relative; display:inline-block;">${dangerIcon}${text}<span title="需≥100%付费占比才保本" style="position:absolute; right:-8px; top:-4px; width:6px; height:6px; background:#ef4444; border-radius:50%;"></span></div>`;
	};
	const tbody = '<tbody>' + rows.map((row, idx) => {
		const res = row.__result || {};
		const roiText = String(fmtRange(res.breakevenROI,false,false)).replace('Infinity','∞');
		return `<tr data-index=\"${idx}\">`+
			`<td class=\"lp-col-center\"><input type=\"checkbox\" class=\"catalog-check\"></td>`+
			`<td>${buildCellInput(row,'name','text','名称')}<div class=\"catalog-error\" style=\"color:#e11d48; font-size:12px; margin-top:4px; display:none;\"></div></td>`+
			`<td>${buildCellInput(row,'sku','text','SKU')}</td>`+
			`<td>${buildCellInput(row,'platform','text','平台')}</td>`+
			`<td class=\"lp-col-right\">${buildCellInput(row,'salePrice','number','P')}</td>`+
			`<td class=\"lp-col-right\">${buildPriceTiers(row)}</td>`+
			`<td class=\"lp-col-right\">${buildCostTiers(row)}</td>`+
			`<td class=\"lp-col-right return-rate-column\">${buildCellInput(row,'returnRate','text','输入数字自动添加%')}</td>`+
			`<td class=\"lp-col-right\" style=\"white-space:nowrap;\">${(function(){
				if (Array.isArray(res.list)) return res.list.map(x=>`<div>${isFinite(x.breakevenROI)? Number(x.breakevenROI).toFixed(2) : '∞'}</div>`).join('');
				if (Array.isArray(res.priceRangeResults)) return res.priceRangeResults.map(x=>`<div>${fmtRange(x.breakevenROI,false,false)}</div>`).join('');
				if (Array.isArray(res.combinations)) return res.combinations.map(x=>`<div>${isFinite(x.breakevenROI)? Number(x.breakevenROI).toFixed(2) : '∞'}</div>`).join('');
				return roiText;
			})()}</td>`+
			`<td class=\"lp-col-right\" style=\"white-space:nowrap;\">${(function(){
				const renderAd = (a)=>{
					const text = (!isFinite(a)||isNaN(a))? '-' : (a<=0? '0%' : (a*100).toFixed(2)+'%');
					const over = isFinite(a)&&a>=1;
					const isDanger = isFinite(a) && a > 0 && a < 0.21; // 低于21%的实时预警标识
					
					// 实时预警标识样式：红色背景、白色文字、加粗显示、闪烁动画
					const dangerStyle = isDanger ? 'background:#dc2626; color:#fff; padding:2px 6px; border-radius:4px; font-weight:700; animation:pulse-warning 2s infinite;' : '';
					const dangerIcon = isDanger ? '⚠️ ' : '';
					
					return `<div style=\\\"position:relative; display:inline-block; ${dangerStyle}\\\">${dangerIcon}${text}${over?'<span title=\\\"需≥100%付费占比才保本\\\" style=\\\"position:absolute; right:-8px; top:-4px; width:6px; height:6px; background:#ef4444; border-radius:50%;\\\"></span>':''}</div>`;
				};
				if (Array.isArray(res.list)) return res.list.map(x=>renderAd(x.breakevenAdRate)).join('');
				if (Array.isArray(res.priceRangeResults)) return res.priceRangeResults.map(x=>{
					const adRate = x.breakevenAdRate;
					let isDanger = false;
					
					// 检查价格区间结果中是否有低于21%的保本广告占比
					if (typeof adRate === 'object' && adRate.min !== undefined) {
						isDanger = isFinite(adRate.min) && adRate.min > 0 && adRate.min < 0.21;
					} else {
						isDanger = isFinite(adRate) && adRate > 0 && adRate < 0.21;
					}
					
					// 实时预警标识样式
					const dangerStyle = isDanger ? 'background:#dc2626; color:#fff; padding:2px 6px; border-radius:4px; font-weight:700; animation:pulse-warning 2s infinite;' : '';
					const dangerIcon = isDanger ? '⚠️ ' : '';
					
					return `<div style="display:inline-block; ${dangerStyle}">${dangerIcon}${fmtRange(adRate,true,false,true)}</div>`;
				}).join('');
				if (Array.isArray(res.combinations)) return res.combinations.map(x=>renderAd(x.breakevenAdRate)).join('');
				return buildAdCell(res.breakevenAdRate);
			})()}</td>`+
			`<td class=\"lp-col-right\" style=\"white-space:nowrap;\">${(function(){
				// 使用统一利润计算函数计算利润率（付费占比20%）
				try {
					// 获取行数据并转换为统一参数格式
					const globals = getGlobalDefaultsForCatalog();
					const std = mergeGlobalsWithRow(row, globals);
					
					// 获取售价和进货价的档位信息
					const salePrices = Array.isArray(row.salePriceTiers) && row.salePriceTiers.length > 0 
						? row.salePriceTiers.map(p => Number(p)).filter(p => isFinite(p) && p > 0)
						: (isFinite(std.salePrice) && std.salePrice > 0 ? [std.salePrice] : []);
					
					const costPrices = Array.isArray(row.costTiers) && row.costTiers.length > 0
						? row.costTiers.map(c => Number(c)).filter(c => isFinite(c) && c >= 0)
						: (isFinite(std.costMin) && std.costMin > 0 ? [std.costMin] : []);
					
					// 检查是否有有效的售价和进货价
					if (salePrices.length === 0 || costPrices.length === 0) {
						return '<span style="color:#9ca3af; font-style:italic;">需填写售价和进货价</span>';
					}
					
					// 计算多档利润率
					const profitRates = [];
					
					// 如果有多档售价和多档进货价，计算每档的利润率
					if (salePrices.length > 1 && costPrices.length > 1) {
						// 多档对多档：取最小长度，计算对应档位的利润率
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
								adRate: 0.20, // 固定付费占比20%
								otherCost: std.otherCost,
								returnRate: std.returnRate
							};
							
							const result = calculateProfitUnified(inputs);
							if (isFinite(result.profitRate)) {
								profitRates.push({
									rate: result.profitRate,
									price: salePrices[i],
									cost: costPrices[i]
								});
							}
						}
					} else if (salePrices.length > 1 && costPrices.length === 1) {
						// 多档售价单档进货价：计算每档售价的利润率
						for (let i = 0; i < salePrices.length; i++) {
							const inputs = {
								costPrice: costPrices[0],
								actualPrice: salePrices[i],
								inputTaxRate: std.inputTaxRate,
								outputTaxRate: std.outputTaxRate,
								salesTaxRate: std.salesTaxRate,
								platformRate: std.platformRate,
								shippingCost: std.shippingCost,
								shippingInsurance: std.shippingInsurance,
								adRate: 0.20, // 固定付费占比20%
								otherCost: std.otherCost,
								returnRate: std.returnRate
							};
							
							const result = calculateProfitUnified(inputs);
							if (isFinite(result.profitRate)) {
								profitRates.push({
									rate: result.profitRate,
									price: salePrices[i],
									cost: costPrices[0]
								});
							}
						}
					} else if (salePrices.length === 1 && costPrices.length > 1) {
						// 单档售价多档进货价：计算每档进货价的利润率
						for (let i = 0; i < costPrices.length; i++) {
							const inputs = {
								costPrice: costPrices[i],
								actualPrice: salePrices[0],
								inputTaxRate: std.inputTaxRate,
								outputTaxRate: std.outputTaxRate,
								salesTaxRate: std.salesTaxRate,
								platformRate: std.platformRate,
								shippingCost: std.shippingCost,
								shippingInsurance: std.shippingInsurance,
								adRate: 0.20, // 固定付费占比20%
								otherCost: std.otherCost,
								returnRate: std.returnRate
							};
							
							const result = calculateProfitUnified(inputs);
							if (isFinite(result.profitRate)) {
								profitRates.push({
									rate: result.profitRate,
									price: salePrices[0],
									cost: costPrices[i]
								});
							}
						}
					} else {
						// 单档对单档：计算单一利润率
						const inputs = {
							costPrice: costPrices[0],
							actualPrice: salePrices[0],
							inputTaxRate: std.inputTaxRate,
							outputTaxRate: std.outputTaxRate,
							salesTaxRate: std.salesTaxRate,
							platformRate: std.platformRate,
							shippingCost: std.shippingCost,
							shippingInsurance: std.shippingInsurance,
							adRate: 0.20, // 固定付费占比20%
							otherCost: std.otherCost,
							returnRate: std.returnRate
						};
						
						const result = calculateProfitUnified(inputs);
						if (isFinite(result.profitRate)) {
							profitRates.push({
								rate: result.profitRate,
								price: salePrices[0],
								cost: costPrices[0]
							});
						}
					}
					
					// 检查是否有有效的利润率结果
					if (profitRates.length === 0) {
						return '<span style="color:#9ca3af;">计算错误</span>';
					}
					
					// 格式化多档利润率显示
					if (profitRates.length === 1) {
						// 单档利润率显示
						const profitRate = profitRates[0].rate;
						const profitRatePercent = (profitRate * 100).toFixed(2);
						const isPositive = profitRate > 0;
						const isWarning = profitRate > 0 && profitRate < 0.05; // 低于5%利润率警告
						
						let style = 'font-weight:600;';
						if (isPositive) {
							if (isWarning) {
								style += 'color:#f59e0b;'; // 橙色警告
							} else {
								style += 'color:#059669;'; // 绿色正常
							}
						} else {
							style += 'color:#dc2626;'; // 红色亏损
						}
						
						return `<span style="${style}">${profitRatePercent}%</span>`;
					} else {
						// 多档利润率显示
						const profitRateItems = profitRates.map(item => {
							const profitRatePercent = (item.rate * 100).toFixed(2);
							const isPositive = item.rate > 0;
							const isWarning = item.rate > 0 && item.rate < 0.05; // 低于5%利润率警告
							
							let style = 'font-weight:600;';
							if (isPositive) {
								if (isWarning) {
									style += 'color:#f59e0b;'; // 橙色警告
								} else {
									style += 'color:#059669;'; // 绿色正常
								}
							} else {
								style += 'color:#dc2626;'; // 红色亏损
							}
							
							return `<div style="${style}">${profitRatePercent}%</div>`;
						});
						
						return profitRateItems.join('');
					}
				} catch (error) {
					console.error('利润率计算错误:', error);
					return '<span style="color:#9ca3af;">计算错误</span>';
				}
			})()}</td>`+
			`<td class=\"lp-col-center\"><button class=\"batch-modal-btn\" data-action=\"priceCheck\" style=\"margin:0; white-space:nowrap; min-width:80px;\">价格验证</button> <button class=\"batch-modal-btn\" data-action=\"profitScenario\" style=\"margin:0; white-space:nowrap; min-width:80px;\">利润推演</button></td>`+
		`</tr>`;
	}).join('') + '</tbody>';
	container.innerHTML = `<table class=\"lp-table\">${thead}${tbody}</table>`;
	const checkAll = document.getElementById('catalogCheckAll'); if (checkAll) checkAll.addEventListener('change', ()=>{ container.querySelectorAll('.catalog-check').forEach(cb=>cb.checked=checkAll.checked); });
	// 输入节流：避免每次输入都重建整行导致焦点丢失
	let inputDebounceTimer = null;
	container.querySelectorAll('.catalog-input, select.catalog-input').forEach(input => {
		input.addEventListener('input', (e) => {
			const el = e.target;
			const tr = el.closest('tr'); const index = Number(tr.getAttribute('data-index'));
			const key = el.getAttribute('data-key'); let value = el.value; 
			
			// 修复：根据筛选状态获取正确的行数据
			const row = getRowByDisplayIndex(index);
			if (!row) return;
			
			// 退货率字段特殊处理：支持百分比格式输入，智能处理%号
			if (key === 'returnRate') {
				// 智能处理退货率输入：移除所有%号，重新格式化
				let cleanValue = value.replace(/%/g, ''); // 移除所有%号
				
				// 检查是否为有效数字
				if (/^\d+(\.\d+)?$/.test(cleanValue)) {
					// 如果是纯数字，自动添加%号并更新显示
					el.value = cleanValue + '%';
					value = cleanValue + '%';
				} else if (cleanValue === '') {
					// 如果为空，清空显示
					el.value = '';
					value = '';
				} else {
					// 如果不是有效数字，保持原值但尝试清理
					value = cleanValue + '%';
				}
				
				// 使用 parsePercent 函数解析输入值，确保存储为小数值
				const parsedValue = parsePercent(value);
				if (isFinite(parsedValue)) {
					value = parsedValue; // 存储为小数值
				} else {
					// 如果解析失败，保持原值但标记为无效
					console.warn(`退货率输入值 "${el.value}" 无法解析，将保持原值`);
				}
			}
			
			row[key] = value; 
			// 立即计算缓存，但仅更新行展示的非输入单元格，避免重建输入框
			const computed = computeRow(row); row.__result = computed.__result; saveCatalogToStorage();
			// 使用 120ms 节流合并频繁输入，降低 render 频率，且仅调用 renderCatalogRow（不会重建输入框）
			clearTimeout(inputDebounceTimer);
			inputDebounceTimer = setTimeout(() => { renderCatalogRow(index); updateCatalogStatus(); }, 120);
		});
	});
	// 平台选择变更时，自动填充默认佣金（覆盖至全局佣金字段）并提示
	container.querySelectorAll('select[data-key="platform"]').forEach(sel => {
		sel.addEventListener('change', (e) => {
			const el = e.target; const tr = el.closest('tr'); const index = Number(tr.getAttribute('data-index'));
			const name = el.value; const rate = getPlatformRateByName(name);
			if (isFinite(rate)) {
				const row = getRowByDisplayIndex(index);
				if (!row) return;
				
				row.platform = name; // 已在通用 input 处理逻辑中覆盖
				// 行内覆盖平台佣金：后续 mergeGlobalsWithRow 会优先取行内值
				row.platformRate = rate;
				const computed = computeRow(row); row.__result = computed.__result; saveCatalogToStorage(); renderCatalogRow(index); updateCatalogStatus();
				showToast && showToast(`已按平台"${name}"设置佣金为 ${(rate*100).toFixed(2)}%`);
			}
		});
	});
	// 退货率列隐藏/显示功能
	const returnRateToggle = document.getElementById('returnRateToggle');
	if (returnRateToggle) {
		// 从localStorage获取退货率列的显示状态，默认显示
		const returnRateVisible = localStorage.getItem('returnRateColumnVisible') !== 'false';
		
		// 设置初始状态
		if (!returnRateVisible) {
			// 隐藏退货率输入框的内容
			document.querySelectorAll('.return-rate-column input[data-key="returnRate"]').forEach(input => {
				input.style.color = 'transparent';
				input.style.textShadow = 'none';
			});
			returnRateToggle.textContent = '👁‍🗨️'; // 隐藏状态图标
			returnRateToggle.title = '点击显示退货率列';
		}
		
		// 添加点击事件
		returnRateToggle.addEventListener('click', () => {
			const inputs = document.querySelectorAll('.return-rate-column input[data-key="returnRate"]');
			const isVisible = inputs[0].style.color !== 'transparent';
			
			if (isVisible) {
				// 隐藏输入框内容
				inputs.forEach(input => {
					input.style.color = 'transparent';
					input.style.textShadow = 'none';
				});
				returnRateToggle.textContent = '👁‍🗨️'; // 隐藏状态图标
				returnRateToggle.title = '点击显示退货率列';
				localStorage.setItem('returnRateColumnVisible', 'false');
			} else {
				// 显示输入框内容
				inputs.forEach(input => {
					input.style.color = '';
					input.style.textShadow = '';
				});
				returnRateToggle.textContent = '👁'; // 显示状态图标
				returnRateToggle.title = '点击隐藏退货率列';
				localStorage.setItem('returnRateColumnVisible', 'true');
			}
		});
	}
	
	// 事件：新增/删除/编辑 多档进货价
	container.querySelectorAll('button[data-action="addTier"]').forEach(btn => {
		btn.addEventListener('click', (e) => {
			const tr = e.target.closest('tr'); const index = Number(tr.getAttribute('data-index')); 
			const row = getRowByDisplayIndex(index);
			if (!row) return;
			
			if (!Array.isArray(row.costTiers)) row.costTiers = [];
			row.costTiers.push('');
			// 需要重新渲染整表以生成新的输入框并绑定事件
			saveCatalogToStorage();
			renderCatalogTable();
			updateCatalogStatus();
		});
	});
	container.querySelectorAll('button[data-action="removeTier"]').forEach(btn => {
		btn.addEventListener('click', (e) => {
			const tr = e.target.closest('tr'); const index = Number(tr.getAttribute('data-index')); 
			const row = getRowByDisplayIndex(index);
			if (!row) return;
			
			const ti = Number(e.target.getAttribute('data-tier-index'));
			if (Array.isArray(row.costTiers)) row.costTiers.splice(ti,1);
			const computed = computeRow(row); row.__result = computed.__result; saveCatalogToStorage();
			// 需要重新渲染整表以去除该输入框并重绑事件
			renderCatalogTable();
			updateCatalogStatus();
		});
	});
	container.querySelectorAll('.catalog-cost-tier').forEach(inp => {
		inp.addEventListener('input', (e) => {
			const tr = e.target.closest('tr'); const index = Number(tr.getAttribute('data-index')); 
			const row = getRowByDisplayIndex(index);
			if (!row) return;
			
			const ti = Number(e.target.getAttribute('data-tier-index'));
			if (!Array.isArray(row.costTiers)) row.costTiers = [];
			row.costTiers[ti] = e.target.value;
			const computed = computeRow(row); row.__result = computed.__result; saveCatalogToStorage(); renderCatalogRow(index); updateCatalogStatus();
		});
	});
	container.querySelectorAll('button[data-action="priceCheck"]').forEach(btn => {
		btn.addEventListener('click', (e) => {
			const tr = e.target.closest('tr'); const index = Number(tr.getAttribute('data-index'));
			const row = getRowByDisplayIndex(index);
			if (!row) return;
			showPriceCheckModal(row);
		});
	});

/**
 * 商品清单-利润推演弹窗
 * 说明：
 * - 基于当前行输入（进货价/含税售价/退货率/平台佣金/物流费/运费险/其他成本/税率），从0%到40%枚举付费占比，推演利润率
 * - 多档成本时分开展示，每档成本一列
 * - 使用统一的利润计算函数，确保与利润率计算tab结果完全一致
 */
function showCatalogProfitScenario(row){
	const globals = getGlobalDefaultsForCatalog();
	const std = mergeGlobalsWithRow(row, globals);
	
	// 修复：检测多档售价，如果存在且有效，使用多档售价进行推演
	const salePriceTiers = Array.isArray(row.salePriceTiers) ? row.salePriceTiers.filter(v => isFinite(Number(v)) && Number(v) > 0).map(Number) : [];
	const costTiers = Array.isArray(row.costTiers) ? row.costTiers.filter(v => isFinite(Number(v)) && Number(v) >= 0).map(Number) : [];
	
	// 确定推演策略：优先使用多档售价，否则使用单一售价
	let validationStrategy = 'single';
	let validationPairs = [];
	
	if (salePriceTiers.length > 0 && costTiers.length > 0) {
		// 多档售价 + 多档进货价：1:1配对推演
		if (salePriceTiers.length === costTiers.length) {
			validationStrategy = 'multi_tier';
			validationPairs = salePriceTiers.map((price, i) => ({
				price: price,
				cost: costTiers[i],
				label: `档位${i+1}`
			}));
		} else {
			// 档数不匹配，使用第一个售价档位
			validationStrategy = 'first_tier';
			validationPairs = costTiers.map((cost, i) => ({
				price: salePriceTiers[0],
				cost: cost,
				label: `档位${i+1}`
			}));
		}
	} else if (salePriceTiers.length > 0) {
		// 只有多档售价：使用第一个售价档位
		validationStrategy = 'first_tier';
		const firstPrice = salePriceTiers[0];
		if (Array.isArray(std.costTiers) && std.costTiers.length > 0) {
			validationPairs = std.costTiers.map((cost, i) => ({
				price: firstPrice,
				cost: cost,
				label: `档位${i+1}`
			}));
		} else {
			// 使用成本区间
			const cmin = isFinite(std.costMin) ? std.costMin : std.costMax;
			const cmax = isFinite(std.costMax) ? std.costMax : std.costMin;
			if (isFinite(cmin)) validationPairs.push({ price: firstPrice, cost: cmin, label: '区间下限' });
			if (isFinite(cmax) && Math.abs(cmax-cmin)>1e-9) validationPairs.push({ price: firstPrice, cost: cmax, label: '区间上限' });
		}
	} else {
		// 单一售价场景：使用原有逻辑
		validationStrategy = 'single';
		const tiers = Array.isArray(row.costTiers) ? row.costTiers.filter(v => isFinite(Number(v)) && Number(v) >= 0).map(Number) : [];
		if (tiers.length) {
			validationPairs = tiers.map((c,i) => ({ price: std.salePrice, cost: c, label: `档位${i+1}` }));
		} else {
			const cmin = isFinite(std.costMin) ? std.costMin : std.costMax;
			const cmax = isFinite(std.costMax) ? std.costMax : std.costMin;
			if (isFinite(cmin)) validationPairs.push({ price: std.salePrice, cost: cmin, label: '区间下限' });
			if (isFinite(cmax) && Math.abs(cmax-cmin)>1e-9) validationPairs.push({ price: std.salePrice, cost: cmax, label: '区间上限' });
		}
	}
	
	// 使用验证策略构建tiers
	const tiers = validationPairs.map(pair => pair.cost);
	const adRates = [0,0.05,0.10,0.15,0.20,0.25,0.30,0.35,0.40];
	
	const calc = (cost, adRate) => {
		try{
			// 找到对应的价格
			const pair = validationPairs.find(p => p.cost === cost);
			const price = pair ? pair.price : std.salePrice;
			
			// 使用统一的利润计算函数，确保与利润率计算tab结果完全一致
			const inputs = { 
				costPrice: cost, 
				actualPrice: price, 
				inputTaxRate: std.inputTaxRate, 
				outputTaxRate: std.outputTaxRate, 
				salesTaxRate: std.salesTaxRate, 
				platformRate: std.platformRate, 
				shippingCost: std.shippingCost, 
				shippingInsurance: std.shippingInsurance, 
				otherCost: std.otherCost, 
				adRate: adRate, 
				returnRate: std.returnRate 
			};
			
			const result = calculateProfitUnified(inputs);
			return { profit: result.profit, rate: result.profitRate };
		}catch(_){ return { profit: NaN, rate: NaN }; }
	};
	// 为每个成本档位生成三列表格：付费占比 | 利润率 | 利润金额
	const buildTableForCost = (cost, costIndex) => {
		const values = adRates.map(a => {
			const r = calc(cost, a);
			try {
				// 找到对应的价格
				const pair = validationPairs.find(p => p.cost === cost);
				const price = pair ? pair.price : std.salePrice;
				
				// 使用统一的利润计算函数，确保与利润率计算tab结果完全一致
				const inputs = { 
					costPrice: cost, 
					actualPrice: price, 
					inputTaxRate: std.inputTaxRate, 
					outputTaxRate: std.outputTaxRate, 
					salesTaxRate: std.salesTaxRate, 
					platformRate: std.platformRate, 
					shippingCost: std.shippingCost, 
					shippingInsurance: std.shippingInsurance, 
					otherCost: std.otherCost, 
					adRate: a, 
					returnRate: std.returnRate 
				};
				
				const result = calculateProfitUnified(inputs);
				
				// 生成详细的计算过程说明
				const detail = [
					`含税售价：¥${price.toFixed(2)}`,
					`不含税净价：¥${result.netPrice.toFixed(2)}`,
					`进货有效成本：¥${result.effectiveCost.toFixed(2)}`,
					`平台佣金：¥${result.platformFee.toFixed(2)}`,
					`广告费（分摊）：¥${result.adCostEffective.toFixed(2)}`,
					`物流（分摊）：¥${result.shippingCostEffective.toFixed(2)}`,
					`运费险（分摊）：¥${result.insuranceCostEffective.toFixed(2)}`,
					`其他（分摊）：¥${result.otherCostEffective.toFixed(2)}`,
					`销项税：¥${result.outputVAT.toFixed(2)}`,
					`进项抵扣合计：¥${result.totalVATDeduction.toFixed(2)}`,
					`实缴增值税：¥${result.actualVAT.toFixed(2)}`,
					`总成本：¥${result.totalCost.toFixed(2)}`,
					`利润：¥${result.profit.toFixed(2)}`,
					`利润率：${(result.profitRate * 100).toFixed(2)}%`
				].join('\n');
				
				return { ...r, tooltip: detail };
			} catch (_) { return { ...r, tooltip: '' }; }
		});
		
		// 生成趋势图数据
		const chartData = values.map((v, i) => ({ x: adRates[i] * 100, y: v.profit, rate: v.rate }));
		
		return { cost, costIndex, values, chartData };
	};
	
	const costTables = tiers.map((c, i) => buildTableForCost(c, i));
	
	// 生成每个成本档位的三列表格
	const generateTableHtml = (costTable) => {
		const { cost, costIndex, values } = costTable;
		const header = `
			<tr>
				<th style="border-bottom:1px solid #eee;padding:8px 10px;color:#333;font-weight:600;text-align:center;background:#f8fafc;" colspan="3">
					<span style="color:#3b82f6;font-weight:700;">成本${tiers.length > 1 ? (costIndex + 1) : ''}：¥${cost.toFixed(2)}</span>
				</th>
			</tr>
			<tr>
				<th style="border-bottom:1px solid #eee;padding:8px 10px;color:#666;font-weight:500;text-align:center;">付费占比</th>
				<th style="border-bottom:1px solid #eee;padding:8px 10px;color:#666;font-weight:500;text-align:center;">利润率</th>
				<th style="border-bottom:1px solid #eee;border-right:1px solid #f2f2f2;padding:8px 10px;color:#666;font-weight:500;text-align:center;">利润金额</th>
			</tr>`;
		
		const rows = values.map((v, ri) => {
			const adRate = adRates[ri];
			const color = v.rate > 0 ? '#16a34a' : (v.rate < 0 ? '#dc2626' : '#475569');
			const tooltip = v.tooltip || '';
			
			return `
				<tr>
					<td style="padding:8px 10px;text-align:center;border-right:1px solid #f2f2f2;background:#f8fafc;font-weight:500;">${(adRate * 100).toFixed(0)}%</td>
					<td style="padding:8px 10px;text-align:center;font-weight:600;color:${color};" 
						data-tooltip="${tooltip.replace(/"/g, '&quot;')}">${isFinite(v.rate) ? (v.rate * 100).toFixed(2) + '%' : '-'}</td>
					<td style="padding:8px 10px;text-align:center;border-right:1px solid #f2f2f2;color:${color};" 
						data-tooltip="${tooltip.replace(/"/g, '&quot;')}">${isFinite(v.profit) ? ('¥' + v.profit.toFixed(2)) : '-'}</td>
				</tr>`;
		}).join('');
		
		return `<table style="border-collapse:separate;border-spacing:0;width:100%;font-size:13px;margin-bottom:20px;">${header}${rows}</table>`;
	};
	

	// 生成到手价推演矩阵HTML
	const generateTakeHomePriceTableHtml = (costTable) => {
		const { cost, costIndex } = costTable;
		
		// 目标利润率范围：0%、3%、5%、7%、9%、10%、12%、15%
		const targetProfitRates = [0, 0.03, 0.05, 0.07, 0.09, 0.10, 0.12, 0.15];
		
		// 表头：第一行显示目标利润率
		const header = `
			<tr>
				<th style="border-bottom:1px solid #eee;padding:8px 10px;color:#333;font-weight:600;text-align:center;background:#f8fafc;" colspan="${targetProfitRates.length + 1}">
					<span style="color:#10b981;font-weight:700;">成本${tiers.length > 1 ? (costIndex + 1) : ''}：¥${cost.toFixed(2)}</span>
				</th>
			</tr>
			<tr>
				<th style="border-bottom:1px solid #eee;padding:8px 10px;color:#666;font-weight:500;text-align:center;background:#f8fafc;">付费占比 \\ 目标利润率</th>
				${targetProfitRates.map(rate => 
					`<th style="border-bottom:1px solid #eee;padding:8px 10px;color:#666;font-weight:500;text-align:center;background:#f8fafc;">${(rate * 100).toFixed(1)}%</th>`
				).join('')}
			</tr>`;
		
		// 表格行：每行显示一个付费占比，每列显示对应目标利润率的到手价
		const rows = adRates.map(adRate => {
			// 20%付费占比行高亮显示
			const isHighlighted = adRate === 0.20;
			const rowStyle = isHighlighted ? 'background:linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border:2px solid #f59e0b;' : '';
			
			const rowHeader = `<td style="padding:8px 10px;text-align:center;border-right:1px solid #f2f2f2;background:#f8fafc;font-weight:500;color:#3b82f6;">${(adRate * 100).toFixed(0)}%</td>`;
			
			const cells = targetProfitRates.map(targetRate => {
				const takeHomePrice = calculateTakeHomePrice(cost, adRate, targetRate, std);
				const color = takeHomePrice > 0 ? '#16a34a' : '#dc2626';
				
				// 计算对应的利润金额
				let profitAmount = 0;
				if (isFinite(takeHomePrice) && takeHomePrice > 0) {
					try {
						// 使用统一的利润计算函数，确保与利润率计算tab结果完全一致
						const inputs = { 
							costPrice: cost, 
							actualPrice: takeHomePrice, 
							inputTaxRate: std.inputTaxRate, 
							outputTaxRate: std.outputTaxRate, 
							salesTaxRate: std.salesTaxRate, 
							platformRate: std.platformRate, 
							shippingCost: std.shippingCost, 
							shippingInsurance: std.shippingInsurance, 
							otherCost: std.otherCost, 
							adRate: adRate, 
							returnRate: std.returnRate
						};
						
						const result = calculateProfitUnified(inputs);
						profitAmount = result.profit;
					} catch (_) {
						profitAmount = 0;
					}
				}
				
				const tooltip = `目标利润率：${(targetRate * 100).toFixed(1)}%\n付费占比：${(adRate * 100).toFixed(0)}%\n进货价：¥${cost.toFixed(2)}\n到手价：¥${takeHomePrice.toFixed(2)}\n利润金额：¥${profitAmount.toFixed(2)}`;
				
				return `<td style="padding:8px 10px;text-align:center;border-right:1px solid #f2f2f2;color:${color};font-weight:600;" 
					data-tooltip="${tooltip.replace(/"/g, '&quot;')}">${isFinite(takeHomePrice) ? ('¥' + takeHomePrice.toFixed(2)) : '-'}</td>`;
			}).join('');
			
			return `<tr style="${rowStyle}">${rowHeader}${cells}</tr>`;
		}).join('');
		
		return `<table style="border-collapse:separate;border-spacing:0;width:100%;font-size:13px;margin-bottom:20px;">${header}${rows}</table>`;
	};
	
	// 计算到手价的函数
	const calculateTakeHomePrice = (costPrice, adRate, targetProfitRate, params) => {
		try {
			// 基于目标利润率和已知参数，反推到手价
			// 使用迭代法求解：从成本价开始，逐步调整直到达到目标利润率
			let lowPrice = costPrice;
			let highPrice = costPrice * 10; // 上限设为成本的10倍
			let midPrice;
			let bestPrice = costPrice;
			let bestDiff = Infinity;
			
			// 二分查找最优价格
			for (let i = 0; i < 20; i++) {
				midPrice = (lowPrice + highPrice) / 2;
				
				// 使用统一的利润计算函数，确保与利润率计算tab结果完全一致
				const inputs = { 
					costPrice: costPrice, 
					actualPrice: midPrice, 
					inputTaxRate: params.inputTaxRate, 
					outputTaxRate: params.outputTaxRate, 
					salesTaxRate: params.salesTaxRate, 
					platformRate: params.platformRate, 
					shippingCost: params.shippingCost, 
					shippingInsurance: params.shippingInsurance, 
					otherCost: params.otherCost, 
					adRate: adRate, 
					returnRate: params.returnRate
				};
				
				const result = calculateProfitUnified(inputs);
				const actualProfitRate = result.profitRate;
				
				const diff = Math.abs(actualProfitRate - targetProfitRate);
				if (diff < bestDiff) {
					bestDiff = diff;
					bestPrice = midPrice;
				}
				
				if (Math.abs(actualProfitRate - targetProfitRate) < 0.001) {
					break; // 精度足够，退出循环
				}
				
				if (actualProfitRate < targetProfitRate) {
					lowPrice = midPrice;
				} else {
					highPrice = midPrice;
				}
			}
			
			return bestPrice;
		} catch (_) {
			return NaN;
		}
	};
	const html = `
		<div class="pv-mask">
			<div class="pv-modal">
				<div class="pv-hd">
					<div class="pv-title">利润推演 - ${row.name||''}（${row.sku||''}）<span style="color:#6b7280;font-size:0.9em;margin-left:8px;">${row.platform||''}</span><span style="color:#10b981;font-size:0.8em;margin-left:8px;">✓ 已统一计算逻辑</span></div>
					<div class="pv-tabs" style="display:flex;gap:8px;margin-left:auto;">
						<button id="profitTabBtn" class="pv-tab-btn active" style="padding:6px 12px;border:1px solid #3b82f6;background:#3b82f6;color:#fff;border-radius:6px;font-size:12px;cursor:pointer;">利润推演</button>
						<button id="takeHomeTabBtn" class="pv-tab-btn" style="padding:6px 12px;border:1px solid #d1d5db;background:#fff;color:#6b7280;border-radius:6px;font-size:12px;cursor:pointer;">到手价推演</button>
					</div>
					<button id="catalogProfitScenarioClose" class="batch-modal-btn pv-close">关闭</button>
				</div>
				<div class="pv-body">
					<div class="pv-meta">
						<span class="pv-badge" style="background:#3b82f6;color:#fff;font-weight:700;border:2px solid #3b82f6;">售价 ${validationStrategy === 'multi_tier' ? '多档售价' : validationStrategy === 'first_tier' ? '多档售价（首档）' : '单一售价'} ${validationStrategy === 'multi_tier' ? salePriceTiers.map(p=>'¥'+p.toFixed(2)).join(' / ') : validationStrategy === 'first_tier' ? '¥'+salePriceTiers[0].toFixed(2) : '¥'+(Number(std.salePrice)||0).toFixed(2)}</span>
						<span class="pv-badge" style="background:#3b82f6;color:#fff;font-weight:700;border:2px solid #3b82f6;">进货价${tiers.length>1?'（多档）':''} ${tiers.map(c=>'¥'+c.toFixed(2)).join(' / ')}</span>
						<span class="pv-badge">退货率 ${((std.returnRate||0)*100).toFixed(2)}%</span>
						<span class="pv-badge">佣金 ${((std.platformRate||0)*100).toFixed(2)}%</span>
						<span class="pv-badge">销项税 ${((std.salesTaxRate||0)*100).toFixed(2)}%</span>
						<span class="pv-badge">物流费 ¥ ${(Number(std.shippingCost)||0).toFixed(2)}</span>
						<span class="pv-badge">运费险 ¥ ${(Number(std.shippingInsurance)||0).toFixed(2)}</span>
						<span class="pv-badge">其他成本 ¥ ${(Number(std.otherCost)||0).toFixed(2)}</span>
					</div>
					<!-- 计算逻辑统一说明 -->
					<div style="background:#f0f4ff; border:1px solid #3b82f6; border-radius:8px; padding:12px; margin-bottom:16px; color:#1e40af;">
						<div style="font-weight:600; margin-bottom:4px;">✅ 计算逻辑已统一</div>
						<div style="font-size:13px; line-height:1.4;">
							本弹窗使用与"利润率计算"tab完全一致的计算逻辑，包括进项税抵扣计算方式（0.06/1.06），确保结果完全一致。
						</div>
					</div>
					
					${validationStrategy !== 'single' ? `<div style="background:#f0f9ff; border:1px solid #0ea5e9; border-radius:8px; padding:12px; margin-bottom:16px; color:#0c4a6e;">
						<div style="font-weight:600; margin-bottom:4px;">📊 推演策略说明</div>
						<div style="font-size:13px; line-height:1.4;">
							${validationStrategy === 'multi_tier' ? 
								`当前使用<strong>多档售价+多档进货价1:1配对推演</strong>，共${validationPairs.length}个档位。每个档位基于对应售价计算利润率变化。` :
								`当前使用<strong>多档售价首档推演</strong>，以第一个售价档位（¥${salePriceTiers[0].toFixed(2)}）为基础，推演各成本档位的利润率变化。`
							}
						</div>
					</div>` : ''}
					<div id="profitContent" class="batch-table-container" style="overflow:auto;max-height:75vh;padding:16px;">
						${costTables.map((ct, i) => `
							<div style="margin-bottom:30px;border:1px solid #e5e7eb;border-radius:12px;padding:16px;background:#fff;">
								${generateTableHtml(ct)}
							</div>
						`).join('')}
					</div>
					<div id="takeHomeContent" class="batch-table-container" style="overflow:auto;max-height:75vh;padding:16px;display:none;">
						${costTables.map((ct, i) => `
							<div style="margin-bottom:30px;border:1px solid #e5e7eb;border-radius:12px;padding:16px;background:#fff;">
								${generateTakeHomePriceTableHtml(ct)}
							</div>
						`).join('')}
					</div>
				</div>
			</div>
		</div>`;
	const wrapper = document.createElement('div'); wrapper.innerHTML = html; document.body.appendChild(wrapper);
	const close = ()=>{ try { document.body.removeChild(wrapper); } catch(_){} };
	wrapper.addEventListener('click', (e)=>{ if (e.target === wrapper) close(); });
	const closeBtn = document.getElementById('catalogProfitScenarioClose'); if (closeBtn) closeBtn.addEventListener('click', close);
	
	// 标签页切换事件
	const profitTabBtn = document.getElementById('profitTabBtn');
	const takeHomeTabBtn = document.getElementById('takeHomeTabBtn');
	const profitContent = document.getElementById('profitContent');
	const takeHomeContent = document.getElementById('takeHomeContent');
	
	if (profitTabBtn && takeHomeTabBtn && profitContent && takeHomeContent) {
		profitTabBtn.addEventListener('click', () => {
			profitTabBtn.className = 'pv-tab-btn active';
			profitTabBtn.style.cssText = 'padding:6px 12px;border:1px solid #3b82f6;background:#3b82f6;color:#fff;border-radius:6px;font-size:12px;cursor:pointer;';
			takeHomeTabBtn.className = 'pv-tab-btn';
			takeHomeTabBtn.style.cssText = 'padding:6px 12px;border:1px solid #d1d5db;background:#fff;color:#6b7280;border-radius:6px;font-size:12px;cursor:pointer;';
			profitContent.style.display = 'block';
			takeHomeContent.style.display = 'none';
		});
		
		takeHomeTabBtn.addEventListener('click', () => {
			takeHomeTabBtn.className = 'pv-tab-btn active';
			takeHomeTabBtn.style.cssText = 'padding:6px 12px;border:1px solid #3b82f6;background:#3b82f6;color:#fff;border-radius:6px;font-size:12px;cursor:pointer;';
			profitTabBtn.className = 'pv-tab-btn';
			profitTabBtn.style.cssText = 'padding:6px 12px;border:1px solid #d1d5db;background:#fff;color:#6b7280;border-radius:6px;font-size:12px;cursor:pointer;';
			takeHomeContent.style.display = 'block';
			profitContent.style.display = 'none';
		});
	}
	
	// 悬浮提示：委托到表格容器，悬停即显
	(function attachTooltipDelegation(){
		const profitContainer = wrapper.querySelector('#profitContent');
		const takeHomeContainer = wrapper.querySelector('#takeHomeContent');
		if (!profitContainer || !takeHomeContainer) return;
		
		// 为两个容器都添加悬浮提示事件
		[profitContainer, takeHomeContainer].forEach(container => {

		let currentHighlightedRow = null;

		const onOver = (e) => {
			const cell = e.target.closest('[data-tooltip]');
			if (!cell || !container.contains(cell)) return;
			
			// 高亮当前行
			const row = cell.closest('tr');
			if (row && row !== currentHighlightedRow) {
				// 移除之前的高亮
				if (currentHighlightedRow) {
					currentHighlightedRow.style.backgroundColor = '';
				}
				// 添加新的高亮
				row.style.backgroundColor = '#f0f9ff';
				currentHighlightedRow = row;
			}
			
			const text = cell.getAttribute('data-tooltip');
			if (text) showCatalogTooltip(text, e.clientX, e.clientY);
		};
		const onMove = (e) => {
			const cell = e.target.closest('[data-tooltip]');
			if (!cell || !container.contains(cell)) return hideCatalogTooltip();
			
			// 更新高亮行
			const row = cell.closest('tr');
			if (row && row !== currentHighlightedRow) {
				// 移除之前的高亮
				if (currentHighlightedRow) {
					currentHighlightedRow.style.backgroundColor = '';
				}
				// 添加新的高亮
				row.style.backgroundColor = '#f0f9ff';
				currentHighlightedRow = row;
			}
			
			const text = cell.getAttribute('data-tooltip');
			if (text) showCatalogTooltip(text, e.clientX, e.clientY);
		};
		const onLeave = () => {
			// 移除行高亮
			if (currentHighlightedRow) {
				currentHighlightedRow.style.backgroundColor = '';
				currentHighlightedRow = null;
			}
			hideCatalogTooltip();
		};

		container.addEventListener('mouseover', onOver);
		container.addEventListener('mousemove', onMove);
		container.addEventListener('mouseleave', onLeave);
		});
	})();
}
	// 新增：利润推演按钮事件
	container.querySelectorAll('button[data-action="profitScenario"]').forEach(btn => {
		btn.addEventListener('click', (e) => {
			const tr = e.target.closest('tr'); const index = Number(tr.getAttribute('data-index'));
			const row = getRowByDisplayIndex(index);
			if (!row) return;
			showCatalogProfitScenario(row);
		});
	});
	// 事件：新增/删除/编辑 多档含税售价
	container.querySelectorAll('button[data-action="addPriceTier"]').forEach(btn => {
		btn.addEventListener('click', (e) => {
			const tr = e.target.closest('tr'); const index = Number(tr.getAttribute('data-index')); 
			const row = getRowByDisplayIndex(index);
			if (!row) return;
			
			if (!Array.isArray(row.salePriceTiers)) row.salePriceTiers = [];
			row.salePriceTiers.push('');
			saveCatalogToStorage();
			renderCatalogTable();
			updateCatalogStatus();
		});
	});
	container.querySelectorAll('button[data-action="removePriceTier"]').forEach(btn => {
		btn.addEventListener('click', (e) => {
			const tr = e.target.closest('tr'); const index = Number(tr.getAttribute('data-index')); 
			const row = getRowByDisplayIndex(index);
			if (!row) return;
			
			const ti = Number(e.target.getAttribute('data-price-tier-index'));
			if (Array.isArray(row.salePriceTiers)) row.salePriceTiers.splice(ti,1);
			const computed = computeRow(row); row.__result = computed.__result; saveCatalogToStorage();
			renderCatalogTable();
			updateCatalogStatus();
		});
	});
	container.querySelectorAll('.catalog-price-tier').forEach(inp => {
		inp.addEventListener('input', (e) => {
			const tr = e.target.closest('tr'); const index = Number(tr.getAttribute('data-index')); 
			const row = getRowByDisplayIndex(index);
			if (!row) return;
			
			const ti = Number(e.target.getAttribute('data-price-tier-index'));
			if (!Array.isArray(row.salePriceTiers)) row.salePriceTiers = [];
			row.salePriceTiers[ti] = e.target.value;
			const computed = computeRow(row); row.__result = computed.__result; saveCatalogToStorage(); renderCatalogRow(index); updateCatalogStatus();
		});
	});
	updateCatalogStatus();
}

function renderCatalogRow(index) {
	const container = document.getElementById('catalogTableContainer'); const tr = container.querySelector(`tr[data-index="${index}"]`); if (!tr) return;
	const row = getRowByDisplayIndex(index); if (!row) return; const res = row.__result || {}; const tds = tr.querySelectorAll('td');
	const fmt = (v, asPercent, asMoney, clampZero) => {
		const show = (x) => { if (!isFinite(x)) return '-'; if (asPercent) { if (clampZero && x<=0) return '0%'; return (x*100).toFixed(2)+'%'; } return asMoney?('¥ '+Number(x).toFixed(2)):Number(x).toFixed(2); };
		if (v && typeof v==='object' && 'min' in v) return `${show(v.min)} ~ ${show(v.max)}`; return show(v);
	};
	const ROI_COL = 8, AD_COL = 9, PROFIT_COL = 10; // 新索引：添加利润率列后
	if (Array.isArray(res.list)) {
		if (tds[ROI_COL]) tds[ROI_COL].innerHTML = res.list.map(x=>`<div style="margin:2px 0;">${isFinite(x.breakevenROI)? Number(x.breakevenROI).toFixed(2) : '∞'}</div>`).join('');
		if (tds[AD_COL]) tds[AD_COL].innerHTML = res.list.map(x=>{ 
			const a=x.breakevenAdRate; 
			const text = (!isFinite(a)||isNaN(a))? '-' : (a<=0? '0%' : (a*100).toFixed(2)+'%'); 
			const over = isFinite(a)&&a>=1; 
			const isDanger = isFinite(a) && a > 0 && a < 0.21; // 低于21%的实时预警标识
			
			// 实时预警标识样式：红色背景、白色文字、加粗显示、闪烁动画
			const dangerStyle = isDanger ? 'background:#dc2626; color:#fff; padding:2px 6px; border-radius:4px; font-weight:700; animation:pulse-warning 2s infinite;' : '';
			const dangerIcon = isDanger ? '⚠️ ' : '';
			
			return `<div style="margin:2px 0; position:relative; display:block;">${dangerIcon}${text}${over?'<span title="需≥100%付费占比才保本" style="position:absolute; right:-8px; top:-4px; width:6px; height:6px; background:#ef4444; border-radius:50%;"></span>':''}</div>`; 
		}).join('');
	} else if (Array.isArray(res.priceRangeResults)) {
		if (tds[ROI_COL]) tds[ROI_COL].innerHTML = res.priceRangeResults.map(x=>`<div style="margin:2px 0;">${fmt(x.breakevenROI,false,false)}</div>`).join('');
		if (tds[AD_COL]) tds[AD_COL].innerHTML = res.priceRangeResults.map(x=>{
			const adRate = x.breakevenAdRate;
			let isDanger = false;
			
			// 检查价格区间结果中是否有低于21%的保本广告占比
			if (typeof adRate === 'object' && adRate.min !== undefined) {
				isDanger = isFinite(adRate.min) && adRate.min > 0 && adRate.min < 0.21;
			} else {
				isDanger = isFinite(adRate) && adRate > 0 && adRate < 0.21;
			}
			
			// 实时预警标识样式
			const dangerStyle = isDanger ? 'background:#dc2626; color:#fff; padding:2px 6px; border-radius:4px; font-weight:700; animation:pulse-warning 2s infinite;' : '';
			const dangerIcon = isDanger ? '⚠️ ' : '';
			
			return `<div style="margin:2px 0; display:inline-block; ${dangerStyle}">${dangerIcon}${fmt(adRate,true,false,true)}</div>`;
		}).join('');
	} else if (Array.isArray(res.combinations)) {
		if (tds[ROI_COL]) tds[ROI_COL].innerHTML = res.combinations.map(x=>`<div style="margin:2px 0;">${isFinite(x.breakevenROI)? Number(x.breakevenROI).toFixed(2) : '∞'}</div>`).join('');
		if (tds[AD_COL]) tds[AD_COL].innerHTML = res.combinations.map(x=>{ 
			const a=x.breakevenAdRate; 
			const text = (!isFinite(a)||isNaN(a))? '-' : (a<=0? '0%' : (a*100).toFixed(2)+'%'); 
			const over = isFinite(a)&&a>=1; 
			const isDanger = isFinite(a) && a > 0 && a < 0.21; // 低于21%的实时预警标识
			
			// 实时预警标识样式：红色背景、白色文字、加粗显示、闪烁动画
			const dangerStyle = isDanger ? 'background:#dc2626; color:#fff; padding:2px 6px; border-radius:4px; font-weight:700; animation:pulse-warning 2s infinite;' : '';
			const dangerIcon = isDanger ? '⚠️ ' : '';
			
			return `<div style="margin:2px 0; position:relative; display:block;">${dangerIcon}${text}${over?'<span title="需≥100%付费占比才保本" style="position:absolute; right:-8px; top:-4px; width:6px; height:6px; background:#ef4444; border-radius:50%;"></span>':''}</div>`; 
		}).join('');
	} else {
		if (tds[ROI_COL]) tds[ROI_COL].innerHTML = String(fmt(res.breakevenROI,false,false)).replace('Infinity','∞');
		if (tds[AD_COL]) {
			const v = res.breakevenAdRate; 
			const text = fmt(v,true,false,true);
			let over1 = false; 
			let isDanger = false;
			
			if (v && typeof v==='object' && 'min' in v) { 
				over1 = isFinite(v.min) && v.min >= 1; 
				isDanger = isFinite(v.min) && v.min > 0 && v.min < 0.21;
			} else { 
				over1 = isFinite(v) && v >= 1; 
				isDanger = isFinite(v) && v > 0 && v < 0.21;
			}
			
			// 实时预警标识样式：红色背景、白色文字、加粗显示、闪烁动画
			const dangerStyle = isDanger ? 'background:#dc2626; color:#fff; padding:2px 6px; border-radius:4px; font-weight:700; animation:pulse-warning 2s infinite;' : '';
			const dangerIcon = isDanger ? '⚠️ ' : '';
			
			if (over1) {
				tds[AD_COL].innerHTML = `<div style="position:relative; display:inline-block;">${dangerIcon}${text}<span title="需≥100%付费占比才保本" style="position:absolute; right:-8px; top:-4px; width:6px; height:6px; background:#ef4444; border-radius:50%;"></span></div>`;
			} else {
				tds[AD_COL].innerHTML = `<div style="display:inline-block; ${dangerStyle}">${dangerIcon}${text}</div>`;
			}
		}
	}
	// 在不打断输入焦点的前提下显示错误提示：不重建单元格内容，仅更新占位容器
	const nameCell = tds[1];
	if (nameCell) {
		let errDiv = nameCell.querySelector('.catalog-error');
		const hasErr = (res.errors||[]).length>0;
		if (errDiv) {
			if (hasErr) {
				// 改进错误信息的显示样式
				errDiv.innerHTML = `<div style="background: #dc2626; color: white; padding: 6px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-top: 4px; animation: pulse-error 2s infinite;">
					<span style="color: #fbbf24; font-size: 14px;">⚠️</span> ${res.errors.join('；')}
				</div>`;
				errDiv.style.display = '';
				// 如果有错误，在商品名称列添加明显的错误样式
				nameCell.style.backgroundColor = '#fef2f2';
				nameCell.style.border = '2px solid #ef4444';
				nameCell.style.borderRadius = '6px';
				// 同时为整行添加错误标识
				tr.style.backgroundColor = '#fef7f7';
			} else {
				errDiv.textContent = '';
				errDiv.style.display = 'none';
				nameCell.style.backgroundColor = '';
				nameCell.style.border = '';
				nameCell.style.borderRadius = '';
				tr.style.backgroundColor = '';
			}
		}
	}
	
	// 更新利润率列（付费占比20%）
	if (tds[PROFIT_COL]) {
		try {
			// 获取行数据并转换为统一参数格式
			const globals = getGlobalDefaultsForCatalog();
			const std = mergeGlobalsWithRow(row, globals);
			
			// 获取售价和进货价的档位信息
			const salePrices = Array.isArray(row.salePriceTiers) && row.salePriceTiers.length > 0 
				? row.salePriceTiers.map(p => Number(p)).filter(p => isFinite(p) && p > 0)
				: (isFinite(std.salePrice) && std.salePrice > 0 ? [std.salePrice] : []);
			
			const costPrices = Array.isArray(row.costTiers) && row.costTiers.length > 0
				? row.costTiers.map(c => Number(c)).filter(c => isFinite(c) && c >= 0)
				: (isFinite(std.costMin) && std.costMin > 0 ? [std.costMin] : []);
			
			// 检查是否有有效的售价和进货价
			if (salePrices.length === 0 || costPrices.length === 0) {
				tds[PROFIT_COL].innerHTML = '<span style="color:#9ca3af; font-style:italic;">需填写售价和进货价</span>';
				return;
			}
			
			// 计算多档利润率
			const profitRates = [];
			
			// 如果有多档售价和多档进货价，计算每档的利润率
			if (salePrices.length > 1 && costPrices.length > 1) {
				// 多档对多档：取最小长度，计算对应档位的利润率
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
						adRate: 0.20, // 固定付费占比20%
						otherCost: std.otherCost,
						returnRate: std.returnRate
					};
					
					const result = calculateProfitUnified(inputs);
					if (isFinite(result.profitRate)) {
						profitRates.push({
							rate: result.profitRate,
							price: salePrices[i],
							cost: costPrices[i]
						});
					}
				}
			} else if (salePrices.length > 1 && costPrices.length === 1) {
				// 多档售价单档进货价：计算每档售价的利润率
				for (let i = 0; i < salePrices.length; i++) {
					const inputs = {
						costPrice: costPrices[0],
						actualPrice: salePrices[i],
						inputTaxRate: std.inputTaxRate,
						outputTaxRate: std.outputTaxRate,
						salesTaxRate: std.salesTaxRate,
						platformRate: std.platformRate,
						shippingCost: std.shippingCost,
						shippingInsurance: std.shippingInsurance,
						adRate: 0.20, // 固定付费占比20%
						otherCost: std.otherCost,
						returnRate: std.returnRate
					};
					
					const result = calculateProfitUnified(inputs);
					if (isFinite(result.profitRate)) {
						profitRates.push({
							rate: result.profitRate,
							price: salePrices[i],
							cost: costPrices[0]
						});
					}
				}
			} else if (salePrices.length === 1 && costPrices.length > 1) {
				// 单档售价多档进货价：计算每档进货价的利润率
				for (let i = 0; i < costPrices.length; i++) {
					const inputs = {
						costPrice: costPrices[i],
						actualPrice: salePrices[0],
						inputTaxRate: std.inputTaxRate,
						outputTaxRate: std.outputTaxRate,
						salesTaxRate: std.salesTaxRate,
						platformRate: std.platformRate,
						shippingCost: std.shippingCost,
						shippingInsurance: std.shippingInsurance,
						adRate: 0.20, // 固定付费占比20%
						otherCost: std.otherCost,
						returnRate: std.returnRate
					};
					
					const result = calculateProfitUnified(inputs);
					if (isFinite(result.profitRate)) {
						profitRates.push({
							rate: result.profitRate,
							price: salePrices[0],
							cost: costPrices[i]
						});
					}
				}
			} else {
				// 单档对单档：计算单一利润率
				const inputs = {
					costPrice: costPrices[0],
					actualPrice: salePrices[0],
					inputTaxRate: std.inputTaxRate,
					outputTaxRate: std.outputTaxRate,
					salesTaxRate: std.salesTaxRate,
					platformRate: std.platformRate,
					shippingCost: std.shippingCost,
					shippingInsurance: std.shippingInsurance,
					adRate: 0.20, // 固定付费占比20%
					otherCost: std.otherCost,
					returnRate: std.returnRate
				};
				
				const result = calculateProfitUnified(inputs);
				if (isFinite(result.profitRate)) {
					profitRates.push({
						rate: result.profitRate,
						price: salePrices[0],
						cost: costPrices[0]
					});
				}
			}
			
			// 检查是否有有效的利润率结果
			if (profitRates.length === 0) {
				tds[PROFIT_COL].innerHTML = '<span style="color:#9ca3af;">计算错误</span>';
				return;
			}
			
			// 格式化多档利润率显示
			if (profitRates.length === 1) {
				// 单档利润率显示
				const profitRate = profitRates[0].rate;
				const profitRatePercent = (profitRate * 100).toFixed(2);
				const isPositive = profitRate > 0;
				const isWarning = profitRate > 0 && profitRate < 0.05; // 低于5%利润率警告
				
				// 设置样式
				let style = 'font-weight:600;';
				if (isPositive) {
					if (isWarning) {
						style += 'color:#f59e0b;'; // 橙色警告
					} else {
						style += 'color:#059669;'; // 绿色正常
					}
				} else {
					style += 'color:#dc2626;'; // 红色亏损
				}
				
				tds[PROFIT_COL].innerHTML = `<span style="${style}">${profitRatePercent}%</span>`;
			} else {
				// 多档利润率显示
				const profitRateItems = profitRates.map(item => {
					const profitRatePercent = (item.rate * 100).toFixed(2);
					const isPositive = item.rate > 0;
					const isWarning = item.rate > 0 && item.rate < 0.05; // 低于5%利润率警告
					
					let style = 'font-weight:600;';
					if (isPositive) {
						if (isWarning) {
							style += 'color:#f59e0b;'; // 橙色警告
						} else {
							style += 'color:#059669;'; // 绿色正常
						}
					} else {
						style += 'color:#dc2626;'; // 红色亏损
					}
					
					return `<div style="${style}">${profitRatePercent}%</div>`;
				});
				
				tds[PROFIT_COL].innerHTML = profitRateItems.join('');
			}
		} catch (error) {
			console.error('利润率计算错误:', error);
			tds[PROFIT_COL].innerHTML = '<span style="color:#9ca3af;">计算错误</span>';
		}
	}
}

// 价格验证弹窗：展示该行各档进货价的详细计算拆解
// 样式注入（仅一次）
(function injectStyles(){
	if (document.getElementById('pv-styles')) return;
	const style = document.createElement('style'); style.id = 'pv-styles';
	style.textContent = `
	.pv-mask{position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:9999}
	.pv-modal{width:860px;max-width:94vw;max-height:88vh;overflow:auto;background:#fff;border-radius:14px;box-shadow:0 12px 34px rgba(0,0,0,.18)}
	.pv-hd{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #f1f5f9}
	.pv-title{font-weight:700;font-size:16px;color:#111827}
	.pv-close{margin:0}
	.pv-body{padding:14px 16px}
	.pv-meta{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}
	.pv-badge{background:#f3f4f6;border:1px solid #e5e7eb;color:#374151;padding:3px 8px;border-radius:999px;font-size:12px}
	.pv-grid{display:grid;grid-template-columns:160px 1fr;gap:8px}
	@media (max-width:600px){.pv-grid{grid-template-columns:130px 1fr}}
	.pv-group{background:#f9fafb;border:1px solid #f3f4f6;border-radius:10px;padding:10px 12px;margin:10px 0}
	.pv-group h4{margin:0 0 8px 0;color:#111827}
	.pv-k{color:#6b7280}
	.pv-v{text-align:right;color:#111827}
	.pv-conclusion{background:#0f172a;color:white;border-radius:12px;padding:12px 12px;margin-top:10px}
	.pv-conclusion .pv-grid{grid-template-columns:160px 1fr}
	.pv-pill{display:inline-block;padding:2px 8px;border-radius:999px;margin-left:8px;font-size:12px}
	.pv-pill.good{background:#16a34a;color:#fff}
	.pv-pill.warn{background:#f59e0b;color:#111}
	.pv-pill.bad{background:#ef4444;color:#fff}
	`;
	document.head.appendChild(style);
})();

function showPriceCheckModal(row) {
	const globals = getGlobalDefaultsForCatalog();
	const std = mergeGlobalsWithRow(row, globals);
	
	// 修复：检测多档售价，如果存在且有效，使用多档售价进行验证
	const salePriceTiers = Array.isArray(row.salePriceTiers) ? row.salePriceTiers.filter(v => isFinite(Number(v)) && Number(v) > 0).map(Number) : [];
	const costTiers = Array.isArray(row.costTiers) ? row.costTiers.filter(v => isFinite(Number(v)) && Number(v) >= 0).map(Number) : [];
	
	// 确定验证策略：优先使用多档售价，否则使用单一售价
	let validationStrategy = 'single';
	let validationPairs = [];
	
	if (salePriceTiers.length > 0 && costTiers.length > 0) {
		// 多档售价 + 多档进货价：1:1配对验证
		if (salePriceTiers.length === costTiers.length) {
			validationStrategy = 'multi_tier';
			validationPairs = salePriceTiers.map((price, i) => ({
				price: price,
				cost: costTiers[i],
				label: `档位${i+1}`
			}));
		} else {
			// 档数不匹配，使用第一个售价档位
			validationStrategy = 'first_tier';
			validationPairs = costTiers.map((cost, i) => ({
				price: salePriceTiers[0],
				cost: cost,
				label: `档位${i+1}`
			}));
		}
	} else if (salePriceTiers.length > 0) {
		// 只有多档售价：使用第一个售价档位
		validationStrategy = 'first_tier';
		const firstPrice = salePriceTiers[0];
		if (Array.isArray(std.costTiers) && std.costTiers.length > 0) {
			validationPairs = std.costTiers.map((cost, i) => ({
				price: firstPrice,
				cost: cost,
				label: `档位${i+1}`
			}));
		} else {
			// 使用成本区间
			const cmin = isFinite(std.costMin) ? std.costMin : std.costMax;
			const cmax = isFinite(std.costMax) ? std.costMax : std.costMin;
			if (isFinite(cmin)) validationPairs.push({ price: firstPrice, cost: cmin, label: '区间下限' });
			if (isFinite(cmax) && Math.abs(cmax-cmin)>1e-9) validationPairs.push({ price: firstPrice, cost: cmax, label: '区间上限' });
		}
	} else {
		// 单一售价场景：使用原有逻辑
		validationStrategy = 'single';
		const tiers = Array.isArray(row.costTiers) ? row.costTiers.filter(v => isFinite(Number(v)) && Number(v) >= 0).map(Number) : [];
		if (tiers.length) {
			validationPairs = tiers.map((c,i) => ({ price: std.salePrice, cost: c, label: `档位${i+1}` }));
		} else {
			const cmin = isFinite(std.costMin) ? std.costMin : std.costMax;
			const cmax = isFinite(std.costMax) ? std.costMax : std.costMin;
			if (isFinite(cmin)) validationPairs.push({ price: std.salePrice, cost: cmin, label: '区间下限' });
			if (isFinite(cmax) && Math.abs(cmax-cmin)>1e-9) validationPairs.push({ price: std.salePrice, cost: cmax, label: '区间上限' });
		}
	}
	let sections = [];
	const VAT_RATE = 0.06;
	
	const buildOne = (label, cost, price) => {
		const inputs = { costPrice:cost, inputTaxRate:std.inputTaxRate, outputTaxRate:std.outputTaxRate, salesTaxRate:std.salesTaxRate, platformRate:std.platformRate, shippingCost:std.shippingCost, shippingInsurance:std.shippingInsurance, otherCost:std.otherCost, adRate:std.adRate, returnRate:std.returnRate, finalPrice:price, targetProfitRate:0 };
		const purchaseCost = calculatePurchaseCost(inputs);
		const salesCost = calculateSalesCost(inputs, 0, purchaseCost);
		const roiRes = calculateBreakevenROI({ costPrice:cost, inputTaxRate:inputs.inputTaxRate, outputTaxRate:inputs.outputTaxRate, salesTaxRate:inputs.salesTaxRate, platformRate:inputs.platformRate, shippingCost:inputs.shippingCost, shippingInsurance:inputs.shippingInsurance, otherCost:inputs.otherCost, returnRate:inputs.returnRate, finalPrice:price });
		// 详细税额与费用拆解（考虑退货分摊）
		const netPrice = price / (1 + inputs.salesTaxRate);
		const outputVAT = netPrice * inputs.salesTaxRate;
		const platformFee = price * inputs.platformRate;
		const adCost = price * inputs.adRate;
		const adVAT = (adCost / salesCost.effectiveRate) * VAT_RATE;
		const platformVAT = platformFee * VAT_RATE;
		const totalVATDeduction = purchaseCost.purchaseVAT + adVAT + platformVAT;
		const actualVAT = outputVAT - totalVATDeduction;
		const shipSplit = inputs.shippingCost / salesCost.effectiveRate;
		const insureSplit = inputs.shippingInsurance / salesCost.effectiveRate;
		const otherSplit = inputs.otherCost / salesCost.effectiveRate;
		const fixedSplitSum = shipSplit + insureSplit + otherSplit;
		const adSplitCost = adCost / salesCost.effectiveRate;
		return `
			<div style="margin-bottom:20px;">
				<div style="font-weight:600; margin-bottom:12px;">成本：¥ ${Number(cost).toFixed(2)}（${label}）</div>
				<div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px;">
					<div style="background:#f8fafc; border-radius:8px; padding:12px;">
						<div style="font-weight:600; margin-bottom:8px;">采购成本</div>
						<div style="display:flex; flex-direction:column; gap:8px; font-size:13px;">
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#64748b">采购有效成本</span>
								<span>¥ ${Number(purchaseCost.effectiveCost).toFixed(2)}</span>
							</div>
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#64748b">进项税</span>
								<span>¥ ${Number(purchaseCost.purchaseVAT).toFixed(2)}</span>
							</div>
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#64748b">含税售价P</span>
								<span>¥ ${Number(price).toFixed(2)}</span>
							</div>
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#64748b">不含税净价</span>
								<span>¥ ${netPrice.toFixed(2)}</span>
							</div>
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#64748b">有效销售率</span>
								<span>${(salesCost.effectiveRate*100).toFixed(2)}%</span>
							</div>
						</div>
					</div>

					<div style="background:#f8fafc; border-radius:8px; padding:12px;">
						<div style="font-weight:600; margin-bottom:8px;">税费明细</div>
						<div style="display:flex; flex-direction:column; gap:8px; font-size:13px;">
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#64748b">销项税</span>
								<span>¥ ${outputVAT.toFixed(2)}</span>
							</div>
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#64748b">进项抵扣-商品</span>
								<span>¥ ${purchaseCost.purchaseVAT.toFixed(2)}</span>
							</div>
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#64748b">进项抵扣-广告</span>
								<span>¥ ${adVAT.toFixed(2)}</span>
							</div>
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#64748b">进项抵扣-平台</span>
								<span>¥ ${platformVAT.toFixed(2)}</span>
							</div>
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#64748b">进项抵扣合计</span>
								<span>¥ ${totalVATDeduction.toFixed(2)}</span>
							</div>
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#64748b">实缴增值税</span>
								<span>¥ ${actualVAT.toFixed(2)}</span>
							</div>
						</div>
					</div>

					<div style="background:#f8fafc; border-radius:8px; padding:12px;">
						<div style="font-weight:600; margin-bottom:8px;">费用分摊</div>
						<div style="display:flex; flex-direction:column; gap:8px; font-size:13px;">
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#64748b">平台佣金</span>
								<span>¥ ${platformFee.toFixed(2)}</span>
							</div>
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#64748b">广告费（分摊）</span>
								<span>¥ ${adSplitCost.toFixed(2)}</span>
							</div>
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#64748b">物流（分摊）</span>
								<span>¥ ${shipSplit.toFixed(2)}</span>
							</div>
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#64748b">运费险（分摊）</span>
								<span>¥ ${insureSplit.toFixed(2)}</span>
							</div>
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#64748b">其他（分摊）</span>
								<span>¥ ${otherSplit.toFixed(2)}</span>
							</div>
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#64748b">固定费用分摊合计</span>
								<span>¥ ${fixedSplitSum.toFixed(2)}</span>
							</div>
						</div>
					</div>

					<div style="background:#1e293b; color:white; border-radius:8px; padding:12px;">
						<div style="font-weight:600; margin-bottom:8px;">保本指标</div>
						<div style="display:flex; flex-direction:column; gap:8px; font-size:13px;">
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#94a3b8">保本ROI</span>
								<span>${isFinite(roiRes.breakevenROI)? roiRes.breakevenROI.toFixed(2) : '∞'}</span>
							</div>
							<div style="display:flex; justify-content:space-between; align-items:baseline;">
								<span style="color:#94a3b8">保本广告占比</span>
								<span>${isFinite(roiRes.breakevenAdRate)? (roiRes.breakevenAdRate*100).toFixed(2)+'%' : '-'}</span>
							</div>
						</div>
					</div>
				</div>
			</div>`;
	};
	// 使用验证策略构建sections
	if (validationPairs.length > 0) {
		sections = validationPairs.map(pair => buildOne(pair.label, pair.cost, pair.price));
	} else {
		sections.push('<div style="color:#ef4444;">未找到可计算的成本，请先填写成本或多档价格。</div>');
	}
	const html = `
		<div class="pv-mask">
			<div class="pv-modal">
				<div class="pv-hd">
					<div class="pv-title">保本指标验证 - ${row.name||''}（${row.sku||''}）</div>
					<button id="catalogPriceCheckClose" class="batch-modal-btn pv-close">关闭</button>
				</div>
				<div class="pv-body">
					<div class="pv-meta">
						<span class="pv-badge" style="background:#3b82f6;color:#fff;font-weight:700;border:2px solid #3b82f6;">售价 ${validationStrategy === 'multi_tier' ? '多档售价' : validationStrategy === 'first_tier' ? '多档售价（首档）' : '单一售价'} ${validationStrategy === 'multi_tier' ? salePriceTiers.map(p=>'¥'+p.toFixed(2)).join(' / ') : validationStrategy === 'first_tier' ? '¥'+salePriceTiers[0].toFixed(2) : '¥'+(Number(std.salePrice)||0).toFixed(2)}</span>
						<span class="pv-badge" style="background:#3b82f6;color:#fff;font-weight:700;border:2px solid #3b82f6;">进货价${Array.isArray(std.costTiers) && std.costTiers.length > 1 ? '（多档）' : ''} ${Array.isArray(std.costTiers) ? std.costTiers.map(c=>'¥'+c.toFixed(2)).join(' / ') : (isFinite(std.costMin) ? '¥'+std.costMin.toFixed(2) : (isFinite(std.costMax) ? '¥'+std.costMax.toFixed(2) : ''))}</span>
						<span class="pv-badge">退货率 ${((std.returnRate||0)*100).toFixed(2)}%</span>
						<span class="pv-badge">佣金 ${((std.platformRate||0)*100).toFixed(2)}%</span>
						<span class="pv-badge">销项税 ${((std.salesTaxRate||0)*100).toFixed(2)}%</span>
						<span class="pv-badge">物流费 ¥ ${(Number(std.shippingCost)||0).toFixed(2)}</span>
						<span class="pv-badge">运费险 ¥ ${(Number(std.shippingInsurance)||0).toFixed(2)}</span>
						<span class="pv-badge">其他成本 ¥ ${(Number(std.otherCost)||0).toFixed(2)}</span>
					</div>
					${validationStrategy !== 'single' ? `<div style="background:#f0f9ff; border:1px solid #0ea5e9; border-radius:8px; padding:12px; margin-bottom:16px; color:#0c4a6e;">
						<div style="font-weight:600; margin-bottom:4px;">📊 验证策略说明</div>
						<div style="font-size:13px; line-height:1.4;">
							${validationStrategy === 'multi_tier' ? 
								`当前使用<strong>多档售价+多档进货价1:1配对验证</strong>，共${validationPairs.length}个档位。每个档位独立计算保本指标。` :
								`当前使用<strong>多档售价首档验证</strong>，以第一个售价档位（¥${salePriceTiers[0].toFixed(2)}）为基础，验证各成本档位的保本指标。`
							}
						</div>
					</div>` : ''}
					${sections.join('')}
			</div>
		</div>`;
	const wrapper = document.createElement('div'); wrapper.innerHTML = html; document.body.appendChild(wrapper);
	const close = ()=>{ try { document.body.removeChild(wrapper); } catch(_){} };
	wrapper.addEventListener('click', (e)=>{ if (e.target === wrapper) close(); });
	const closeBtn = document.getElementById('catalogPriceCheckClose'); if (closeBtn) closeBtn.addEventListener('click', close);
}

// 搜索和筛选状态管理
let catalogFilterState = {
	searchText: '',
	platform: '',
	returnRateMin: '',
	returnRateMax: '',
	dangerFilter: false, // 新增：保本广告占比低于21%风险商品筛选
	sortBy: '',
	sortOrder: 'asc',
	filteredRows: []
};

// 清除筛选输入框的值
function clearCatalogFilterInputs() {
	const searchInput = document.getElementById('catalogSearchInput');
	const platformFilter = document.getElementById('catalogPlatformFilter');
	const returnRateMin = document.getElementById('catalogReturnRateMin');
	const returnRateMax = document.getElementById('catalogReturnRateMax');
	const dangerFilter = document.getElementById('catalogDangerFilter');
	const sortBy = document.getElementById('catalogSortBy');
	const sortOrder = document.getElementById('catalogSortOrder');
	
	if (searchInput) searchInput.value = '';
	if (platformFilter) platformFilter.value = '';
	if (returnRateMin) returnRateMin.value = '';
	if (returnRateMax) returnRateMax.value = '';
	if (dangerFilter) dangerFilter.checked = false;
	if (sortBy) sortBy.value = '';
	if (sortOrder) sortOrder.value = 'asc';
}

// 清除全屏模式筛选输入框的值
function clearFullscreenFilterInputs() {
	const fullscreenSearchInput = document.getElementById('catalogFullscreenSearchInput');
	const fullscreenPlatformFilter = document.getElementById('catalogFullscreenPlatformFilter');
	const fullscreenReturnRateMin = document.getElementById('catalogFullscreenReturnRateMin');
	const fullscreenReturnRateMax = document.getElementById('catalogFullscreenReturnRateMax');
	const fullscreenDangerFilter = document.getElementById('catalogFullscreenDangerFilter');
	const fullscreenSortBy = document.getElementById('catalogFullscreenSortBy');
	const fullscreenSortOrder = document.getElementById('catalogFullscreenSortOrder');
	
	if (fullscreenSearchInput) fullscreenSearchInput.value = '';
	if (fullscreenPlatformFilter) fullscreenPlatformFilter.value = '';
	if (fullscreenReturnRateMin) fullscreenReturnRateMin.value = '';
	if (fullscreenReturnRateMax) fullscreenReturnRateMax.value = '';
	if (fullscreenDangerFilter) fullscreenDangerFilter.checked = false;
	if (fullscreenSortBy) fullscreenSortBy.value = '';
	if (fullscreenSortOrder) fullscreenSortOrder.value = 'asc';
}

// 应用搜索和筛选
function applyCatalogFilters() {
	const searchText = document.getElementById('catalogSearchInput').value.toLowerCase();
	const platform = document.getElementById('catalogPlatformFilter').value;
	const returnRateMin = parseFloat(document.getElementById('catalogReturnRateMin').value) || 0;
	const returnRateMax = parseFloat(document.getElementById('catalogReturnRateMax').value) || 100;
	const dangerFilter = document.getElementById('catalogDangerFilter').checked;
	const sortBy = document.getElementById('catalogSortBy').value;
	const sortOrder = document.getElementById('catalogSortOrder').value;
	
	// 更新筛选状态
	catalogFilterState = {
		searchText,
		platform,
		returnRateMin,
		returnRateMax,
		dangerFilter,
		sortBy,
		sortOrder
	};
	
	// 获取所有行
	let rows = [...(catalogState.rows || [])];
	
	// 应用筛选
	rows = rows.filter(row => {
		// 搜索筛选：名称或货号智能匹配搜索文本
		if (searchText) {
			const searchKeywords = searchText.toLowerCase().trim().split(/\s+/).filter(keyword => keyword.length > 0);
			const name = (row.name || '').toLowerCase();
			const sku = (row.sku || '').toLowerCase();
			
			// 检查是否所有关键词都能在名称或货号中找到（支持任意顺序）
			const nameMatch = searchKeywords.every(keyword => name.includes(keyword));
			const skuMatch = searchKeywords.every(keyword => sku.includes(keyword));
			
			// 如果名称和货号都不匹配，则过滤掉该行
			if (!nameMatch && !skuMatch) {
				return false;
			}
		}
		
		// 平台筛选
		if (platform && row.platform !== platform) {
			return false;
		}
		
		// 退货率区间筛选
		if (returnRateMin > 0 || returnRateMax < 100) {
			const returnRate = parsePercent(row.returnRate) * 100;
			if (returnRate < returnRateMin || returnRate > returnRateMax) {
				return false;
			}
		}
		
		// 保本广告占比风险筛选
		if (dangerFilter) {
			const result = row.__result;
			if (!result) return false;
			
			let hasDanger = false;
			if (Array.isArray(result.list)) {
				// 多档情况：检查是否有任何一档的保本广告占比低于21%
				hasDanger = result.list.some(item => {
					const adRate = item.breakevenAdRate;
					return isFinite(adRate) && adRate > 0 && adRate < 0.21;
				});
			} else if (Array.isArray(result.priceRangeResults)) {
				// 价格区间情况：检查是否有任何区间的保本广告占比低于21%
				hasDanger = result.priceRangeResults.some(item => {
					const adRate = item.breakevenAdRate;
					if (typeof adRate === 'object' && adRate.min !== undefined) {
						return isFinite(adRate.min) && adRate.min > 0 && adRate.min < 0.21;
					}
					return isFinite(adRate) && adRate > 0 && adRate < 0.21;
				});
			} else if (Array.isArray(result.combinations)) {
				// 组合情况：检查是否有任何组合的保本广告占比低于21%
				hasDanger = result.combinations.some(item => {
					const adRate = item.breakevenAdRate;
					return isFinite(adRate) && adRate > 0 && adRate < 0.21;
				});
			} else {
				// 单一情况：检查保本广告占比是否低于21%
				const adRate = result.breakevenAdRate;
				hasDanger = isFinite(adRate) && adRate > 0 && adRate < 0.21;
			}
			
			if (!hasDanger) return false;
		}
		
		return true;
	});
	
	// 应用排序
	if (sortBy) {
		rows.sort((a, b) => {
			let aVal, bVal;
			
			switch (sortBy) {
				case 'name':
					aVal = (a.name || '').toLowerCase();
					bVal = (b.name || '').toLowerCase();
					break;
				case 'sku':
					aVal = (a.sku || '').toLowerCase();
					bVal = (b.sku || '').toLowerCase();
					break;
				case 'returnRate':
					aVal = parsePercent(a.returnRate);
					bVal = parsePercent(b.returnRate);
					break;
				case 'salePrice':
					aVal = parseFloat(a.salePrice) || 0;
					bVal = parseFloat(b.salePrice) || 0;
					break;
				default:
					return 0;
			}
			
			if (sortOrder === 'asc') {
				return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
			} else {
				return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
			}
		});
	}
	
	// 保存筛选结果
	catalogFilterState.filteredRows = rows;
	
	// 重新渲染表格
	renderCatalogTable();
	
	// 更新状态显示
	updateCatalogStatus();
}

// 清除所有筛选
function clearCatalogFilters() {
	document.getElementById('catalogSearchInput').value = '';
	document.getElementById('catalogPlatformFilter').value = '';
	document.getElementById('catalogReturnRateMin').value = '';
	document.getElementById('catalogReturnRateMax').value = '';
	document.getElementById('catalogDangerFilter').checked = false;
	document.getElementById('catalogSortBy').value = '';
	document.getElementById('catalogSortOrder').value = 'asc';
	
	catalogFilterState = {
		searchText: '',
		platform: '',
		returnRateMin: '',
		returnRateMax: '',
		dangerFilter: false,
		sortBy: '',
		sortOrder: 'asc',
		filteredRows: []
	};
	
	renderCatalogTable();
	updateCatalogStatus();
}

// 更新平台筛选选项
function updatePlatformFilterOptions() {
	const platformSelect = document.getElementById('catalogPlatformFilter');
	if (!platformSelect) return;
	
	// 获取所有唯一的平台
	const platforms = [...new Set((catalogState.rows || []).map(row => row.platform).filter(Boolean))];
	
	// 清空现有选项（保留"全部平台"）
	platformSelect.innerHTML = '<option value="">全部平台</option>';
	
	// 添加平台选项
	platforms.forEach(platform => {
		const option = document.createElement('option');
		option.value = platform;
		option.textContent = platform;
		platformSelect.appendChild(option);
	});
}

function updateCatalogStatus() {
	const el = document.getElementById('catalogStatus'); if (!el) return;
	const allRows = catalogState.rows || [];
	const filteredRows = catalogFilterState.filteredRows.length > 0 ? catalogFilterState.filteredRows : allRows;
	let err = 0;
	let errorMessages = [];
	filteredRows.forEach(r => {
		if (r && r.__result && (r.__result.errors||[]).length) {
			err++;
			// 收集具体的错误信息
			const rowErrors = r.__result.errors;
			const rowName = r.name || '未命名商品';
			const rowSku = r.sku || '无货号';
			errorMessages.push(`${rowName}(${rowSku}): ${rowErrors.join('；')}`);
		}
	});

	// 显示筛选状态
	if (catalogFilterState.searchText || catalogFilterState.platform || catalogFilterState.returnRateMin || catalogFilterState.returnRateMax || catalogFilterState.dangerFilter || catalogFilterState.sortBy) {
		if (err > 0) {
			el.innerHTML = `共 ${allRows.length} 条，筛选后 ${filteredRows.length} 条，
				<span style="background:#dc2626; color:white; padding:2px 6px; border-radius:12px; font-weight:600; animation:pulse-error 2s infinite;" title="${errorMessages.slice(0, 5).join('\n')}">
					⚠️ ${err} 条异常
				</span>
				<span style="color:#6b7280; font-size:0.9em;">（已应用筛选）</span>`;
		} else {
			el.innerHTML = `共 ${allRows.length} 条，筛选后 ${filteredRows.length} 条，${err} 条异常 <span style="color:#6b7280; font-size:0.9em;">（已应用筛选）</span>`;
		}
	} else {
		if (err > 0) {
			el.innerHTML = `共 ${allRows.length} 条，
				<span style="background:#dc2626; color:white; padding:2px 6px; border-radius:12px; font-weight:600; animation:pulse-error 2s infinite;" title="${errorMessages.slice(0, 5).join('\n')}">
					⚠️ ${err} 条异常
				</span>`;
		} else {
			el.textContent = `共 ${allRows.length} 条，${err} 条异常`;
		}
	}

	// 显示全局错误提示
	showGlobalErrorAlert(err, errorMessages);
}

// 全局错误提示功能
function showGlobalErrorAlert(errorCount, errorMessages) {
	let alertEl = document.getElementById('catalog-global-error-alert');

	if (errorCount > 0) {
		if (!alertEl) {
			// 创建全局错误提示框
			alertEl = document.createElement('div');
			alertEl.id = 'catalog-global-error-alert';
			alertEl.style.cssText = `
				position: fixed;
				top: 20px;
				right: 20px;
				background: #dc2626;
				color: white;
				padding: 12px 16px;
				border-radius: 8px;
				box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
				z-index: 1000;
				font-size: 14px;
				font-weight: 600;
				animation: pulse-error 2s infinite;
				cursor: pointer;
				max-width: 300px;
				border: 2px solid #b91c1c;
			`;
			document.body.appendChild(alertEl);
		}

		// 更新错误提示内容
		const previewMessages = errorMessages.slice(0, 3);
		let message = `发现 ${errorCount} 条数据异常`;
		if (previewMessages.length > 0) {
			message += '\n' + previewMessages.join('\n');
		}
		if (errorMessages.length > 3) {
			message += '\n...点击查看更多详情';
		}

		alertEl.innerHTML = `<span style="color: #fbbf24; font-size: 16px;">⚠️</span> ${message.replace(/\n/g, '<br>')}`;
		alertEl.style.display = 'block';

		// 点击显示详细错误信息
		alertEl.onclick = () => {
			showDetailedErrors(errorMessages);
		};
	} else {
		// 隐藏错误提示
		if (alertEl) {
			alertEl.style.display = 'none';
		}
	}
}

// 显示详细错误信息
function showDetailedErrors(errorMessages) {
	const overlay = document.createElement('div');
	overlay.style.cssText = `
		position: fixed;
		inset: 0;
		background: rgba(0,0,0,0.5);
		z-index: 10000;
		display: flex;
		align-items: center;
		justify-content: center;
	`;

	const panel = document.createElement('div');
	panel.style.cssText = `
		background: white;
		border-radius: 12px;
		padding: 20px;
		max-width: 600px;
		max-height: 80vh;
		overflow-y: auto;
		box-shadow: 0 10px 30px rgba(0,0,0,0.3);
	`;

	const title = document.createElement('h3');
	title.textContent = '数据验证异常详情';
	title.style.cssText = 'margin: 0 0 16px 0; color: #dc2626; font-size: 18px;';

	const closeBtn = document.createElement('button');
	closeBtn.textContent = '关闭';
	closeBtn.style.cssText = `
		float: right;
		background: #6b7280;
		color: white;
		border: none;
		padding: 6px 12px;
		border-radius: 6px;
		cursor: pointer;
	`;
	closeBtn.onclick = () => document.body.removeChild(overlay);

	const errorList = document.createElement('div');
	errorList.style.cssText = 'margin-top: 16px;';

	errorMessages.forEach((msg, index) => {
		const item = document.createElement('div');
		item.style.cssText = `
			padding: 8px 12px;
			margin: 4px 0;
			background: #fef2f2;
			border-left: 4px solid #dc2626;
			border-radius: 4px;
			font-family: monospace;
			font-size: 13px;
			line-height: 1.4;
		`;
		item.innerHTML = `<strong>${index + 1}.</strong> ${msg}`;
		errorList.appendChild(item);
	});

	panel.appendChild(closeBtn);
	panel.appendChild(title);
	panel.appendChild(errorList);
	overlay.appendChild(panel);
	document.body.appendChild(overlay);
}

function loadCatalogFromStorage() {
	try { const raw = localStorage.getItem('priceCalculatorCatalog'); if (!raw) return; const obj = JSON.parse(raw); if (obj && Array.isArray(obj.rows)) { catalogState.rows = obj.rows; (catalogState.rows||[]).forEach((row, idx)=>{ const computed = computeRow(row); catalogState.rows[idx].__result = computed.__result; }); } } catch (_) {}
}
function saveCatalogToStorage() { try { const payload = { rows: catalogState.rows, version: catalogState.version }; localStorage.setItem('priceCalculatorCatalog', JSON.stringify(payload)); } catch (_) {} }

function recomputeAllCatalogRows() {
	const t0 = performance.now();
	let minMs = Infinity, maxMs = 0;
	(catalogState.rows||[]).forEach((row, idx) => {
		const s = performance.now();
		const computed = computeRow(row);
		const e = performance.now();
		const dt = e - s; if (dt < minMs) minMs = dt; if (dt > maxMs) maxMs = dt;
		catalogState.rows[idx].__result = computed.__result;
		
		// 一键重算时自动格式化退货率显示：如果是小数值，转换为百分比格式
		if (row.returnRate !== undefined && row.returnRate !== null && row.returnRate !== '') {
			const num = Number(row.returnRate);
			if (isFinite(num)) {
				// 如果是小数值（0-1之间）且不是百分比格式，转换为百分比格式
				if (num >= 0 && num <= 1 && typeof row.returnRate !== 'string') {
					catalogState.rows[idx].returnRate = (num * 100).toFixed(2) + '%';
				}
				// 如果已经是百分比数值（>1），转换为百分比格式字符串
				else if (num > 1 && typeof row.returnRate !== 'string') {
					catalogState.rows[idx].returnRate = num.toFixed(2) + '%';
				}
			}
		}
	});
	saveCatalogToStorage();
	renderCatalogTable();
	const t1 = performance.now();
	try {
		const rows = catalogState.rows || [];
		const errorRows = rows.filter(r => r.__result && (r.__result.errors||[]).length);
		const errors = errorRows.length;
		const span = (isFinite(minMs)&&isFinite(maxMs)) ? `${minMs.toFixed(2)}~${maxMs.toFixed(2)}ms/行` : '-';
		console.log(`[Catalog] 计算完成：记录数=${rows.length}，计算耗时区间=${span}，总耗时=${(t1-t0).toFixed(1)}ms，异常行数=${errors}`);
		
		// 详细输出异常行信息（只输出有异常的日志）
		if (errorRows.length > 0) {
			console.group(`[Catalog] 异常详情（共${errors}行）：`);
			errorRows.forEach((row, idx) => {
				const rowIndex = rows.indexOf(row) + 1; // 获取在原始数组中的行号
				const rowName = row.name || '未命名';
				const rowSku = row.sku || '无货号';
				const errorMessages = row.__result.errors.join('; ');
				console.log(`[行${rowIndex}] ${rowName} (${rowSku}): ${errorMessages}`);
			});
			console.groupEnd();
		}
	} catch (_) {}
}

function exportCatalogToCSV() {
	// 新版模板：导出中文表头；多档成本/售价以分号分隔（例如："19;29;39"）
	const header = '商品名称,货号,平台,含税售价P,含税售价（多档）,退货率,进货价（多档）';
	const rows = catalogState.rows || [];
	const toPercent = (v) => { const p = parsePercent(v); return isFinite(p) ? (p*100).toFixed(2)+'%' : ''; };
	const toMoney = (v) => { const n = Number(v); return isFinite(n) ? n.toFixed(2) : ''; };
	const toCostTiers = (r) => {
		// 新规则：仅导出单值或多档；不再导出 costMin/costMax 区间表达
		if (Array.isArray(r.costTiers) && r.costTiers.length) {
			return r.costTiers.filter(x=>x!==''&&x!==null&&x!==undefined).map(Number).filter(n=>isFinite(n)).map(n=>n.toFixed(2)).join(';');
		}
		const c = Number(isFinite(Number(r.costMin)) ? r.costMin : r.costMax);
		return isFinite(c) ? c.toFixed(2) : '';
	};
	const toPriceTiers = (r) => {
		if (Array.isArray(r.salePriceTiers) && r.salePriceTiers.length) {
			return r.salePriceTiers.filter(x=>x!==''&&x!==null&&x!==undefined).map(Number).filter(n=>isFinite(n) && n>0).map(n=>n.toFixed(2)).join(';');
		}
		return '';
	};
	const lines = rows.map(r => [
		(r.name||''),
		(r.sku||''),
		(r.platform||''),
		toMoney(r.salePrice),
		toPriceTiers(r),
		toPercent(r.returnRate),
		toCostTiers(r)
	].join(','));
	// 导出行内字段合法性检查（仅警告日志，不阻断导出），便于在控制台发现潜在导入失败项
	try {
		rows.forEach((r, i) => {
			if (Array.isArray(r.salePriceTiers) && r.salePriceTiers.length) {
				if (!Array.isArray(r.costTiers) || r.costTiers.length === 0) console.warn(`[CSV 导出警告][行${i+1}] 已配置售价多档但缺少进货价多档`);
				if (Array.isArray(r.costTiers) && r.costTiers.length && r.costTiers.length !== r.salePriceTiers.length) console.warn(`[CSV 导出警告][行${i+1}] 售价多档与进货价多档数量不一致`);
			}
		});
	} catch(_) {}
	const csv = [header].concat(lines.length? lines : []).join('\r\n');
	const bom = new Uint8Array([0xEF,0xBB,0xBF]); const blob = new Blob([bom, csv], { type: 'text/csv;charset=utf-8;' });
	const now = new Date(); const ts = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
	const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `商品清单_${ts}.csv`; document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

async function importCatalogFromFile(file) {
	// 检查文件类型
	const fileName = file.name.toLowerCase();
	const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
	const isCSV = fileName.endsWith('.csv');
	
	if (!isExcel && !isCSV) {
		throw new Error('不支持的文件格式，请选择 .csv、.xlsx 或 .xls 文件');
	}
	
	// 健壮的CSV解析函数：正确处理包含逗号、引号等特殊字符的字段
	const parseCSVLine = (line) => {
		const result = [];
		let current = '';
		let inQuotes = false;
		let i = 0;
		
		while (i < line.length) {
			const char = line[i];
			
			if (char === '"') {
				if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
					// 双引号转义
					current += '"';
					i += 2;
				} else {
					// 切换引号状态
					inQuotes = !inQuotes;
					i++;
				}
			} else if (char === ',' && !inQuotes) {
				// 逗号分隔符（不在引号内）
				result.push(current.trim());
				current = '';
				i++;
			} else {
				// 普通字符
				current += char;
				i++;
			}
		}
		
		// 添加最后一个字段
		result.push(current.trim());
		return result;
	};
	
	let lines = [];
	let header = [];
	
	if (isExcel) {
		// 处理Excel文件
		try {
			const arrayBuffer = await file.arrayBuffer();
			const workbook = XLSX.read(arrayBuffer, { type: 'array' });
			const sheetName = workbook.SheetNames[0]; // 使用第一个工作表
			const worksheet = workbook.Sheets[sheetName];
			
			// 将Excel数据转换为数组格式
			const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
			
			if (jsonData.length === 0) {
				throw new Error('Excel文件为空或格式不正确');
			}
			
			// 第一行作为表头
			header = jsonData[0].map(cell => String(cell || ''));
			// 其余行作为数据
			lines = jsonData.slice(1).map(row => 
				row.map(cell => String(cell || '')).join(',')
			);
			
			console.log(`[Catalog] Excel文件解析成功：工作表=${sheetName}，行数=${jsonData.length}`);
		} catch (e) {
			throw new Error(`Excel文件解析失败：${e.message}`);
		}
	} else {
		// 处理CSV文件
		const text = await file.text();
		const content = text.replace(/^\uFEFF/, ''); // 移除BOM
		const csvLines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
		
		if (csvLines.length === 0) {
			throw new Error('CSV文件为空');
		}
		
		// 使用健壮的CSV解析函数解析表头
		header = parseCSVLine(csvLines[0]);
		lines = csvLines.slice(1);
		
		console.log(`[Catalog] CSV文件解析成功：列数=${header.length}，行数=${lines.length}`);
		console.log(`[Catalog] CSV表头：`, header);
	}
	
	if (lines.length === 0) {
		throw new Error('文件中没有数据行');
	}
	// 兼容中文/英文列名
	const normalize = (name)=>{
		switch(name.trim()){
			case 'name': case '商品名称': return 'name';
			case 'sku': case '货号': return 'sku';
			case 'platform': case '平台': return 'platform';
			case 'salePrice': case '含税售价P': return 'salePrice';
			case 'salePriceTiers': case '含税售价（多档）': return 'salePriceTiers';
			case 'returnRate': case '退货率': return 'returnRate';
			case 'costTiers': case '进货价（多档）': return 'costTiers';
			case 'adRate': case '付费占比%': return 'adRate'; // 兼容旧模板导入，但清单页已不再展示/导出该字段
			case 'platformRate': case '平台佣金%': return 'platformRate';
			case 'costMin': return 'costMin';
			case 'costMax': return 'costMax';
			case 'inputTaxRate': return 'inputTaxRate';
			case 'outputTaxRate': return 'outputTaxRate';
			case 'salesTaxRate': return 'salesTaxRate';
			case 'platformRate': return 'platformRate';
			case 'shippingCost': return 'shippingCost';
			case 'shippingInsurance': return 'shippingInsurance';
			case 'otherCost': return 'otherCost';
			default: return name;
		}
	};
	const normHeader = header.map(normalize);
	// 输入完整性检查：关键列提示
	const requiredCols = ['name','sku','platform','salePrice','returnRate'];
	requiredCols.forEach(k=>{ if (!normHeader.includes(k)) console.warn('[CSV 导入警告] 缺少列：'+k); });
	const isNew = normHeader.includes('costTiers') || normHeader.includes('salePriceTiers');
	const idx = (k)=>normHeader.indexOf(k);
	const failed = []; const okRows = [];
	for (let i=0;i<lines.length;i++) {
		try {
			const currentLine = lines[i];
			if (!currentLine || String(currentLine).trim() === '') { continue; }
			
			// 使用健壮的CSV解析函数解析数据行
			const cells = isExcel ? currentLine.split(',') : parseCSVLine(currentLine);
			const get = (k)=>{ const j=idx(k); return j>=0 ? cells[j] : ''; };
			if (isNew) {
				const row = { name:get('name'), sku:get('sku'), platform:get('platform') };
				const salePrice = Number(get('salePrice'));
				if (!row.name || !row.sku || !row.platform) throw new Error('name/sku/platform 必填');
				
				// 先解析多档售价，用于判断是否启用多档模式
				const rawPrices = String(get('salePriceTiers')||'').trim();
				let pt = [];
				if (rawPrices) {
					const parts = rawPrices.split(/[;|，,\/\s]+/);
					pt = parts.map(s=>Number(s)).filter(n=>isFinite(n) && n>0);
				}
				
				// 如果启用了多档售价，允许含税售价P为0；否则必须>0
				if (pt.length > 0) {
					// 启用多档售价时，含税售价P可以为0或>0
					if (!isFinite(salePrice) || salePrice < 0) throw new Error('含税售价P不能为负数');
					row.salePrice = salePrice;
					row.salePriceTiers = pt;
				} else {
					// 未启用多档售价时，含税售价P必须>0
					if (!isFinite(salePrice) || salePrice <= 0) throw new Error('含税售价P必须>0（未启用多档售价时）');
					row.salePrice = salePrice;
				}
				
				// 退货率特殊处理：导入后直接转换为百分比格式字符串，确保显示一致性
				const returnRateValue = parsePercent(get('returnRate'));
				if (isFinite(returnRateValue)) {
					row.returnRate = (returnRateValue * 100).toFixed(2) + '%';
				} else {
					row.returnRate = '';
				}
				row.adRate = parsePercent(get('adRate'));
				
				// 解析多档进货价：支持 19;29;39 或用空格/逗号/竖线等分隔（不再支持上下限区间写法）
				const rawCosts = String(get('costTiers')||'').trim();
				let tiers = [];
				if (rawCosts) {
					const parts = rawCosts.split(/[;|，,\/\s]+/);
					tiers = parts.map(s=>Number(s)).filter(n=>isFinite(n) && n>=0);
				}
				// 放宽限制：如果模板提供了售价多档但未提供成本多档，不强制要求成本多档
				if (tiers.length) row.costTiers = tiers;
				// 校验多档联动：若提供了售价多档但成本多档数量不一致，给出明确错误
				if (Array.isArray(row.salePriceTiers) && row.salePriceTiers.length) {
					if (!Array.isArray(row.costTiers) || row.costTiers.length === 0) throw new Error('提供了含税售价（多档）但缺少进货价（多档）');
					if (row.salePriceTiers.length !== row.costTiers.length) throw new Error('含税售价（多档）与进货价（多档）数量不一致');
				}
				const computed = computeRow(row); row.__result = computed.__result; okRows.push(row);
			} else {
				// 兼容旧模板，但成本区间已废弃：若出现 costMin/costMax，将合并为单值
				const cols = ['name','sku','platform','salePrice','returnRate','costMin','costMax','inputTaxRate','outputTaxRate','salesTaxRate','platformRate','shippingCost','shippingInsurance','otherCost','adRate'];
				const row = {}; cols.forEach(k => { row[k] = get(k); });
				const salePrice = Number(row.salePrice); const costMin = row.costMin===''?NaN:Number(row.costMin); const costMax = row.costMax===''?NaN:Number(row.costMax);
				if (!row.name || !row.sku || !row.platform) throw new Error('name/sku/platform 必填');
				if (!isFinite(salePrice) || salePrice <= 0) throw new Error('salePrice 必须>0');
				if (!isFinite(costMin) && !isFinite(costMax)) throw new Error('成本（进货价）为必填');
				if (!isNaN(costMin) && costMin < 0) throw new Error('costMin 不得为负');
				if (!isNaN(costMax) && costMax < 0) throw new Error('costMax 不得为负');
				// 处理百分比字段，退货率特殊处理为百分比格式字符串
				['inputTaxRate','outputTaxRate','salesTaxRate','platformRate','adRate'].forEach(k => { const p = parsePercent(row[k]); row[k] = isFinite(p) ? p : ''; });
				// 退货率特殊处理：导入后直接转换为百分比格式字符串
				const returnRateValue = parsePercent(row.returnRate);
				if (isFinite(returnRateValue)) {
					row.returnRate = (returnRateValue * 100).toFixed(2) + '%';
				} else {
					row.returnRate = '';
				}
				row.salePrice = salePrice; const mergedCost = isFinite(costMin) ? costMin : costMax; row.costMin = isFinite(mergedCost) ? mergedCost : ''; row.costMax = '';
				const computed = computeRow(row); row.__result = computed.__result; okRows.push(row);
			}
		} catch (e) {
			const fileLine = i + 2; // 文件中的真实行号（包含表头）
			let name = '', sku = '';
			try {
				// 使用健壮的CSV解析函数解析错误行
				const cells = isExcel ? (lines[i] || '').split(',') : parseCSVLine(lines[i] || '');
				const jName = idx('name');
				const jSku = idx('sku');
				name = jName>=0 ? (cells[jName]||'') : '';
				sku = jSku>=0 ? (cells[jSku]||'') : '';
			} catch(_) {}
			failed.push({ line: fileLine, sku, name, reason: (e && e.message) ? e.message : '格式错误' });
		}
	}
	if (failed.length) {
		showToast(`导入完成：成功 ${okRows.length} 条 / 失败 ${failed.length} 条`);
		console.group('[Catalog] 导入错误详情');
		failed.forEach(f => {
			const tag = (f.name || f.sku) ? `${f.name||''} (${f.sku||'无货号'})` : '';
			console.warn(`行${f.line}${tag? ' - '+tag : ''}：${f.reason}`);
		});
		console.groupEnd();
		console.warn('[Catalog] 导入错误行（结构化）:', failed);
	}
	catalogState.lastImportBackup = JSON.parse(JSON.stringify(catalogState.rows || [])); 
	const undoBtn = document.getElementById('btnCatalogUndoImport'); 
	if (undoBtn) undoBtn.style.display='';
	
	catalogState.rows = okRows.concat(catalogState.rows||[]); 
	
	// 清除筛选状态，确保新导入的数据能够显示
	catalogFilterState = {
		searchText: '',
		platform: '',
		returnRateMin: '',
		returnRateMax: '',
		dangerFilter: false,
		sortBy: '',
		sortOrder: 'asc',
		filteredRows: []
	};
	
	recomputeAllCatalogRows();
	updatePlatformFilterOptions();
	
	// 清除筛选输入框的值
	clearCatalogFilterInputs();
	clearFullscreenFilterInputs();
}

function initCatalogTab() {
	if (initCatalogTab.__inited) return; initCatalogTab.__inited = true;
	loadCatalogFromStorage();
	try { renderCatalogTable(); } catch (_) {}
	const btnAdd = document.getElementById('btnCatalogAddRow');
	const btnImport = document.getElementById('btnCatalogImport');
	const fileInput = document.getElementById('catalogImportFile');
	const btnExport = document.getElementById('btnCatalogExport');
	const btnDelete = document.getElementById('btnCatalogDeleteSelected');
	const btnRecompute = document.getElementById('btnCatalogRecomputeAll');
	const btnExamples = document.getElementById('btnCatalogExamples');
	const btnUndo = document.getElementById('btnCatalogUndoImport');
	const btnPlat = document.getElementById('btnPlatformSettings');
	const btnFullscreen = document.getElementById('btnCatalogFullscreen');
	if (btnAdd) btnAdd.addEventListener('click', () => { 
		// 添加新行到数据中
		catalogState.rows.unshift({ name:'', sku:'', platform:'', salePrice:'', returnRate:'', costMin:'', costMax:'' }); 
		
		// 清除筛选状态，确保新行能够显示
		catalogFilterState = {
			searchText: '',
			platform: '',
			returnRateMin: '',
			returnRateMax: '',
			dangerFilter: false,
			sortBy: '',
			sortOrder: 'asc',
			filteredRows: []
		};
		
		// 重新渲染表格
		renderCatalogTable(); 
		updateCatalogStatus(); 
		saveCatalogToStorage(); 
		updatePlatformFilterOptions(); 
		
		// 清除筛选输入框的值
		clearCatalogFilterInputs();
	});
	if (btnImport && fileInput) { btnImport.addEventListener('click', () => fileInput.click()); fileInput.addEventListener('change', async () => { const f = fileInput.files && fileInput.files[0]; if (!f) return; try { await importCatalogFromFile(f); } finally { fileInput.value=''; } }); }
	if (btnExport) btnExport.addEventListener('click', exportCatalogToCSV);
	if (btnDelete) btnDelete.addEventListener('click', () => { const container = document.getElementById('catalogTableContainer'); const checks = Array.from(container.querySelectorAll('.catalog-check')); const remain = []; checks.forEach(cb => { const tr = cb.closest('tr'); const idx = Number(tr.getAttribute('data-index')); if (!cb.checked) remain.push(catalogState.rows[idx]); }); catalogState.rows = remain; renderCatalogTable(); updateCatalogStatus(); saveCatalogToStorage(); updatePlatformFilterOptions(); });
	if (btnRecompute) btnRecompute.addEventListener('click', recomputeAllCatalogRows);
	if (btnExamples) btnExamples.addEventListener('click', () => {
		// 密码验证弹窗
		const overlay = document.createElement('div');
		overlay.style.position = 'fixed';
		overlay.style.inset = '0';
		overlay.style.background = 'rgba(0,0,0,.35)';
		overlay.style.zIndex = '9999';
		overlay.style.display = 'flex';
		overlay.style.alignItems = 'center';
		overlay.style.justifyContent = 'center';
		
		const panel = document.createElement('div');
		panel.style.background = '#fff';
		panel.style.borderRadius = '12px';
		panel.style.width = '400px';
		panel.style.maxWidth = '94vw';
		panel.style.boxShadow = '0 12px 34px rgba(0,0,0,.18)';
		panel.style.padding = '20px';
		
		panel.innerHTML = `
			<div style="text-align:center; margin-bottom:20px;">
				<div style="font-weight:700; font-size:18px; color:#111827; margin-bottom:8px;">🔒 数据保密验证</div>
				<div style="font-size:14px; color:#6b7280; margin-bottom:8px;">公司固定电话多少？</div>
				<div style="font-size:12px; color:#9ca3af; font-style:italic;">提示：请输入8位数字</div>
			</div>
			<div style="margin-bottom:20px;">
				<input type="text" id="samplePasswordInput" placeholder="请输入答案" 
					style="width:100%; padding:12px 16px; border:2px solid #e5e7eb; border-radius:8px; font-size:16px; box-sizing:border-box;"
					autocomplete="off" maxlength="8" pattern="[0-9]*">
			</div>
			<div style="display:flex; gap:12px; justify-content:center;">
				<button id="btnCancelSample" class="batch-modal-btn" style="min-width:100px;">取消</button>
				<button id="btnConfirmSample" class="batch-modal-btn primary" style="min-width:100px;">确认</button>
			</div>
		`;
		
		overlay.appendChild(panel);
		document.body.appendChild(overlay);
		
		// 自动聚焦到密码输入框
		const passwordInput = panel.querySelector('#samplePasswordInput');
		passwordInput.focus();
		
		// 回车键确认
		passwordInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') {
				document.getElementById('btnConfirmSample').click();
			}
		});
		
		// 取消按钮
		panel.querySelector('#btnCancelSample').addEventListener('click', () => {
			document.body.removeChild(overlay);
		});
		
		// 确认按钮
		panel.querySelector('#btnConfirmSample').addEventListener('click', () => {
			const answer = passwordInput.value.trim();
			
			// 公司固定电话答案
			const correctAnswer = '88772773';
			
			if (answer === correctAnswer) {
				// 密码正确，插入示例数据
				const samples = (window.CATALOG_SAMPLE_ROWS || []).map(s => ({ ...s }));
				if (!samples.length) { 
					console.warn('[Catalog] 未找到示例数据 window.CATALOG_SAMPLE_ROWS'); 
					showToast && showToast('未找到示例数据');
					document.body.removeChild(overlay);
					return; 
				}
				
				samples.forEach(s => { const c = computeRow(s); s.__result = c.__result; });
				catalogState.rows = samples.concat(catalogState.rows||[]);
				
				// 清除筛选状态，确保新插入的示例数据能够显示
				catalogFilterState = {
					searchText: '',
					platform: '',
					returnRateMin: '',
					returnRateMax: '',
					dangerFilter: false,
					sortBy: '',
					sortOrder: 'asc',
					filteredRows: []
				};
				
				renderCatalogTable(); 
				updateCatalogStatus(); 
				saveCatalogToStorage(); 
				updatePlatformFilterOptions();
				
				// 清除筛选输入框的值
				clearCatalogFilterInputs();
				
				showToast && showToast(`示例数据插入成功，共${samples.length}条记录`);
				document.body.removeChild(overlay);
			} else {
				// 答案错误
				passwordInput.style.borderColor = '#ef4444';
				passwordInput.style.background = '#fef2f2';
				passwordInput.value = '';
				passwordInput.placeholder = '答案错误，请重新输入';
				passwordInput.focus();
				
				// 3秒后恢复样式
				setTimeout(() => {
					passwordInput.style.borderColor = '#e5e7eb';
					passwordInput.style.background = '#fff';
					passwordInput.style.placeholder = '请输入答案';
				}, 3000);
			}
		});
		
		// 点击遮罩层关闭弹窗
		overlay.addEventListener('click', (e) => {
			if (e.target === overlay) {
				document.body.removeChild(overlay);
			}
		});
	});
	if (btnUndo) btnUndo.addEventListener('click', () => { 
		if (!catalogState.lastImportBackup) return; 
		
		// 恢复导入前的数据
		catalogState.rows = catalogState.lastImportBackup; 
		catalogState.lastImportBackup = null; 
		btnUndo.style.display='none'; 
		
		// 清除筛选状态，确保恢复的数据能够显示
		catalogFilterState = {
			searchText: '',
			platform: '',
			returnRateMin: '',
			returnRateMax: '',
			dangerFilter: false,
			sortBy: '',
			sortOrder: 'asc',
			filteredRows: []
		};
		
		renderCatalogTable(); 
		updateCatalogStatus(); 
		saveCatalogToStorage(); 
		updatePlatformFilterOptions(); 
		
		// 清除筛选输入框的值
		clearCatalogFilterInputs();
		clearFullscreenFilterInputs();
	});
	if (btnPlat) btnPlat.addEventListener('click', () => openPlatformSettingsModal());

			// 全屏：将表格容器临时移动到全屏弹窗中显示，关闭时移回原位
		if (btnFullscreen) {
			const overlay = document.getElementById('catalogFullscreenOverlay');
			const body = document.getElementById('catalogFullscreenBody');
			const closeBtn = document.getElementById('btnCatalogFullscreenClose');
			const recomputeBtn = document.getElementById('btnCatalogFullscreenRecompute');
			const addRowBtn = document.getElementById('btnCatalogFullscreenAddRow');
			const importBtn = document.getElementById('btnCatalogFullscreenImport');
			const fullscreenFileInput = document.getElementById('catalogFullscreenImportFile');
			const delBtn = document.getElementById('btnCatalogFullscreenDeleteSelected');
			const container = document.getElementById('catalogTableContainer');
			// 占位符：用于关闭时把容器放回原处
			const placeholder = document.createElement('div');
			placeholder.id = 'catalogTablePlaceholder';
					btnFullscreen.addEventListener('click', () => {
				if (!overlay || !body || !container) return;
				if (!container.parentElement || container.parentElement.id !== 'catalogTablePlaceholder') {
					container.after(placeholder);
				}
				body.appendChild(container);
				overlay.style.display = 'flex';
				// 全屏时再渲染一次，确保宽度自适应
				try { renderCatalogTable(); } catch (_) {}
				// 全屏时同步筛选状态到全屏筛选器
				syncFullscreenFilters();
			});
		const exitFullscreen = () => {
			if (!overlay) return;
			overlay.style.display = 'none';
			const ph = document.getElementById('catalogTablePlaceholder');
			const cont = document.getElementById('catalogTableContainer');
			if (ph && cont) ph.replaceWith(cont);
			// 退出后恢复一次渲染，适配原容器宽度
			try { renderCatalogTable(); } catch (_) {}
		};
		if (closeBtn) closeBtn.addEventListener('click', exitFullscreen);
		if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) exitFullscreen(); });
					if (recomputeBtn) recomputeBtn.addEventListener('click', recomputeAllCatalogRows);
			if (addRowBtn) addRowBtn.addEventListener('click', () => { 
				// 添加新行到数据中
				catalogState.rows.unshift({ name:'', sku:'', platform:'', salePrice:'', returnRate:'', costMin:'', costMax:'' }); 
				
				// 清除筛选状态，确保新行能够显示
				catalogFilterState = {
					searchText: '',
					platform: '',
					returnRateMin: '',
					returnRateMax: '',
					dangerFilter: false,
					sortBy: '',
					sortOrder: 'asc',
					filteredRows: []
				};
				
				// 重新渲染表格
				renderCatalogTable(); 
				updateCatalogStatus(); 
				saveCatalogToStorage(); 
				updatePlatformFilterOptions(); 
				updateFullscreenPlatformFilterOptions(); 
				
				// 清除筛选输入框的值
				clearCatalogFilterInputs();
				clearFullscreenFilterInputs();
			});
			if (importBtn && fullscreenFileInput) { importBtn.addEventListener('click', () => fullscreenFileInput.click()); fullscreenFileInput.addEventListener('change', async () => { const f = fullscreenFileInput.files && fullscreenFileInput.files[0]; if (!f) return; try { await importCatalogFromFile(f); } finally { fullscreenFileInput.value=''; } }); }
			if (delBtn) delBtn.addEventListener('click', () => { const cont = document.getElementById('catalogTableContainer'); const checks = Array.from(cont.querySelectorAll('.catalog-check')); const remain = []; checks.forEach(cb => { const tr = cb.closest('tr'); const idx = Number(tr.getAttribute('data-index')); if (!cb.checked) remain.push(catalogState.rows[idx]); }); catalogState.rows = remain; renderCatalogTable(); updateCatalogStatus(); saveCatalogToStorage(); updatePlatformFilterOptions(); updateFullscreenPlatformFilterOptions(); });
		// ESC 关闭
		window.addEventListener('keydown', (e) => { if (overlay && overlay.style.display !== 'none' && e.key === 'Escape') { exitFullscreen(); } });
	}
	
	// 搜索和筛选功能事件监听器
	const searchInput = document.getElementById('catalogSearchInput');
	const platformFilter = document.getElementById('catalogPlatformFilter');
	const returnRateMin = document.getElementById('catalogReturnRateMin');
	const returnRateMax = document.getElementById('catalogReturnRateMax');
	const sortBy = document.getElementById('catalogSortBy');
	const sortOrder = document.getElementById('catalogSortOrder');
	const applyFiltersBtn = document.getElementById('btnCatalogApplyFilters');
	const clearFiltersBtn = document.getElementById('btnCatalogClearFilters');
	
	// 实时搜索（输入时自动应用）
	if (searchInput) {
		searchInput.addEventListener('input', () => {
			// 延迟300ms执行，避免频繁搜索
			clearTimeout(searchInput.searchTimeout);
			searchInput.searchTimeout = setTimeout(applyCatalogFilters, 300);
		});
	}
	
	// 平台筛选变化时自动应用
	if (platformFilter) {
		platformFilter.addEventListener('change', applyCatalogFilters);
	}
	
	// 退货率区间变化时自动应用
	if (returnRateMin) {
		returnRateMin.addEventListener('input', () => {
			clearTimeout(returnRateMin.filterTimeout);
			returnRateMin.filterTimeout = setTimeout(applyCatalogFilters, 500);
		});
	}
	if (returnRateMax) {
		returnRateMax.addEventListener('input', () => {
			clearTimeout(returnRateMax.filterTimeout);
			returnRateMax.filterTimeout = setTimeout(applyCatalogFilters, 500);
		});
	}
	
	// 保本广告占比风险筛选变化时自动应用
	const dangerFilter = document.getElementById('catalogDangerFilter');
	if (dangerFilter) {
		dangerFilter.addEventListener('change', applyCatalogFilters);
	}
	
	// 排序变化时自动应用
	if (sortBy) {
		sortBy.addEventListener('change', applyCatalogFilters);
	}
	if (sortOrder) {
		sortOrder.addEventListener('change', applyCatalogFilters);
	}
	
	// 应用筛选按钮
	if (applyFiltersBtn) {
		applyFiltersBtn.addEventListener('click', applyCatalogFilters);
	}
	
	// 清除筛选按钮
	if (clearFiltersBtn) {
		clearFiltersBtn.addEventListener('click', clearCatalogFilters);
	}
	
	// 初始化平台筛选选项
	updatePlatformFilterOptions();
	
	// 全屏筛选功能事件监听器
	const fullscreenSearchInput = document.getElementById('catalogFullscreenSearchInput');
	const fullscreenPlatformFilter = document.getElementById('catalogFullscreenPlatformFilter');
	const fullscreenReturnRateMin = document.getElementById('catalogFullscreenReturnRateMin');
	const fullscreenReturnRateMax = document.getElementById('catalogFullscreenReturnRateMax');
	const fullscreenSortBy = document.getElementById('catalogFullscreenSortBy');
	const fullscreenSortOrder = document.getElementById('catalogFullscreenSortOrder');
	const fullscreenApplyFiltersBtn = document.getElementById('btnCatalogFullscreenApplyFilters');
	const fullscreenClearFiltersBtn = document.getElementById('btnCatalogFullscreenClearFilters');
	
	// 全屏实时搜索（输入时自动应用）
	if (fullscreenSearchInput) {
		fullscreenSearchInput.addEventListener('input', () => {
			// 延迟300ms执行，避免频繁搜索
			clearTimeout(fullscreenSearchInput.searchTimeout);
			fullscreenSearchInput.searchTimeout = setTimeout(() => applyFullscreenFilters(), 300);
		});
	}
	
	// 全屏平台筛选变化时自动应用
	if (fullscreenPlatformFilter) {
		fullscreenPlatformFilter.addEventListener('change', () => applyFullscreenFilters());
	}
	
	// 全屏退货率区间变化时自动应用
	if (fullscreenReturnRateMin) {
		fullscreenReturnRateMin.addEventListener('input', () => {
			clearTimeout(fullscreenReturnRateMin.filterTimeout);
			fullscreenReturnRateMin.filterTimeout = setTimeout(() => applyFullscreenFilters(), 500);
		});
	}
	if (fullscreenReturnRateMax) {
		fullscreenReturnRateMax.addEventListener('input', () => {
			clearTimeout(fullscreenReturnRateMax.filterTimeout);
			fullscreenReturnRateMax.filterTimeout = setTimeout(() => applyFullscreenFilters(), 500);
		});
	}
	
	// 全屏保本广告占比风险筛选变化时自动应用
	const fullscreenDangerFilter = document.getElementById('catalogFullscreenDangerFilter');
	if (fullscreenDangerFilter) {
		fullscreenDangerFilter.addEventListener('change', () => applyFullscreenFilters());
	}
	
	// 全屏排序变化时自动应用
	if (fullscreenSortBy) {
		fullscreenSortBy.addEventListener('change', () => applyFullscreenFilters());
	}
	if (fullscreenSortOrder) {
		fullscreenSortOrder.addEventListener('change', () => applyFullscreenFilters());
	}
	
	// 全屏应用筛选按钮
	if (fullscreenApplyFiltersBtn) {
		fullscreenApplyFiltersBtn.addEventListener('click', () => applyFullscreenFilters());
	}
	
	// 全屏清除筛选按钮
	if (fullscreenClearFiltersBtn) {
		fullscreenClearFiltersBtn.addEventListener('click', () => clearFullscreenFilters());
	}
}

// 页面加载：预初始化 Catalog，避免首次切换迟缓
try { window.addEventListener('load', () => { try { initCatalogTab(); } catch (_) {} }); } catch (_) {}

/**
 * 切换价格指标的口径视图（含税/不含税）
 * 功能说明：
 * 1. 含税视图：含税售价 vs 进货实际成本（不含进项税）
 * 2. 不含税视图：不含税售价 vs 不含税进价
 * 3. 切换后自动重新计算并更新显示
 */
function toggleTaxView() {
    const toggle = document.getElementById('taxViewToggle');
    const label = document.getElementById('taxViewLabel');
    const description = document.getElementById('taxViewDescription');
    
    if (!toggle || !label || !description) return;
    
    const isTaxInclusive = !toggle.checked;
    
    if (isTaxInclusive) {
        // 含税视图
        label.textContent = '含税视图';
        label.style.color = '#2ea44f';
        description.innerHTML = '当前口径：含税售价 vs 进货实际成本（不含进项税）';
        
        // 更新公式说明
        updateFormulaDescriptions(true);
    } else {
        // 不含税视图
        label.textContent = '不含税视图';
        label.style.color = '#e65100';
        description.innerHTML = '当前口径：不含税售价 vs 不含税进价';
        
        // 更新公式说明
        updateFormulaDescriptions(false);
    }
    
    // 重新计算价格指标
    try {
        // 触发利润页的重新计算
        const profitTab = document.getElementById('profitTab');
        if (profitTab && profitTab.classList.contains('active')) {
            // 如果当前在利润页，重新计算
            const calculateBtn = document.getElementById('calculateProfit');
            if (calculateBtn) calculateBtn.click();
        }
    } catch (e) {
        console.warn('切换口径后重新计算失败:', e);
    }
}

/**
 * 更新公式说明文字
 * @param {boolean} isTaxInclusive - 是否为含税视图
 */
function updateFormulaDescriptions(isTaxInclusive) {
    try {
        if (isTaxInclusive) {
            // 含税视图的公式说明
            const multipleDesc = document.querySelector('[data-formula="multiple"]');
            const grossDesc = document.querySelector('[data-formula="gross"]');
            
            if (multipleDesc) multipleDesc.textContent = '售价÷进货实际成本';
            if (grossDesc) grossDesc.textContent = '(售价-进货实际成本)÷售价';
        } else {
            // 不含税视图的公式说明
            const multipleDesc = document.querySelector('[data-formula="multiple"]');
            const grossDesc = document.querySelector('[data-formula="gross"]');
            
            if (multipleDesc) multipleDesc.textContent = '不含税售价÷不含税进价';
            if (grossDesc) grossDesc.textContent = '(不含税售价-不含税进价)÷不含税售价';
        }
    } catch (e) {
        console.warn('更新公式说明失败:', e);
    }
}

// 全屏筛选功能相关函数

/**
 * 同步筛选状态到全屏筛选器
 */
function syncFullscreenFilters() {
	const fullscreenSearchInput = document.getElementById('catalogFullscreenSearchInput');
	const fullscreenPlatformFilter = document.getElementById('catalogFullscreenPlatformFilter');
	const fullscreenReturnRateMin = document.getElementById('catalogFullscreenReturnRateMin');
	const fullscreenReturnRateMax = document.getElementById('catalogFullscreenReturnRateMax');
	const fullscreenDangerFilter = document.getElementById('catalogFullscreenDangerFilter');
	const fullscreenSortBy = document.getElementById('catalogFullscreenSortBy');
	const fullscreenSortOrder = document.getElementById('catalogFullscreenSortOrder');
	
	if (fullscreenSearchInput) fullscreenSearchInput.value = catalogFilterState.searchText;
	if (fullscreenPlatformFilter) fullscreenPlatformFilter.value = catalogFilterState.platform;
	if (fullscreenReturnRateMin) fullscreenReturnRateMin.value = catalogFilterState.returnRateMin;
	if (fullscreenReturnRateMax) fullscreenReturnRateMax.value = catalogFilterState.returnRateMax;
	if (fullscreenDangerFilter) fullscreenDangerFilter.checked = catalogFilterState.dangerFilter;
	if (fullscreenSortBy) fullscreenSortBy.value = catalogFilterState.sortBy;
	if (fullscreenSortOrder) fullscreenSortOrder.value = catalogFilterState.sortOrder;
	
	// 更新全屏平台筛选选项
	updateFullscreenPlatformFilterOptions();
}

/**
 * 更新全屏平台筛选选项
 */
function updateFullscreenPlatformFilterOptions() {
	const platformSelect = document.getElementById('catalogFullscreenPlatformFilter');
	if (!platformSelect) return;
	
	// 获取所有唯一的平台
	const platforms = [...new Set((catalogState.rows || []).map(row => row.platform).filter(Boolean))];
	
	// 清空现有选项（保留"全部平台"）
	platformSelect.innerHTML = '<option value="">全部平台</option>';
	
	// 添加平台选项
	platforms.forEach(platform => {
		const option = document.createElement('option');
		option.value = platform;
		option.textContent = platform;
		platformSelect.appendChild(option);
	});
}

/**
 * 应用全屏筛选
 */
function applyFullscreenFilters() {
	const searchText = document.getElementById('catalogFullscreenSearchInput').value.toLowerCase();
	const platform = document.getElementById('catalogFullscreenPlatformFilter').value;
	const returnRateMin = parseFloat(document.getElementById('catalogFullscreenReturnRateMin').value) || 0;
	const returnRateMax = parseFloat(document.getElementById('catalogFullscreenReturnRateMax').value) || 100;
	const dangerFilter = document.getElementById('catalogFullscreenDangerFilter').checked;
	const sortBy = document.getElementById('catalogFullscreenSortBy').value;
	const sortOrder = document.getElementById('catalogFullscreenSortOrder').value;
	
	// 更新筛选状态
	catalogFilterState = {
		searchText,
		platform,
		returnRateMin,
		returnRateMax,
		dangerFilter,
		sortBy,
		sortOrder,
		filteredRows: []
	};
	
	// 获取所有行
	let rows = [...(catalogState.rows || [])];
	
	// 应用筛选
	rows = rows.filter(row => {
		// 搜索筛选：名称或货号智能匹配搜索文本
		if (searchText) {
			const searchKeywords = searchText.toLowerCase().trim().split(/\s+/).filter(keyword => keyword.length > 0);
			const name = (row.name || '').toLowerCase();
			const sku = (row.sku || '').toLowerCase();
			
			// 检查是否所有关键词都能在名称或货号中找到（支持任意顺序）
			const nameMatch = searchKeywords.every(keyword => name.includes(keyword));
			const skuMatch = searchKeywords.every(keyword => sku.includes(keyword));
			
			// 如果名称和货号都不匹配，则过滤掉该行
			if (!nameMatch && !skuMatch) {
				return false;
			}
		}
		
		// 平台筛选
		if (platform && row.platform !== platform) {
			return false;
		}
		
		// 退货率区间筛选
		if (returnRateMin > 0 || returnRateMax < 100) {
			const returnRate = parsePercent(row.returnRate) * 100;
			if (returnRate < returnRateMin || returnRate > returnRateMax) {
				return false;
			}
		}
		
		// 保本广告占比风险筛选
		if (dangerFilter) {
			const result = row.__result;
			if (!result) return false;
			
			let hasDanger = false;
			if (Array.isArray(result.list)) {
				// 多档情况：检查是否有任何一档的保本广告占比低于21%
				hasDanger = result.list.some(item => {
					const adRate = item.breakevenAdRate;
					return isFinite(adRate) && adRate > 0 && adRate < 0.21;
				});
			} else if (Array.isArray(result.priceRangeResults)) {
				// 价格区间情况：检查是否有任何区间的保本广告占比低于21%
				hasDanger = result.priceRangeResults.some(item => {
					const adRate = item.breakevenAdRate;
					if (typeof adRate === 'object' && adRate.min !== undefined) {
						return isFinite(adRate.min) && adRate.min > 0 && adRate.min < 0.21;
					}
					return isFinite(adRate) && adRate > 0 && adRate < 0.21;
				});
			} else if (Array.isArray(result.combinations)) {
				// 组合情况：检查是否有任何组合的保本广告占比低于21%
				hasDanger = result.combinations.some(item => {
					const adRate = item.breakevenAdRate;
					return isFinite(adRate) && adRate > 0 && adRate < 0.21;
				});
			} else {
				// 单一情况：检查保本广告占比是否低于21%
				const adRate = result.breakevenAdRate;
				hasDanger = isFinite(adRate) && adRate > 0 && adRate < 0.21;
			}
			
			if (!hasDanger) return false;
		}
		
		return true;
	});
	// 应用排序
	if (sortBy) {
		rows.sort((a, b) => {
			let aVal, bVal;
			
			switch (sortBy) {
				case 'name':
					aVal = (a.name || '').toLowerCase();
					bVal = (b.name || '').toLowerCase();
					break;
				case 'sku':
					aVal = (a.sku || '').toLowerCase();
					bVal = (b.sku || '').toLowerCase();
					break;
				case 'returnRate':
					aVal = parsePercent(a.returnRate);
					bVal = parsePercent(b.returnRate);
					break;
				case 'salePrice':
					aVal = parseFloat(a.salePrice) || 0;
					bVal = parseFloat(b.salePrice) || 0;
					break;
				default:
					return 0;
			}
			
			if (sortOrder === 'asc') {
				return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
			} else {
				return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
			}
		});
	}
	
	// 保存筛选结果
	catalogFilterState.filteredRows = rows;
	
	// 重新渲染表格
	renderCatalogTable();
	
	// 更新状态显示
	updateCatalogStatus();
}

/**
 * 清除全屏筛选
 */
function clearFullscreenFilters() {
	document.getElementById('catalogFullscreenSearchInput').value = '';
	document.getElementById('catalogFullscreenPlatformFilter').value = '';
	document.getElementById('catalogFullscreenReturnRateMin').value = '';
	document.getElementById('catalogFullscreenReturnRateMax').value = '';
	document.getElementById('catalogFullscreenDangerFilter').checked = false;
	document.getElementById('catalogFullscreenSortBy').value = '';
	document.getElementById('catalogFullscreenSortOrder').value = 'asc';
	
	catalogFilterState = {
		searchText: '',
		platform: '',
		returnRateMin: '',
		returnRateMax: '',
		sortBy: '',
		sortOrder: 'asc',
		filteredRows: []
	};
	
	renderCatalogTable();
	updateCatalogStatus();
}

// 添加税费详情浮层功能
function addTaxTooltip(element, taxData) {
    // 移除已存在的浮层
    removeTaxTooltip();
    
    // 创建浮层元素
    const tooltip = document.createElement('div');
    tooltip.id = 'tax-tooltip';
    
    // 生成税费详情内容
    const tooltipContent = generateTaxTooltipContent(taxData);
    tooltip.innerHTML = tooltipContent;
    
    // 使用内联样式，与利润率推演弹窗保持一致
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
    
    // 添加到页面
    document.body.appendChild(tooltip);
    
    // 鼠标进入事件
    element.addEventListener('mouseenter', (e) => {
        showTaxTooltip(e, tooltip);
    });
    
    // 鼠标离开事件
    element.addEventListener('mouseleave', () => {
        hideTaxTooltip();
    });
    
    // 鼠标移动事件（更新浮层位置）
    element.addEventListener('mousemove', (e) => {
        updateTaxTooltipPosition(e, tooltip);
    });
}

// 生成税费详情浮层内容
function generateTaxTooltipContent(taxData) {
    const {
        actualVAT,
        outputVAT,
        totalVATDeduction,
        purchaseVAT,
        adVAT,
        platformVAT,
        actualPrice,
        salesTaxRate,
        inputTaxRate
    } = taxData;
    
    // 修复：salesTaxRate已经是百分比值（如13），不需要再除以100
    const netPrice = actualPrice / (1 + salesTaxRate / 100);
    
    return `详细税费计算过程

销项税计算
含税售价：¥${actualPrice.toFixed(2)}
不含税售价：¥${netPrice.toFixed(2)}
销项税（${salesTaxRate}%）：¥${outputVAT.toFixed(2)}

进项税抵扣
商品进项税（${inputTaxRate}%）：¥${purchaseVAT.toFixed(2)}
广告费进项税（6%）：¥${adVAT.toFixed(2)}
平台佣金进项税（6%）：¥${platformVAT.toFixed(2)}
可抵扣进项税合计：¥${totalVATDeduction.toFixed(2)}

实际税负
销项税：+¥${outputVAT.toFixed(2)}
可抵扣进项税：-¥${totalVATDeduction.toFixed(2)}
实际应缴税额：¥${actualVAT.toFixed(2)}
占销售额比例：${(actualVAT / actualPrice * 100).toFixed(2)}%

注：税费占比 = 实际应缴税额 ÷ 含税销售额 × 100%`;
}

// 显示税费详情浮层
function showTaxTooltip(event, tooltip) {
    // 即显：不做延时，直接更新位置与内容
    updateTaxTooltipPosition(event, tooltip);
    tooltip.style.opacity = '1';
}

// 隐藏税费详情浮层
function hideTaxTooltip() {
    const tooltip = document.getElementById('tax-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
    }
}

// 更新税费详情浮层位置
function updateTaxTooltipPosition(event, tooltip) {
    const offset = 12;
    tooltip.style.left = `${event.clientX + offset}px`;
    tooltip.style.top = `${event.clientY + offset}px`;
}

// 移除税费详情浮层
function removeTaxTooltip() {
    const tooltip = document.getElementById('tax-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// ==================== 到手价推演功能 ====================

/**
 * 初始化到手价推演tab
 * 加载保存的参数并设置默认值
 */
function initTakeHomeTab() {
    // 从localStorage加载保存的参数
    const savedInputs = JSON.parse(localStorage.getItem('takehomeInputs') || '{}');

    // 设置默认值
    const defaults = {
        takehomeCostPrice: 38,
        takehomeInputTaxRate: 6,
        takehomeOutputTaxRate: 13,
        takehomePlatformRate: 5.5,
        takehomeSalesTaxRate: 13,
        takehomeShippingCost: 2.8,
        takehomeShippingInsurance: 1.5,
        takehomeOtherCost: 2.5,
        takehomeReturnRate: 20,
        takehomeAdRateMin: 0,
        takehomeAdRateMax: 40,
        takehomeFreeCommission: false
    };
    
    // 应用保存的值或默认值
    Object.keys(defaults).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = savedInputs[key] !== undefined ? savedInputs[key] : defaults[key];
            } else {
                element.value = savedInputs[key] || defaults[key];
            }
        }
    });

    // 初始化免佣功能
    initTakeHomeFreeCommission();

    // 立即尝试自动计算一次，不等待
    try {
        // 使用requestAnimationFrame确保DOM更新完成后再计算
        requestAnimationFrame(() => {
            calculateTakeHomePriceExploration();
        });
    } catch (error) {
        console.warn('到手价推演自动计算失败:', error);
        // 如果自动计算失败，不阻塞界面显示
    }
}

/**
 * 初始化到手价推演免佣功能
 */
function initTakeHomeFreeCommission() {
    const freeCommissionCheckbox = document.getElementById('takehomeFreeCommission');
    const platformRateInput = document.getElementById('takehomePlatformRate');

    if (!freeCommissionCheckbox || !platformRateInput) return;

    // 免佣复选框变化事件
    freeCommissionCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // 免佣开启：佣金设为0，输入框禁用
            platformRateInput.value = '0';
            platformRateInput.disabled = true;
            platformRateInput.style.opacity = '0.5';
        } else {
            // 免佣关闭：恢复输入框可用状态，佣金设为默认值5.5%
            platformRateInput.value = '5.5';
            platformRateInput.disabled = false;
            platformRateInput.style.opacity = '1';
        }

        // 同步到表格中的免佣按钮
        const tableFreeCommission = document.getElementById('tableFreeCommission');
        if (tableFreeCommission) {
            tableFreeCommission.checked = this.checked;
        }

        // 触发计算
        calculateTakeHomePriceExploration();
    });

    // 平台佣金输入框变化时，自动取消免佣
    platformRateInput.addEventListener('input', function() {
        const freeCommissionCheckbox = document.getElementById('takehomeFreeCommission');
        if (freeCommissionCheckbox && this.value !== '0' && freeCommissionCheckbox.checked) {
            freeCommissionCheckbox.checked = false;
            // 同步取消表格中的免佣按钮
            const tableFreeCommission = document.getElementById('tableFreeCommission');
            if (tableFreeCommission) {
                tableFreeCommission.checked = false;
            }
        }
    });
}

/**
 * 计算到手价推演
 * 基于输入参数，计算不同退货率和付费占比下的到手价
 */
function calculateTakeHomePriceExploration() {
    try {
        // 获取输入参数
        const inputs = {
            costPrice: parseFloat(document.getElementById('takehomeCostPrice').value) || 0,
            inputTaxRate: (parseFloat(document.getElementById('takehomeInputTaxRate').value) || 0) / 100,
            outputTaxRate: (parseFloat(document.getElementById('takehomeOutputTaxRate').value) || 0) / 100,
            platformRate: (parseFloat(document.getElementById('takehomePlatformRate').value) || 0) / 100,
            salesTaxRate: (parseFloat(document.getElementById('takehomeSalesTaxRate').value) || 0) / 100,
            shippingCost: parseFloat(document.getElementById('takehomeShippingCost').value) || 0,
            shippingInsurance: parseFloat(document.getElementById('takehomeShippingInsurance').value) || 0,
            otherCost: parseFloat(document.getElementById('takehomeOtherCost').value) || 0,
            returnRate: (parseFloat(document.getElementById('takehomeReturnRate').value) || 0) / 100,
            adRateMin: (parseFloat(document.getElementById('takehomeAdRateMin').value) || 0) / 100,
            adRateMax: (parseFloat(document.getElementById('takehomeAdRateMax').value) || 0) / 100
        };
        
        // 验证输入参数
        if (inputs.costPrice <= 0) {
            alert('请输入有效的进货价');
            return;
        }
        
        if (inputs.returnRate < 0 || inputs.returnRate > 1) {
            alert('退货率必须在0%到100%之间');
            return;
        }
        
        if (inputs.adRateMin > inputs.adRateMax) {
            alert('付费占比最小值不能大于最大值');
            return;
        }
        
        // 生成付费占比的推演点（退货率固定）
        const adRates = generateRangePoints(inputs.adRateMin, inputs.adRateMax, 9);
        
        // 目标利润率：0%、3%、5%、7%、9%、10%、12%、15%
        const targetProfitRates = [0, 0.03, 0.05, 0.07, 0.09, 0.10, 0.12, 0.15];
        
        // 生成推演结果（退货率固定）
        const results = generateTakeHomePriceResults(inputs, adRates, targetProfitRates);
        
        // 显示结果
        displayTakeHomePriceResults(results, inputs, adRates, targetProfitRates);
        
        // 保存参数到localStorage
        saveTakeHomeInputs();

        // 同步免佣状态到平台佣金输入框和表格中的免佣按钮
        const freeCommissionCheckbox = document.getElementById('takehomeFreeCommission');
        const platformRateInput = document.getElementById('takehomePlatformRate');
        if (freeCommissionCheckbox && platformRateInput) {
            if (freeCommissionCheckbox.checked) {
                platformRateInput.value = '0';
                platformRateInput.disabled = true;
                platformRateInput.style.opacity = '0.5';
            } else {
                platformRateInput.disabled = false;
                platformRateInput.style.opacity = '1';
            }
            // 同步到表格中的免佣按钮
            const tableFreeCommission = document.getElementById('tableFreeCommission');
            if (tableFreeCommission) {
                tableFreeCommission.checked = freeCommissionCheckbox.checked;
            }
        }
        
    } catch (error) {
        console.error('到手价推演计算错误:', error);
        alert('计算过程中发生错误，请检查输入参数');
    }
}

/**
 * 生成范围内的推演点
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @param {number} count 点数
 * @returns {Array} 推演点数组
 */
function generateRangePoints(min, max, count) {
    if (count <= 1) return [min];
    if (Math.abs(max - min) < 0.001) return [min];
    
    const points = [];
    for (let i = 0; i < count; i++) {
        const point = min + (max - min) * i / (count - 1);
        points.push(Math.round(point * 1000) / 1000); // 保留3位小数
    }
    return points;
}

/**
 * 生成到手价推演结果
 * @param {Object} inputs 输入参数
 * @param {Array} adRates 付费占比数组
 * @param {Array} targetProfitRates 目标利润率数组
 * @returns {Object} 推演结果
 */
function generateTakeHomePriceResults(inputs, adRates, targetProfitRates) {
    const results = {};
    
    // 只有一个退货率
    const returnRate = inputs.returnRate;
    results[returnRate] = {};
    
    adRates.forEach(adRate => {
        results[returnRate][adRate] = {};
        targetProfitRates.forEach(targetProfitRate => {
            const takeHomePrice = calculateTakeHomePriceForExploration(
                inputs.costPrice,
                adRate,
                targetProfitRate,
                {
                    ...inputs,
                    returnRate: returnRate
                }
            );
            results[returnRate][adRate][targetProfitRate] = takeHomePrice;
        });
    });
    
    return results;
}

/**
 * 计算到手价（推演专用）
 * @param {number} costPrice 进货价
 * @param {number} adRate 付费占比
 * @param {number} targetProfitRate 目标利润率
 * @param {Object} params 其他参数
 * @returns {number} 到手价
 */
function calculateTakeHomePriceForExploration(costPrice, adRate, targetProfitRate, params) {
    try {
        // 基于目标利润率和已知参数，反推到手价
        // 使用迭代法求解：从成本价开始，逐步调整直到达到目标利润率
        let lowPrice = costPrice;
        let highPrice = costPrice * 10; // 上限设为成本的10倍
        let midPrice;
        let bestPrice = costPrice;
        let bestDiff = Infinity;
        
        // 二分查找最优价格
        for (let i = 0; i < 20; i++) {
            midPrice = (lowPrice + highPrice) / 2;
            
            // 使用统一的利润计算函数，确保与利润率计算tab结果完全一致
            const inputs = { 
                costPrice: costPrice, 
                actualPrice: midPrice, 
                inputTaxRate: params.inputTaxRate, 
                outputTaxRate: params.outputTaxRate, 
                salesTaxRate: params.salesTaxRate, 
                platformRate: params.platformRate, 
                shippingCost: params.shippingCost, 
                shippingInsurance: params.shippingInsurance, 
                otherCost: params.otherCost, 
                adRate: adRate, 
                returnRate: params.returnRate
            };
            
            const result = calculateProfitUnified(inputs);
            const actualProfitRate = result.profitRate;
            
            const diff = Math.abs(actualProfitRate - targetProfitRate);
            if (diff < bestDiff) {
                bestDiff = diff;
                bestPrice = midPrice;
            }
            
            if (Math.abs(actualProfitRate - targetProfitRate) < 0.001) {
                break; // 精度足够，退出循环
            }
            
            if (actualProfitRate < targetProfitRate) {
                lowPrice = midPrice;
            } else {
                highPrice = midPrice;
            }
        }
        
        return bestPrice;
    } catch (_) {
        return NaN;
    }
}

/**
 * 显示到手价推演结果
 * @param {Object} results 推演结果
 * @param {Object} inputs 输入参数
 * @param {Array} adRates 付费占比数组
 * @param {Array} targetProfitRates 目标利润率数组
 */
function displayTakeHomePriceResults(results, inputs, adRates, targetProfitRates) {
    const container = document.getElementById('takehomeResultContainer');
    const content = document.getElementById('takehomeResultContent');
    
    if (!container || !content) return;
    
    // 显示结果容器
    container.style.display = 'block';
    
    // 生成结果HTML
    let html = `
        <div style="background:#f0f4ff; border:1px solid #3b82f6; border-radius:8px; padding:16px; margin-bottom:20px; color:#1e40af;">
            <div style="font-weight:600; margin-bottom:8px;">📊 推演参数摘要</div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; font-size:13px; line-height:1.4;">
                <div><strong>进货价：</strong>¥${inputs.costPrice.toFixed(2)}</div>
                <div><strong>开票成本：</strong>${(inputs.inputTaxRate * 100).toFixed(1)}%</div>
                <div><strong>进项税率：</strong>${(inputs.outputTaxRate * 100).toFixed(1)}%</div>
                <div><strong>平台佣金：</strong>${(inputs.platformRate * 100).toFixed(1)}%</div>
                <div><strong>销项税率：</strong>${(inputs.salesTaxRate * 100).toFixed(1)}%</div>
                <div><strong>物流费：</strong>¥${inputs.shippingCost.toFixed(2)}</div>
                <div><strong>运费险：</strong>¥${inputs.shippingInsurance.toFixed(2)}</div>
                <div><strong>其他成本：</strong>¥${inputs.otherCost.toFixed(2)}</div>
            </div>
        </div>
        

    `;
    
    // 只有一个退货率，直接生成结果表格
    const returnRate = inputs.returnRate;
    const freeCommissionChecked = document.getElementById('takehomeFreeCommission')?.checked ? 'checked' : '';
    html += `
        <div style="margin:20px 0 16px 0; display:flex; justify-content:center; align-items:center; gap:16px; flex-wrap:wrap;">
            <h4 style="margin:0; text-align:center; color:#1e40af; font-size:16px;">
                📈 推演进货价：¥${inputs.costPrice.toFixed(2)}，预计退货率：${(returnRate * 100).toFixed(1)}%
            </h4>
            <div class="takehome-free-commission-header">
                <input type="checkbox" id="tableFreeCommission" ${freeCommissionChecked}>
                <label for="tableFreeCommission">免佣</label>
            </div>
        </div>
        ${generateTakeHomePriceTableHtmlForExploration(results[returnRate], adRates, targetProfitRates, returnRate)}
    `;
    
    content.innerHTML = html;

    // 为表格中的免佣按钮添加事件监听
    const tableFreeCommission = document.getElementById('tableFreeCommission');
    if (tableFreeCommission) {
        tableFreeCommission.addEventListener('change', function() {
            const paramFreeCommission = document.getElementById('takehomeFreeCommission');
            if (paramFreeCommission) {
                paramFreeCommission.checked = this.checked;
                // 触发参数区域的免佣逻辑
                const platformRateInput = document.getElementById('takehomePlatformRate');
                if (this.checked) {
                    platformRateInput.value = '0';
                    platformRateInput.disabled = true;
                    platformRateInput.style.opacity = '0.5';
                } else {
                    platformRateInput.value = '5.5';
                    platformRateInput.disabled = false;
                    platformRateInput.style.opacity = '1';
                }
                // 重新计算
                calculateTakeHomePriceExploration();
            }
        });
    }
}

/**
 * 生成到手价推演表格HTML（推演页面专用）
 * @param {Object} returnRateResults 该退货率下的所有结果
 * @param {Array} adRates 付费占比数组
 * @param {Array} targetProfitRates 目标利润率数组
 * @param {number} returnRate 当前退货率
 * @returns {string} 表格HTML
 */
function generateTakeHomePriceTableHtmlForExploration(returnRateResults, adRates, targetProfitRates, returnRate) {
    // 表头：显示目标利润率，每个利润率下显示一个列
    const header = `
        <tr>
            <th style="border-bottom:2px solid #e5e7eb;padding:12px 16px;color:#374151;font-weight:600;text-align:center;background:#f8fafc;font-size:14px;min-width:120px;">付费占比 \\ 目标利润率</th>
            ${targetProfitRates.map(rate => 
                `<th style="border-bottom:2px solid #e5e7eb;padding:12px 16px;color:#374151;font-weight:600;text-align:center;background:#f8fafc;font-size:14px;min-width:100px;">${(rate * 100).toFixed(1)}%</th>`
            ).join('')}
        </tr>`;
    
    // 表格行：每行显示一个付费占比，每列显示对应目标利润率的综合信息
    const rows = adRates.map(adRate => {
        // 20%付费占比行高亮显示
        const isHighlighted = Math.abs(adRate - 0.20) < 0.001;
        const rowStyle = isHighlighted ? 'background:linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border:2px solid #f59e0b;' : '';
        
        const rowHeader = `<td style="padding:12px 16px;text-align:center;border-right:2px solid #e5e7eb;background:#f8fafc;font-weight:600;color:#3b82f6;font-size:14px;min-width:120px;">${(adRate * 100).toFixed(0)}%</td>`;
        
        const cells = targetProfitRates.map(targetRate => {
            const takeHomePrice = returnRateResults[adRate][targetRate];
            const isPositive = takeHomePrice > 0;
            
            // 计算保本ROI和保本广告占比
            let breakevenROI = '-';
            let breakevenAdRate = '-';
            
            if (isFinite(takeHomePrice) && takeHomePrice > 0) {
                try {
                    // 获取当前输入参数用于计算保本ROI
                    const currentInputs = {
                        costPrice: parseFloat(document.getElementById('takehomeCostPrice').value) || 0,
                        inputTaxRate: (parseFloat(document.getElementById('takehomeInputTaxRate').value) || 0) / 100,
                        outputTaxRate: (parseFloat(document.getElementById('takehomeOutputTaxRate').value) || 0) / 100,
                        salesTaxRate: (parseFloat(document.getElementById('takehomeSalesTaxRate').value) || 0) / 100,
                        platformRate: (parseFloat(document.getElementById('takehomePlatformRate').value) || 0) / 100,
                        shippingCost: parseFloat(document.getElementById('takehomeShippingCost').value) || 0,
                        shippingInsurance: parseFloat(document.getElementById('takehomeShippingInsurance').value) || 0,
                        otherCost: parseFloat(document.getElementById('takehomeOtherCost').value) || 0,
                        returnRate: returnRate,
                        finalPrice: takeHomePrice
                    };
                    
                    const roiResult = calculateBreakevenROI(currentInputs);
                    if (roiResult.feasible && isFinite(roiResult.breakevenROI)) {
                        breakevenROI = roiResult.breakevenROI === Infinity ? '∞' : roiResult.breakevenROI.toFixed(2);
                    }
                    if (roiResult.feasible && isFinite(roiResult.breakevenAdRate)) {
                        breakevenAdRate = (roiResult.breakevenAdRate * 100).toFixed(1) + '%';
                    }
                } catch (error) {
                    console.warn('计算保本ROI失败:', error);
                }
            }
            
            const tooltip = `目标利润率：${(targetRate * 100).toFixed(1)}%\n付费占比：${(adRate * 100).toFixed(0)}%\n退货率：${(returnRate * 100).toFixed(1)}%\n到手价：¥${takeHomePrice.toFixed(2)}\n保本ROI：${breakevenROI}\n保本广告占比：${breakevenAdRate}`;
            
            // 直接在单元格中显示三个数值，减少嵌套层级
            const cellContent = isFinite(takeHomePrice) ? 
                `<span class="price-main">¥${takeHomePrice.toFixed(2)}</span><br>
                 <span class="roi-info">ROI: ${breakevenROI}</span><br>
                 <span class="adrate-info">广告: ${breakevenAdRate}</span>` : '-';
            
            return `<td class="${isPositive ? 'positive' : 'negative'}" data-tooltip="${tooltip.replace(/"/g, '&quot;')}">
                ${cellContent}
            </td>`;
        }).join('');
        
        const rowClass = isHighlighted ? 'highlighted' : '';
        return `<tr class="${rowClass}">${rowHeader}${cells}</tr>`;
    }).join('');
    
    return `<table class="takehome-result-table">${header}${rows}</table>`;
}

/**
 * 保存到手价推演输入参数到localStorage
 */
function saveTakeHomeInputs() {
    const inputs = {
        takehomeCostPrice: document.getElementById('takehomeCostPrice').value,
        takehomeInputTaxRate: document.getElementById('takehomeInputTaxRate').value,
        takehomeOutputTaxRate: document.getElementById('takehomeOutputTaxRate').value,
        takehomePlatformRate: document.getElementById('takehomePlatformRate').value,
        takehomeSalesTaxRate: document.getElementById('takehomeSalesTaxRate').value,
        takehomeShippingCost: document.getElementById('takehomeShippingCost').value,
        takehomeShippingInsurance: document.getElementById('takehomeShippingInsurance').value,
        takehomeOtherCost: document.getElementById('takehomeOtherCost').value,
        takehomeReturnRate: document.getElementById('takehomeReturnRate').value,
        takehomeAdRateMin: document.getElementById('takehomeAdRateMin').value,
        takehomeAdRateMax: document.getElementById('takehomeAdRateMax').value,
        takehomeFreeCommission: document.getElementById('takehomeFreeCommission').checked
    };
    
    localStorage.setItem('takehomeInputs', JSON.stringify(inputs));
}

// 为到手价推演页面的输入框添加实时计算功能
document.addEventListener('DOMContentLoaded', function() {
    // 延迟执行，确保DOM完全加载
    setTimeout(() => {
        // 初始化立减档位（如果在标价tab）
        try {
            if (document.getElementById('listpriceTab').classList.contains('active')) {
                initDiscountRates();
            }
        } catch (error) {
            console.warn('初始化立减档位失败:', error);
        }
        const takehomeInputs = [
            'takehomeCostPrice', 'takehomeInputTaxRate', 'takehomeOutputTaxRate',
            'takehomePlatformRate', 'takehomeSalesTaxRate', 'takehomeShippingCost',
            'takehomeShippingInsurance', 'takehomeOtherCost', 'takehomeReturnRate',
            'takehomeAdRateMin', 'takehomeAdRateMax'
        ];
        
        takehomeInputs.forEach(inputId => {
            const element = document.getElementById(inputId);
            if (element) {
                element.addEventListener('input', () => {
                    // 延迟计算，避免频繁计算
                    clearTimeout(window.takehomeCalculationTimer);
                    window.takehomeCalculationTimer = setTimeout(() => {
                        try {
                            calculateTakeHomePriceExploration();
                        } catch (_) {}
                    }, 500);
                });
            }
        });
        
        // 确保默认tab正确显示（只在没有任何tab激活时设置默认值）
        try {
            // 检查是否已有激活的tab
            const activeTabContent = document.querySelector('.tab-content.active');
            if (!activeTabContent) {
                // 如果没有激活的tab，则显示默认的利润计算tab
                const profitTab = document.getElementById('profitTab');
                if (profitTab) {
                    profitTab.classList.add('active');
                }
            }
            
            // 为当前激活的tab自动计算结果
            const currentActiveTab = document.querySelector('.tab-content.active');
            if (currentActiveTab) {
                const tabId = currentActiveTab.id;
                if (tabId === 'profitTab') {
                    setTimeout(() => {
                        try {
                            calculateProfit();
                        } catch (error) {
                            console.warn('页面加载时利润计算自动计算失败:', error);
                        }
                    }, 200);
                } else if (tabId === 'priceTab') {
                    setTimeout(() => {
                        try {
                            calculate();
                        } catch (error) {
                            console.warn('页面加载时售价计算自动计算失败:', error);
                        }
                    }, 200);
                }
            }
        } catch (_) {}
    }, 1000);
});