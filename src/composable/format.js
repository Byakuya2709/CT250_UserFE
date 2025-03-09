export function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN"); // Định dạng ngày tháng theo Việt Nam
  }
  
  export function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  }