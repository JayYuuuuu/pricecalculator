// 商品清单示例数据（独立文件）
// 说明：
// - 本文件用于集中维护"插入示例"所使用的示例行，便于后期统一修改与扩展
// - 数据口径需与 `js/calculator.js` 中的清单字段一致
// - 价格、成本、退货率等字段请填写与页面一致的口径（退货率可用百分比字符串或小数）

// 全局变量：页面通过 <script> 标签引入后可直接读取
// 注意：保持字段名称与清单一致：name, sku, platform, salePrice, salePriceTiers, returnRate, costTiers, costMin, costMax
window.CATALOG_SAMPLE_ROWS = [
	// 淘宝平台商品
	// 摇粒绒马甲 - 单一售价 + 单一进货价
	{ name:'摇粒绒马甲', sku:'HYXB50001', platform:'淘宝', salePrice:58, returnRate:'13.99%', costTiers:[22.5] },
	// 色纱空气层单裤 - 多档售价 + 多档进货价
	{ name:'色纱空气层单裤', sku:'FWL240331', platform:'淘宝', salePrice:0, salePriceTiers:[59.80, 65.80, 69.80], returnRate:'23.15%', costTiers:[27.00, 29.50, 32.00] },
	// 暖阳绒 - 单一售价 + 单一进货价
	{ name:'暖阳绒', sku:'HYXY8101', platform:'淘宝', salePrice:79.8, returnRate:'10.82%', costTiers:[38] },
	// 绵绵绒上衣 - 单一售价 + 多档进货价
	{ name:'绵绵绒上衣', sku:'FWL240441', platform:'淘宝', salePrice:44.1, returnRate:'14.27%', costTiers:[18.50, 20.50] },
	// 色纱棉毛 - 单一售价 + 单一进货价
	{ name:'色纱棉毛', sku:'HYXY50001', platform:'淘宝', salePrice:89.1, returnRate:'8.89%', costTiers:[44] },
	// 色纱加绒 - 单一售价 + 单一进货价
	{ name:'色纱加绒', sku:'HYXY60001', platform:'淘宝', salePrice:125.1, returnRate:'12.67%', costTiers:[62] },
	// 鸿运礼盒 - 单一售价 + 单一进货价
	{ name:'鸿运礼盒', sku:'HYX2889', platform:'淘宝', salePrice:69.8, returnRate:'6.58%', costTiers:[33] },
	// 鸿运内裤 - 单一售价 + 多档进货价
	{ name:'鸿运内裤', sku:'HYXN3061', platform:'淘宝', salePrice:69.8, returnRate:'6.39%', costTiers:[29.50, 31.00, 33.50] },
	// 纯色棉毛 - 多档售价 + 多档进货价
	{ name:'纯色棉毛', sku:'HYX19585', platform:'淘宝', salePrice:0, salePriceTiers:[62.10, 62.10, 71.10], returnRate:'9.40%', costTiers:[33.50, 38.50, 42.00] },
	// 纯棉印花棉毛 - 单一售价 + 单一进货价
	{ name:'纯棉印花棉毛', sku:'HYX2021', platform:'淘宝', salePrice:69.98, returnRate:'9.14%', costTiers:[35] },
	// 纯棉印花棉毛 - 单一售价 + 单一进货价
	{ name:'纯棉印花棉毛', sku:'HYX2221', platform:'淘宝', salePrice:79.98, returnRate:'6.92%', costTiers:[43.5] },
	// 空气层套装 - 多档售价 + 多档进货价
	{ name:'空气层套装', sku:'FWL240131', platform:'淘宝', salePrice:0, salePriceTiers:[99.00, 108.00, 115.50], returnRate:'13.08%', costTiers:[50.00, 52.50, 56.00] },
	// 德绒背心 - 单一售价 + 多档进货价
	{ name:'德绒背心', sku:'HYX2140', platform:'淘宝', salePrice:79, returnRate:'9.14%', costTiers:[24.30, 30.30, 33.80] },
	// 德绒套装（不贴片） - 单一售价 + 单一进货价
	{ name:'德绒套装（不贴片）', sku:'HYX2101', platform:'淘宝', salePrice:129, returnRate:'8.47%', costTiers:[64] },
	// 德绒套装（贴片） - 单一售价 + 单一进货价
	{ name:'德绒套装（贴片）', sku:'HYX21011-1', platform:'淘宝', salePrice:149, returnRate:'4.55%', costTiers:[67] },
	// 德绒运动套装 - 单一售价 + 单一进货价
	{ name:'德绒运动套装', sku:'HYX2151', platform:'淘宝', salePrice:139, returnRate:'10.58%', costTiers:[68.5] },
	// 大红棉毛 - 多档售价 + 多档进货价
	{ name:'大红棉毛', sku:'HYX17100', platform:'淘宝', salePrice:0, salePriceTiers:[71.10, 71.10, 80.10], returnRate:'7.99%', costTiers:[37.50, 40.50, 44.00] },
	// 色纱空气层马甲 - 单一售价 + 单一进货价
	{ name:'色纱空气层马甲', sku:'FWL240231', platform:'淘宝', salePrice:59.4, returnRate:'15.22%', costTiers:[27] },
	// 蜂巢马甲 - 单一售价 + 单一进货价
	{ name:'蜂巢马甲', sku:'FWL240251', platform:'淘宝', salePrice:99, returnRate:'16.06%', costTiers:[47] },
	// 蜂巢裤子 - 单一售价 + 单一进货价
	{ name:'蜂巢裤子', sku:'FWL240351', platform:'淘宝', salePrice:99, returnRate:'26.87%', costTiers:[47] },
	// 蜂巢上衣 - 单一售价 + 单一进货价
	{ name:'蜂巢上衣', sku:'FWL240451', platform:'淘宝', salePrice:118.8, returnRate:'21.11%', costTiers:[56] },
	// 棉莱卡内衣 - 单一售价 + 单一进货价
	{ name:'棉莱卡内衣', sku:'HYXY70001', platform:'淘宝', salePrice:89.1, returnRate:'10.44%', costTiers:[46] },
	// 纯棉秋裤 - 多档售价 + 多档进货价
	{ name:'纯棉秋裤', sku:'HYX1813', platform:'淘宝', salePrice:0, salePriceTiers:[35.10, 39.60, 44.10, 44.10], returnRate:'6.85%', costTiers:[17.00, 18.50, 20.00, 21.50] },
	// 色纱加绒单裤 - 多档售价 + 多档进货价
	{ name:'色纱加绒单裤', sku:'FWL240361', platform:'淘宝', salePrice:0, salePriceTiers:[69.30, 79.20, 89.10], returnRate:'28.85%', costTiers:[31.00, 37.00, 43.00] },
	// 莫代尔内裤 - 单一售价 + 多档进货价
	{ name:'莫代尔内裤', sku:'HYXN3081', platform:'淘宝', salePrice:79.8, returnRate:'7.26%', costTiers:[30.50, 32.00] },
	// 网眼内裤三条 - 单一售价 + 多档进货价
	{ name:'网眼内裤三条', sku:'HYXN94341', platform:'淘宝', salePrice:69, returnRate:'5.10%', costTiers:[26.50, 28.00, 29.50] },
	// 网眼内裤4条 - 单一售价 + 多档进货价
	{ name:'网眼内裤4条', sku:'FWL2505541', platform:'淘宝', salePrice:79.8, returnRate:'5.10%', costTiers:[30.50, 33.00] },
	// 胖童内裤 - 单一售价 + 单一进货价
	{ name:'胖童内裤', sku:'HYXN11221', platform:'淘宝', salePrice:59, returnRate:'10.95%', costTiers:[25.5] },
	// 纯棉内裤3条 - 多档售价 + 多档进货价
	{ name:'纯棉内裤3条', sku:'HYX1801', platform:'淘宝', salePrice:0, salePriceTiers:[53.10, 53.10, 62.10], returnRate:'5.03%', costTiers:[27.50, 29.00, 30.50] },
	// 纯棉内裤4条常规 - 单一售价 + 多档进货价
	{ name:'纯棉内裤4条常规', sku:'HYX2003', platform:'淘宝', salePrice:69.75, returnRate:'3.99%', costTiers:[36.50, 39.50] },
	// 纯棉内裤4条小童 - 单一售价 + 多档进货价
	{ name:'纯棉内裤4条小童', sku:'FWL2405141', platform:'淘宝', salePrice:69.75, returnRate:'6.23%', costTiers:[28.50, 30.00] },
	// 纯棉内裤3条 - 单一售价 + 多档进货价
	{ name:'纯棉内裤3条', sku:'FWL2505131', platform:'淘宝', salePrice:59, returnRate:'4.82%', costTiers:[23.40, 25.00] },
	// 空气层加绒套装 - 多档售价 + 多档进货价
	{ name:'空气层加绒套装', sku:'FWL240161', platform:'淘宝', salePrice:0, salePriceTiers:[125.10, 134.10, 143.10], returnRate:'14.87%', costTiers:[59.00, 64.00, 69.00] },
	// 羊毛衫 - 多档售价 + 多档进货价
	{ name:'羊毛衫', sku:'JYMBQ2262A', platform:'淘宝', salePrice:0, salePriceTiers:[229.00, 239.00, 249.00, 289.00, 299.00, 309.00, 319.00, 329.00], returnRate:'25.00%', costTiers:[147.00, 157.00, 157.00, 167.00, 167.00, 177.00, 182.00, 192.00] },
	// 全棉针织衫 - 多档售价 + 多档进货价
	{ name:'全棉针织衫', sku:'HG03HDCJB', platform:'淘宝', salePrice:0, salePriceTiers:[109.00, 129.00], returnRate:'23.84%', costTiers:[62.00, 72.00] },
	// 加绒单上衣 - 单一售价 + 单一进货价
	{ name:'加绒单上衣', sku:'HYXC60001', platform:'淘宝', salePrice:79, returnRate:'16.04%', costTiers:[36] },
	// 绵绵绒套装 - 多档售价 + 多档进货价
	{ name:'绵绵绒套装', sku:'FWL240141', platform:'淘宝', salePrice:0, salePriceTiers:[59.40, 62.10], returnRate:'8.66%', costTiers:[29.00, 30.50] },
	// 空气层马甲（老） - 单一售价 + 单一进货价
	{ name:'空气层马甲（老）', sku:'HYXB8401', platform:'淘宝', salePrice:59.4, returnRate:'15.58%', costTiers:[25.5] },
	
	// 天猫平台商品
	// 色纱空气层单裤 - 多档售价 + 多档进货价
	{ name:'色纱空气层单裤', sku:'FWL240331', platform:'天猫', salePrice:0, salePriceTiers:[59.80, 65.80, 69.80], returnRate:'22.10%', costTiers:[27.00, 29.50, 32.00] },
	// 暖阳绒 - 单一售价 + 单一进货价
	{ name:'暖阳绒', sku:'HYXY8101', platform:'天猫', salePrice:79.8, returnRate:'10.24%', costTiers:[38] },
	// 绵绵绒上衣 - 单一售价 + 多档进货价
	{ name:'绵绵绒上衣', sku:'FWL240441', platform:'天猫', salePrice:44.1, returnRate:'9.74%', costTiers:[18.50, 20.50] },
	// 色纱棉毛 - 单一售价 + 单一进货价
	{ name:'色纱棉毛', sku:'HYXY50001', platform:'天猫', salePrice:89.1, returnRate:'10.55%', costTiers:[44] },
	// 色纱加绒 - 单一售价 + 单一进货价
	{ name:'色纱加绒', sku:'HYXY60001', platform:'天猫', salePrice:125.1, returnRate:'11.17%', costTiers:[62] },
	// 鸿运礼盒 - 单一售价 + 单一进货价
	{ name:'鸿运礼盒', sku:'HYX2889', platform:'天猫', salePrice:69.8, returnRate:'5.92%', costTiers:[33] },
	// 鸿运内裤 - 单一售价 + 多档进货价
	{ name:'鸿运内裤', sku:'HYXN3061', platform:'天猫', salePrice:69.8, returnRate:'7.16%', costTiers:[29.50, 31.00, 33.50] },
	// 纯色棉毛 - 多档售价 + 多档进货价
	{ name:'纯色棉毛', sku:'HYX19585', platform:'天猫', salePrice:0, salePriceTiers:[62.10, 62.10, 71.10], returnRate:'8.23%', costTiers:[33.50, 38.50, 42.00] },
	// 纯棉印花棉毛 - 单一售价 + 单一进货价
	{ name:'纯棉印花棉毛', sku:'HYX2021', platform:'天猫', salePrice:69.98, returnRate:'8.87%', costTiers:[35] },
	// 纯棉印花棉毛 - 单一售价 + 单一进货价
	{ name:'纯棉印花棉毛', sku:'HYX2221', platform:'天猫', salePrice:79.98, returnRate:'7.21%', costTiers:[43.5] },
	// 空气层套装 - 多档售价 + 多档进货价
	{ name:'空气层套装', sku:'FWL240131', platform:'天猫', salePrice:0, salePriceTiers:[99.00, 108.00, 115.50], returnRate:'13.29%', costTiers:[50.00, 52.50, 56.00] },
	// 德绒背心 - 单一售价 + 多档进货价
	{ name:'德绒背心', sku:'HYX2140', platform:'天猫', salePrice:79, returnRate:'8.00%', costTiers:[24.30, 30.30, 33.80] },
	// 德绒套装（不贴片） - 单一售价 + 单一进货价
	{ name:'德绒套装（不贴片）', sku:'HYX2101', platform:'天猫', salePrice:129, returnRate:'10.71%', costTiers:[64] },
	// 德绒套装（贴片） - 单一售价 + 单一进货价
	{ name:'德绒套装（贴片）', sku:'HYX21011-1', platform:'天猫', salePrice:149, returnRate:'9.09%', costTiers:[67] },
	// 德绒运动套装 - 单一售价 + 单一进货价
	{ name:'德绒运动套装', sku:'HYX2151', platform:'天猫', salePrice:139, returnRate:'14.71%', costTiers:[68.5] },
	// 大红棉毛 - 多档售价 + 多档进货价
	{ name:'大红棉毛', sku:'HYX17100', platform:'天猫', salePrice:0, salePriceTiers:[71.10, 71.10, 80.10], returnRate:'8.17%', costTiers:[37.50, 40.50, 44.00] },
	// 色纱空气层马甲 - 单一售价 + 单一进货价
	{ name:'色纱空气层马甲', sku:'FWL240231', platform:'天猫', salePrice:59.4, returnRate:'17.14%', costTiers:[27] },
	// 蜂巢马甲 - 单一售价 + 单一进货价
	{ name:'蜂巢马甲', sku:'FWL240251', platform:'天猫', salePrice:99, returnRate:'21.71%', costTiers:[47] },
	// 蜂巢裤子 - 单一售价 + 单一进货价
	{ name:'蜂巢裤子', sku:'FWL240351', platform:'天猫', salePrice:99, returnRate:'23.75%', costTiers:[47] },
	// 蜂巢上衣 - 单一售价 + 单一进货价
	{ name:'蜂巢上衣', sku:'FWL240451', platform:'天猫', salePrice:118.8, returnRate:'16.67%', costTiers:[56] },
	// 棉莱卡内衣 - 单一售价 + 单一进货价
	{ name:'棉莱卡内衣', sku:'HYXY70001', platform:'天猫', salePrice:89.1, returnRate:'6.19%', costTiers:[46] },
	// 纯棉秋裤 - 多档售价 + 多档进货价
	{ name:'纯棉秋裤', sku:'HYX1813', platform:'天猫', salePrice:0, salePriceTiers:[35.10, 39.60, 44.10, 44.10], returnRate:'6.83%', costTiers:[17.00, 18.50, 20.00, 21.50] },
	// 色纱加绒单裤 - 多档售价 + 多档进货价
	{ name:'色纱加绒单裤', sku:'FWL240361', platform:'天猫', salePrice:0, salePriceTiers:[69.30, 79.20, 89.10], returnRate:'25.09%', costTiers:[31.00, 37.00, 43.00] },
	// 莫代尔内裤 - 单一售价 + 多档进货价
	{ name:'莫代尔内裤', sku:'HYXN3081', platform:'天猫', salePrice:79.8, returnRate:'7.85%', costTiers:[30.50, 32.00] },
	// 网眼内裤三条 - 单一售价 + 多档进货价
	{ name:'网眼内裤三条', sku:'HYXN94341', platform:'天猫', salePrice:69, returnRate:'5.47%', costTiers:[26.50, 28.00, 29.50] },
	// 网眼内裤4条 - 单一售价 + 多档进货价
	{ name:'网眼内裤4条', sku:'FWL2505541', platform:'天猫', salePrice:79.8, returnRate:'5.10%', costTiers:[30.50, 33.00] },
	// 胖童内裤 - 单一售价 + 单一进货价
	{ name:'胖童内裤', sku:'HYXN11221', platform:'天猫', salePrice:59, returnRate:'8.41%', costTiers:[25.5] },
	// 纯棉内裤3条 - 多档售价 + 多档进货价
	{ name:'纯棉内裤3条', sku:'HYX1801', platform:'天猫', salePrice:0, salePriceTiers:[53.10, 53.10, 62.10], returnRate:'3.81%', costTiers:[27.50, 29.00, 30.50] },
	// 纯棉内裤4条常规 - 单一售价 + 多档进货价
	{ name:'纯棉内裤4条常规', sku:'HYX2003', platform:'天猫', salePrice:69.75, returnRate:'3.22%', costTiers:[36.50, 39.50] },
	// 纯棉内裤4条小童 - 单一售价 + 多档进货价
	{ name:'纯棉内裤4条小童', sku:'FWL2405141', platform:'天猫', salePrice:69.75, returnRate:'0.00%', costTiers:[28.50, 30.00] },
	// 纯棉内裤3条 - 单一售价 + 多档进货价
	{ name:'纯棉内裤3条', sku:'FWL2505131', platform:'天猫', salePrice:59, returnRate:'4.84%', costTiers:[23.40, 25.00] },
	// 加绒单上衣 - 单一售价 + 单一进货价
	{ name:'加绒单上衣', sku:'HYXC60001', platform:'天猫', salePrice:79, returnRate:'18.60%', costTiers:[36] },
	// 绵绵绒套装 - 多档售价 + 多档进货价
	{ name:'绵绵绒套装', sku:'FWL240141', platform:'天猫', salePrice:0, salePriceTiers:[59.40, 62.10], returnRate:'3.45%', costTiers:[29.00, 30.50] },
	// 空气层马甲（老） - 单一售价 + 单一进货价
	{ name:'空气层马甲（老）', sku:'HYXB8401', platform:'天猫', salePrice:59.4, returnRate:'17.12%', costTiers:[25.5] }
];


