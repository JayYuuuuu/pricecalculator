E-commerce Rational Pricing Calculator (Tax-Compliant Edition)

System Overview

This is a professional e-commerce pricing tool designed for online sellers. It helps calculate rational product prices, analyze profit structure, plan pricing strategies, and manage products in bulk. The system fully accounts for tax compliance, including input tax deductions, output tax calculations, and platform commission input tax, ensuring accurate and compliant pricing strategies.

Core Functional Modules

1. Price Calculation Module

Objective: Calculate rational prices that meet business goals based on target profit margins

Key Features:
	•	Factor in return rates and distribute non-refundable costs across valid orders
	•	Accurately calculate tax, including input tax deductions and output tax
	•	Support commission-free models on platforms
	•	Real-time calculation of breakeven ROI and breakeven ad spend ratio

2. Profit Analysis Module

Objective: Analyze operating profit and cost structure based on actual selling price

Key Features:
	•	Real-time profit calculation with dynamic parameter adjustment
	•	Detailed cost breakdown, including base cost, selling expenses, and tax analysis
	•	Display of key pricing metrics: markup multiple, gross margin, breakeven ROI, breakeven ad spend ratio
	•	Profit analysis under commission-free models

3. List Price Module

Objective: Back-calculate suggested list price based on target take-home price

Key Features:
	•	Support instant discount (10%, 12%, 15%, 18% tiers)
	•	Support full-discount rules (multiple tiers configurable)
	•	Stacked discounts: apply instant discount before full-discount
	•	Real-time validation to ensure take-home price matches target

4. Product List Module

Objective: Manage multiple products in bulk, with CSV import/export

Key Features:
	•	Batch calculation of profits/profit margins
	•	CSV import/export for large-scale data management
	•	Platform-specific settings for commission rates
	•	Full-screen display optimized for large table viewing

Field Details

Base Cost Fields

Purchase Price (excl. tax)
	•	Definition: Supplier’s quoted price, tax excluded
	•	Unit: RMB
	•	Range: 0.01 – 1,000,000
	•	Note: Fundamental cost, excludes all tax

Invoice Fee (%)
	•	Definition: Extra fee charged by suppliers for issuing invoices
	•	Unit: %
	•	Default: 6%
	•	Range: 0 – 100
	•	Note: Typically 6%, counted into actual purchase cost

Input Tax Rate (%)
	•	Definition: Input VAT rate, deductible from output VAT
	•	Unit: %
	•	Default: 13%
	•	Range: 0 – 100
	•	Note: Apparel category typically 13%, deductible

Selling Cost Fields

Platform Commission (%)
	•	Definition: Transaction fee charged by platform
	•	Unit: %
	•	Default: 5.5%
	•	Range: 0 – 100
	•	Note: Calculated on tax-inclusive sales price; invoiced at 6% VAT deductible

Logistics Fee (RMB/order)
	•	Definition: Courier cost per order
	•	Default: 2.8
	•	Range: 0 – 10,000
	•	Note: Non-refundable, allocated by return rate

Shipping Insurance (RMB/order)
	•	Definition: Buyer shipping insurance per order
	•	Default: 1.5
	•	Range: 0 – 100
	•	Note: Non-refundable, allocated by return rate

Paid Ads Share (%)
	•	Definition: Share of ads in final sales price
	•	Default: 30%
	•	Range: 0 – 100
	•	Note: Advertising invoices at 6% VAT deductible, non-refundable

Other Costs (RMB/order)
	•	Definition: Packaging, materials, indirect expenses
	•	Default: 2.5
	•	Range: 0 – 10,000
	•	Note: Estimated, covers packaging, consumables, overhead

Output Tax Rate (%)
	•	Definition: VAT rate on sales
	•	Default: 13%
	•	Range: 0 – 100
	•	Note: Typically same as input VAT rate

Target Settings

Target Profit Margin (%)
	•	Definition: Desired profit margin, based on sales price
	•	Default: 5%
	•	Range: 0 – 100
	•	Note: 5% = 5 RMB profit per 100 RMB sales price

Expected Return Rate (%)
	•	Definition: Estimated returns ratio, affects cost allocation
	•	Default: 20%
	•	Range: 0 – 100
	•	Note: Only accounts for return/refund orders

Core Calculation Logic

1. Price Calculation Logic

Base Cost

Actual Purchase Cost = Purchase Price + Invoice Fee
Input Tax Credit = Purchase Price × Input Tax Rate

Sales Cost (with returns)

Effective Sales Rate = 1 - Return Rate
Non-refundable Cost Allocation = Original Cost ÷ Effective Sales Rate
Refundable Cost = Original Cost (e.g., commission)

Final Price

Tax-inclusive Price = (Actual Purchase Cost - Input Tax Credit + Fixed Costs ÷ Effective Sales Rate) ÷
                     (1 - Commission Rate - Output Tax Share - Target Profit Margin - Ad Cost Share 
                      + Ad Tax Credit + Commission Tax Credit)

Where:
- Output Tax Share = Output Tax Rate ÷ (1 + Output Tax Rate)
- Ad Cost Share = Ad Share ÷ Effective Sales Rate
- Ad Tax Credit = Ad Cost Share × 6%
- Commission Tax Credit = Commission Rate × 6%

2. Profit Calculation Logic

Profit

Profit = Tax-inclusive Price - Total Costs
Total Costs = Actual Purchase Cost + Commission + Allocated Ads + Allocated Fixed Costs + Tax Payable

Tax Payable = Output VAT - Total Input VAT Credits
Total Input VAT Credits = Product Input VAT + Ads Input VAT + Commission Input VAT

Profit Margin

Profit Margin = Profit ÷ Sales Price × 100%

3. List Price Logic

Discount Order
	1.	Instant Discount
	2.	Full Discount Check
	3.	Final Take-home Price = Discounted Price - Full Discount

Reverse Calculation

Suggested List Price = (Target Take-home Price + Full Discount Amount) ÷ (1 - Instant Discount Rate)

4. Breakeven ROI

Breakeven Ad Share

Breakeven Ad Share = (1 - Return Rate) ÷ (1 - 6%) × (D - B/P)

Where:
D = 1 - Commission Rate - Output Tax Share + 6% × Commission Rate
B = Actual Purchase Cost - Input Tax Credit + Fixed Costs ÷ Effective Sales Rate
P = Sales Price

Breakeven ROI

Breakeven ROI = Effective Sales Rate ÷ Breakeven Ad Share

Technical Architecture

Frontend: HTML5, CSS3 (Grid, Flexbox, responsive design), ES6+ JavaScript
Core Algorithms:
	•	calculatePurchaseCost()
	•	calculateSalesCost()
	•	calculatePrices()
	•	calculateBreakevenROI()
	•	calculateListPrice()

Data Handling:
	•	LocalStorage for auto-saving inputs
	•	CSV import/export
	•	Real-time recalculation

Usage Guide
	•	Open index.html in a browser
	•	Choose module (Price/Profit/List Price/Product List)
	•	Enter parameters
	•	Click calculate

Supports:
	•	Price planning by cost → sales price
	•	Profit analysis by sales price → margin breakdown
	•	List price reverse calculation for promotions
	•	Batch product management via CSV

Advanced Features
	•	Commission-free toggle
	•	Batch profit simulations with ad/return combinations
	•	Scenario analysis of price, ads, returns
	•	Export/share results as images

Notes
	•	All base inputs are tax-exclusive
	•	Input tax deductions are built-in
	•	Return rate only applies to refund orders
	•	Non-refundable costs allocated by effective sales rate
	•	Calculation precision: two decimals, VAT-compliant

Roadmap
	•	Bulk calculation optimizations
	•	Preset tax rates by category
	•	History tracking
	•	Multi-currency support
	•	Data visualization
	•	API access
	•	Mobile app

⸻

Version: v2.0
Release: 2024
Compatibility: Modern browsers, mobile-friendly

⸻