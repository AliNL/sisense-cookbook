const expectedResults = {
  'New Opportunity / Monthly': {
    'value': [123, 1234, 12345, 123456, 1234567, 12345678],
    'count': [1, 1, 1, 1, 1, 1],
  },
  'Open Pipeline (Qualification to Contract Negotiation)': {
    'value': 1234 + 12345 + 123456 + 1234567,
    'secondary': 4,
  },
  'Open Pipeline (1 - 99%)': {
    'value': 1234 + 12345 + 123456 + 1234567,
    'secondary': 4,
  },
  'Open Pipeline Value by Current Probability': {
    'Value': [0, 1234, 12345, 123456, 1234567],
  },
  'Open Pipeline Count by Current Probability': {
    'Count': [0, 1, 2, 3, 4],
  },
  'Open Pipeline Value by Current Stage (1 - 99%)': {
    'Value': [1234, 12345, 123456, 1234567],
  },
  'Open Pipeline Count by Current Stage (1 - 99%)': {
    'Count': [1, 1, 1, 1],
  },
  'Won opprtunity/closed opp.': {
    'value': 0.5,
    'secondary': 1,
  },
  'Won Extension opp./closed Ext. opp.': {
    'value': 0.5,
    'secondary': 1,
  },
  'Lost opportunity/closed opp.': {
    'value': 0.5,
    'secondary': 1,
  },
  'Lost Extension opportunity/closed Ext. opp.': {
    'value': 0.5,
    'secondary': 1,
  },
  'Cycle time from create to start - Won opp.': {
    'value': 100,
  },
  'Cycle time from create to close date - Won opp.': {
    'value': 100,
  },
  'Count of Closed opportunity in different size': {
    'Count': [1, 2, 3, 4, 5],
  },
};

dashboard.on('refreshend', (dashboard) => {
  console.log('============================= Test Result =============================');
  dashboard.widgets.$$widgets.forEach(widget => {
    const thisExpectedResult = expectedResults[widget.title];
    if (thisExpectedResult) {
      if (widget.queryResult.series) {
        widget.queryResult.series.forEach(measurement => {
          const thisExpectedValue = thisExpectedResult[measurement.name];
          const thisActualValue = measurement.data.map(data => (data && data.y));
          if (thisActualValue.toString() !== thisExpectedValue.toString()) {
            console.error(`"${widget.title}" ${measurement.name} Failed:`);
            console.error(`    expected ${thisExpectedValue}`);
            console.error(`    actual ${thisActualValue}`);
          }
        });
      } else {
        if (thisExpectedResult.value && widget.queryResult.value.data !== thisExpectedResult.value) {
          console.error(`"${widget.title}" Failed:`);
          console.error(`    expected ${thisExpectedResult.value}`);
          console.error(`    actual ${widget.queryResult.value.data}`);
        }
        if (thisExpectedResult.secondary && widget.queryResult.secondary.data !== thisExpectedResult.secondary) {
          console.error(`"${widget.title}" Failed:`);
          console.error(`    expected ${thisExpectedResult.secondary}`);
          console.error(`    actual ${widget.queryResult.secondary.data}`);
        }
      }
      console.log(`"${widget.title}" Passed`);
    } else if (widget.title !== 'RICHTEXT_MAIN.TITLE') {
      console.warn(`"${widget.title}" is not covered by test.`);
    }
  });
});
