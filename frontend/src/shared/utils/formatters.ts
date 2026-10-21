export const formatPrice = (amount: number, currency: 'KES' | 'USD' = 'KES'): string => {
  if (currency === 'KES') {
    return `KES ${amount.toLocaleString('en-KE')}`;
  }
  return `$${amount.toLocaleString('en-US')}`;
};

export const formatMileage = (km: number): string => {
  return `${km.toLocaleString()} km`;
};

export const calculateMonthlyPayment = (
  vehiclePrice: number,
  downPaymentPercent: number = 20,
  interestRateAnnual: number = 13, // Standard car loan rate in Kenya ~13-14%
  tenureMonths: number = 48
): {
  downPaymentAmount: number;
  loanAmount: number;
  monthlyPayment: number;
  totalInterest: number;
} => {
  const downPaymentAmount = (vehiclePrice * downPaymentPercent) / 100;
  const loanAmount = vehiclePrice - downPaymentAmount;
  
  if (loanAmount <= 0) {
    return { downPaymentAmount, loanAmount: 0, monthlyPayment: 0, totalInterest: 0 };
  }

  const monthlyRate = interestRateAnnual / 100 / 12;
  const monthlyPayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths))) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  const totalPayment = monthlyPayment * tenureMonths;
  const totalInterest = totalPayment - loanAmount;

  return {
    downPaymentAmount: Math.round(downPaymentAmount),
    loanAmount: Math.round(loanAmount),
    monthlyPayment: Math.round(monthlyPayment),
    totalInterest: Math.round(totalInterest),
  };
};

export const createWhatsAppLink = (phone: string, text: string): string => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};
