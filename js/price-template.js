// 生成售价计算结果HTML
function generatePriceResultHtml({ purchaseCost, salesCost, priceInfo, inputs }) {
    const adCost = priceInfo.adCost;
    // 为了与页面展示的成本拆分完全一致，这里基于展示用口径重新计算一次"销售费用/总成本/预期利润"
    const displaySalesExpense = priceInfo.platformFee
        + salesCost.operationalCosts.shipping
        + salesCost.operationalCosts.insurance
        + salesCost.operationalCosts.other
        + (priceInfo.adCost / salesCost.effectiveRate);
    const displayTotalCost = purchaseCost.effectiveCost + displaySalesExpense + priceInfo.actualVAT;
    const displayProfit = priceInfo.finalPrice - displayTotalCost;
    const displayProfitRate = (displayProfit / priceInfo.finalPrice * 100).toFixed(2);
    
    return `
        <div class="final-price">
            <div class="price-label">建议含税售价</div>
            <div class="price-value">¥ ${priceInfo.finalPrice.toFixed(2)}</div>
            <div class="price-hint">此价格已考虑所有成本、税费和目标利润</div>
            <div class="price-hint">
                利润率说明：系统已把预计的退货损失（如退不回的运费、广告费）提前摊入有效订单成本，确保实际利润率接近目标
            </div>
            <div class="price-hint highlight">
                保本ROI（有效GMV÷广告费）：${(function(){
                    try{
                        const roiRes = calculateBreakevenROI({
                            costPrice: purchaseCost.purchasePrice,
                            inputTaxRate: inputs.inputTaxRate,
                            outputTaxRate: inputs.outputTaxRate,
                            salesTaxRate: inputs.salesTaxRate,
                            platformRate: inputs.platformRate,
                            shippingCost: inputs.shippingCost,
                            shippingInsurance: inputs.shippingInsurance,
                            otherCost: inputs.otherCost,
                            returnRate: inputs.returnRate,
                            finalPrice: priceInfo.finalPrice
                        });
                        if (!isFinite(roiRes.breakevenROI)) return '∞';
                        if (isNaN(roiRes.breakevenROI) || roiRes.breakevenROI <= 0) return '-';
                        return Number(roiRes.breakevenROI).toFixed(2);
                    }catch(_){return '-'}
                })()}
            </div>
        </div>

        <div class="section calculation-process">
            <h3>关键指标</h3>
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-label">预期利润率</div>
                    <div class="metric-value profit">${displayProfitRate}%</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">预期利润</div>
                    <div class="metric-value profit">¥${displayProfit.toFixed(2)}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">总成本</div>
                    <div class="metric-value cost">¥${displayTotalCost.toFixed(2)}</div>
                </div>
            </div>
        </div>
    `;
}

// 生成标价计算结果HTML
function generateListPriceHtml({ targetFinalPrice, tiers, results }) {
    // 按立减比例从小到大排序展示（0, 10%, 12%, 15%, 18%）
    const sorted = results.slice().sort((a,b)=>a.r-b.r);

    const tierSummary = tiers && tiers.length ? (
        '<div class="tier-summary">满减档位：'
        + tiers
            .slice()
            .sort((a,b)=>a.threshold-b.threshold)
            .map(t=>`满${Number(t.threshold).toFixed(2)}减${Number(t.off).toFixed(2)}`)
            .join('，')
        + '</div>'
    ) : '<div class="tier-summary">未设置满减，按无满减计算</div>';

    // 生成卡片形式的标价建议
    const priceCards = sorted.map(item => {
        const rPct = (item.r*100).toFixed(0) + '%';
        if (!isFinite(item.price)) {
            return `<div class="price-card price-card-invalid">
                <div class="price-card-header">
                    <span class="discount-rate">${rPct}</span>
                    <span class="status-badge status-error">参数无解</span>
                </div>
                <div class="price-card-content">
                    <div class="price-value">-</div>
                    <div class="price-details">
                        <div class="detail-item">
                            <span class="detail-label">建议标价：</span>
                            <span class="detail-value">-</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">满减触发：</span>
                            <span class="detail-value">-</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">叠加后到手价：</span>
                            <span class="detail-value">-</span>
                        </div>
                    </div>
                </div>
            </div>`;
        }
        
        // 提示优化：满减触发信息用 Chip 展示，维持次要色；金额保持统一格式
        const offText = item.off ? `<span class="price-chip price-chip-green">减 ¥${Number(item.off).toFixed(2)}</span>${item.thresholdUsed? ` <span class=\"price-chip price-chip-blue\">触发满¥${Number(item.thresholdUsed).toFixed(2)}</span>` : ''}` : '<span class="price-chip price-chip-gray">无</span>';
        const isExact = Math.abs((item.finalPrice||0) - targetFinalPrice) < 0.005;
        const statusClass = isExact ? 'status-success' : 'status-warning';
        const statusText = isExact ? '精确匹配' : `偏差 ¥${Math.abs((item.finalPrice||0)-targetFinalPrice).toFixed(2)}`;
        
        return `<div class="price-card" data-s="${Number(item.price).toFixed(2)}" data-r="${item.r}">
            <div class="price-card-header">
                <span class="discount-rate">${rPct}</span>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="price-card-content">
                <div class="price-value">
                    <span class="currency">¥</span>
                    <span class="value">${Number(item.price).toFixed(2)}</span>
                </div>
                <div class="price-details">
                    <div class="detail-item">
                        <span class="detail-label">满减触发：</span>
                        <span class="detail-value">${offText}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">叠加后到手价：</span>
                        <span class="detail-value">¥${Number(item.finalPrice).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');

    // 说明：这里原本会渲染一个顶部"目标到手价"信息卡片（类名：final-price），
    // 为满足"仅在标价计算页面隐藏该模块，不影响其他页面"的需求，
    // 我们在此函数内直接移除该模块的模板字符串，仅保留下方的"标价建议与校验"表格区域。
    // 其它页面的结果页仍然使用各自模板文件（如 generatePriceResultHtml / generateResultHtml），不会受此次修改影响。
    return `
        <div class="price-cards-container">
            ${priceCards}
        </div>
    `;
}

// 生成批量标价计算结果HTML（支持多个到手价目标）
function generateBatchListPriceHtml({ allResults, tiers }) {
    // 按到手价从小到大排序
    const sortedResults = allResults.slice().sort((a, b) => a.targetFinalPrice - b.targetFinalPrice);
    
    // 生成每个到手价目标的结果区域
    const targetPriceSections = sortedResults.map(({ targetFinalPrice, results }) => {
        // 按立减比例从小到大排序展示
        const sorted = results.slice().sort((a,b)=>a.r-b.r);

        // 生成简化的结果展示
        const resultItems = sorted.map(item => {
            const rPct = (item.r*100).toFixed(0) + '%';
            if (!isFinite(item.price)) {
                return `
                    <div class="result-item error">
                        <div class="result-header">
                            <div class="discount-rate">❌ ${rPct}立减</div>
                            <div class="status error">参数无解</div>
                        </div>
                        <div class="price-grid">
                            <div class="price-label">无法计算建议标价</div>
                        </div>
                    </div>
                `;
            }

            const offText = item.off ? `减 ¥${Number(item.off).toFixed(2)}${item.thresholdUsed? ` (满¥${Number(item.thresholdUsed).toFixed(2)})` : ''}` : '无满减';
            const isExact = Math.abs((item.finalPrice||0) - targetFinalPrice) < 0.005;

            return `
                <div class="result-item">
                    <div class="result-header">
                        <div class="discount-rate">${rPct}立减</div>
                        <div class="status ${isExact ? 'success' : 'warning'}">
                            ${isExact ? '✅ 精确匹配' : `⚠️ 偏差 ¥${Math.abs((item.finalPrice||0)-targetFinalPrice).toFixed(2)}`}
                        </div>
                    </div>
                    <div class="price-grid">
                        <div class="price-cell">
                            <div class="price-label">建议标价</div>
                            <div class="price-value green">¥${Number(item.price).toFixed(2)}</div>
                        </div>
                        <div class="price-cell">
                            <div class="price-label">实际到手价</div>
                            <div class="price-value orange">¥${Number(item.finalPrice).toFixed(2)}</div>
                        </div>
                    </div>
                    <div class="full-reduction-info">
                        ${offText}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="target-result-section">
                <div class="target-result-header">
                    <div class="target-icon">🎯</div>
                    <h4>目标到手价 ¥${targetFinalPrice.toFixed(2)} 的标价建议</h4>
                </div>
                <div class="result-items">
                    ${resultItems}
                </div>
            </div>
        `;
    }).join('');

    // 满减规则说明
    const tierSummary = tiers && tiers.length ? (
        '<div class="tier-summary">满减档位：'
        + tiers
            .slice()
            .sort((a,b)=>a.threshold-b.threshold)
            .map(t=>`满${Number(t.threshold).toFixed(2)}减${Number(t.off).toFixed(2)}`)
            .join('，')
        + '</div>'
    ) : '<div class="tier-summary">未设置满减，按无满减计算</div>';

    return `
        <div class="batch-results">
            ${targetPriceSections}
            ${tierSummary}
        </div>
    `;
}
