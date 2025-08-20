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
            <div class="price-hint" style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">
                利润率说明：系统已把预计的退货损失（如退不回的运费、广告费）提前摊入有效订单成本，确保实际利润率接近目标
            </div>
            <div class="price-hint" style="font-size: 0.85rem; color: #2ea44f; margin-top: 0.25rem;">
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
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">预期利润率</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: #2ea44f;">${displayProfitRate}%</div>
                </div>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">预期利润</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: #2ea44f;">¥${displayProfit.toFixed(2)}</div>
                </div>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">总成本</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: #e65100;">¥${displayTotalCost.toFixed(2)}</div>
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
        '<div style="font-size:0.9rem;color:#666;margin-top:6px;">满减档位：'
        + tiers
            .slice()
            .sort((a,b)=>a.threshold-b.threshold)
            .map(t=>`满${Number(t.threshold).toFixed(2)}减${Number(t.off).toFixed(2)}`)
            .join('，')
        + '</div>'
    ) : '<div style="font-size:0.9rem;color:#666;margin-top:6px;">未设置满减，按无满减计算</div>';

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
        
        return `<div class="price-card" data-s="${Number(item.price).toFixed(2)}">
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
        <div class="section calculation-process lp-card">
            <h3>标价建议与校验</h3>
            <div class="price-cards-container">
                ${priceCards}
            </div>
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
        
        // 生成该到手价目标的卡片
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
            
            return `<div class="price-card" data-s="${Number(item.price).toFixed(2)}">
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

        return `
            <div class="target-price-section">
                <div class="target-price-header">
                    <h4>目标到手价：¥${targetFinalPrice.toFixed(2)}</h4>
                    <div class="target-price-summary">
                        共 ${sorted.length} 个立减档位，${sorted.filter(r => isFinite(r.price)).length} 个有效标价建议
                    </div>
                </div>
                <div class="price-cards-container">
                    ${priceCards}
                </div>
            </div>
        `;
    }).join('');

    // 满减规则说明
    const tierSummary = tiers && tiers.length ? (
        '<div style="font-size:0.9rem;color:#666;margin-top:6px;">满减档位：'
        + tiers
            .slice()
            .sort((a,b)=>a.threshold-b.threshold)
            .map(t=>`满${Number(t.threshold).toFixed(2)}减${Number(t.off).toFixed(2)}`)
            .join('，')
        + '</div>'
    ) : '<div style="font-size:0.9rem;color:#666;margin-top:6px;">未设置满减，按无满减计算</div>';

    return `
        <div class="section calculation-process lp-card">
            <h3>批量标价建议与校验</h3>
            <div class="batch-summary">
                <div class="summary-item">
                    <span class="summary-label">目标到手价数量：</span>
                    <span class="summary-value">${sortedResults.length} 个</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">价格区间：</span>
                    <span class="summary-value">¥${Math.min(...sortedResults.map(r => r.targetFinalPrice)).toFixed(2)} - ¥${Math.max(...sortedResults.map(r => r.targetFinalPrice)).toFixed(2)}</span>
                </div>
                ${tierSummary}
            </div>
            
            ${targetPriceSections}
        </div>
    `;
}
