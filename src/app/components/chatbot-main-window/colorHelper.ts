export function returnColorForQuestions(
  themeName: string,
  inHex: boolean
): string {
  switch (themeName) {
    case 'lara-dark-blue':
      return inHex ? '#93C5FD' : 'custom-card-body-db border-class-right';

    case 'lara-dark-indigo':
      return inHex ? '#A5B4FC' : 'custom-card-body-di border-class-right';

    case 'lara-dark-purple':
      return inHex ? '#C4B5FD' : 'custom-card-body-dp border-class-right';

    case 'lara-dark-teal':
      return inHex ? '#5EEAD4' : 'custom-card-body-dt border-class-right';

    case 'lara-light-blue':
      return inHex ? '#3B82F6' : 'custom-card-body-lb border-class-right';

    case 'lara-light-indigo':
      return inHex ? '#6366F1' : 'custom-card-body-li border-class-right';

    case 'lara-light-purple':
      return inHex ? '#8B5CF6' : 'custom-card-body-lp border-class-right';

    case 'lara-light-teal':
      return inHex ? '#14B8A6' : 'custom-card-body-lt border-class-right';

    default:
      return '';
  }
}

export function returnColorForAnswers(
  themeName: string,
  inHex: boolean
): string {
  if (themeName.includes('light')) {
    return inHex ? '#F8F9FA' : 'custom-card-body-light border-class-left-light';
  } else if (themeName.includes('dark')) {
    return inHex ? '#040D19' : 'custom-card-body-dark border-class-left-dark';
  } else {
    return '';
  }
}

// https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
export function invertColor(hex: string) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  const r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);

  // https://stackoverflow.com/a/3943023/112731
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
}
