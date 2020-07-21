const filters = ['Sales Revenue By Country'];
const targetName = 'Target';
const localStorageKey = 'cp_dashboard_targets';

const getTargets = () => {
  try {
    return JSON.parse(localStorage.getItem(localStorageKey)) || {};
  } catch (e) {
    return {};
  }
};

let categoryName = '';
let filterString = '';

widget.on('queryend', (widget, event) => {
  const targets = getTargets();
  categoryName = event.query.metadata.find((data) => (data.wpanel === 'xAxis')).jaql.title;
  filterString = filters.map((filterName) => {
    const filter = event.query.metadata.find((data) => (data.jaql.title === filterName)).jaql.filter;
    if (filter.all) {
      return 'all';
    } else if (filter.exclude) {
      return `!${filter.exclude.members.sort().join('+')}`;
    } else {
      return filter.members.sort().join('+');
    }
  }).join('_');
  const categoryIdx = event.rawResult.headers.indexOf(categoryName);
  const targetIdx = event.rawResult.headers.indexOf(targetName);
  event.rawResult.values.forEach((value) => {
    const category = value[categoryIdx].text;
    const targetKey = `${category}_${filterString}`;
    if (targets && targets[targetKey]) {
      value[targetIdx].data = targets[targetKey];
      value[targetIdx].text = targets[targetKey].toString();
    } else {
      value[targetIdx].data = 0;
      value[targetIdx].text = '0';
    }
  });
});

let input = null;

widget.on('render', (widget) => {
  const targets = getTargets();
  input = document.getElementById('targetInput');
  if (!input) {
    input = document.createElement('input');
    input.id = 'targetInput';
    input.style = 'position: absolute; display: none; z-index: 5000;';
    document.body.appendChild(input);
    $(input).blur(() => {
      $(input).hide();
    });
  }

  const handleClick = (event) => {
    const category = event.point.category;
    const targetKey = `${category}_${filterString}`;
    $(input).css({
      display: 'block',
      left: event.pageX + 20,
      top: event.pageY,
    });
    input.value = targets[targetKey] || '0';
    input.focus();
    $(input).keypress((inputEvent) => {
      if (inputEvent.keyCode === 13) {
        targets[targetKey] = parseFloat(inputEvent.target.value);
        localStorage.setItem(localStorageKey, JSON.stringify(targets));
        $(input).hide();
        widget.refresh();
      }
    });
  };

  const targetSeries = widget.queryResult.series.find((series) => (series.name === targetName));
  if (targetSeries) {
    targetSeries.data.forEach((point) => {
      point.events = {
        'click': handleClick,
      };
    });
  }
});
