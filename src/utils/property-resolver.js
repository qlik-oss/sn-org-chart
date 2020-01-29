function getValue(dataContainer, reference, defaultValue) {
  const steps = reference.split('.');
  let i;
  if (dataContainer === undefined) {
    return defaultValue;
  }
  let currentValue = dataContainer;
  for (i = 0; i < steps.length; ++i) {
    if (typeof currentValue[steps[i]] === 'undefined') {
      return defaultValue;
    }
    currentValue = currentValue[steps[i]];
  }

  return currentValue;
}

export default {
  getValue,
};
