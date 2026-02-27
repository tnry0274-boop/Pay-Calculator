class PartTimePayCalculator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                h2 { color: #0f766e; }
                .form-group { margin-bottom: 1rem; }
                label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
                input { width: 100%; box-sizing: border-box; padding: 0.55rem; border: 1px solid #ccc; border-radius: 4px; }
                .inline { display: flex; align-items: center; gap: 8px; margin: 0.75rem 0; }
                .inline input { width: auto; }
                button { background-color: #0f766e; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; }
                #result { margin-top: 1rem; line-height: 1.55; }
                .small { color: #475569; font-size: 0.9rem; margin-top: 0.75rem; }
                .money { font-weight: 700; }
            </style>
            <div>
                <h2>알바 급여 계산기 (최저시급·주휴·시간외 반영)</h2>
                <div class="form-group">
                    <label for="hourly-wage">시급 (원)</label>
                    <input type="number" id="hourly-wage" placeholder="해당 연도 최저시급 또는 실제 시급 입력" min="0">
                </div>
                <div class="form-group">
                    <label for="daily-hours">하루 근무시간</label>
                    <input type="number" id="daily-hours" placeholder="8" min="0" step="0.5" value="8">
                </div>
                <div class="form-group">
                    <label for="work-days">주 근무일수</label>
                    <input type="number" id="work-days" placeholder="5" min="1" max="7" value="5">
                </div>
                <div class="form-group">
                    <label for="overtime-hours">주 시간외근무 시간 (연장근무)</label>
                    <input type="number" id="overtime-hours" placeholder="0" min="0" step="0.5" value="0">
                </div>
                <div class="inline">
                    <input type="checkbox" id="include-weekly-holiday" checked>
                    <label for="include-weekly-holiday">주휴수당 포함 (주 15시간 이상 근무 시)</label>
                </div>
                <button>계산</button>
                <div id="result"></div>
                <p class="small">안내: 월급은 주급 x 4.345주(연평균)로 계산한 추정치입니다.</p>
            </div>
        `;
        this.shadowRoot.querySelector('button').addEventListener('click', () => this.calculate());
    }

    formatWon(amount) {
        return `${Math.round(amount).toLocaleString()}원`;
    }

    calculate() {
        const hourlyWage = parseFloat(this.shadowRoot.querySelector('#hourly-wage').value);
        const dailyHours = parseFloat(this.shadowRoot.querySelector('#daily-hours').value);
        const workDays = parseFloat(this.shadowRoot.querySelector('#work-days').value);
        const overtimeHours = parseFloat(this.shadowRoot.querySelector('#overtime-hours').value) || 0;
        const includeWeeklyHoliday = this.shadowRoot.querySelector('#include-weekly-holiday').checked;
        const resultEl = this.shadowRoot.querySelector('#result');

        if (!hourlyWage || !dailyHours || !workDays) {
            resultEl.textContent = '시급, 하루 근무시간, 주 근무일수를 입력하세요.';
            return;
        }

        const dailyPay = hourlyWage * dailyHours;
        const weeklyBasePay = dailyPay * workDays;
        const weeklyHours = dailyHours * workDays;
        const weeklyHolidayHours = includeWeeklyHoliday && weeklyHours >= 15 ? (weeklyHours / workDays) : 0;
        const weeklyHolidayPay = hourlyWage * weeklyHolidayHours;
        const overtimePay = hourlyWage * overtimeHours * 1.5;
        const weeklyTotalPay = weeklyBasePay + weeklyHolidayPay + overtimePay;
        const monthlyPay = weeklyTotalPay * 4.345;
        const yearlyPay = monthlyPay * 12;

        resultEl.innerHTML = `
            <div class="money">일급: ${this.formatWon(dailyPay)}</div>
            <div class="money">주급(기본): ${this.formatWon(weeklyBasePay)}</div>
            <div class="money">주휴수당: ${this.formatWon(weeklyHolidayPay)} (${weeklyHolidayHours.toFixed(2)}시간)</div>
            <div class="money">시간외수당(1.5배): ${this.formatWon(overtimePay)}</div>
            <div class="money">주급(합계): ${this.formatWon(weeklyTotalPay)}</div>
            <div class="money">월급(추정): ${this.formatWon(monthlyPay)}</div>
            <div class="money">연봉(추정): ${this.formatWon(yearlyPay)}</div>
        `;
    }
}

class AfterTaxCalculator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                h2 { color: #4a90e2; }
                .form-group { margin-bottom: 1rem; }
                label { display: block; margin-bottom: 0.5rem; }
                input { width: 100%; box-sizing: border-box; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
                button { background-color: #4a90e2; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; }
                #result { margin-top: 1rem; font-weight: bold; }
            </style>
            <div>
                <h2>월급 세후 계산기</h2>
                <div class="form-group">
                    <label for="monthly-salary">월급 (세전)</label>
                    <input type="number" id="monthly-salary" placeholder="3000000">
                </div>
                <button>계산</button>
                <div id="result"></div>
            </div>
        `;
        this.shadowRoot.querySelector('button').addEventListener('click', () => this.calculate());
    }

    calculate() {
        const salary = this.shadowRoot.querySelector('#monthly-salary').value;
        const resultEl = this.shadowRoot.querySelector('#result');
        if (!salary) { resultEl.textContent = '월급을 입력하세요.'; return; }
        resultEl.textContent = `세후 월급: ${(salary * 0.9).toLocaleString()}원 (간이세액 기준)`;
    }
}

class AnnualSalaryCalculator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                h2 { color: #50e3c2; }
                .form-group { margin-bottom: 1rem; }
                label { display: block; margin-bottom: 0.5rem; }
                input { width: 100%; box-sizing: border-box; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
                button { background-color: #50e3c2; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; }
                #result { margin-top: 1rem; font-weight: bold; }
            </style>
            <div>
                <h2>연봉 계산기</h2>
                <div class="form-group">
                    <label for="annual-salary">연봉</label>
                    <input type="number" id="annual-salary" placeholder="50000000">
                </div>
                <button>계산</button>
                <div id="result"></div>
            </div>
        `;
        this.shadowRoot.querySelector('button').addEventListener('click', () => this.calculate());
    }

    calculate() {
        const salary = this.shadowRoot.querySelector('#annual-salary').value;
        const resultEl = this.shadowRoot.querySelector('#result');
        if (!salary) { resultEl.textContent = '연봉을 입력하세요.'; return; }
        resultEl.textContent = `세후 연봉: ${(salary * 0.88).toLocaleString()}원 (근사치)`;
    }
}

class SeverancePayCalculator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                h2 { color: #f5a623; }
                .form-group { margin-bottom: 1rem; }
                label { display: block; margin-bottom: 0.5rem; }
                input { width: 100%; box-sizing: border-box; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
                button { background-color: #f5a623; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; }
                #result { margin-top: 1rem; font-weight: bold; }
            </style>
            <div>
                <h2>퇴직금 계산기</h2>
                <div class="form-group">
                    <label for="last-3-months-salary">최근 3개월 월급 총액</label>
                    <input type="number" id="last-3-months-salary" placeholder="9000000">
                </div>
                 <div class="form-group">
                    <label for="years-worked">총 재직일수</label>
                    <input type="number" id="years-worked" placeholder="365">
                </div>
                <button>계산</button>
                <div id="result"></div>
            </div>
        `;
        this.shadowRoot.querySelector('button').addEventListener('click', () => this.calculate());
    }

    calculate() {
        const salary = this.shadowRoot.querySelector('#last-3-months-salary').value;
        const days = this.shadowRoot.querySelector('#years-worked').value;
        const resultEl = this.shadowRoot.querySelector('#result');
        if (!salary || !days) { resultEl.textContent = '모든 값을 입력하세요.'; return; }
        const dailyWage = salary / 3 / 30; // Approximation
        const severancePay = dailyWage * 30 * (days / 365);
        resultEl.textContent = `예상 퇴직금: ${severancePay.toLocaleString()}원`;
    }
}

class LoanInterestCalculator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                h2 { color: #d0021b; }
                .form-group { margin-bottom: 1rem; }
                label { display: block; margin-bottom: 0.5rem; }
                input { width: 100%; box-sizing: border-box; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
                button { background-color: #d0021b; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; }
                #result { margin-top: 1rem; font-weight: bold; }
            </style>
            <div>
                <h2>대출 이자 계산기</h2>
                <div class="form-group">
                    <label for="principal">대출 원금</label>
                    <input type="number" id="principal" placeholder="100000000">
                </div>
                 <div class="form-group">
                    <label for="interest-rate">연 이자율 (%)</label>
                    <input type="number" id="interest-rate" placeholder="5">
                </div>
                <button>계산</button>
                <div id="result"></div>
            </div>
        `;
        this.shadowRoot.querySelector('button').addEventListener('click', () => this.calculate());
    }

    calculate() {
        const principal = this.shadowRoot.querySelector('#principal').value;
        const rate = this.shadowRoot.querySelector('#interest-rate').value;
        const resultEl = this.shadowRoot.querySelector('#result');
        if (!principal || !rate) { resultEl.textContent = '모든 값을 입력하세요.'; return; }
        const monthlyInterest = (principal * (rate / 100)) / 12;
        resultEl.textContent = `월 예상 이자: ${monthlyInterest.toLocaleString()}원 (원리금균등분할상환 아님)`;
    }
}

class SalaryRaiseSimulator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                h2 { color: #7c3aed; }
                .form-group { margin-bottom: 1rem; }
                label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
                input { width: 100%; box-sizing: border-box; padding: 0.55rem; border: 1px solid #ccc; border-radius: 4px; }
                button { background-color: #7c3aed; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; }
                #result { margin-top: 1rem; line-height: 1.55; }
                .money { font-weight: 700; }
                .small { color: #64748b; font-size: 0.9rem; margin-top: 0.75rem; }
            </style>
            <div>
                <h2>연봉 인상 시뮬레이션</h2>
                <div class="form-group">
                    <label for="current-annual">현재 연봉 (원)</label>
                    <input type="number" id="current-annual" placeholder="40000000" min="0">
                </div>
                <div class="form-group">
                    <label for="raise-rate">인상률 (%)</label>
                    <input type="number" id="raise-rate" placeholder="5" min="0" step="0.1">
                </div>
                <div class="form-group">
                    <label for="effective-tax-rate">예상 실효 공제율 (%)</label>
                    <input type="number" id="effective-tax-rate" placeholder="12" min="0" max="50" step="0.1" value="12">
                </div>
                <button>시뮬레이션</button>
                <div id="result"></div>
                <p class="small">안내: 실효 공제율은 세금·보험 등 전체 공제를 단순화한 추정값입니다.</p>
            </div>
        `;
        this.shadowRoot.querySelector('button').addEventListener('click', () => this.calculate());
    }

    formatWon(amount) {
        return `${Math.round(amount).toLocaleString()}원`;
    }

    calculate() {
        const currentAnnual = parseFloat(this.shadowRoot.querySelector('#current-annual').value);
        const raiseRate = parseFloat(this.shadowRoot.querySelector('#raise-rate').value);
        const effectiveTaxRate = parseFloat(this.shadowRoot.querySelector('#effective-tax-rate').value) || 0;
        const resultEl = this.shadowRoot.querySelector('#result');

        if (!currentAnnual || raiseRate < 0) {
            resultEl.textContent = '현재 연봉과 인상률을 입력하세요.';
            return;
        }

        const newAnnual = currentAnnual * (1 + raiseRate / 100);
        const annualIncrease = newAnnual - currentAnnual;
        const monthlyIncrease = annualIncrease / 12;
        const netCurrentAnnual = currentAnnual * (1 - effectiveTaxRate / 100);
        const netNewAnnual = newAnnual * (1 - effectiveTaxRate / 100);
        const netAnnualIncrease = netNewAnnual - netCurrentAnnual;

        resultEl.innerHTML = `
            <div class="money">인상 전 연봉: ${this.formatWon(currentAnnual)}</div>
            <div class="money">인상 후 연봉: ${this.formatWon(newAnnual)}</div>
            <div class="money">연봉 증가액(세전): ${this.formatWon(annualIncrease)}</div>
            <div class="money">월 증가액(세전): ${this.formatWon(monthlyIncrease)}</div>
            <div class="money">연 증가액(세후 추정): ${this.formatWon(netAnnualIncrease)}</div>
        `;
    }
}

class LoanRepaymentCalculator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                h2 { color: #0f766e; }
                .form-group { margin-bottom: 1rem; }
                label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
                input, select { width: 100%; box-sizing: border-box; padding: 0.55rem; border: 1px solid #ccc; border-radius: 4px; }
                button { background-color: #0f766e; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; }
                #result { margin-top: 1rem; line-height: 1.55; }
                .money { font-weight: 700; }
            </style>
            <div>
                <h2>대출 상환 계산기</h2>
                <div class="form-group">
                    <label for="loan-principal">대출 원금 (원)</label>
                    <input type="number" id="loan-principal" placeholder="100000000" min="0">
                </div>
                <div class="form-group">
                    <label for="loan-rate">연 이자율 (%)</label>
                    <input type="number" id="loan-rate" placeholder="4.5" min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label for="loan-months">상환 기간 (개월)</label>
                    <input type="number" id="loan-months" placeholder="360" min="1">
                </div>
                <div class="form-group">
                    <label for="repayment-type">상환 방식</label>
                    <select id="repayment-type">
                        <option value="equal-payment">원리금균등</option>
                        <option value="equal-principal">원금균등</option>
                    </select>
                </div>
                <button>계산</button>
                <div id="result"></div>
            </div>
        `;
        this.shadowRoot.querySelector('button').addEventListener('click', () => this.calculate());
    }

    formatWon(amount) {
        return `${Math.round(amount).toLocaleString()}원`;
    }

    calculate() {
        const principal = parseFloat(this.shadowRoot.querySelector('#loan-principal').value);
        const annualRate = parseFloat(this.shadowRoot.querySelector('#loan-rate').value);
        const months = parseInt(this.shadowRoot.querySelector('#loan-months').value, 10);
        const type = this.shadowRoot.querySelector('#repayment-type').value;
        const resultEl = this.shadowRoot.querySelector('#result');

        if (!principal || annualRate < 0 || !months) {
            resultEl.textContent = '대출 원금, 이자율, 기간을 입력하세요.';
            return;
        }

        const monthlyRate = annualRate / 100 / 12;
        let firstMonthPayment = 0;
        let averageMonthlyPayment = 0;
        let totalInterest = 0;
        let totalPayment = 0;

        if (type === 'equal-payment') {
            if (monthlyRate === 0) {
                firstMonthPayment = principal / months;
            } else {
                const pow = Math.pow(1 + monthlyRate, months);
                firstMonthPayment = principal * monthlyRate * pow / (pow - 1);
            }
            totalPayment = firstMonthPayment * months;
            totalInterest = totalPayment - principal;
            averageMonthlyPayment = firstMonthPayment;
        } else {
            const monthlyPrincipal = principal / months;
            let remaining = principal;
            let first = 0;
            for (let i = 0; i < months; i++) {
                const interest = remaining * monthlyRate;
                const payment = monthlyPrincipal + interest;
                if (i === 0) first = payment;
                totalPayment += payment;
                totalInterest += interest;
                remaining -= monthlyPrincipal;
            }
            firstMonthPayment = first;
            averageMonthlyPayment = totalPayment / months;
        }

        resultEl.innerHTML = `
            <div class="money">첫 달 상환액: ${this.formatWon(firstMonthPayment)}</div>
            <div class="money">월 평균 상환액: ${this.formatWon(averageMonthlyPayment)}</div>
            <div class="money">총 이자: ${this.formatWon(totalInterest)}</div>
            <div class="money">총 상환액: ${this.formatWon(totalPayment)}</div>
        `;
    }
}

class TaxSavingTipsAI extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                :host { color: inherit; }
                h2 { color: #2563eb; }
                .form-group { margin-bottom: 1rem; }
                label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: inherit; }
                input { width: 100%; box-sizing: border-box; padding: 0.55rem; border: 1px solid #ccc; border-radius: 4px; background: #ffffff; color: #0f172a; }
                button { background-color: #2563eb; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; }
                #result { margin-top: 1rem; line-height: 1.55; }
                .tip { border: 1px solid #bfdbfe; background: #eff6ff; color: #1e293b; border-radius: 8px; padding: 10px; margin-top: 8px; }
                .title { font-weight: 700; margin-bottom: 4px; }
                .small { color: #64748b; font-size: 0.9rem; margin-top: 0.75rem; }
            </style>
            <div>
                <h2>세금 절약 팁 자동 추천 (AI)</h2>
                <div class="form-group">
                    <label for="ai-annual-income">연 소득 (원)</label>
                    <input type="number" id="ai-annual-income" placeholder="42000000" min="0">
                </div>
                <div class="form-group">
                    <label for="ai-card-spend">연 카드 사용액 (원)</label>
                    <input type="number" id="ai-card-spend" placeholder="10000000" min="0">
                </div>
                <div class="form-group">
                    <label for="ai-pension">연금계좌 납입액 (원)</label>
                    <input type="number" id="ai-pension" placeholder="2000000" min="0">
                </div>
                <div class="form-group">
                    <label for="ai-insurance">보장성 보험료 납입액 (원)</label>
                    <input type="number" id="ai-insurance" placeholder="800000" min="0">
                </div>
                <div class="form-group">
                    <label for="ai-dependents">부양가족 수</label>
                    <input type="number" id="ai-dependents" placeholder="1" min="0" step="1">
                </div>
                <button>AI 추천 받기</button>
                <div id="result"></div>
                <p class="small">안내: AI 추천은 입력값 기반의 절세 패턴 가이드이며 세무 자문을 대체하지 않습니다.</p>
            </div>
        `;
        this.shadowRoot.querySelector('button').addEventListener('click', () => this.recommend());
    }

    recommend() {
        const income = parseFloat(this.shadowRoot.querySelector('#ai-annual-income').value);
        const cardSpend = parseFloat(this.shadowRoot.querySelector('#ai-card-spend').value) || 0;
        const pension = parseFloat(this.shadowRoot.querySelector('#ai-pension').value) || 0;
        const insurance = parseFloat(this.shadowRoot.querySelector('#ai-insurance').value) || 0;
        const dependents = parseInt(this.shadowRoot.querySelector('#ai-dependents').value || '0', 10);
        const resultEl = this.shadowRoot.querySelector('#result');

        if (!income) {
            resultEl.textContent = '연 소득을 입력하세요.';
            return;
        }

        const tips = [];
        if (pension < 4000000) {
            tips.push({
                title: '연금계좌 세액공제 점검',
                body: '연금저축/IRP 납입 여력이 있다면 세액공제 한도 활용을 검토하세요.'
            });
        }
        if (cardSpend < income * 0.25) {
            tips.push({
                title: '카드 공제 최소 구간 확보',
                body: '연 소득 대비 카드 사용액이 낮아 공제 효율이 떨어질 수 있습니다. 사용 구조를 점검해 보세요.'
            });
        }
        if (insurance < 1000000) {
            tips.push({
                title: '보장성 보험료 공제 확인',
                body: '보장성 보험료 공제 대상 여부를 확인하고, 누락된 증빙이 없는지 점검하세요.'
            });
        }
        if (dependents === 0) {
            tips.push({
                title: '인적공제 대상 재확인',
                body: '부양가족 요건을 충족하는 가족이 있다면 인적공제 적용 가능성을 확인하세요.'
            });
        }
        tips.push({
            title: '증빙 자동화',
            body: '연말정산 전 카드·보험·교육·의료 지출을 월별로 정리하면 누락 공제를 줄일 수 있습니다.'
        });

        resultEl.innerHTML = tips.slice(0, 4).map((tip, idx) => `
            <div class="tip">
                <div class="title">${idx + 1}. ${tip.title}</div>
                <div>${tip.body}</div>
            </div>
        `).join('');
    }
}

class DetailedSalaryCalculator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                .form-group { margin-bottom: 0.75rem; }
                label { display: block; margin-bottom: 0.3rem; font-weight: 600; }
                input { width: 100%; padding: 0.5rem; box-sizing: border-box; border: 1px solid #cbd5e1; border-radius: 6px; }
                button { background: #1d4ed8; color: white; border: 0; padding: 0.65rem 1rem; border-radius: 6px; cursor: pointer; }
                #result { margin-top: 0.8rem; line-height: 1.5; }
                .money { font-weight: 700; }
            </style>
            <div>
                <div class="form-group"><label>세전 월급 (원)</label><input id="gross" type="number" placeholder="3000000"></div>
                <div class="form-group"><label>국민연금률 (%)</label><input id="pension" type="number" value="4.5" step="0.01"></div>
                <div class="form-group"><label>건강보험률 (%)</label><input id="health" type="number" value="3.545" step="0.001"></div>
                <div class="form-group"><label>고용보험률 (%)</label><input id="employment" type="number" value="0.9" step="0.01"></div>
                <div class="form-group"><label>소득세+지방세 추정률 (%)</label><input id="tax" type="number" value="3.0" step="0.1"></div>
                <button id="run">세부 계산</button>
                <div id="result"></div>
            </div>
        `;
        this.shadowRoot.getElementById('run').addEventListener('click', () => this.calculate());
    }
    won(v) { return `${Math.round(v).toLocaleString()}원`; }
    calculate() {
        const gross = parseFloat(this.shadowRoot.getElementById('gross').value);
        const pensionRate = parseFloat(this.shadowRoot.getElementById('pension').value) || 0;
        const healthRate = parseFloat(this.shadowRoot.getElementById('health').value) || 0;
        const employmentRate = parseFloat(this.shadowRoot.getElementById('employment').value) || 0;
        const taxRate = parseFloat(this.shadowRoot.getElementById('tax').value) || 0;
        const el = this.shadowRoot.getElementById('result');
        if (!gross) { el.textContent = '세전 월급을 입력하세요.'; return; }
        const pension = gross * pensionRate / 100;
        const health = gross * healthRate / 100;
        const employment = gross * employmentRate / 100;
        const tax = gross * taxRate / 100;
        const totalDeduction = pension + health + employment + tax;
        const net = gross - totalDeduction;
        el.innerHTML = `
          <div class="money">국민연금: ${this.won(pension)}</div>
          <div class="money">건강보험: ${this.won(health)}</div>
          <div class="money">고용보험: ${this.won(employment)}</div>
          <div class="money">소득세+지방세(추정): ${this.won(tax)}</div>
          <div class="money">총 공제액: ${this.won(totalDeduction)}</div>
          <div class="money">예상 실수령액: ${this.won(net)}</div>
        `;
    }
}

class MonthlyTakeHomeCalendar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                .form-group { margin-bottom: 0.75rem; }
                label { display: block; margin-bottom: 0.3rem; font-weight: 600; }
                input, select { width: 100%; padding: 0.5rem; box-sizing: border-box; border: 1px solid #cbd5e1; border-radius: 6px; }
                button { background: #0f766e; color: white; border: 0; padding: 0.65rem 1rem; border-radius: 6px; cursor: pointer; }
                table { width: 100%; border-collapse: collapse; margin-top: 0.8rem; font-size: 0.9rem; }
                th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: left; }
            </style>
            <div>
                <div class="form-group"><label>기본 월 실수령액 (원)</label><input id="base" type="number" placeholder="2500000"></div>
                <div class="form-group"><label>상여 지급 월</label><select id="bonusMonth">${Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">${i + 1}월</option>`).join('')}</select></div>
                <div class="form-group"><label>상여 실수령액 (원)</label><input id="bonus" type="number" value="0"></div>
                <div class="form-group"><label>월 무급휴가 일수</label><input id="unpaid" type="number" value="0"></div>
                <div class="form-group"><label>월 추가 수당 (원)</label><input id="extra" type="number" value="0"></div>
                <button id="run">12개월 계산</button>
                <div id="result"></div>
            </div>
        `;
        this.shadowRoot.getElementById('run').addEventListener('click', () => this.calculate());
    }
    calculate() {
        const base = parseFloat(this.shadowRoot.getElementById('base').value);
        const bonusMonth = parseInt(this.shadowRoot.getElementById('bonusMonth').value, 10);
        const bonus = parseFloat(this.shadowRoot.getElementById('bonus').value) || 0;
        const unpaid = parseFloat(this.shadowRoot.getElementById('unpaid').value) || 0;
        const extra = parseFloat(this.shadowRoot.getElementById('extra').value) || 0;
        const el = this.shadowRoot.getElementById('result');
        if (!base) { el.textContent = '기본 월 실수령액을 입력하세요.'; return; }
        const daily = base / 30;
        let rows = '';
        let total = 0;
        for (let m = 1; m <= 12; m++) {
            let value = base - (daily * unpaid) + extra + (m === bonusMonth ? bonus : 0);
            total += value;
            rows += `<tr><td>${m}월</td><td>${Math.round(value).toLocaleString()}원</td></tr>`;
        }
        el.innerHTML = `<table><thead><tr><th>월</th><th>예상 실수령</th></tr></thead><tbody>${rows}</tbody></table><div style="margin-top:8px;font-weight:700;">연 합계: ${Math.round(total).toLocaleString()}원</div>`;
    }
}

class JobOfferComparator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .form-group { margin-bottom: 0.7rem; }
                label { display: block; margin-bottom: 0.25rem; font-weight: 600; }
                input { width: 100%; padding: 0.5rem; box-sizing: border-box; border: 1px solid #cbd5e1; border-radius: 6px; }
                button { background: #7c3aed; color: white; border: 0; padding: 0.65rem 1rem; border-radius: 6px; cursor: pointer; }
            </style>
            <div>
              <div class="grid">
                <div>
                  <div class="form-group"><label>A 연봉</label><input id="aAnnual" type="number" placeholder="50000000"></div>
                  <div class="form-group"><label>A 월 복리 (식대/교통)</label><input id="aBenefit" type="number" value="0"></div>
                </div>
                <div>
                  <div class="form-group"><label>B 연봉</label><input id="bAnnual" type="number" placeholder="55000000"></div>
                  <div class="form-group"><label>B 월 복리 (식대/교통)</label><input id="bBenefit" type="number" value="0"></div>
                </div>
              </div>
              <button id="run">비교</button>
              <div id="result" style="margin-top:8px;"></div>
            </div>
        `;
        this.shadowRoot.getElementById('run').addEventListener('click', () => this.calculate());
    }
    calculate() {
        const aAnnual = parseFloat(this.shadowRoot.getElementById('aAnnual').value);
        const aBenefit = parseFloat(this.shadowRoot.getElementById('aBenefit').value) || 0;
        const bAnnual = parseFloat(this.shadowRoot.getElementById('bAnnual').value);
        const bBenefit = parseFloat(this.shadowRoot.getElementById('bBenefit').value) || 0;
        const el = this.shadowRoot.getElementById('result');
        if (!aAnnual || !bAnnual) { el.textContent = 'A/B 연봉을 입력하세요.'; return; }
        const aNet = (aAnnual * 0.88) + (aBenefit * 12);
        const bNet = (bAnnual * 0.88) + (bBenefit * 12);
        const diff = bNet - aNet;
        el.innerHTML = `
          <div><strong>A 연 실수령 추정:</strong> ${Math.round(aNet).toLocaleString()}원</div>
          <div><strong>B 연 실수령 추정:</strong> ${Math.round(bNet).toLocaleString()}원</div>
          <div><strong>차이(B-A):</strong> ${Math.round(diff).toLocaleString()}원</div>
        `;
    }
}

class ExitPackageCalculator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                .form-group { margin-bottom: 0.75rem; }
                label { display: block; margin-bottom: 0.3rem; font-weight: 600; }
                input { width: 100%; padding: 0.5rem; box-sizing: border-box; border: 1px solid #cbd5e1; border-radius: 6px; }
                button { background: #b45309; color: white; border: 0; padding: 0.65rem 1rem; border-radius: 6px; cursor: pointer; }
            </style>
            <div>
              <div class="form-group"><label>최근 3개월 급여 총액 (원)</label><input id="sum3m" type="number" placeholder="9000000"></div>
              <div class="form-group"><label>총 재직일수</label><input id="days" type="number" placeholder="730"></div>
              <div class="form-group"><label>미사용 연차 일수</label><input id="leaveDays" type="number" value="0"></div>
              <button id="run">통합 계산</button>
              <div id="result" style="margin-top:8px;"></div>
            </div>
        `;
        this.shadowRoot.getElementById('run').addEventListener('click', () => this.calculate());
    }
    calculate() {
        const sum3m = parseFloat(this.shadowRoot.getElementById('sum3m').value);
        const days = parseFloat(this.shadowRoot.getElementById('days').value);
        const leaveDays = parseFloat(this.shadowRoot.getElementById('leaveDays').value) || 0;
        const el = this.shadowRoot.getElementById('result');
        if (!sum3m || !days) { el.textContent = '최근 3개월 급여 총액과 재직일수를 입력하세요.'; return; }
        const daily = sum3m / 90;
        const severance = daily * 30 * (days / 365);
        const leavePay = daily * leaveDays;
        const total = severance + leavePay;
        el.innerHTML = `
          <div><strong>퇴직금 추정:</strong> ${Math.round(severance).toLocaleString()}원</div>
          <div><strong>연차수당 추정:</strong> ${Math.round(leavePay).toLocaleString()}원</div>
          <div><strong>퇴사 시 총 수령 추정:</strong> ${Math.round(total).toLocaleString()}원</div>
        `;
    }
}

class RefinanceComparator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                .form-group { margin-bottom: 0.75rem; }
                label { display: block; margin-bottom: 0.3rem; font-weight: 600; }
                input { width: 100%; padding: 0.5rem; box-sizing: border-box; border: 1px solid #cbd5e1; border-radius: 6px; }
                button { background: #0f766e; color: white; border: 0; padding: 0.65rem 1rem; border-radius: 6px; cursor: pointer; }
            </style>
            <div>
              <div class="form-group"><label>잔여 원금 (원)</label><input id="principal" type="number" placeholder="200000000"></div>
              <div class="form-group"><label>기존 금리 (%)</label><input id="oldRate" type="number" placeholder="5.2"></div>
              <div class="form-group"><label>대환 금리 (%)</label><input id="newRate" type="number" placeholder="3.9"></div>
              <div class="form-group"><label>잔여 기간 (개월)</label><input id="months" type="number" placeholder="240"></div>
              <div class="form-group"><label>중도상환수수료율 (%)</label><input id="feeRate" type="number" value="1.0"></div>
              <button id="run">대환 비교</button>
              <div id="result" style="margin-top:8px;"></div>
            </div>
        `;
        this.shadowRoot.getElementById('run').addEventListener('click', () => this.calculate());
    }
    totalInterest(principal, annualRate, months) {
        const r = annualRate / 100 / 12;
        if (r === 0) return 0;
        const pow = Math.pow(1 + r, months);
        const payment = principal * r * pow / (pow - 1);
        return (payment * months) - principal;
    }
    calculate() {
        const principal = parseFloat(this.shadowRoot.getElementById('principal').value);
        const oldRate = parseFloat(this.shadowRoot.getElementById('oldRate').value);
        const newRate = parseFloat(this.shadowRoot.getElementById('newRate').value);
        const months = parseInt(this.shadowRoot.getElementById('months').value, 10);
        const feeRate = parseFloat(this.shadowRoot.getElementById('feeRate').value) || 0;
        const el = this.shadowRoot.getElementById('result');
        if (!principal || !months) { el.textContent = '잔여 원금과 기간을 입력하세요.'; return; }
        const oldInt = this.totalInterest(principal, oldRate, months);
        const newInt = this.totalInterest(principal, newRate, months);
        const fee = principal * feeRate / 100;
        const saving = oldInt - newInt - fee;
        el.innerHTML = `
          <div><strong>기존 총이자:</strong> ${Math.round(oldInt).toLocaleString()}원</div>
          <div><strong>대환 총이자:</strong> ${Math.round(newInt).toLocaleString()}원</div>
          <div><strong>중도상환수수료:</strong> ${Math.round(fee).toLocaleString()}원</div>
          <div><strong>대환 순효과:</strong> ${Math.round(saving).toLocaleString()}원</div>
        `;
    }
}

class TaxChecklistManager extends HTMLElement {
    constructor() {
        super();
        this.key = 'tax_checklist_v1';
        this.items = ['연금계좌 납입 확인', '보장성 보험료 증빙 확인', '카드 사용내역 누락 점검', '의료비/교육비 공제 대상 확인', '부양가족 공제 요건 확인', '회사 제출 기한 체크'];
        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                .item { margin: 6px 0; display: flex; gap: 8px; align-items: center; }
                button { margin-top: 8px; background: #475569; color: white; border: 0; padding: 0.5rem 0.8rem; border-radius: 6px; cursor: pointer; }
            </style>
            <div>
              <div id="list"></div>
              <button id="reset">체크 초기화</button>
            </div>
        `;
        this.render();
        this.shadowRoot.getElementById('reset').addEventListener('click', () => {
            localStorage.removeItem(this.key);
            this.render();
        });
    }
    render() {
        const saved = JSON.parse(localStorage.getItem(this.key) || '[]');
        const list = this.shadowRoot.getElementById('list');
        list.innerHTML = this.items.map((item, idx) => `<label class="item"><input type="checkbox" data-idx="${idx}" ${saved[idx] ? 'checked' : ''}> ${item}</label>`).join('');
        list.querySelectorAll('input[type="checkbox"]').forEach((box) => {
            box.addEventListener('change', () => {
                const next = Array.from(list.querySelectorAll('input[type="checkbox"]')).map((el) => el.checked);
                localStorage.setItem(this.key, JSON.stringify(next));
            });
        });
    }
}

class ResultExportTool extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                textarea { width: 100%; min-height: 120px; box-sizing: border-box; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px; }
                .actions { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
                button { background: #1e40af; color: white; border: 0; padding: 0.5rem 0.8rem; border-radius: 6px; cursor: pointer; }
            </style>
            <div>
              <textarea id="text" placeholder="저장할 계산 결과/메모를 입력하세요."></textarea>
              <div class="actions">
                <button id="download">TXT 저장</button>
                <button id="copy">복사</button>
              </div>
            </div>
        `;
        this.shadowRoot.getElementById('download').addEventListener('click', () => this.download());
        this.shadowRoot.getElementById('copy').addEventListener('click', () => this.copy());
    }
    download() {
        const text = this.shadowRoot.getElementById('text').value || '저장할 내용이 없습니다.';
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'salary-calculation-result.txt';
        a.click();
        URL.revokeObjectURL(a.href);
    }
    async copy() {
        const text = this.shadowRoot.getElementById('text').value;
        if (!text) return;
        try { await navigator.clipboard.writeText(text); } catch (_) {}
    }
}

class RegulationUpdateBanner extends HTMLElement {
    constructor() {
        super();
        this.key = 'regulation_banner_hidden';
        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                .banner { border: 1px solid #fde68a; background: #fffbeb; color: #7c2d12; padding: 10px; border-radius: 8px; display: flex; justify-content: space-between; gap: 8px; align-items: center; }
                button { background: #b45309; color: white; border: 0; padding: 0.35rem 0.6rem; border-radius: 6px; cursor: pointer; }
            </style>
            <div id="wrap"></div>
        `;
        this.render();
    }
    render() {
        const wrap = this.shadowRoot.getElementById('wrap');
        if (localStorage.getItem(this.key) === '1') { wrap.innerHTML = ''; return; }
        wrap.innerHTML = `<div class="banner"><span>최저시급·4대보험·세율은 매년 변경될 수 있습니다. 최신 요율을 확인하고 계산값을 갱신하세요.</span><button id="hide">닫기</button></div>`;
        this.shadowRoot.getElementById('hide').addEventListener('click', () => {
            localStorage.setItem(this.key, '1');
            this.render();
        });
    }
}


customElements.define('part-time-pay-calculator', PartTimePayCalculator);
customElements.define('salary-raise-simulator', SalaryRaiseSimulator);
customElements.define('loan-repayment-calculator', LoanRepaymentCalculator);
customElements.define('tax-saving-tips-ai', TaxSavingTipsAI);
customElements.define('detailed-salary-calculator', DetailedSalaryCalculator);
customElements.define('monthly-takehome-calendar', MonthlyTakeHomeCalendar);
customElements.define('job-offer-comparator', JobOfferComparator);
customElements.define('exit-package-calculator', ExitPackageCalculator);
customElements.define('refinance-comparator', RefinanceComparator);
customElements.define('tax-checklist-manager', TaxChecklistManager);
customElements.define('result-export-tool', ResultExportTool);
customElements.define('regulation-update-banner', RegulationUpdateBanner);
customElements.define('after-tax-calculator', AfterTaxCalculator);
customElements.define('annual-salary-calculator', AnnualSalaryCalculator);
customElements.define('severance-pay-calculator', SeverancePayCalculator);
customElements.define('loan-interest-calculator', LoanInterestCalculator);
