// 生成售价计算结果HTML
function generatePriceResultHtml({ purchaseCost, salesCost, priceInfo, inputs }) {
    const adCost = priceInfo.adCost;
    
    return `
        <div class="final-price">
            <div class="price-label">建议含税售价</div>
            <div class="price-value">¥ ${priceInfo.finalPrice.toFixed(2)}</div>
            <div class="price-hint">此价格已考虑所有成本、税费和目标利润</div>
        </div>

        <div class="section calculation-process">
            <h3>价格构成分析</h3>
            <div class="price-composition">
                <div class="composition-item">
                    <div class="item-label">基础成本</div>
                    <div class="item-value">¥ ${purchaseCost.effectiveCost.toFixed(2)}</div>
                    <div class="item-percent">${(purchaseCost.effectiveCost/priceInfo.finalPrice*100).toFixed(1)}%</div>
                </div>
                <div class="composition-item">
                    <div class="item-label">销售费用</div>
                    <div class="item-value">¥ ${(priceInfo.platformFee + salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance + (priceInfo.adCost / salesCost.effectiveRate)).toFixed(2)}</div>
                    <div class="item-percent">${((priceInfo.platformFee + salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance + (priceInfo.adCost / salesCost.effectiveRate))/priceInfo.finalPrice*100).toFixed(1)}%</div>
                    <div class="cost-detail">
                        <div class="cost-item">平台佣金：¥ ${priceInfo.platformFee.toFixed(2)}</div>
                        <div class="cost-item">广告费用：¥ ${(priceInfo.adCost / salesCost.effectiveRate).toFixed(2)}</div>
                        <div class="cost-item">物流及其他：¥ ${(salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance).toFixed(2)}</div>
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
                    <div class="item-value">¥ ${priceInfo.profit.toFixed(2)}</div>
                    <div class="item-percent">${priceInfo.profitRate}%</div>
                </div>
            </div>
            <div class="price-note">注意：由于平台佣金（${(inputs.platformRate*100).toFixed(1)}%）和广告费（${(inputs.adRate*100).toFixed(1)}%）是基于最终售价计算的，所以各项金额直接相加不等于最终售价。</div>
            
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
                                    <td>税后实际成本（C）<br><span class="note">已扣除可抵扣进项税，不随退货率分摊</span></td>
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
                                    <td>广告费（不可退回）</td>
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
                    <div class="step-title">2. 计算不含税售价</div>
                    <div class="formula-box">
                        <div class="formula-title">计算公式：</div>
                        <div class="formula-content">
                            (税后进货成本 + 不可退回固定成本/(1-退货率)) ÷ (1 - 平台费率 - 销项税率 - 目标利润率 - 广告费率/(1-退货率) + 广告费进项税抵扣 + 平台佣金进项税抵扣)
                        </div>
                        <div class="formula-note">
                            说明：按利润率定义 (最终售价-所有成本和税费)/最终售价 = 目标利润率 进行联立求解
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
                                        广告费分摊 ${(priceInfo.adFactorEffective*100).toFixed(1)}% -<br>
                                        广告费进项税抵扣 ${(priceInfo.adVatCreditFactor*100).toFixed(1)}% -<br>
                                        平台佣金进项税抵扣 ${(priceInfo.platformVatCreditFactor*100).toFixed(1)}%
                                    </span>
                                </td>
                                <td class="amount">${(100*(inputs.platformRate + priceInfo.taxFactorOnFinal + priceInfo.profitFactorEffective + priceInfo.adFactorEffective - priceInfo.adVatCreditFactor - priceInfo.platformVatCreditFactor)).toFixed(1)}%</td>
                            </tr>
                        </table>
                        
                        <div class="final-calculation">
                            <div class="calc-step">
                                具体计算：(${purchaseCost.effectiveCost.toFixed(2)} + ${priceInfo.fixedCosts.toFixed(2)}) ÷ (1 - ${(100*(inputs.platformRate + priceInfo.taxFactorOnFinal + priceInfo.profitFactorEffective + priceInfo.adFactorEffective - priceInfo.adVatCreditFactor)).toFixed(1)}%)
                            </div>
                            <div class="calc-result">
                                = ${priceInfo.netPrice.toFixed(2)}元
                            </div>
                        </div>
                    </div>
                </div>

                <div class="step-section">
                    <div class="step-title">3. 计算含税售价</div>
                    <div class="final-price-calc">
                        <div class="calc-formula">不含税售价 × (1 + 商品税率)</div>
                        <div class="calc-step">${priceInfo.netPrice.toFixed(2)} × (1 + ${(inputs.outputTaxRate*100).toFixed(0)}%)</div>
                        <div class="calc-result">= ${priceInfo.finalPrice.toFixed(2)}元</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
