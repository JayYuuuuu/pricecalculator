# E-commerce Rational Pricing Calculator (Tax-Compliant Edition)

## System Overview

This is a professional e-commerce pricing tool designed for online sellers. It helps calculate rational product prices, analyze profit structure, plan pricing strategies, and manage products in bulk. The system fully accounts for tax compliance, including input tax deductions, output tax calculations, and platform commission input tax, ensuring accurate and compliant pricing strategies.

## Core Functional Modules

### 1. Price Calculation Module

**Objective**: Calculate rational prices that meet business goals based on target profit margins

**Key Features**:
- Consider return rates and allocate non-refundable costs to valid orders
- Accurately calculate taxes, including input tax deductions and output tax
- Support commission-free models on platforms
- Real-time calculation of breakeven ROI and breakeven advertising cost ratio

### 2. Profit Analysis Module

**Objective**: Analyze operating profit and cost structure based on actual selling price

**Key Features**:
- Real-time profit calculation with dynamic parameter adjustment
- Detailed cost breakdown, including base cost, selling expenses, and tax analysis
- Display of key pricing metrics: markup multiple, gross margin, breakeven ROI, breakeven advertising cost ratio
- Profit analysis under commission-free models

### 3. List Price Calculation Module

**Objective**: Calculate suggested list price through reverse engineering based on target take-home price

**Key Features**:
- Support instant discount tiers (10%, 12%, 15%, 18%)
- Support threshold-based discount rules (multiple tiers configurable)
- Discount stacking: apply instant discount first, then threshold-based discount
- Real-time validation to ensure take-home price matches target

### 4. Product Catalog Module

**Objective**: Manage multiple products in bulk, with CSV import/export support

**Key Features**:
- Batch calculation of profits/profit margins for multiple products
- CSV import/export for large-scale data management
- Platform-specific settings for commission rates
- Full-screen display optimized for large table viewing

## System Field Details

### Base Cost Fields

#### Purchase Price (excl. tax)
- **Definition**: Supplier's quoted price, tax excluded
- **Unit**: RMB (¥)
- **Range**: 0.01 – 1,000,000
- **Note**: This is the fundamental cost of goods, excluding all taxes

#### Invoice Cost (%)
- **Definition**: Extra fee charged by suppliers for issuing invoices
- **Unit**: Percentage (%)
- **Default**: 6%
- **Range**: 0 – 100
- **Note**: Typically 6%, this fee is included in actual purchase cost

#### Input Tax Rate (%)
- **Definition**: Input VAT rate, deductible from output VAT
- **Unit**: Percentage (%)
- **Default**: 13%
- **Range**: 0 – 100
- **Note**: Apparel category typically 13%, this tax is deductible

### Sales Process Cost Fields

#### Platform Commission Rate (%)
- **Definition**: Transaction fee charged by e-commerce platform
- **Unit**: Percentage (%)
- **Default**: 5.5%
- **Range**: 0 – 100
- **Note**: Calculated on tax-inclusive final selling price; platform issues 6% VAT invoice for input tax deduction

#### Logistics Cost (¥/order)
- **Definition**: Courier cost per order
- **Unit**: RMB per order
- **Default**: 2.8
- **Range**: 0 – 10,000
- **Note**: Non-refundable cost, allocated by return rate

#### Shipping Insurance (¥/order)
- **Definition**: Shipping insurance cost per order
- **Unit**: RMB per order
- **Default**: 1.5
- **Range**: 0 – 100
- **Note**: Non-refundable cost, allocated by return rate

#### Advertising Cost Ratio (%)
- **Definition**: Advertising cost as a percentage of final selling price
- **Unit**: Percentage (%)
- **Default**: 30%
- **Range**: 0 – 100
- **Note**: Advertising service providers issue 6% VAT invoices for input tax deduction; non-refundable cost requiring allocation

#### Other Costs (¥/order)
- **Definition**: Packaging materials and other fixed costs
- **Unit**: RMB per order
- **Default**: 2.5
- **Range**: 0 – 10,000
- **Note**: Estimated costs covering packaging materials, consumables, and overhead expenses not separately accounted for

#### Output Tax Rate (%)
- **Definition**: VAT rate applied to sales
- **Unit**: Percentage (%)
- **Default**: 13%
- **Range**: 0 – 100
- **Note**: Usually same as input VAT rate, used to calculate output VAT payable

### Target Setting Fields

#### Target Profit Margin (%)
- **Definition**: Desired profit margin, calculated based on final selling price
- **Unit**: Percentage (%)
- **Default**: 5%
- **Range**: 0 – 100
- **Note**: 5% means ¥5 profit for every ¥100 of selling price

#### Expected Return Rate (%)
- **Definition**: Estimated return rate affecting cost allocation
- **Unit**: Percentage (%)
- **Default**: 20%
- **Range**: 0 – 100
- **Note**: Only includes return and refund orders, excludes partial refunds

## Core Calculation Logic

### 1. Price Calculation Logic

#### Base Cost Calculation
```
Actual Purchase Cost = Purchase Price + Invoice Cost
Input Tax Credit = Purchase Price × Input Tax Rate (deductible)
```

#### Sales Cost Calculation (considering return rate)
```
Effective Sales Rate = 1 - Return Rate
Non-refundable Cost Allocation = Original Cost ÷ Effective Sales Rate
Refundable Cost = Original Cost (e.g., platform commission)
```

#### Final Price Calculation
```
Tax-inclusive Price = (Actual Purchase Cost - Input Tax Credit + Non-refundable Fixed Costs ÷ Effective Sales Rate) ÷ 
                     (1 - Platform Commission Rate - Output Tax Share - Target Profit Margin - Advertising Cost Allocation + Advertising Tax Credit + Commission Tax Credit)

Where:
- Output Tax Share = Output Tax Rate ÷ (1 + Output Tax Rate)
- Advertising Cost Allocation = Advertising Cost Ratio ÷ Effective Sales Rate
- Advertising Tax Credit = Advertising Cost Allocation × 6%
- Commission Tax Credit = Platform Commission Rate × 6%
```

### 2. Profit Calculation Logic

#### Actual Profit Calculation
```
Actual Profit = Tax-inclusive Price - Total Cost
Total Cost = Actual Purchase Cost + Platform Commission + Allocated Advertising Cost + Allocated Fixed Costs + Actual Tax Payable

Where:
- Actual Tax Payable = Output VAT - Total Input VAT Credits
- Total Input VAT Credits = Product Input VAT + Advertising Input VAT + Commission Input VAT
```

#### Profit Margin Calculation
```
Profit Margin = Actual Profit ÷ Tax-inclusive Price × 100%
```

### 3. List Price Calculation Logic

#### Discount Stacking Order
1. **Instant Discount**: List Price × (1 - Discount Rate)
2. **Threshold-based Discount**: Check if discounted price triggers any discount tiers
3. **Final Take-home Price**: Discounted Price - Maximum Discount Amount

#### List Price Reverse Calculation
```
Suggested List Price = (Target Take-home Price + Discount Amount) ÷ (1 - Instant Discount Rate)
```

### 4. Breakeven ROI Calculation Logic

#### Breakeven Advertising Cost Ratio Calculation
```
Breakeven Advertising Cost Ratio = (1 - Return Rate) ÷ (1 - 6%) × (D - B/P)

Where:
- D = 1 - Platform Commission Rate - Output Tax Share + 6% × Platform Commission Rate
- B = Actual Purchase Cost - Input Tax Credit + Fixed Costs ÷ Effective Sales Rate
- P = Tax-inclusive Selling Price
```

#### Breakeven ROI Calculation
```
Breakeven ROI = Effective Sales Rate ÷ Breakeven Advertising Cost Ratio
```

## Technical Architecture

### Frontend Technology Stack
- **HTML5**: Semantic tags, mobile-friendly support
- **CSS3**: Grid layout, Flexbox, CSS variables, responsive design
- **JavaScript ES6+**: Modular design, event delegation, asynchronous processing

### Core Algorithm Modules
- **`calculatePurchaseCost()`**: Purchase cost calculation
- **`calculateSalesCost()`**: Sales cost calculation
- **`calculatePrices()`**: Final price calculation
- **`calculateBreakevenROI()`**: Breakeven ROI calculation
- **`calculateListPrice()`**: List price reverse calculation

### Data Persistence
- **localStorage**: Automatic user input parameter saving
- **CSV Import/Export**: Support for bulk data management
- **Real-time Calculation**: Automatic recalculation on input changes

## Usage Guide

### 1. Basic Usage
1. Open `index.html` file directly in a web browser
2. Select appropriate functional module (Price Calculation/Profit Analysis/List Price Calculation/Product Catalog)
3. Input relevant parameters
4. Click calculate button to view results

### 2. Price Calculation Process
1. Input base costs (purchase price, invoice cost, input tax rate)
2. Set sales process costs (platform commission, logistics cost, advertising cost, etc.)
3. Define targets (target profit margin, expected return rate)
4. Click "Calculate Price" to get suggested selling price

### 3. Profit Analysis Process
1. Input basic information (purchase price, actual selling price)
2. Set cost parameters (marketing costs, platform costs, logistics costs, etc.)
3. System calculates profit and profit margin in real-time
4. View detailed cost structure analysis

### 4. List Price Calculation Process
1. Set target take-home price
2. Select instant discount tiers
3. Configure threshold-based discount rules
4. System calculates suggested list price through reverse engineering

### 5. Product Catalog Management
1. Add product rows or import CSV files
2. Set parameters for each product
3. Recalculate all products with one click
4. Export calculation results

## Advanced Features

### 1. Commission-Free Mode
- Support platform commission-free toggle
- Commission-free mode calculates platform commission at 0%
- Applicable to self-owned platforms or special partnership models

### 2. Batch Profit Margin Simulation
- Support batch calculation for different advertising cost and return rate combinations
- Matrix display for easy selection of optimal parameter combinations
- Real-time parameter adjustment with immediate result updates

### 3. Price Scenario Analysis
- Fix other parameters while varying tax-inclusive price, return rate, and advertising cost ratio
- Help understand the impact of each parameter on profit
- Support multi-scenario comparative analysis

### 4. Share and Export
- Support saving calculation results as images
- Copy images to clipboard
- System sharing functionality (for browsers supporting file sharing)

## Important Notes

### 1. Tax Compliance
- All monetary inputs are tax-exclusive prices
- System has built-in input tax deduction calculations, ensuring accurate tax calculations
- Support for different product category tax rates

### 2. Return Rate Setting
- Only count return and refund orders, exclude partial refunds
- Return rate affects allocation of non-refundable costs
- Recommend adjustment based on actual operational data

### 3. Cost Allocation
- Non-refundable costs allocated by effective sales rate
- Refundable costs (such as platform commission) do not participate in allocation
- Advertising costs as non-refundable costs require allocation

### 4. Calculation Precision
- System supports two decimal place precision
- Tax calculations follow national tax regulations
- Recommend regular verification of calculation results against actual operational data

### 5. Calculation Logic Consistency
- **Unified Profit Calculation**: All profit calculation modules now use the same core calculation function
- **Consistent Tax Deduction**: Input tax deduction calculations use the standard 0.06/1.06 method across all modules
- **Modular Design**: Eliminates code duplication and ensures calculation results are identical between different interfaces
- **Verified Consistency**: Profit calculation results in the Product Catalog profit scenario popup are now identical to the Profit Analysis tab

## Development Roadmap

- [ ] Optimize batch calculation functionality
- [ ] Support preset tax rates by product category
- [ ] Add historical calculation record functionality
- [ ] Support multi-currency calculations
- [ ] Add data visualization charts
- [ ] Support API interface calls
- [ ] Mobile app development

## Technical Support

For questions or suggestions, please contact through the following methods:
- Review code comments to understand detailed implementation logic
- Check browser console for debug output
- Refer to built-in help tips and explanations

---

**Version**: v2.1  
**Release Date**: 2024  
**Latest Update**: Calculation logic unification across all profit calculation modules  
**Compatibility**: Supports modern browsers, mobile-friendly