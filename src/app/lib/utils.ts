export function greetByTime(date: Date = new Date()): string {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) return "God morgen ";
  if (hour >= 12 && hour < 17) return "God dag ";
  if (hour >= 17 && hour < 21) return "Good kveld ";
  return "God dag ";
}

export function getEmailPrefix(email: string): string {
  return email.split("@")[0];
}

export function formatNumber(num: number): string {
  return num.toString().padStart(2, "0");
}

export function parseDate(date: string): string {
  return new Date(date).toLocaleDateString();
}
