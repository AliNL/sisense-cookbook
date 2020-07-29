const breakBys = [
  'Consultant - Graduate',
  'Consultant',
  'Senior Consultant',
  'Lead Consultant',
  'Principal Consultant',
  'Director'];

widget.on('processresult', (widget, event) => {
  event.result.series.sort((a, b) => (breakBys.indexOf(a.name) - breakBys.indexOf(b.name)));
});
