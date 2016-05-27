$(document).ready(function() {
  $('#dashboard-tabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });
})
