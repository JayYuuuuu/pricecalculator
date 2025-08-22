// 商品清单示例数据（独立文件）
// 版本号：v1.0.2 (2025-08-22)
// 说明：
// - 本文件用于集中维护"插入示例"所使用的示例行，便于后期统一修改与扩展
// - 数据口径需与 `js/calculator.js` 中的清单字段一致
// - 价格、成本、退货率等字段请填写与页面一致的口径（退货率可用百分比字符串或小数）
// - 主推款标识：isMainProduct: true 表示该商品为主推款
// 
// ⚠️ 重要提醒：每次更新示例数据后，请同时更新HTML文件中的版本号！
// 更新方法：在index.html中找到 <script src="js/catalog-samples.js"></script>
// 修改为：<script src="js/catalog-samples.js?v=新版本号"></script>
// 例如：<script src="js/catalog-samples.js?v=1.0.2"></script>
// 
// 版本历史：
// v1.0.2 (2025-08-22) - 更新示例数据
// v1.0.1 (2024-12-01) - 新增25条示例数据，包括奥粒绒、火山石、德绒等系列商品
// v1.0.0 (初始版本) - 基础示例数据

// 全局变量：页面通过 <script> 标签引入后可直接读取
// 注意：保持字段名称与清单一致：name, sku, platform, salePrice, salePriceTiers, returnRate, costTiers, costMin, costMax, isMainProduct
window.CATALOG_SAMPLE_ROWS = [
	// 淘宝平台商品
	// 摇粒绒马甲 - 单一售价 + 单一进货价
	{ name:'摇粒绒马甲', sku:'HYXB50001', platform:'淘宝', salePrice:58, returnRate:'13.99%', costTiers:[22.5], isMainProduct: false },
	// 色纱空气层单裤 - 多档售价 + 多档进货价
	{ name:'色纱空气层单裤', sku:'FWL240331', platform:'淘宝', salePrice:0, salePriceTiers:[59.80, 65.80, 69.80], returnRate:'23.15%', costTiers:[27.00, 29.50, 32.00], isMainProduct: true },
	// 暖阳绒 - 单一售价 + 单一进货价
	{ name:'暖阳绒', sku:'HYXY8101', platform:'淘宝', salePrice:79.8, returnRate:'10.82%', costTiers:[38], isMainProduct: true },
	// 绵绵绒上衣 - 单一售价 + 多档进货价
	{ name:'绵绵绒上衣', sku:'FWL240441', platform:'淘宝', salePrice:49.8, returnRate:'14.27%', costTiers:[18.50, 20.50], isMainProduct: false },
	// 色纱棉毛 - 单一售价 + 单一进货价
	{ name:'色纱棉毛', sku:'HYXY50001', platform:'淘宝', salePrice:89.1, returnRate:'8.89%', costTiers:[44], isMainProduct: true },
	// 色纱加绒 - 单一售价 + 单一进货价
	{ name:'色纱加绒', sku:'HYXY60001', platform:'淘宝', salePrice:129, returnRate:'12.67%', costTiers:[62], isMainProduct: true },
	// 鸿运礼盒 - 单一售价 + 单一进货价
	{ name:'鸿运礼盒', sku:'HYX2889', platform:'淘宝', salePrice:69.8, returnRate:'6.58%', costTiers:[33], isMainProduct: true },
	// 鸿运内裤 - 单一售价 + 多档进货价
	{ name:'鸿运内裤', sku:'HYXN3061', platform:'淘宝', salePrice:69.8, returnRate:'6.39%', costTiers:[29.50, 31.00, 33.50], isMainProduct: true },
	// 纯色棉毛 - 多档售价 + 多档进货价
	{ name:'纯色棉毛', sku:'HYX19585', platform:'淘宝', salePrice:0, salePriceTiers:[62.10, 62.10, 71.10], returnRate:'9.40%', costTiers:[33.50, 38.50, 42.00], isMainProduct: false },
	// 纯棉印花棉毛 - 单一售价 + 单一进货价
	{ name:'纯棉印花棉毛', sku:'HYX2021', platform:'淘宝', salePrice:69.98, returnRate:'9.14%', costTiers:[35], isMainProduct: true },
	// 纯棉印花棉毛 - 单一售价 + 单一进货价
	{ name:'纯棉印花棉毛', sku:'HYX2221', platform:'淘宝', salePrice:79.98, returnRate:'6.92%', costTiers:[43.5], isMainProduct: false },
	// 空气层套装 - 多档售价 + 多档进货价
	{ name:'空气层套装', sku:'FWL240131', platform:'淘宝', salePrice:0, salePriceTiers:[99.00, 108.00, 115.50], returnRate:'13.08%', costTiers:[50.00, 52.50, 56.00], isMainProduct: false },
	// 德绒背心 - 单一售价 + 多档进货价
	{ name:'德绒背心', sku:'HYX2140', platform:'淘宝', salePrice:79, returnRate:'9.14%', costTiers:[24.30, 30.30, 33.80], isMainProduct: true },
	// 德绒套装（不贴片） - 单一售价 + 单一进货价
	{ name:'德绒套装（不贴片）', sku:'HYX2101', platform:'淘宝', salePrice:129, returnRate:'8.47%', costTiers:[64], isMainProduct: false },
	// 德绒套装（贴片） - 单一售价 + 单一进货价
	{ name:'德绒套装（贴片）', sku:'HYX21011-1', platform:'淘宝', salePrice:149, returnRate:'4.55%', costTiers:[67], isMainProduct: false },
	// 德绒运动套装 - 单一售价 + 单一进货价
	{ name:'德绒运动套装', sku:'HYX2151', platform:'淘宝', salePrice:139, returnRate:'10.58%', costTiers:[68.5], isMainProduct: false },
	// 大红棉毛 - 多档售价 + 多档进货价
	{ name:'大红棉毛', sku:'HYX17100', platform:'淘宝', salePrice:0, salePriceTiers:[71.10, 71.10, 80.10], returnRate:'7.99%', costTiers:[37.50, 40.50, 44.00], isMainProduct: false },
	// 色纱空气层马甲 - 单一售价 + 单一进货价
	{ name:'色纱空气层马甲', sku:'FWL240231', platform:'淘宝', salePrice:59.4, returnRate:'15.22%', costTiers:[27], isMainProduct: true },
	// 蜂巢马甲 - 单一售价 + 单一进货价
	{ name:'蜂巢马甲', sku:'FWL240251', platform:'淘宝', salePrice:99, returnRate:'16.06%', costTiers:[47], isMainProduct: false },
	// 蜂巢裤子 - 单一售价 + 单一进货价
	{ name:'蜂巢裤子', sku:'FWL240351', platform:'淘宝', salePrice:99, returnRate:'26.87%', costTiers:[47], isMainProduct: false },
	// 蜂巢上衣 - 单一售价 + 单一进货价
	{ name:'蜂巢上衣', sku:'FWL240451', platform:'淘宝', salePrice:118.8, returnRate:'21.11%', costTiers:[56], isMainProduct: false },
	// 棉莱卡内衣 - 单一售价 + 单一进货价
	{ name:'棉莱卡内衣', sku:'HYXY70001', platform:'淘宝', salePrice:89.1, returnRate:'10.44%', costTiers:[46], isMainProduct: false },
	// 纯棉秋裤 - 多档售价 + 多档进货价
	{ name:'纯棉秋裤', sku:'HYX1813', platform:'淘宝', salePrice:0, salePriceTiers:[35.10, 39.60, 44.10, 44.10], returnRate:'6.85%', costTiers:[17.00, 18.50, 20.00, 21.50], isMainProduct: false },
	// 色纱加绒单裤 - 多档售价 + 多档进货价
	{ name:'色纱加绒单裤', sku:'FWL240361', platform:'淘宝', salePrice:0, salePriceTiers:[69.30, 79.20, 89.10], returnRate:'28.85%', costTiers:[31.00, 37.00, 43.00], isMainProduct: false },
	// 莫代尔内裤 - 单一售价 + 多档进货价
	{ name:'莫代尔内裤', sku:'HYXN3081', platform:'淘宝', salePrice:79.8, returnRate:'7.26%', costTiers:[30.50, 32.00], isMainProduct: false },
	// 网眼内裤3条 - 单一售价 + 多档进货价
	{ name:'网眼内裤3条', sku:'HYXN94341', platform:'淘宝', salePrice:69, returnRate:'5.10%', costTiers:[26.50, 28.00, 29.50], isMainProduct: false },
	// 网眼内裤4条 - 单一售价 + 多档进货价
	{ name:'网眼内裤4条', sku:'FWL2505541', platform:'淘宝', salePrice:79.8, returnRate:'5.10%', costTiers:[30.50, 33.00], isMainProduct: false },
	// 胖童内裤 - 单一售价 + 单一进货价
	{ name:'胖童内裤', sku:'HYXN11221', platform:'淘宝', salePrice:59, returnRate:'10.95%', costTiers:[25.5], isMainProduct: false },
	// 纯棉内裤3条 - 多档售价 + 多档进货价
	{ name:'纯棉内裤3条', sku:'HYX1801', platform:'淘宝', salePrice:0, salePriceTiers:[53.10, 53.10, 62.10], returnRate:'5.03%', costTiers:[27.50, 29.00, 30.50], isMainProduct: false },
	// 纯棉内裤4条常规 - 单一售价 + 多档进货价
	{ name:'纯棉内裤4条常规', sku:'HYX2003', platform:'淘宝', salePrice:69.75, returnRate:'3.99%', costTiers:[36.50, 39.50], isMainProduct: false },
	// 纯棉内裤4条小童 - 单一售价 + 多档进货价
	{ name:'纯棉内裤4条小童', sku:'FWL2405141', platform:'淘宝', salePrice:69.75, returnRate:'6.23%', costTiers:[28.50, 30.00], isMainProduct: false },
	// 纯棉内裤3条 - 单一售价 + 多档进货价
	{ name:'纯棉内裤3条', sku:'FWL2505131', platform:'淘宝', salePrice:59, returnRate:'4.82%', costTiers:[23.40, 25.00], isMainProduct: false },
	// 加绒套装 - 单一售价 + 单一进货价
	{ name:'加绒套装', sku:'HYX1881', platform:'淘宝', salePrice:99, returnRate:'12.87%', costTiers:[58], isMainProduct: false },
	// 空气层加绒套装 - 多档售价 + 多档进货价
	{ name:'空气层加绒套装', sku:'FWL240161', platform:'淘宝', salePrice:0, salePriceTiers:[125.10, 134.10, 143.10], returnRate:'14.87%', costTiers:[59.00, 64.00, 69.00], isMainProduct: false },
	// 羊毛衫 - 多档售价 + 多档进货价
	{ name:'羊毛衫', sku:'JYMBQ2262A', platform:'淘宝', salePrice:0, salePriceTiers:[229.00, 239.00, 249.00, 289.00, 299.00, 309.00, 319.00, 329.00], returnRate:'25.00%', costTiers:[147.00, 157.00, 157.00, 167.00, 167.00, 177.00, 182.00, 192.00], isMainProduct: false },
	// 全棉针织衫 - 多档售价 + 多档进货价
	{ name:'全棉针织衫', sku:'HG03HDCJB', platform:'淘宝', salePrice:0, salePriceTiers:[109.00, 129.00], returnRate:'23.84%', costTiers:[62.00, 72.00], isMainProduct: false },
	// 加绒单上衣 - 单一售价 + 单一进货价
	{ name:'加绒单上衣', sku:'HYXC60001', platform:'淘宝', salePrice:79, returnRate:'16.04%', costTiers:[36], isMainProduct: true },
	// 绵绵绒套装 - 多档售价 + 多档进货价
	{ name:'绵绵绒套装', sku:'FWL240141', platform:'淘宝', salePrice:0, salePriceTiers:[59.80, 69.80], returnRate:'8.66%', costTiers:[29.00, 30.50], isMainProduct: false },
	// 空气层马甲（老） - 单一售价 + 单一进货价
	{ name:'空气层马甲（老）', sku:'HYXB8401', platform:'淘宝', salePrice:59.4, returnRate:'15.58%', costTiers:[25.5], isMainProduct: false },
	
	// 天猫平台商品
	// 色纱空气层单裤 - 多档售价 + 多档进货价
	{ name:'色纱空气层单裤', sku:'FWL240331', platform:'天猫', salePrice:0, salePriceTiers:[59.80, 65.80, 69.80], returnRate:'22.10%', costTiers:[27.00, 29.50, 32.00], isMainProduct: true },
	// 暖阳绒 - 单一售价 + 单一进货价
	{ name:'暖阳绒', sku:'HYXY8101', platform:'天猫', salePrice:79.8, returnRate:'10.24%', costTiers:[38], isMainProduct: true },
	// 绵绵绒上衣 - 单一售价 + 多档进货价
	{ name:'绵绵绒上衣', sku:'FWL240441', platform:'天猫', salePrice:49.8, returnRate:'9.74%', costTiers:[18.50, 20.50], isMainProduct: true },
	// 色纱棉毛 - 单一售价 + 单一进货价
	{ name:'色纱棉毛', sku:'HYXY50001', platform:'天猫', salePrice:89.1, returnRate:'10.55%', costTiers:[44], isMainProduct: true },
	// 色纱加绒 - 单一售价 + 单一进货价
	{ name:'色纱加绒', sku:'HYXY60001', platform:'天猫', salePrice:129, returnRate:'11.17%', costTiers:[62], isMainProduct: true },
	// 鸿运礼盒 - 单一售价 + 单一进货价
	{ name:'鸿运礼盒', sku:'HYX2889', platform:'天猫', salePrice:69.8, returnRate:'5.92%', costTiers:[33], isMainProduct: true },
	// 鸿运内裤 - 单一售价 + 多档进货价
	{ name:'鸿运内裤', sku:'HYXN3061', platform:'天猫', salePrice:69.8, returnRate:'7.16%', costTiers:[29.50, 31.00, 33.50], isMainProduct: true },
	// 纯色棉毛 - 多档售价 + 多档进货价
	{ name:'纯色棉毛', sku:'HYX19585', platform:'天猫', salePrice:0, salePriceTiers:[62.10, 62.10, 71.10], returnRate:'8.23%', costTiers:[33.50, 38.50, 42.00], isMainProduct: false },
	// 纯棉印花棉毛 - 单一售价 + 单一进货价
	{ name:'纯棉印花棉毛', sku:'HYX2021', platform:'天猫', salePrice:69.98, returnRate:'8.87%', costTiers:[35], isMainProduct: true },
	// 纯棉印花棉毛 - 单一售价 + 单一进货价
	{ name:'纯棉印花棉毛', sku:'HYX2221', platform:'天猫', salePrice:79.98, returnRate:'7.21%', costTiers:[43.5], isMainProduct: false },
	// 空气层套装 - 多档售价 + 多档进货价
	{ name:'空气层套装', sku:'FWL240131', platform:'天猫', salePrice:0, salePriceTiers:[99.00, 108.00, 115.50], returnRate:'13.29%', costTiers:[50.00, 52.50, 56.00], isMainProduct: false },
	// 德绒背心 - 单一售价 + 多档进货价
	{ name:'德绒背心', sku:'HYX2140', platform:'天猫', salePrice:79, returnRate:'8.00%', costTiers:[24.30, 30.30, 33.80], isMainProduct: true },
	// 德绒套装（不贴片） - 单一售价 + 单一进货价
	{ name:'德绒套装（不贴片）', sku:'HYX2101', platform:'天猫', salePrice:129, returnRate:'10.71%', costTiers:[64], isMainProduct: false },
	// 德绒套装（贴片） - 单一售价 + 单一进货价
	{ name:'德绒套装（贴片）', sku:'HYX21011-1', platform:'天猫', salePrice:149, returnRate:'9.09%', costTiers:[67], isMainProduct: false },
	// 德绒运动套装 - 单一售价 + 单一进货价
	{ name:'德绒运动套装', sku:'HYX2151', platform:'天猫', salePrice:139, returnRate:'14.71%', costTiers:[68.5], isMainProduct: false },
	// 大红棉毛 - 多档售价 + 多档进货价
	{ name:'大红棉毛', sku:'HYX17100', platform:'天猫', salePrice:0, salePriceTiers:[71.10, 71.10, 80.10], returnRate:'8.17%', costTiers:[37.50, 40.50, 44.00], isMainProduct: false },
	// 色纱空气层马甲 - 单一售价 + 单一进货价
	{ name:'色纱空气层马甲', sku:'FWL240231', platform:'天猫', salePrice:59.4, returnRate:'17.14%', costTiers:[27], isMainProduct: true },
	// 蜂巢马甲 - 单一售价 + 单一进货价
	{ name:'蜂巢马甲', sku:'FWL240251', platform:'天猫', salePrice:99, returnRate:'21.71%', costTiers:[47], isMainProduct: false },
	// 蜂巢裤子 - 单一售价 + 单一进货价
	{ name:'蜂巢裤子', sku:'FWL240351', platform:'天猫', salePrice:99, returnRate:'23.75%', costTiers:[47], isMainProduct: false },
	// 蜂巢上衣 - 单一售价 + 单一进货价
	{ name:'蜂巢上衣', sku:'FWL240451', platform:'天猫', salePrice:118.8, returnRate:'16.67%', costTiers:[56], isMainProduct: false },
	// 棉莱卡内衣 - 单一售价 + 单一进货价
	{ name:'棉莱卡内衣', sku:'HYXY70001', platform:'天猫', salePrice:89.1, returnRate:'6.19%', costTiers:[46], isMainProduct: false },
	// 纯棉秋裤 - 多档售价 + 多档进货价
	{ name:'纯棉秋裤', sku:'HYX1813', platform:'天猫', salePrice:0, salePriceTiers:[35.10, 39.60, 44.10, 44.10], returnRate:'6.83%', costTiers:[17.00, 18.50, 20.00, 21.50], isMainProduct: false },
	// 色纱加绒单裤 - 多档售价 + 多档进货价
	{ name:'色纱加绒单裤', sku:'FWL240361', platform:'天猫', salePrice:0, salePriceTiers:[69.30, 79.20, 89.10], returnRate:'25.09%', costTiers:[31.00, 37.00, 43.00], isMainProduct: false },
	// 莫代尔内裤 - 单一售价 + 多档进货价
	{ name:'莫代尔内裤', sku:'HYXN3081', platform:'天猫', salePrice:79.8, returnRate:'7.85%', costTiers:[30.50, 32.00], isMainProduct: false },
	// 网眼内裤3条 - 单一售价 + 多档进货价
	{ name:'网眼内裤3条', sku:'HYXN94341', platform:'天猫', salePrice:69, returnRate:'5.47%', costTiers:[26.50, 28.00, 29.50], isMainProduct: false },
	// 网眼内裤4条 - 单一售价 + 多档进货价
	{ name:'网眼内裤4条', sku:'FWL2505541', platform:'天猫', salePrice:79.8, returnRate:'5.10%', costTiers:[30.50, 33.00], isMainProduct: false },
	// 胖童内裤 - 单一售价 + 单一进货价
	{ name:'胖童内裤', sku:'HYXN11221', platform:'天猫', salePrice:59, returnRate:'8.41%', costTiers:[25.5], isMainProduct: false },
	// 纯棉内裤3条 - 多档售价 + 多档进货价
	{ name:'纯棉内裤3条', sku:'HYX1801', platform:'天猫', salePrice:0, salePriceTiers:[53.10, 53.10, 62.10], returnRate:'3.81%', costTiers:[27.50, 29.00, 30.50], isMainProduct: false },
	// 纯棉内裤4条常规 - 单一售价 + 多档进货价
	{ name:'纯棉内裤4条常规', sku:'HYX2003', platform:'天猫', salePrice:69.75, returnRate:'3.22%', costTiers:[36.50, 39.50], isMainProduct: false },
	// 纯棉内裤4条小童 - 单一售价 + 多档进货价
	{ name:'纯棉内裤4条小童', sku:'FWL2405141', platform:'天猫', salePrice:69.75, returnRate:'0.00%', costTiers:[28.50, 30.00], isMainProduct: false },
	// 纯棉内裤3条 - 单一售价 + 多档进货价
	{ name:'纯棉内裤3条', sku:'FWL2505131', platform:'天猫', salePrice:59, returnRate:'4.84%', costTiers:[23.40, 25.00], isMainProduct: false },
	// 加绒单上衣 - 单一售价 + 单一进货价
	{ name:'加绒单上衣', sku:'HYXC60001', platform:'天猫', salePrice:79, returnRate:'18.60%', costTiers:[36], isMainProduct: true },
	// 绵绵绒套装 - 多档售价 + 多档进货价
	{ name:'绵绵绒套装', sku:'FWL240141', platform:'天猫', salePrice:0, salePriceTiers:[59.80, 69.80], returnRate:'3.45%', costTiers:[29.00, 30.50], isMainProduct: false },
	// 空气层马甲（老） - 单一售价 + 单一进货价
	{ name:'空气层马甲（老）', sku:'HYXB8401', platform:'天猫', salePrice:59.4, returnRate:'17.12%', costTiers:[25.5], isMainProduct: false },
	
	// 新增示例数据
	// 奥粒绒单裤 - 单一售价 + 单一进货价
	{ name:'奥粒绒单裤', sku:'HYX240381', platform:'淘宝', salePrice:49.5, returnRate:'19.49%', costTiers:[21], isMainProduct: false },
	// 奥粒绒套装 - 单一售价 + 单一进货价
	{ name:'奥粒绒套装', sku:'HYX240181', platform:'淘宝', salePrice:89.1, returnRate:'15.79%', costTiers:[44], isMainProduct: false },
	// 大红背心 - 单一售价 + 单一进货价
	{ name:'大红背心', sku:'HYX18103', platform:'天猫', salePrice:35.9, returnRate:'10.45%', costTiers:[15], isMainProduct: false },
	// 大红背心 - 单一售价 + 单一进货价
	{ name:'大红背心', sku:'HYX18103', platform:'淘宝', salePrice:35.9, returnRate:'9.19%', costTiers:[15], isMainProduct: false },
	// 摇粒绒马甲拉链款 - 单一售价 + 单一进货价
	{ name:'摇粒绒马甲拉链款', sku:'HYXM50001', platform:'淘宝', salePrice:78, returnRate:'25.19%', costTiers:[35], isMainProduct: false },
	// 火山石套装 - 多档售价 + 单一进货价
	{ name:'火山石套装', sku:'HYX9101', platform:'淘宝', salePrice:0, salePriceTiers:[98.1], returnRate:'12.44%', costTiers:[45], isMainProduct: false },
	// 德绒单裤 - 多档售价 + 单一进货价
	{ name:'德绒单裤', sku:'HYX21311', platform:'天猫', salePrice:0, salePriceTiers:[79.8], returnRate:'13.46%', costTiers:[38], isMainProduct: false },
	// 德绒单裤 - 多档售价 + 单一进货价
	{ name:'德绒单裤', sku:'HYX21311', platform:'淘宝', salePrice:0, salePriceTiers:[79.8], returnRate:'22.86%', costTiers:[38], isMainProduct: false },
	// 全棉短袖家居服 - 单一售价 + 单一进货价
	{ name:'全棉短袖家居服', sku:'HYXJ5031', platform:'淘宝', salePrice:71.1, returnRate:'4.65%', costTiers:[32], isMainProduct: false },
	// 长袖家居服 - 单一售价 + 单一进货价
	{ name:'长袖家居服', sku:'HYXJ1111', platform:'淘宝', salePrice:134.1, returnRate:'13.25%', costTiers:[63.5], isMainProduct: false },
	// 全棉单上衣 - 多档售价 + 多档进货价
	{ name:'全棉单上衣', sku:'HYX1811', platform:'淘宝', salePrice:0, salePriceTiers:[44.40, 53.10, 62.10, 62.10], returnRate:'11.94%', costTiers:[19.00, 20.50, 22.00, 23.50], isMainProduct: false },
	// 全棉单上衣 - 多档售价 + 多档进货价
	{ name:'全棉单上衣', sku:'HYX1811', platform:'天猫', salePrice:0, salePriceTiers:[44.40, 53.10, 62.10, 62.10], returnRate:'5.17%', costTiers:[19.00, 20.50, 22.00, 23.50], isMainProduct: false },
	// 加绒单裤 - 单一售价 + 多档进货价
	{ name:'加绒单裤', sku:'HYX19527', platform:'淘宝', salePrice:71.1, returnRate:'20.28%', costTiers:[29.50, 32.00, 34.00, 37.00], isMainProduct: false },
	// 暖阳绒单上衣 - 单一售价 + 单一进货价
	{ name:'暖阳绒单上衣', sku:'HYXC811', platform:'淘宝', salePrice:53.1, returnRate:'11.64%', costTiers:[23], isMainProduct: false },
	// 纯棉背心 - 单一售价 + 多档进货价
	{ name:'纯棉背心', sku:'HYX2117', platform:'淘宝', salePrice:29, returnRate:'6.68%', costTiers:[14.20, 16.10, 18.00, 19.90], isMainProduct: false },
	// 纯棉背心 - 单一售价 + 多档进货价
	{ name:'纯棉背心', sku:'HYX2117', platform:'天猫', salePrice:29, returnRate:'6.61%', costTiers:[14.20, 16.10, 18.00, 19.90], isMainProduct: false },
	// 网眼背心 - 单一售价 + 单一进货价
	{ name:'网眼背心', sku:'HYXB7201', platform:'淘宝', salePrice:29.9, returnRate:'8.11%', costTiers:[14], isMainProduct: false },
	// 网眼背心 - 单一售价 + 单一进货价
	{ name:'网眼背心', sku:'HYXB7201', platform:'天猫', salePrice:29.9, returnRate:'7.48%', costTiers:[14], isMainProduct: false },
	// 空气层加绒单裤 - 多档售价 + 多档进货价
	{ name:'空气层加绒单裤', sku:'HYX21811', platform:'淘宝', salePrice:0, salePriceTiers:[71.10, 76.50, 80.10], returnRate:'29.06%', costTiers:[30.00, 36.00, 41.00], isMainProduct: false },
	// 空气层加绒单裤 - 多档售价 + 多档进货价
	{ name:'空气层加绒单裤', sku:'HYX21811', platform:'天猫', salePrice:0, salePriceTiers:[71.10, 76.50, 80.10], returnRate:'18.11%', costTiers:[30.00, 36.00, 41.00], isMainProduct: false },
	// 空气层单裤 - 多档售价 + 多档进货价
	{ name:'空气层单裤', sku:'HYX20313', platform:'淘宝', salePrice:0, salePriceTiers:[53.10, 58.80, 62.10, 62.10], returnRate:'16.12%', costTiers:[24.80, 26.60, 29.00, 31.60], isMainProduct: false },
	// 空气层单裤 - 多档售价 + 多档进货价
	{ name:'空气层单裤', sku:'HYX20313', platform:'天猫', salePrice:0, salePriceTiers:[53.10, 58.80, 62.10, 62.10], returnRate:'13.62%', costTiers:[24.80, 26.60, 29.00, 31.60], isMainProduct: false }
];


