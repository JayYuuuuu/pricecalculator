// 生成结果HTML
function generateResultHtml({ purchaseCost, salesCost, priceInfo, inputs }) {
    const adCost = priceInfo.adCost;
    
    return `
        <div class="final-price">
            <div class="price-label">实际利润</div>
            <div class="price-value">¥ ${priceInfo.profit.toFixed(2)}</div>
            <div class="price-hint">利润率：${priceInfo.profitRate}%</div>
            <div class="price-hint" style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">
                利润率说明：利润 ÷ 含税售价，利润中已扣除退货带来的损失（如退不回的运费、广告费）
            </div>
        </div>

        <div class="section calculation-process">
            <h3>利润构成分析</h3>
            <div class="profit-composition">
                <div class="composition-item revenue">
                    <div class="item-label">销售收入</div>
                    <div class="item-value">¥ ${priceInfo.finalPrice.toFixed(2)}</div>
                    <div class="item-percent">100%</div>
                    <div class="cost-detail" style="text-align: left;">
                        <div class="cost-item">
                            含税销售金额：¥ ${priceInfo.finalPrice.toFixed(2)}
                        </div>
                        <div class="cost-item" style="color: #666; font-size: 0.85rem;">
                            注：含税销售金额就是买家实际付款金额
                        </div>
                        <div class="cost-item">
                            不含税销售收入：¥ ${(priceInfo.finalPrice / (1 + inputs.outputTaxRate)).toFixed(2)}
                        </div>
                        <div class="cost-item" style="color: #666; font-size: 0.85rem;">
                            注：不含税销售收入 = 含税销售金额 ÷ (1 + ${(inputs.outputTaxRate*100).toFixed(0)}%)
                        </div>
                    </div>
                </div>
                <div class="composition-item cost">
                    <div class="item-label">基础成本</div>
                    <div class="item-value">¥ ${purchaseCost.effectiveCost.toFixed(2)}</div>
                    <div class="item-percent">${(purchaseCost.effectiveCost/priceInfo.finalPrice*100).toFixed(1)}%</div>
                    <div class="cost-detail" style="text-align: left;">
                        <div class="cost-item">
                            进货价（不含税）：¥ ${purchaseCost.purchasePrice.toFixed(2)}
                        </div>
                        <div style="margin: 0.5rem 0; padding: 0.5rem 0; border-top: 1px dashed #e0e0e0; border-bottom: 1px dashed #e0e0e0;">
                            <div class="cost-item">
                                开票成本（${(inputs.inputTaxRate*100).toFixed(1)}%）：¥ ${(purchaseCost.purchasePrice * inputs.inputTaxRate).toFixed(2)}
                            </div>
                        </div>
                        <div class="cost-item" style="font-weight: 500;">
                            实际进货成本：¥ ${purchaseCost.effectiveCost.toFixed(2)}
                        </div>
                        <div style="font-size: 0.85rem; color: #666; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed #e0e0e0;">
                            计算过程：进货价 + 开票成本
                        </div>
                    </div>
                </div>
                <div class="composition-item expenses">
                    <div class="item-label">销售费用</div>
                    <div class="item-value">¥ ${(priceInfo.platformFee + salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance + salesCost.operationalCosts.other + (adCost / salesCost.effectiveRate)).toFixed(2)}</div>
                    <div class="item-percent">${((priceInfo.platformFee + salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance + salesCost.operationalCosts.other + (adCost / salesCost.effectiveRate))/priceInfo.finalPrice*100).toFixed(1)}%</div>
                    <div class="cost-detail" style="text-align: left;">
                        <div class="cost-item">平台佣金（可退回）：¥ ${priceInfo.platformFee.toFixed(2)}</div>
                        <div class="cost-item">广告费用（分摊后）：¥ ${(adCost / salesCost.effectiveRate).toFixed(2)}</div>
                        <div class="cost-item">物流费（分摊后）：¥ ${salesCost.operationalCosts.shipping.toFixed(2)}</div>
                        <div class="cost-item">运费险（分摊后）：¥ ${salesCost.operationalCosts.insurance.toFixed(2)}</div>
                        <div class="cost-item">其他成本（分摊后）：¥ ${salesCost.operationalCosts.other.toFixed(2)}</div>
                        <div class="cost-item" style="color: #666; font-size: 0.85rem;">
                            注：可退回是指买家退货，对应费用会退回商家。<br>已分摊是指不可退回费用已按退货率${(salesCost.returnRate*100).toFixed(0)}%分摊
                        </div>
                    </div>
                </div>
                <div class="composition-item tax" style="background: #f0f7ff;">
                    <div class="item-label">税费分析</div>
                    <div class="item-value">¥ ${priceInfo.actualVAT.toFixed(2)}</div>
                    <div class="item-percent">${(priceInfo.actualVAT/priceInfo.finalPrice*100).toFixed(1)}%</div>
                    <div class="cost-detail" style="text-align: left;">
                        <div class="cost-item" style="color: #e65100;">
                            应缴销项税：¥ ${priceInfo.outputVAT.toFixed(2)} (${(priceInfo.outputVAT/priceInfo.finalPrice*100).toFixed(1)}%)
                        </div>
                        <div style="margin: 0.5rem 0; padding: 0.5rem 0; border-top: 1px dashed #e0e0e0; border-bottom: 1px dashed #e0e0e0;">
                            <div class="cost-item" style="color: #2ea44f;">
                                可抵扣进项税：¥ ${priceInfo.totalVATDeduction.toFixed(2)} (${(priceInfo.totalVATDeduction/priceInfo.finalPrice*100).toFixed(1)}%)
                            </div>
                            <div style="margin-top: 0.5rem; padding-left: 1rem; font-size: 0.85rem; color: #666;">
                                <div class="cost-item">• 商品进项税：¥${purchaseCost.purchaseVAT.toFixed(2)}</div>
                                <div class="cost-item">• 广告费进项税：¥${priceInfo.adVAT.toFixed(2)}</div>
                                <div class="cost-item">• 平台佣金进项税：¥${(priceInfo.platformFee * 0.06).toFixed(2)}</div>
                            </div>
                        </div>
                        <div class="cost-item" style="font-weight: 500;">
                            实际应缴税费：¥ ${priceInfo.actualVAT.toFixed(2)} (${(priceInfo.actualVAT/priceInfo.finalPrice*100).toFixed(1)}%)
                        </div>
                    </div>
                </div>
            </div>

            <div class="calculation-steps">
                <div class="step-header">详细成本分析：</div>
                
                <div class="step-section">
                    <div class="step-title">1. 进货成本分析</div>
                    <div class="cost-table">
                        <table>
                            <tr>
                                <td>进货价（不含税）</td>
                                <td class="amount">${purchaseCost.purchasePrice.toFixed(2)}元</td>
                            </tr>
                            <tr>
                                <td>开票费用（${(inputs.inputTaxRate*100).toFixed(1)}%）</td>
                                <td class="amount">${purchaseCost.invoiceCost.toFixed(2)}元</td>
                            </tr>
                            <tr class="total">
                                <td>实际进货成本</td>
                                <td class="amount">${purchaseCost.effectiveCost.toFixed(2)}元</td>
                            </tr>
                        </table>
                        <div style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">
                            注：进货成本 = 进货价 + 开票费用
                        </div>
                    </div>
                </div>

                <div class="step-section">
                    <div class="step-title">2. 销售费用分析</div>
                    <div class="cost-table">
                        <table>
                            <tr>
                                <td>平台佣金（${(inputs.platformRate*100).toFixed(1)}%，可退回）</td>
                                <td class="amount">${priceInfo.platformFee.toFixed(2)}元</td>
                            </tr>
                            <tr>
                                <td>广告费用（${(inputs.adRate*100).toFixed(1)}%）</td>
                                <td class="formula">${adCost.toFixed(2)} ÷ ${(salesCost.effectiveRate*100).toFixed(0)}%</td>
                                <td class="amount">${(adCost / salesCost.effectiveRate).toFixed(2)}元</td>
                            </tr>
                            <tr>
                                <td>物流费用</td>
                                <td class="formula">${inputs.shippingCost.toFixed(2)} ÷ ${(salesCost.effectiveRate*100).toFixed(0)}%</td>
                                <td class="amount">${(inputs.shippingCost/salesCost.effectiveRate).toFixed(2)}元</td>
                            </tr>
                            <tr>
                                <td>运费险</td>
                                <td class="formula">${inputs.shippingInsurance.toFixed(2)} ÷ ${(salesCost.effectiveRate*100).toFixed(0)}%</td>
                                <td class="amount">${(inputs.shippingInsurance/salesCost.effectiveRate).toFixed(2)}元</td>
                            </tr>
                            <tr>
                                <td>其他成本</td>
                                <td class="formula">${inputs.otherCost.toFixed(2)} ÷ ${(salesCost.effectiveRate*100).toFixed(0)}%</td>
                                <td class="amount">${(inputs.otherCost/salesCost.effectiveRate).toFixed(2)}元</td>
                            </tr>
                            <tr class="total">
                                <td colspan="2">销售费用合计（考虑退货分摊）</td>
                                <td class="amount">${(priceInfo.platformFee + salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance + salesCost.operationalCosts.other + (adCost / salesCost.effectiveRate)).toFixed(2)}元</td>
                            </tr>
                        </table>
                        <div style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                            注：由于退货率${(salesCost.returnRate*100).toFixed(0)}%，不可退回费用（广告费、物流费等）需要由${(salesCost.effectiveRate*100).toFixed(0)}%的成功订单分摊承担。
                        </div>
                    </div>
                </div>

                <div class="step-section">
                    <div class="step-title">3. 税费分析</div>
                    <div class="cost-table">
                        <div class="table-section">
                            <div class="section-title" style="color: #e65100;">销项税计算：</div>
                            <div class="section-note">
                                销项税是基于不含税售价计算的，计算步骤如下：
                            </div>
                            <table>
                                <tr>
                                    <td>含税售价</td>
                                    <td class="formula">${priceInfo.finalPrice.toFixed(2)}</td>
                                    <td class="amount">${priceInfo.finalPrice.toFixed(2)}元</td>
                                </tr>
                                <tr>
                                    <td>不含税售价</td>
                                    <td class="formula">${priceInfo.finalPrice.toFixed(2)} ÷ (1 + ${(inputs.outputTaxRate*100).toFixed(0)}%)</td>
                                    <td class="amount">${(priceInfo.finalPrice/(1+inputs.outputTaxRate)).toFixed(2)}元</td>
                                </tr>
                                <tr>
                                    <td>销项税额（${(inputs.outputTaxRate*100).toFixed(0)}%）</td>
                                    <td class="formula">${(priceInfo.finalPrice/(1+inputs.outputTaxRate)).toFixed(2)} × ${(inputs.outputTaxRate*100).toFixed(0)}%</td>
                                    <td class="amount">${priceInfo.outputVAT.toFixed(2)}元</td>
                                </tr>
                                <tr>
                                    <td>占含税售价比例</td>
                                    <td class="formula">${priceInfo.outputVAT.toFixed(2)} ÷ ${priceInfo.finalPrice.toFixed(2)} × 100%</td>
                                    <td class="amount">${(priceInfo.outputVAT/priceInfo.finalPrice*100).toFixed(1)}%</td>
                                </tr>
                            </table>
                        </div>

                        <div class="table-section">
                            <div class="section-title" style="color: #2ea44f;">进项税抵扣：</div>
                            <div class="section-note">
                                进项税包括商品、广告费和平台佣金的可抵扣税额：
                            </div>
                            <table>
                                <tr>
                                    <td>商品进项税（${(inputs.outputTaxRate*100).toFixed(0)}%）</td>
                                    <td class="formula">${purchaseCost.purchasePrice.toFixed(2)} × ${(inputs.outputTaxRate*100).toFixed(0)}%</td>
                                    <td class="amount">${purchaseCost.purchaseVAT.toFixed(2)}元</td>
                                </tr>
                                <tr>
                                    <td>广告费进项税（6%）</td>
                                    <td class="formula">${(adCost / salesCost.effectiveRate).toFixed(2)} × 6%</td>
                                    <td class="amount">${priceInfo.adVAT.toFixed(2)}元</td>
                                </tr>
                                <tr>
                                    <td>平台佣金进项税（6%）</td>
                                    <td class="formula">${priceInfo.platformFee.toFixed(2)} × 6%</td>
                                    <td class="amount">${(priceInfo.platformFee * 0.06).toFixed(2)}元</td>
                                </tr>
                                <tr class="total">
                                    <td>可抵扣进项税合计</td>
                                    <td class="formula"></td>
                                    <td class="amount">${priceInfo.totalVATDeduction.toFixed(2)}元</td>
                                </tr>
                                <tr>
                                    <td>占含税售价比例</td>
                                    <td class="formula">${priceInfo.totalVATDeduction.toFixed(2)} ÷ ${priceInfo.finalPrice.toFixed(2)} × 100%</td>
                                    <td class="amount">${(priceInfo.totalVATDeduction/priceInfo.finalPrice*100).toFixed(1)}%</td>
                                </tr>
                            </table>
                        </div>

                        <div class="table-section">
                            <div class="section-title">实际税负：</div>
                            <table>
                                <tr>
                                    <td>销项税</td>
                                    <td class="amount" style="color: #e65100;">+${priceInfo.outputVAT.toFixed(2)}元</td>
                                </tr>
                                <tr>
                                    <td>可抵扣进项税</td>
                                    <td class="amount" style="color: #2ea44f;">-${priceInfo.totalVATDeduction.toFixed(2)}元</td>
                                </tr>
                                <tr class="total">
                                    <td>实际应缴税额</td>
                                    <td class="amount">${priceInfo.actualVAT.toFixed(2)}元</td>
                                </tr>
                                <tr>
                                    <td>占含税售价比例</td>
                                    <td class="amount">${(priceInfo.actualVAT/priceInfo.finalPrice*100).toFixed(1)}%</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="step-section">
                    <div class="step-title">4. 最终利润分析</div>
                    <div class="cost-table">
                        <div class="table-section">
                            <div class="section-title">收入分析：</div>
                            <table>
                                <tr>
                                    <td>含税销售收入</td>
                                    <td class="amount">${priceInfo.finalPrice.toFixed(2)}元</td>
                                </tr>
                                <tr>
                                    <td>不含税销售收入</td>
                                    <td class="formula">${priceInfo.finalPrice.toFixed(2)} ÷ (1 + ${(inputs.outputTaxRate*100).toFixed(0)}%)</td>
                                    <td class="amount">${(priceInfo.finalPrice/(1+inputs.outputTaxRate)).toFixed(2)}元</td>
                                </tr>
                            </table>
                        </div>

                        <div class="table-section">
                            <div class="section-title">成本构成：</div>
                            <table>
                                <tr>
                                    <td colspan="2">1. 基础成本</td>
                                    <td class="amount">${purchaseCost.effectiveCost.toFixed(2)}元</td>
                                    <td class="percent">${(purchaseCost.effectiveCost/priceInfo.finalPrice*100).toFixed(1)}%</td>
                                </tr>
                                <tr>
                                    <td colspan="2">2. 销售费用：</td>
                                    <td class="amount">${(priceInfo.platformFee + salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance + salesCost.operationalCosts.other + (adCost / salesCost.effectiveRate)).toFixed(2)}元</td>
                                    <td class="percent">${((priceInfo.platformFee + salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance + salesCost.operationalCosts.other + (adCost / salesCost.effectiveRate))/priceInfo.finalPrice*100).toFixed(1)}%</td>
                                </tr>
                                <tr>
                                    <td width="20px"></td>
                                    <td>• 平台佣金（可退回）</td>
                                    <td class="amount">${priceInfo.platformFee.toFixed(2)}元</td>
                                    <td class="percent">${(priceInfo.platformFee/priceInfo.finalPrice*100).toFixed(1)}%</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>• 广告费用（分摊后）</td>
                                    <td class="amount">${(adCost / salesCost.effectiveRate).toFixed(2)}元</td>
                                    <td class="percent">${((adCost / salesCost.effectiveRate)/priceInfo.finalPrice*100).toFixed(1)}%</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>• 物流费（分摊后）</td>
                                    <td class="amount">${salesCost.operationalCosts.shipping.toFixed(2)}元</td>
                                    <td class="percent">${(salesCost.operationalCosts.shipping/priceInfo.finalPrice*100).toFixed(1)}%</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>• 运费险（分摊后）</td>
                                    <td class="amount">${salesCost.operationalCosts.insurance.toFixed(2)}元</td>
                                    <td class="percent">${(salesCost.operationalCosts.insurance/priceInfo.finalPrice*100).toFixed(1)}%</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>• 其他成本（分摊后）</td>
                                    <td class="amount">${salesCost.operationalCosts.other.toFixed(2)}元</td>
                                    <td class="percent">${(salesCost.operationalCosts.other/priceInfo.finalPrice*100).toFixed(1)}%</td>
                                </tr>
                                <tr>
                                    <td colspan="2">3. 税费支出（净额）</td>
                                    <td class="amount">${priceInfo.actualVAT.toFixed(2)}元</td>
                                    <td class="percent">${(priceInfo.actualVAT/priceInfo.finalPrice*100).toFixed(1)}%</td>
                                </tr>
                                <tr class="total">
                                    <td colspan="2">总成本</td>
                                    <td class="amount">${(purchaseCost.effectiveCost + priceInfo.platformFee + salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance + salesCost.operationalCosts.other + (adCost / salesCost.effectiveRate) + priceInfo.actualVAT).toFixed(2)}元</td>
                                    <td class="percent">${((purchaseCost.effectiveCost + priceInfo.platformFee + salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance + salesCost.operationalCosts.other + (adCost / salesCost.effectiveRate) + priceInfo.actualVAT)/priceInfo.finalPrice*100).toFixed(1)}%</td>
                                </tr>
                            </table>
                        </div>

                        <div class="table-section">
                            <div class="section-title" style="color: #2ea44f;">最终利润：</div>
                            <table>
                                <tr>
                                    <td>销售收入</td>
                                    <td class="amount">+${priceInfo.finalPrice.toFixed(2)}元</td>
                                    <td class="percent">100%</td>
                                </tr>
                                <tr>
                                    <td>总成本</td>
                                    <td class="amount" style="color: #e65100;">-${(purchaseCost.effectiveCost + priceInfo.platformFee + salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance + salesCost.operationalCosts.other + (adCost / salesCost.effectiveRate) + priceInfo.actualVAT).toFixed(2)}元</td>
                                    <td class="percent">${((purchaseCost.effectiveCost + priceInfo.platformFee + salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance + salesCost.operationalCosts.other + (adCost / salesCost.effectiveRate) + priceInfo.actualVAT)/priceInfo.finalPrice*100).toFixed(1)}%</td>
                                </tr>
                                <tr class="total">
                                    <td>实际利润</td>
                                    <td class="amount" style="color: #2ea44f;">${priceInfo.profit.toFixed(2)}元</td>
                                    <td class="percent">${priceInfo.profitRate}%</td>
                                </tr>
                            </table>
                            <div style="margin-top: 0.5rem; font-size: 0.85rem; color: #666;">
                                注：所有百分比均基于含税销售收入计算。不可退回费用已按退货率${(salesCost.returnRate*100).toFixed(0)}%分摊。
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
