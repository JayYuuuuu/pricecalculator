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
                        <div class="calc-formula">含税售价 ÷ (1 + 商品税率)</div>
                        <div class="calc-step">${priceInfo.finalPrice.toFixed(2)} ÷ (1 + ${(inputs.outputTaxRate*100).toFixed(0)}%)</div>
                        <div class="calc-result">= ${priceInfo.netPrice.toFixed(2)}元</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
