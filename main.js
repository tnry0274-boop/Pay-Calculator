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


customElements.define('part-time-pay-calculator', PartTimePayCalculator);
customElements.define('after-tax-calculator', AfterTaxCalculator);
customElements.define('annual-salary-calculator', AnnualSalaryCalculator);
customElements.define('severance-pay-calculator', SeverancePayCalculator);
customElements.define('loan-interest-calculator', LoanInterestCalculator);
