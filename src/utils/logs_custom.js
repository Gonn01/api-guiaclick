const isLocal = true;

function print(color, prefix, message) {
  if (!isLocal) return;
  console.log(`\x1b[${color}m%s\x1b[0m`, `${prefix} ${message}\n--------------------------------------------------`);
}

export function logGreen(message) { print(32, "✅", message); }
export function logRed(message) { print(31, "❌", message); }
export function logBlue(message) { print(34, "🔵", message); }
export function logYellow(message) { print(33, "⚠️ ", message); }
export function logPurple(message) { print(35, "💜", message); }
export function logCyan(message) { print(36, "💎", message); }
