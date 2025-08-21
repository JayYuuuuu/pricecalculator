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
    `;
}
