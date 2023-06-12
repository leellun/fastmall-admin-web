export function formatAmount(amount: string) {
  // 去除金额中的非数字和小数点
  amount = amount.replace(/[^\d.]/g, "");
  // 保留两位小数
  const parts = amount.split(".");
  if (parts.length > 1) {
    parts[1] = parts[1].slice(0, 2);
    amount = parts.join(".");
  }
  return amount;
}
