// 生成结果HTML
function generateResultHtml({ purchaseCost, salesCost, priceInfo, inputs }) {
    const adCost = priceInfo.adCost;
    // 计算总成本：进货成本 + 销售费用 + 税费支出
    const totalCost = purchaseCost.effectiveCost + 
                     (priceInfo.platformFee + salesCost.operationalCosts.shipping + salesCost.operationalCosts.insurance + salesCost.operationalCosts.other + (adCost / salesCost.effectiveRate)) + 
                     priceInfo.actualVAT;
    
    return `
        <div class="final-price">
            <div class="price-label">实际利润</div>
            <div class="price-value">¥ ${priceInfo.profit.toFixed(2)}</div>
            <div class="price-hint">利润率：${priceInfo.profitRate}%</div>
            <div class="price-hint" style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">
                利润率说明：利润 ÷ 含税售价，利润中已扣除退货带来的损失（如退不回的运费、广告费）
            </div>
            <div class="price-hint" style="font-size: 0.85rem; color: #2ea44f; margin-top: 0.25rem;">
                保本ROI（有效GMV÷广告费）：${(function(){
                    try{
                        // 从实际结果反推销项税率：salesTaxRate = outputVAT / netPrice
                        const netPrice = (priceInfo.finalPrice - priceInfo.outputVAT);
                        const salesTaxRate = netPrice > 0 ? (priceInfo.outputVAT / netPrice) : 0;
                        const roiRes = calculateBreakevenROI({
                            costPrice: purchaseCost.purchasePrice,
                            inputTaxRate: inputs.inputTaxRate,
                            outputTaxRate: inputs.outputTaxRate,
                            salesTaxRate: salesTaxRate,
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
                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">含税售价</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: #0066cc;">¥${priceInfo.finalPrice.toFixed(2)}</div>
                </div>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">总成本</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: #e65100;">¥${totalCost.toFixed(2)}</div>
                </div>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">税费支出</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: #e65100;">¥${priceInfo.actualVAT.toFixed(2)}</div>
                </div>
            </div>
        </div>
    `;
}
