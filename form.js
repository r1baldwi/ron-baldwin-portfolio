document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var submitBtn = form.querySelector('.form-submit');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    status.textContent = '';
    status.className = 'form-status';
    submitBtn.disabled = true;
    var originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          form.reset();
          form.querySelectorAll('.form-field').forEach(function (field) {
            field.style.display = 'none';
          });
          form.querySelector('.btn-row').style.display = 'none';
          status.textContent = "Thanks — got it. I'll reply within a couple of business days.";
          status.className = 'form-status form-status-success';
        } else {
          return response.json().then(function (data) {
            var message = (data && data.errors && data.errors.length)
              ? data.errors.map(function (err) { return err.message; }).join(', ')
              : 'Something went wrong sending that. Please try again or email me directly.';
            status.textContent = message;
            status.className = 'form-status form-status-error';
          });
        }
      })
      .catch(function () {
        status.textContent = 'Something went wrong sending that. Please try again or email me directly.';
        status.className = 'form-status form-status-error';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      });
  });
});
