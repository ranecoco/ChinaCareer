---
title: 上海2026五险一金及个税计算器
# date: 2026-09-03 18:56:00
index: false
description: 输入税前工资，自动计算上海2026年度社保、公积金、个税及到手工资。适用期间：2026年7月 - 2027年6月。
tools: [ Calculator ]
---

> **适用期间**：2026年7月 - 2027年6月  
> **社保基数**：7546 ~ 37731 元/月  
> **公积金基数**：2740 ~ 37731 元/月  
> **公积金比例**：5% ~ 7%

---

## 使用方法

1. 在下方参数输入框中填入您的工资和扣除项
2. 结果会自动实时计算并显示
3. 所有数据仅在本地浏览器计算，不会上传任何服务器

---

{% raw %}
<style>
.salary-calc * { margin: 0; padding: 0; box-sizing: border-box; }
.salary-calc {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
}
.salary-calc .calc-header {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: #fff;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 20px;
}
.salary-calc .calc-header h2 { font-size: 18px; margin-bottom: 4px; }
.salary-calc .calc-header p { font-size: 11px; opacity: 0.85; }
.salary-calc .section-title {
  font-size: 14px; font-weight: 700; color: #1e3c72;
  margin: 20px 0 10px 0; padding-bottom: 6px;
  border-bottom: 2px solid #e8ecf4;
}
.salary-calc .form-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px 14px;
}
@media (max-width: 600px) {
  .salary-calc .form-grid { grid-template-columns: 1fr; }
}
.salary-calc .form-group {
  display: flex; flex-direction: column; gap: 3px;
}
.salary-calc .form-group label {
  font-size: 12px; font-weight: 600; color: #444;
}
.salary-calc .form-group .hint {
  font-size: 10px; color: #888; margin-top: 1px;
}
.salary-calc .form-group input, .salary-calc .form-group select {
  padding: 8px 10px; border: 1.5px solid #d1d5db; border-radius: 6px;
  font-size: 13px; background: #fff; width: 100%;
}
.salary-calc .form-group input:focus, .salary-calc .form-group select:focus {
  outline: none; border-color: #4f46e5;
}
.salary-calc .form-group input[type="number"] { text-align: right; }
.salary-calc .btn-calc {
  display: block; width: 100%; max-width: 260px; margin: 16px auto;
  padding: 12px 20px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700;
  cursor: pointer; text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
}
.salary-calc .btn-calc:active {
  transform: scale(0.96);
}
.salary-calc .btn-calc.calculating {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  pointer-events: none;
}
.salary-calc .btn-calc::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  width: 0; height: 0;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}
.salary-calc .btn-calc:active::after {
  width: 300px; height: 300px;
}
.salary-calc .value {
  transition: color 0.3s ease, transform 0.3s ease;
}
.salary-calc .value.updating {
  color: #4f46e5;
  transform: scale(1.08);
}
.salary-calc .result-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.salary-calc .result-card.flash {
  animation: cardFlash 0.5s ease;
}
@keyframes cardFlash {
  0% { transform: scale(1); box-shadow: 0 0 0 rgba(79,70,229,0); }
  50% { transform: scale(1.02); box-shadow: 0 0 20px rgba(79,70,229,0.2); }
  100% { transform: scale(1); box-shadow: 0 0 0 rgba(79,70,229,0); }
}
.salary-calc .detail-table tbody tr {
  transition: background-color 0.3s ease;
}
.salary-calc .detail-table tbody tr.flash-row {
  animation: rowFlash 0.6s ease;
}
@keyframes rowFlash {
  0% { background-color: transparent; }
  50% { background-color: rgba(79,70,229,0.08); }
  100% { background-color: transparent; }
}
.salary-calc .number-roll {
  display: inline-block;
  animation: numberRoll 0.4s ease-out;
}
@keyframes numberRoll {
  0% { transform: translateY(-8px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.salary-calc .result-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
}
@media (max-width: 600px) {
  .salary-calc .result-grid { grid-template-columns: 1fr; }
}
.salary-calc .result-card {
  background: #fff; border-radius: 8px; padding: 12px 14px;
  border: 1px solid #e2e8f0;
}
.salary-calc .result-card .label {
  font-size: 11px; color: #64748b; margin-bottom: 3px;
}
.salary-calc .result-card .value {
  font-size: 16px; font-weight: 700; color: #1e293b;
}
.salary-calc .result-card.highlight {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-color: #6ee7b7;
}
.salary-calc .result-card.highlight .value { color: #047857; }
.salary-calc .result-card.important {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #fbbf24;
}
.salary-calc .result-card.important .value { color: #92400e; }
.salary-calc .result-card.danger {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-color: #f87171;
}
.salary-calc .result-card.danger .value { color: #991b1b; }
.salary-calc .detail-table {
  width: 100%; border-collapse: collapse; margin-top: 6px;
  font-size: 12px; background: #fff; border-radius: 8px; overflow: hidden;
}
.salary-calc .detail-table th {
  background: #1e3c72; color: #fff; padding: 8px 10px;
  text-align: left; font-weight: 600;
}
.salary-calc .detail-table td {
  padding: 8px 10px; border-bottom: 1px solid #e2e8f0;
}
.salary-calc .detail-table tr:nth-child(even) { background: #f8fafc; }
.salary-calc .detail-table td:last-child { text-align: right; font-weight: 600; color: #1e293b; }
.salary-calc .detail-table .total-row td { font-weight: 700; background: #e8ecf4 !important; }
.salary-calc .tax-table {
  width: 100%; border-collapse: collapse; margin-top: 8px;
  font-size: 11px; background: #fff; border-radius: 8px; overflow: hidden;
}
.salary-calc .tax-table th, .salary-calc .tax-table td {
  padding: 6px 8px; border: 1px solid #d1d5db; text-align: center;
}
.salary-calc .tax-table th { background: #1e3c72; color: #fff; font-weight: 600; }
.salary-calc .tax-table tr:nth-child(even) { background: #f8fafc; }
.salary-calc .notice {
  background: #eff6ff; border-left: 4px solid #3b82f6;
  padding: 10px 14px; margin-top: 16px; border-radius: 0 8px 8px 0;
  font-size: 11px; color: #1e40af; line-height: 1.7;
}
.salary-calc .formula-bar {
  background: #f1f5f9; border-radius: 8px; padding: 10px 14px;
  margin-top: 10px; font-size: 11px; color: #475569; line-height: 1.8;
}
</style>

<!-- // text -->

<div class="salary-calc">
  <div class="calc-header">
    <h2>上海 2026 五险一金及个税计算器</h2>
    <p>社保基数：7546 ~ 37731 | 公积金基数：2740 ~ 37731 | 公积金比例：5% ~ 7%</p>
  </div>

  <div class="section-title">
    <h2 id="parameter">📥 输入参数</h2>
  </div>
  <div class="form-grid">
    <div class="form-group">
      <label>税前月工资（元）</label>
      <input type="number" id="salary" value="6000" min="0" step="100">
    </div>
    <div class="form-group">
      <label>社保缴费基数（元）</label>
      <input type="number" id="socialBase" value="7546" min="7546" max="37731">
      <div class="hint">工资低于7546按7546，高于37731按37731</div>
    </div>
    <div class="form-group">
      <label>公积金缴费基数（元）</label>
      <input type="number" id="gjjBase" value="6000" min="2740" max="37731">
      <div class="hint">通常按实际工资，也可2740~37731自选</div>
    </div>
    <div class="form-group">
      <label>公积金缴存比例</label>
      <select id="gjjRate">
        <option value="5">5%</option>
        <option value="6">6%</option>
        <option value="7" selected>7%</option>
      </select>
    </div>
    <div class="form-group">
      <label>住房租金专项扣除（元/月）</label>
      <input type="number" id="rent" value="1500" min="0" step="100">
    </div>
    <div class="form-group">
      <label>赡养老人专项扣除（元/月）</label>
      <input type="number" id="elderly" value="0" min="0" step="100">
      <div class="hint">独生子女3000，非独生子女分摊</div>
    </div>
    <div class="form-group">
      <label>子女教育专项扣除（元/月）</label>
      <input type="number" id="children" value="0" min="0" step="100">
      <div class="hint">每个子女2000元/月</div>
    </div>
    <div class="form-group">
      <label>继续教育专项扣除（元/月）</label>
      <input type="number" id="education" value="0" min="0" step="100">
    </div>
    <div class="form-group">
      <label>住房贷款利息（元/月）</label>
      <input type="number" id="mortgage" value="0" min="0" step="100">
      <div class="hint">1000元/月，与租房二选一</div>
    </div>
  </div>

  <button class="btn-calc" onclick="calculateSalary()">🔄 重新计算</button>

  <div class="section-title">📊 社会保险（个人缴纳部分）</div>
  <table class="detail-table">
    <thead><tr><th>险种</th><th>比例</th><th>金额（元）</th></tr></thead>
    <tbody>
      <tr><td>养老保险</td><td>8%</td><td id="pension">0.00</td></tr>
      <tr><td>医疗保险</td><td>2%</td><td id="medical">0.00</td></tr>
      <tr><td>失业保险</td><td>0.5%</td><td id="unemployment">0.00</td></tr>
      <tr class="total-row"><td colspan="2">社保个人合计</td><td id="socialTotal">0.00</td></tr>
    </tbody>
  </table>

  <div class="section-title">🏠 住房公积金</div>
  <div class="result-grid">
    <div class="result-card">
      <div class="label">个人缴纳</div>
      <div class="value" id="gjjPersonal">0.00</div>
    </div>
    <div class="result-card">
      <div class="label">单位缴纳</div>
      <div class="value" id="gjjCompany">0.00</div>
    </div>
    <div class="result-card highlight">
      <div class="label">每月入账公积金账户</div>
      <div class="value" id="gjjAccount">0.00</div>
    </div>
    <div class="result-card">
      <div class="label">缴存比例</div>
      <div class="value" id="gjjRateDisplay">7%</div>
    </div>
  </div>

  <div class="section-title">💰 个人所得税</div>
  <table class="detail-table">
    <tbody>
      <tr><td>税前月工资</td><td id="taxSalary">0.00</td></tr>
      <tr><td>减：起征点</td><td>5,000.00</td></tr>
      <tr><td>减：社保个人部分</td><td id="taxSocial">0.00</td></tr>
      <tr><td>减：公积金个人部分</td><td id="taxGjj">0.00</td></tr>
      <tr><td>减：专项附加扣除合计</td><td id="taxDeduction">0.00</td></tr>
      <tr style="background:#eff6ff;font-weight:700;"><td>应纳税所得额</td><td id="taxableIncome">0.00</td></tr>
      <tr><td>适用税率</td><td id="taxRate">0%</td></tr>
      <tr><td>速算扣除数</td><td id="taxQuick">0.00</td></tr>
      <tr class="total-row"><td>个税金额</td><td id="taxAmount">0.00</td></tr>
    </tbody>
  </table>

  <div class="section-title">
    <h2 id="result">🎯 最终到手</h2>
  </div>
  <div class="result-grid">
    <div class="result-card important">
      <div class="label">💰 实发工资（到手）</div>
      <div class="value" id="takeHome">0.00</div>
    </div>
    <div class="result-card danger">
      <div class="label">个人五险一金扣除合计</div>
      <div class="value" id="personalTotal">0.00</div>
    </div>
  </div>

  <div class="section-title">🏢 单位用工成本</div>
  <table class="detail-table">
    <tbody>
      <tr><td>单位养老保险（16%）</td><td id="compPension">0.00</td></tr>
      <tr><td>单位医疗保险（含生育9%）</td><td id="compMedical">0.00</td></tr>
      <tr><td>单位失业保险（0.5%）</td><td id="compUnemployment">0.00</td></tr>
      <tr><td>单位工伤保险（约0.5%估算）</td><td id="compInjury">0.00</td></tr>
      <tr><td>单位公积金</td><td id="compGjj">0.00</td></tr>
      <tr class="total-row"><td>单位五险一金合计</td><td id="compTotal">0.00</td></tr>
      <tr style="background:#fef3c7;font-weight:700;"><td>📊 单位总用工成本</td><td id="compCost">0.00</td></tr>
    </tbody>
  </table>

  <div class="section-title">🧮 计算逻辑</div>
  <div class="formula-bar">
    <strong>到手工资 =</strong> 税前工资 − 社保个人部分 − 公积金个人部分 − 个税<br>
    <strong>应纳税所得额 =</strong> MAX(税前工资 − 5000 − 社保个人部分 − 公积金个人部分 − 专项附加扣除合计, 0)<br>
    <strong>个税 =</strong> 应纳税所得额 × 税率 − 速算扣除数<br>
    <strong>公积金入账 =</strong> 个人缴纳 + 单位缴纳（全部进入您的公积金账户）
  </div>

  <div class="section-title">📈 个税税率表（月度）</div>
  <table class="tax-table">
    <thead><tr><th>应纳税所得额</th><th>税率</th><th>速算扣除数</th></tr></thead>
    <tbody>
      <tr><td>不超过 3,000 元</td><td>3%</td><td>0</td></tr>
      <tr><td>3,000 ~ 12,000 元</td><td>10%</td><td>210</td></tr>
      <tr><td>12,000 ~ 25,000 元</td><td>20%</td><td>1,410</td></tr>
      <tr><td>25,000 ~ 35,000 元</td><td>25%</td><td>2,660</td></tr>
      <tr><td>35,000 ~ 55,000 元</td><td>30%</td><td>4,410</td></tr>
      <tr><td>55,000 ~ 80,000 元</td><td>35%</td><td>7,160</td></tr>
      <tr><td>超过 80,000 元</td><td>45%</td><td>15,160</td></tr>
    </tbody>
  </table>

  <div class="notice">
    <strong>使用说明：</strong><br>
    1. 黄色输入框可直接修改，修改后点击"重新计算"按钮更新结果。<br>
    2. 社保基数下限7546元、上限37731元；公积金基数下限2740元、上限37731元。<br>
    3. 公积金比例上海规定为5%~7%（取整），单位与个人比例相同。<br>
    4. 专项附加扣除请根据实际情况填写，没有则填0。住房租金上海标准为1500元/月。<br>
    5. 个税计算采用月度预扣预缴方式，年度汇算清缴时多退少补。<br>
    6. 单位工伤保险比例因行业不同而异（0.2%~1.9%），此处按0.5%估算。
  </div>
</div>

<script>
function formatMoney(num) {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function getTaxRate(income) {
  if (income <= 0) return { rate: 0, quick: 0, rateStr: "0%" };
  if (income <= 3000) return { rate: 0.03, quick: 0, rateStr: "3%" };
  if (income <= 12000) return { rate: 0.10, quick: 210, rateStr: "10%" };
  if (income <= 25000) return { rate: 0.20, quick: 1410, rateStr: "20%" };
  if (income <= 35000) return { rate: 0.25, quick: 2660, rateStr: "25%" };
  if (income <= 55000) return { rate: 0.30, quick: 4410, rateStr: "30%" };
  if (income <= 80000) return { rate: 0.35, quick: 7160, rateStr: "35%" };
  return { rate: 0.45, quick: 15160, rateStr: "45%" };
}

function animateValue(element, start, end, duration) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * easeProgress;
    element.textContent = formatMoney(current);
    element.classList.add('number-roll');
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      setTimeout(() => element.classList.remove('number-roll'), 400);
    }
  }
  requestAnimationFrame(update);
}

function flashElements() {
  document.querySelectorAll('.salary-calc .result-card').forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('flash');
      setTimeout(() => card.classList.remove('flash'), 500);
    }, i * 80);
  });
  document.querySelectorAll('.salary-calc .detail-table tbody tr').forEach((row, i) => {
    setTimeout(() => {
      row.classList.add('flash-row');
      setTimeout(() => row.classList.remove('flash-row'), 600);
    }, i * 60);
  });
}

let previousValues = {};

function setAnimatedValue(id, newValue) {
  const el = document.getElementById(id);
  if (!el) return;
  const oldValue = previousValues[id] || 0;
  if (Math.abs(newValue - oldValue) > 0.01) {
    animateValue(el, oldValue, newValue, 400);
    el.classList.add('updating');
    setTimeout(() => el.classList.remove('updating'), 300);
  } else {
    el.textContent = formatMoney(newValue);
  }
  previousValues[id] = newValue;
}

function doCalculate(isManual) {
  const salary = parseFloat(document.getElementById('salary').value) || 0;
  let socialBase = parseFloat(document.getElementById('socialBase').value) || 7546;
  let gjjBase = parseFloat(document.getElementById('gjjBase').value) || 2740;
  const gjjRate = parseFloat(document.getElementById('gjjRate').value) || 7;
  const rent = parseFloat(document.getElementById('rent').value) || 0;
  const elderly = parseFloat(document.getElementById('elderly').value) || 0;
  const children = parseFloat(document.getElementById('children').value) || 0;
  const education = parseFloat(document.getElementById('education').value) || 0;
  const mortgage = parseFloat(document.getElementById('mortgage').value) || 0;
  
  socialBase = Math.max(7546, Math.min(37731, socialBase));
  gjjBase = Math.max(2740, Math.min(37731, gjjBase));
  
  const pension = socialBase * 0.08;
  const medical = socialBase * 0.02;
  const unemployment = socialBase * 0.005;
  const socialTotal = pension + medical + unemployment;
  
  const gjjPersonal = gjjBase * (gjjRate / 100);
  const gjjCompany = gjjBase * (gjjRate / 100);
  const gjjAccount = gjjPersonal + gjjCompany;
  
  const deductionTotal = rent + elderly + children + education + mortgage;
  const taxableIncome = Math.max(salary - 5000 - socialTotal - gjjPersonal - deductionTotal, 0);
  const taxInfo = getTaxRate(taxableIncome);
  const taxAmount = Math.max(taxableIncome * taxInfo.rate - taxInfo.quick, 0);
  
  const takeHome = salary - socialTotal - gjjPersonal - taxAmount;
  const personalTotal = socialTotal + gjjPersonal + taxAmount;
  
  const compPension = socialBase * 0.16;
  const compMedical = socialBase * 0.09;
  const compUnemployment = socialBase * 0.005;
  const compInjury = socialBase * 0.005;
  const compGjj = gjjCompany;
  const compTotal = compPension + compMedical + compUnemployment + compInjury + compGjj;
  const compCost = salary + compTotal;
  
  setAnimatedValue('pension', pension);
  setAnimatedValue('medical', medical);
  setAnimatedValue('unemployment', unemployment);
  setAnimatedValue('socialTotal', socialTotal);
  setAnimatedValue('gjjPersonal', gjjPersonal);
  setAnimatedValue('gjjCompany', gjjCompany);
  setAnimatedValue('gjjAccount', gjjAccount);
  setAnimatedValue('taxSalary', salary);
  setAnimatedValue('taxSocial', socialTotal);
  setAnimatedValue('taxGjj', gjjPersonal);
  setAnimatedValue('taxDeduction', deductionTotal);
  setAnimatedValue('taxableIncome', taxableIncome);
  setAnimatedValue('taxQuick', taxInfo.quick);
  setAnimatedValue('taxAmount', taxAmount);
  setAnimatedValue('takeHome', takeHome);
  setAnimatedValue('personalTotal', personalTotal);
  setAnimatedValue('compPension', compPension);
  setAnimatedValue('compMedical', compMedical);
  setAnimatedValue('compUnemployment', compUnemployment);
  setAnimatedValue('compInjury', compInjury);
  setAnimatedValue('compGjj', compGjj);
  setAnimatedValue('compTotal', compTotal);
  setAnimatedValue('compCost', compCost);
  
  document.getElementById('gjjRateDisplay').textContent = gjjRate + '%';
  document.getElementById('taxRate').textContent = taxInfo.rateStr;
  
  if (isManual) {
    flashElements();
  }
}

function calculateSalary() {
  const btn = document.querySelector('.salary-calc .btn-calc');
  const originalText = btn.textContent;
  btn.textContent = '⚡ 计算中...';
  btn.classList.add('calculating');

  setTimeout(() => {
    doCalculate(true);
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('calculating');
      const resultEl = document.getElementById('result');
      if (resultEl) {
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);
  }, 50);
}

function autoCalculate() {
  doCalculate(false);
}

document.addEventListener('DOMContentLoaded', function() {
  doCalculate(false);
  document.querySelectorAll('.salary-calc input, .salary-calc select').forEach(el => {
    el.addEventListener('change', autoCalculate);
    el.addEventListener('input', autoCalculate);
  });
});
</script>
{% endraw %}

---

## 部署方式

### 方式一：作为独立页面

将本文件保存为 `source/calculator/index.md`，Hexo 会自动生成 `https://你的域名/calculator/` 页面。

```bash
mkdir -p source/calculator
cp 本文件.md source/calculator/index.md
hexo generate
```

### 方式二：作为博客文章

将本文件保存到 `source/_posts/` 目录下，作为一篇普通博客文章发布：

```bash
cp 本文件.md source/_posts/2026-09-03-salary-calculator.md
hexo generate
```

### 注意事项

1. **NexT 主题**：如果使用了 `hexo-filter-optimize` 等插件，可能会压缩内联 JS，建议在本文件 Front Matter 中添加 `mathjax: false` 避免冲突
2. **Pjax 问题**：如果主题开启了 Pjax，需要在主题的 Pjax 回调中重新绑定事件
3. **样式隔离**：所有 CSS 选择器都加了 `.salary-calc` 前缀，避免与主题样式冲突

---

## 计算逻辑说明

| 项目 | 公式 |
|------|------|
| 社保个人合计 | 基数 × 10.5%（养老8% + 医疗2% + 失业0.5%） |
| 公积金个人 | 基数 × 比例（5%~7%） |
| 应纳税所得额 | MAX(工资 − 5000 − 社保 − 公积金 − 专项扣除, 0) |
| 个税 | 应纳税所得额 × 税率 − 速算扣除数 |
| 到手工资 | 工资 − 社保 − 公积金 − 个税 |

---

> 💡 **提示**：所有计算均在浏览器本地完成，数据不会上传至任何服务器。
