angular.module('KronosDashboard').controller('DeleteCalendarCtrl', DeleteCalendarCtrl);

function DeleteCalendarCtrl(
  $scope,
  CalendarService,
  store,
  $window,
  $timeout,
  $uibModal,
  $uibModalInstance,
  id) {

    var getCalendarElementToDelete = function(id) {
      CalendarService.getCalendarElement(id).then(function(data) {
        console.log('Got the calendar element : ');
        console.log(data);
        $scope.calendarElement = data;
      });
    }

    getCalendarElementToDelete(id);

    $scope.confirmDeleteCalendarElement = function(id) {
      var id = id;
      var token = store.get('token');

      $('#delete-button').text('');
      $('#delete-button').add('span');
      $('#delete-button').children().addClass('fa fa-lg fa-spin fa-spinner');

      CalendarService.deleteCalendarElement(id, token).then(function(data) {
        console.log("Success!");
        console.log(data);
        $uibModalInstance.close('Success!');
      }, function(data) {
        console.log("Failure!");
        console.log(data);
      })
    }

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    }
  }
