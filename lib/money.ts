export function centsToDollars(cents: number): number {
  return cents / 100;
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(centsToDollars(cents));
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function parseDollarInput(value: string | undefined): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    return undefined;
  }

  return dollarsToCents(parsed);
}
