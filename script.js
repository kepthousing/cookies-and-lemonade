/* Cookies and Lemonade: inquiry form. Checkout buttons will be added here once a payment provider is chosen. */
const $ = s => document.querySelector(s);
const d = new Date(); d.setDate(d.getDate() + 7);
const min = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const dateInput = $('input[name=event_date]'); if (dateInput) dateInput.min = min;
$('.form').addEventListener('submit', async e => {
  e.preventDefault(); const f = e.target, st = $('.form-status'); st.textContent = 'Sending...';
  try { const r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
    if (!r.ok) throw 0; f.reset(); st.textContent = 'Thank you! We will reply within 24 hours.'; }
  catch { st.textContent = 'Something went wrong. Please call or text 919-438-1403.'; }
});
