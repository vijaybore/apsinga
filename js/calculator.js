/**
 * Solar Savings & Subsidy Calculator for Apsinga Tech Infra Solutions
 * Implements PM Surya Ghar: Muft Bijli Yojana subsidy logic & Maharashtra tariff models.
 */

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(Math.round(amount));
}

function calculateSolarSavings() {
  const billInput = document.getElementById('billRange');
  const billValueDisplay = document.getElementById('billValueDisplay');
  const propType = document.getElementById('calcPropType') ? document.getElementById('calcPropType').value : 'residential';

  let monthlyBill = parseInt(billInput ? billInput.value : 3500, 10);
  if (isNaN(monthlyBill) || monthlyBill < 800) monthlyBill = 800;

  if (billValueDisplay) {
    billValueDisplay.innerText = '₹' + formatINR(monthlyBill);
  }

  // System Size calculation
  // Average 1 kW solar in Maharashtra produces ~120 to 130 units/month.
  // Average cost per unit is approx ₹8.5 to ₹9.5 for residential.
  const unitsNeeded = monthlyBill / 9.0;
  let rawKw = unitsNeeded / 125;
  
  // Clean rounding: min 1kW, rounded to 0.5 increments for <5kW, 1kW for larger
  let systemSize = Math.max(1, Math.round(rawKw * 2) / 2);
  if (systemSize > 10) systemSize = Math.round(systemSize);

  // Roof space required (80 to 90 sq ft per kW)
  const roofSpace = Math.round(systemSize * 85);

  // Government Subsidy Calculation (PM Surya Ghar Rules)
  let govtSubsidy = 0;
  let subsidyLabel = "₹78,000";

  if (propType === 'residential') {
    if (systemSize <= 1) {
      govtSubsidy = 30000;
      subsidyLabel = "₹30,000";
    } else if (systemSize <= 2) {
      govtSubsidy = 60000;
      subsidyLabel = "₹60,000";
    } else {
      govtSubsidy = 78000;
      subsidyLabel = "₹78,000 (Max Cap)";
    }
  } else if (propType === 'society') {
    govtSubsidy = Math.min(systemSize * 18000, 78000 * 10);
    subsidyLabel = "₹" + formatINR(govtSubsidy);
  } else {
    // Commercial / Industrial: 40% Accelerated Depreciation tax benefit
    govtSubsidy = Math.round(systemSize * 45000 * 0.25); // Estimated Tax savings
    subsidyLabel = "Tax Benefits (40% AD)";
  }

  // Monthly & Annual savings (approx 85-92% bill elimination)
  const monthlySavings = Math.min(monthlyBill * 0.92, systemSize * 125 * 9);
  const annualSavings = monthlySavings * 12;
  
  // 25-Year Lifetime Savings (factoring standard 4% power tariff inflation over 25 years)
  const lifetimeSavings = annualSavings * 25 * 1.35;

  // Environmental Metrics
  const co2Reduction = (systemSize * 1.3).toFixed(1);
  const treesPlanted = Math.round(systemSize * 58);

  // Update DOM Elements
  const elSystemSize = document.getElementById('calcResultSystem');
  const elRoofArea = document.getElementById('calcResultRoof');
  const elSubsidy = document.getElementById('calcResultSubsidy');
  const elMonthly = document.getElementById('calcResultMonthly');
  const elAnnual = document.getElementById('calcResultAnnual');
  const elLifetime = document.getElementById('calcResultLifetime');
  const elCO2 = document.getElementById('calcResultCO2');
  const elTrees = document.getElementById('calcResultTrees');

  if (elSystemSize) elSystemSize.innerText = systemSize + ' kW';
  if (elRoofArea) elRoofArea.innerText = formatINR(roofSpace) + ' sq.ft';
  if (elSubsidy) elSubsidy.innerText = typeof govtSubsidy === 'number' ? '₹' + formatINR(govtSubsidy) : subsidyLabel;
  if (elMonthly) elMonthly.innerText = '₹' + formatINR(monthlySavings);
  if (elAnnual) elAnnual.innerText = '₹' + formatINR(annualSavings);
  if (elLifetime) elLifetime.innerText = '₹' + (lifetimeSavings >= 100000 ? (lifetimeSavings / 100000).toFixed(1) + ' Lakhs' : formatINR(lifetimeSavings));
  if (elCO2) elCO2.innerText = co2Reduction + ' Tons';
  if (elTrees) elTrees.innerText = treesPlanted + ' Trees';

  // Setup WhatsApp CTA link
  const btnWhatsApp = document.getElementById('calcWhatsAppBtn');
  if (btnWhatsApp) {
    const message = encodeURIComponent(
      `Hello Apsinga Tech Infra Solutions! ☀️\n\nI calculated my solar savings on your website:\n` +
      `• Monthly Bill: ₹${formatINR(monthlyBill)}\n` +
      `• Recommended System: ${systemSize} kW\n` +
      `• Estimated Roof Area: ${formatINR(roofSpace)} sq.ft\n` +
      `• Central Govt Subsidy: ₹${formatINR(govtSubsidy)}\n` +
      `• 25-Year Net Savings: ₹${(lifetimeSavings / 100000).toFixed(1)} Lakhs\n\n` +
      `Please share a customized proposal and schedule my FREE Site Survey.`
    );
    btnWhatsApp.href = `https://wa.me/919699649598?text=${message}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const billRange = document.getElementById('billRange');
  const propType = document.getElementById('calcPropType');

  if (billRange) {
    billRange.addEventListener('input', calculateSolarSavings);
  }
  if (propType) {
    propType.addEventListener('change', calculateSolarSavings);
  }

  // Quick preset buttons for bill
  const presetBtns = document.querySelectorAll('.bill-preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.getAttribute('data-value');
      if (billRange) {
        billRange.value = val;
        calculateSolarSavings();
      }
    });
  });

  // Initial calculation
  calculateSolarSavings();
});
