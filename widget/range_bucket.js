const categories = ['0', '1 - 19', '20 - 39', '40 - 59', '60 - 79', '80 - 99', '100'];
const breakBys = ['created', 'forward', 'backward', 'unchanged'];

const categoryMapper = (category) => {
  if (category === '0' || category === '100') {
    return category;
  }
  return categories[Math.floor(parseInt(category) / 20 + 1)];
};

const breakByMapper = (breakBy) => {
  if (breakBy === 'N\\A') {
    return 'created';
  }
  if (parseInt(breakBy) < 0) {
    return 'backward';
  }
  if (parseInt(breakBy) > 0) {
    return 'forward';
  }
  return 'unchanged';
};

const flattenResult = (rawResult) => {
  const result = [];
  categories.forEach((category) => {
    breakBys.forEach((breakBy) => {
      let value = rawResult[category] && rawResult[category][breakBy] || 0;
      if (breakBy === 'unchanged' && (category === '0' || category === '100')) {
        value = 0;
      }
      result.push([
        { text: category, data: category },
        { text: breakBy, data: breakBy },
        { text: value.toString(), data: value },
      ]);
    });
  });
  return result;
};

widget.on('queryend', (widget, event) => {
  const newRawResult = {};
  event.rawResult.values.forEach((value) => {
    const mappedCategory = categoryMapper(value[0].text);
    const mappedBreakBy = breakByMapper(value[1].text);
    newRawResult[mappedCategory] = newRawResult[mappedCategory] || {};
    newRawResult[mappedCategory][mappedBreakBy] = newRawResult[mappedCategory][mappedBreakBy] || 0;
    newRawResult[mappedCategory][mappedBreakBy] += value[2].data;
  });
  event.rawResult.values = flattenResult(newRawResult);
});
