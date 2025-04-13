export function formatUnit(unit: string) {
  switch (unit) {
    case "minute":
      return "m";
    default:
      return unit;
  }
}
