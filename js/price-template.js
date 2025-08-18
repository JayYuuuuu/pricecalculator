// 生成售价计算结果HTML
function generatePriceResultHtml({ purchaseCost, salesCost, priceInfo, inputs }) {
    const adCost = priceInfo.adCost;
    // 为了与页面展示的成本拆分完全一致，这里基于展示用口径重新计算一次“销售费用/总成本/预期利润”
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
                            costPrice: purchaseCost.costPrice,
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
            <h3>价格构成分析</h3>
            
            <!-- 成本概览部分 -->
            <div class="cost-overview" style="margin-bottom: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 8px;">
                <h4 style="margin: 0 0 1rem 0; color: #333;">成本概览</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="overview-section">
                        <div class="overview-title" style="font-weight: 500; margin-bottom: 0.5rem; color: #0066cc;">基础成本分析</div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>进货价（不含税）：</span>
                            <span style="font-weight: 500;">¥${purchaseCost.costPrice.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>开票费用（${(inputs.inputTaxRate*100).toFixed(1)}%）：</span>
                            <span style="font-weight: 500;">¥${(purchaseCost.costPrice * inputs.inputTaxRate).toFixed(2)}</span>
                        </div>
                        <div style="margin: 0.5rem 0; padding: 0.5rem 0; border-top: 1px dashed #e0e0e0; border-bottom: 1px dashed #e0e0e0;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>实际支付总额：</span>
                                <span style="font-weight: 500;">¥${purchaseCost.totalPurchaseCost.toFixed(2)}</span>
                            </div>
                        <div style="display: flex; justify-content: space-between; color: #2ea44f;">
                            <span>实际进货成本：</span>
                                <span style="font-weight: 500;">¥${purchaseCost.effectiveCost.toFixed(2)}</span>
                            </div>
                        </div>
                        <div style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">
                        <div>• 实际进货成本 = 进货价 + 开票费用</div>
                        <div>• 商品进项税将统一在税费环节抵扣，不计入采购成本</div>
                        <div>• 可抵扣进项税会在销售时抵减应缴税款</div>
                        </div>
                    </div>
                    <div class="overview-section">
                        <div class="overview-title" style="font-weight: 500; margin-bottom: 0.5rem; color: #0066cc;">销售成本分析</div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>固定成本（含退货分摊）：</span>
                            <span style="font-weight: 500;">¥${(salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance + salesCost.operationalCosts.other).toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>平台佣金：</span>
                            <span style="font-weight: 500;">¥${priceInfo.platformFee.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>广告费：</span>
                            <span style="font-weight: 500;">¥${(priceInfo.adCost / salesCost.effectiveRate).toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>销项税（${(inputs.salesTaxRate*100).toFixed(1)}%）：</span>
                            <span style="font-weight: 500;">¥${priceInfo.outputVAT.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; color: #2ea44f;">
                            <span>总销售成本：</span>
                            <span style="font-weight: 500;">¥${(priceInfo.platformFee + (priceInfo.adCost / salesCost.effectiveRate) + (salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance + salesCost.operationalCosts.other) + priceInfo.outputVAT).toFixed(2)}</span>
                        </div>
                        <div style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">
                            总销售成本 = 固定成本 + 平台佣金 + 广告费 + 销项税（基于最终售价）
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="price-composition">
                <div class="composition-item">
                    <div class="item-label">基础成本</div>
                    <div class="item-value">¥ ${purchaseCost.effectiveCost.toFixed(2)}</div>
                    <div class="item-percent">${(purchaseCost.effectiveCost/priceInfo.finalPrice*100).toFixed(1)}%</div>
                </div>
                <div class="composition-item">
                    <div class="item-label">销售费用</div>
                    <div class="item-value">¥ ${displaySalesExpense.toFixed(2)}</div>
                    <div class="item-percent">${(displaySalesExpense/priceInfo.finalPrice*100).toFixed(1)}%</div>
                    <div class="cost-detail">
                        <div class="cost-item">平台佣金：¥ ${priceInfo.platformFee.toFixed(2)}</div>
                        <div class="cost-item">广告费用（全店付费占比）：¥ ${(priceInfo.adCost / salesCost.effectiveRate).toFixed(2)}</div>
                        <div class="cost-item">物流及其他：¥ ${(salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance + salesCost.operationalCosts.other).toFixed(2)}</div>
                    </div>
                </div>
                <div class="composition-item">
                    <div class="item-label">税费支出（净额）</div>
                    <div class="item-value">¥ ${priceInfo.actualVAT.toFixed(2)}</div>
                    <div class="item-percent">${(priceInfo.actualVAT/priceInfo.finalPrice*100).toFixed(1)}%</div>
                    <div class="tax-detail">
                        <div class="tax-item">销项税：¥ ${priceInfo.outputVAT.toFixed(2)}</div>
                        <div class="tax-item">可抵扣：¥ ${priceInfo.totalVATDeduction.toFixed(2)}</div>
                        <div class="tax-item">实缴税费：¥ ${priceInfo.actualVAT.toFixed(2)}</div>
                    </div>
                </div>
                <div class="composition-item profit">
                    <div class="item-label">预期利润</div>
                    <div class="item-value">¥ ${displayProfit.toFixed(2)}</div>
                    <div class="item-percent">${displayProfitRate}%</div>
                </div>
            </div>
            <div class="price-note">注意：由于平台佣金（${(inputs.platformRate*100).toFixed(1)}%）和广告费（全店付费占比 ${(inputs.adRate*100).toFixed(1)}%）是基于最终售价计算的，所以各项金额直接相加不等于最终售价。</div>
            
            <div class="calculation-steps">
                <div class="step-header">计算过程分为以下步骤（所有成本都已考虑退货率${(salesCost.returnRate*100).toFixed(0)}%的影响）：</div>
                
                <div class="step-section">
                    <div class="step-title">1. 基础成本计算</div>
                    
                    <div class="cost-table">
                        <div class="table-section">
                            <div class="section-title">进货相关：</div>
                            <table>
                                <tr>
                                    <td>进货成本</td>
                                    <td class="amount">${purchaseCost.totalPurchaseCost.toFixed(2)}元</td>
                                </tr>
                                <tr>
                                    <td>实际进货成本（C）<br><span class="note">进货价 + 开票费用，不随退货率分摊</span></td>
                                    <td class="amount">${purchaseCost.effectiveCost.toFixed(2)}元</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div class="table-section">
                            <div class="section-title">运营相关（考虑退货分摊）：</div>
                            <div class="section-note">注：平台佣金（${(inputs.platformRate*100).toFixed(1)}%）基于最终售价计算，将在最终定价时计入</div>
                            <table>
                                <tr>
                                    <td>物流费</td>
                                    <td class="formula">${inputs.shippingCost.toFixed(2)} ÷ ${(salesCost.effectiveRate*100).toFixed(0)}%</td>
                                    <td class="amount">${salesCost.operationalCosts.shipping.toFixed(2)}元</td>
                                </tr>
                                <tr>
                                    <td>运费险</td>
                                    <td class="formula">${inputs.shippingInsurance.toFixed(2)} ÷ ${(salesCost.effectiveRate*100).toFixed(0)}%</td>
                                    <td class="amount">${salesCost.operationalCosts.insurance.toFixed(2)}元</td>
                                </tr>
                                <tr>
                                    <td>广告费（不可退回，按全店付费占比分摊）</td>
                                    <td class="formula">${adCost.toFixed(2)} ÷ ${(salesCost.effectiveRate*100).toFixed(0)}%</td>
                                    <td class="amount">${(adCost / salesCost.effectiveRate).toFixed(2)}元</td>
                                </tr>
                                <tr>
                                    <td>其他成本</td>
                                    <td class="formula">${inputs.otherCost.toFixed(2)} ÷ ${(salesCost.effectiveRate*100).toFixed(0)}%</td>
                                    <td class="amount">${salesCost.operationalCosts.other.toFixed(2)}元</td>
                                </tr>
                                <tr class="total">
                                    <td colspan="2">运营成本合计（不含平台佣金）</td>
                                    <td class="amount">${(salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance + (adCost / salesCost.effectiveRate) + salesCost.operationalCosts.other).toFixed(2)}元</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div class="table-section">
                            <div class="section-title">基础成本合计：</div>
                            <div class="total-amount">${(purchaseCost.effectiveCost + salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance + (adCost / salesCost.effectiveRate) + salesCost.operationalCosts.other).toFixed(2)}元</div>
                        </div>
                    </div>
                </div>

                <div class="step-section">
                    <div class="step-title">2. 联立求解含税售价</div>
                    <div class="formula-box">
                        <div class="formula-title">计算公式：</div>
                        <div class="formula-content">
                            (实际进货成本 - 商品进项税 + 不可退回固定成本/(1-退货率)) ÷ (1 - 平台费率 - 销项税占比 - 目标利润率 - 广告费分摊 + 广告费进项税抵扣 + 平台佣金进项税抵扣)
                        </div>
                        <div class="formula-note">
                            说明：先按利润率定义对“含税售价”联立求解，再在下一步去税得到不含税售价
                        </div>
                    </div>
                    
                    <div class="calculation-details">
                        <table>
                            <tr>
                                <td>固定成本（物流、运费险、其他）</td>
                                <td class="amount">${priceInfo.fixedCosts.toFixed(2)}元</td>
                            </tr>
                            <tr>
                                <td>
                                    比例费用（按最终售价口径）：<br>
                                    <span class="detail-items">
                                        平台佣金 ${(inputs.platformRate*100).toFixed(1)}% +<br>
                                        销项税占比 ${(priceInfo.taxFactorOnFinal*100).toFixed(1)}% +<br>
                                        目标利润分摊 ${(priceInfo.profitFactorEffective*100).toFixed(1)}% +<br>
                                        广告费分摊（全店付费占比）${(priceInfo.adFactorEffective*100).toFixed(1)}% -<br>
                                        广告费进项税抵扣（6%）${(priceInfo.adVatCreditFactor*100).toFixed(1)}% -<br>
                                        平台佣金进项税抵扣 ${(priceInfo.platformVatCreditFactor*100).toFixed(1)}%
                                    </span>
                                </td>
                                <td class="amount">${(100*(inputs.platformRate + priceInfo.taxFactorOnFinal + priceInfo.profitFactorEffective + priceInfo.adFactorEffective - priceInfo.adVatCreditFactor - priceInfo.platformVatCreditFactor)).toFixed(1)}%</td>
                            </tr>
                        </table>
                        
                        <div class="final-calculation">
                            <div class="calc-step">
                                具体计算：(${purchaseCost.effectiveCost.toFixed(2)} - ${purchaseCost.purchaseVAT.toFixed(2)} + ${priceInfo.fixedCosts.toFixed(2)}) ÷ (1 - ${(100*(inputs.platformRate + priceInfo.taxFactorOnFinal + priceInfo.profitFactorEffective + priceInfo.adFactorEffective - priceInfo.adVatCreditFactor - priceInfo.platformVatCreditFactor)).toFixed(1)}%)
                            </div>
                            <div class="calc-result">
                                = ${priceInfo.finalPrice.toFixed(2)}元
                            </div>
                        </div>
                    </div>
                </div>

                <div class="step-section">
                    <div class="step-title">3. 去税得到不含税售价</div>
                    <div class="final-price-calc">
                        <div class="calc-formula">含税售价 ÷ (1 + 销项税率)</div>
                        <div class="calc-step">${priceInfo.finalPrice.toFixed(2)} ÷ (1 + ${(inputs.salesTaxRate*100).toFixed(0)}%)</div>
                        <div class="calc-result">= ${priceInfo.netPrice.toFixed(2)}元</div>
                    </div>
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

            <div class="calculation-steps" style="margin-top:16px;">
                <div class="step-header">计算说明</div>
                <div class="step-section">
                    <div class="step-title">公式与顺序</div>
                    <div class="cost-table">
                        <div class="table-section">
                            <div class="section-title">设：</div>
                            <div class="section-note">S=标价，r=单品立减比例，阈值/减额为满减各档位 (T_i, O_i)</div>
                            <table>
                                <tr>
                                    <td>立减后价</td>
                                    <td class="formula">S1 = S × (1 − r)</td>
                                </tr>
                                <tr>
                                    <td>满减触发条件</td>
                                    <td class="formula">若 S1 ≥ T_i，则可减 O_i，取 O_i 最大者</td>
                                </tr>
                                <tr>
                                    <td>到手价</td>
                                    <td class="formula">P = S1 − O_max</td>
                                </tr>
                                <tr>
                                    <td>反解标价</td>
                                    <td class="formula">S = (目标价 + O_assume) ÷ (1 − r)，并验证 O_assume 是否可由 S1 触发</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
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

            <div class="calculation-steps" style="margin-top:16px;">
                <div class="step-header">计算说明</div>
                <div class="step-section">
                    <div class="step-title">公式与顺序</div>
                    <div class="cost-table">
                        <div class="table-section">
                            <div class="section-title">设：</div>
                            <div class="section-note">S=标价，r=单品立减比例，阈值/减额为满减各档位 (T_i, O_i)</div>
                            <table>
                                <tr>
                                    <td>立减后价</td>
                                    <td class="formula">S1 = S × (1 − r)</td>
                                </tr>
                                <tr>
                                    <td>满减触发条件</td>
                                    <td class="formula">若 S1 ≥ T_i，则可减 O_i，取 O_i 最大者</td>
                                </tr>
                                <tr>
                                    <td>到手价</td>
                                    <td class="formula">P = S1 − O_max</td>
                                </tr>
                                <tr>
                                    <td>反解标价</td>
                                    <td class="formula">S = (目标价 + O_assume) ÷ (1 − r)，并验证 O_assume 是否可由 S1 触发</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
