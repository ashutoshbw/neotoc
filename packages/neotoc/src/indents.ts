// The term indent width is used here to refer to width that starts
// from the start start of a toggle fold button to the half of that button.
// That button statys in any above parent non-foldable.
// Note that it's NOT the distance between two indent lines!
export function indentWidth(power: number) {
  return `calc(calc(var(--toggle-fold-btn-width) / 2) * pow(calc(100 / var(--relative-font-size)), ${power}) + calc(var(--indent-line-width) / 2))`;
}

// The purpose of this padding is to make the distance between indent lines equal
export function getRelativePadding(power: number) {
  return `calc(var(--max-indent-width) - ${indentWidth(power)})`;
}
