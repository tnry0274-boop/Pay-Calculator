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


customElements.define('after-tax-calculator', AfterTaxCalculator);
customElements.define('annual-salary-calculator', AnnualSalaryCalculator);
customElements.define('severance-pay-calculator', SeverancePayCalculator);
customElements.define('loan-interest-calculator', LoanInterestCalculator);
