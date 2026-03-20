const formatter = new Intl.NumberFormat('ru-RU');

const propertyPrice = document.getElementById('propertyPrice');
const downPayment = document.getElementById('downPayment');
const loanTerm = document.getElementById('loanTerm');
const interestRate = document.getElementById('interestRate');
const programInputs = document.querySelectorAll('input[name="program"]');

const outputs = {
  propertyPriceValue: document.getElementById('propertyPriceValue'),
  downPaymentValue: document.getElementById('downPaymentValue'),
  loanTermValue: document.getElementById('loanTermValue'),
  interestRateValue: document.getElementById('interestRateValue'),
  monthlyPayment: document.getElementById('monthlyPayment'),
  loanAmount: document.getElementById('loanAmount'),
  downPaymentResult: document.getElementById('downPaymentResult'),
  interestRateResult: document.getElementById('interestRateResult'),
  loanTermResult: document.getElementById('loanTermResult'),
  programNameResult: document.getElementById('programNameResult')
};

function formatMoney(value) {
  return `${formatter.format(Math.round(value))} ₽`;
}

function getSelectedProgram() {
  const selected = [...programInputs].find(input => input.checked);
  return {
    rate: Number(selected.value),
    name: selected.parentElement.querySelector('span').textContent
  };
}

function yearsLabel(value) {
  return `${value} ${value === 1 ? 'год' : value < 5 ? 'года' : 'лет'}`;
}

function calculateMortgage() {
  const price = Number(propertyPrice.value);
  let firstPay = Number(downPayment.value);
  const years = Number(loanTerm.value);
  const program = getSelectedProgram();

  interestRate.value = program.rate;
  const annualRate = Number(interestRate.value);

  if (firstPay >= price) {
    firstPay = price * 0.9;
    downPayment.value = Math.round(firstPay);
  }

  const loan = price - firstPay;
  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;

  let monthlyPayment;
  if (monthlyRate === 0) {
    monthlyPayment = loan / months;
  } else {
    monthlyPayment = loan * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
  }

  outputs.propertyPriceValue.textContent = formatMoney(price);
  outputs.downPaymentValue.textContent = formatMoney(firstPay);
  outputs.loanTermValue.textContent = yearsLabel(years);
  outputs.interestRateValue.textContent = `${annualRate}%`;

  outputs.monthlyPayment.textContent = `${formatter.format(Math.round(monthlyPayment))} ₽ / мес.`;
  outputs.loanAmount.textContent = formatMoney(loan);
  outputs.downPaymentResult.textContent = formatMoney(firstPay);
  outputs.interestRateResult.textContent = `${annualRate}%`;
  outputs.loanTermResult.textContent = yearsLabel(years);
  outputs.programNameResult.textContent = program.name;
}

[propertyPrice, downPayment, loanTerm, interestRate].forEach(field => {
  field.addEventListener('input', calculateMortgage);
  field.addEventListener('change', calculateMortgage);
});

programInputs.forEach(input => {
  input.addEventListener('change', calculateMortgage);
});

calculateMortgage();
