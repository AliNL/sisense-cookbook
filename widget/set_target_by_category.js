const categoryName = 'Quarters in Date';
const targetName = 'Target';
const localStorageKey = 'cp_dashboard_targets';

const getTargets = () => {
  try {
    return JSON.parse(localStorage.getItem(localStorageKey)) || {};
  } catch (e) {
    return {};
  }
};

widget.on('queryend', (widget, event) => {
  const targets = getTargets();
  const categoryIdx = event.rawResult.headers.indexOf(categoryName);
  const targetIdx = event.rawResult.headers.indexOf(targetName);
  event.rawResult.values.forEach((value) => {
    const category = value[categoryIdx].text;
    if (targets && targets[category]) {
      value[targetIdx].data = targets[category];
      value[targetIdx].text = targets[category].toString();
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
    $(input).css({
      display: 'block',
      left: event.pageX + 20,
      top: event.pageY,
    });
    input.value = targets[category] || '0';
    input.focus();
    $(input).keypress((inputEvent) => {
      if (inputEvent.keyCode === 13) {
        targets[category] = parseFloat(inputEvent.target.value);
        localStorage.setItem(localStorageKey, JSON.stringify(targets));
        $(input).hide();
        widget.refresh();
      }
    });
  };

  const targetSeries = widget.queryResult.series.find((series) => (series.name === targetName));
  targetSeries.data.forEach((point) => {
    point.events = {
      'click': handleClick,
    };
  });
});
