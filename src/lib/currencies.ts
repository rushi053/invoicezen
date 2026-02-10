export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "MXN", symbol: "MX$", name: "Mexican Peso" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "TWD", symbol: "NT$", name: "Taiwan Dollar" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna" },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel" },
  { code: "CLP", symbol: "CL$", name: "Chilean Peso" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "COP", symbol: "CO$", name: "Colombian Peso" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "RON", symbol: "lei", name: "Romanian Leu" },
  { code: "BGN", symbol: "лв", name: "Bulgarian Lev" },
  { code: "ARS", symbol: "AR$", name: "Argentine Peso" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia" },
  { code: "PEN", symbol: "S/.", name: "Peruvian Sol" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi" },
  { code: "QAR", symbol: "QR", name: "Qatari Riyal" },
  { code: "KWD", symbol: "KD", name: "Kuwaiti Dinar" },
  { code: "BHD", symbol: "BD", name: "Bahraini Dinar" },
  { code: "OMR", symbol: "OMR", name: "Omani Rial" },
  { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee" },
  { code: "MMK", symbol: "K", name: "Myanmar Kyat" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
];

export function getCurrency(code: string): Currency {
  return currencies.find((c) => c.code === code) || currencies[0];
}
