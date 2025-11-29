// js/export.js
function exportCSV(){
  const rows = JSON.parse(localStorage.getItem('stepsData')||'[]');
  if(!rows.length){ alert('No data to export'); return; }
  const header = ['date','steps','minutes'];
  const csv = [header.join(',')].concat(rows.map(r => [r.date, r.steps, r.minutes].join(','))).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'meditrust_steps.csv'; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
