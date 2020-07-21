const categories = ['0%', '1%-19%', '20%-39%', '40%-59%', '60%-79%', '80%-99%', '100%'];

widget.on('processresult', (widget, event) => {
  if (event.rawResult.headers[0] === 'probability_label') {
    event.result.series.forEach((breakBy) => {
      const newBreakByData = breakBy.data.filter((data) => (data.selectionData));
      const existedLabel = newBreakByData.map((data) => (data.selectionData[0]));
      categories.filter((label) => (!existedLabel.includes(label))).forEach((label) => {
        newBreakByData.push({ y: null, color: null, selected: false, selectionData: { 0: label } });
      });
      breakBy.data = newBreakByData;
      breakBy.data.sort(
        (a, b) => (categories.indexOf(a.selectionData[0]) -
          categories.indexOf(b.selectionData[0])));
    });
    event.result.xAxis.categories = categories;
  }
});
