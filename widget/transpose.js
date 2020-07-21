const colors = [
  '#ff0000',
  '#00ff00',
  '#0000ff',
];

widget.on('processresult', (widget, event) => {
  const newSeries = event.result.series[0].data.map((data, idx) => ({
    name: data.selectionData[0],
    color: colors.length > idx ? colors[idx] : undefined,
    yAxis: 0,
    data: [],
    mask: event.result.series[0].mask,
  }));
  const newCategories = event.result.series.map((series) => (series.name));
  event.result.series.forEach((series) => {
    series.data.forEach((data, idx) => {
      data.selectionData[0] = series.name;
      data.color = colors.length > idx ? colors[idx] : undefined;
      data.events = {
        click: null,
        contextmenu: null,
      };
      newSeries[idx].data.push(data);
    });
  });
  event.result.xAxis.categories = newCategories;
  event.result.series = newSeries;
});

