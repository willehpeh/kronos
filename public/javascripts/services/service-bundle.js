(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('KronosDashboard').factory('AmbassadorService', function AmbassadorService($http, $q) {

  return {

    newAmbassador: function(ambassador, token) {
      var response = {};
      var defer = $q.defer();

      $http.post('/api/ambassador', {ambassador: ambassador, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    getAmbassadors: function() {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/ambassador').then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    getAmbassador: function(id) {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/ambassador/' + id).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    modifyAmbassador: function(id, ambassador, token) {
      var response = {};
      var defer = $q.defer();

      $http.put('/api/ambassador/' + id, {ambassador:ambassador, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    deleteAmbassador: function(id, token) {
      var response = {};
      var defer = $q.defer();

      $http.delete('/api/ambassador/' + id, {headers: {'x-access-token' : token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      })

      return defer.promise;
    }

  }
});

},{}],2:[function(require,module,exports){
angular.module('KronosDashboard').factory('AuthService', function AuthService($http, $q) {
  return {
    login: function(user) {
      var myData = {};
      var defer = $q.defer();


      $http.post('/auth/login', user).then(function(data) {
        myData = data.data;
        defer.resolve(myData);
      }, function(err) {
        myData = err;
        defer.resolve(myData);
      });

      return defer.promise;

    }
  }
})

},{}],3:[function(require,module,exports){
angular.module('KronosDashboard').factory('CalendarService', function CalendarService($http, $q) {

  return {

    newCalendarElement: function(element, token) {
      var response = {};
      var defer = $q.defer();

      $http.post('/api/calendarelement', {element: element, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    getCalendarElements: function() {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/calendarelement').then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    getCalendarElement: function(id) {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/calendarelement/' + id).then(function(data) {
        response = data.data;
        defer.resolve(response);
      })

      return defer.promise;
    },

    modifyCalendarElement: function(id, element, token) {
      var response = {};
      var defer = $q.defer();

      $http.put('/api/calendarelement/' + id, {element: element, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    deleteCalendarElement: function(id, token) {
      var response = {};
      var defer = $q.defer();

      $http.delete('/api/calendarelement/' + id, {headers: {'x-access-token' : token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    }
  }
});

},{}],4:[function(require,module,exports){
angular.module('KronosDashboard').factory('NewsService', function NewsService($http, $q) {

  return {

    newNewsPost: function(post, token) {
      var response = {};
      var defer = $q.defer();

      $http.post('/api/newspost', {newspost: post, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      }, function(data) {
        response = data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    getNewsPosts: function() {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/newspost').then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    getNewsPost: function(id) {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/newspost/' + id).then(function(data) {
        response = data.data;
        defer.resolve(response);
      })

      return defer.promise;
    },

    modifyNewsPost: function(id, post, token) {
      var response = {};
      var defer = $q.defer();

      $http.put('/api/newspost/' + id, {newspost: post, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    deleteNewsPost: function(id, token) {
      var response = {};
      var defer = $q.defer();

      $http.delete('/api/newspost/' + id, {headers: {'x-access-token': token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    deleteNewsPhoto: function(id, photo, token) {
      var response = {};
      var defer = $q.defer();

      var photo = photo.slice(18);

      console.log("ID is: " + id);

      $http.delete('/api/newspost/rem-image/'+ id + '/' + photo,
      {headers: {'x-access-token': token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    }
  }
});

},{}],5:[function(require,module,exports){
angular.module('KronosDashboard').factory('PressPhotoService', function PressPhotoService($http, $q) {

  return {

    newPressPhoto: function(pressphoto, token) {
      var response = {};
      var defer = $q.defer();

      $http.post('/api/pressphoto', {pressphoto: pressphoto, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    getPressPhotos: function() {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/pressphoto').then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    getPressPhoto: function(id) {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/pressphoto/' + id).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    modifyPressPhoto: function(id, pressphoto, token) {
      var response = {};
      var defer = $q.defer();

      $http.put('/api/pressphoto/' + id, {pressphoto: pressphoto, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    deletePressPhoto: function(id, token) {
      var response = {};
      var defer = $q.defer();

      $http.delete('/api/pressphoto/' + id, {headers: {'x-access-token': token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    }
  }
});

},{}],6:[function(require,module,exports){
angular.module('KronosDashboard').factory('WatchService', function WatchService($http, $q, $window) {
  return {

    newWatch: function(watch, token) {
      var response = {};
      var defer = $q.defer();

      $http.post('/api/watch', {watch: watch, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      }, function(data) {
        response = data;
        defer.resolve(response);
      });
      return defer.promise;
    },

    getWatch: function(id) {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/watch/' + id).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });
      return defer.promise;
    },

    modifyWatch: function(id, watch, token) {
      var response = {};
      var defer = $q.defer();

      $http.put('/api/watch/' + id, {watch: watch, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      }, function(data) {
        response = data;
        defer.resolve(response);
      });
      return defer.promise;
    },

    deleteWatch: function(id, token) {
      var response = {};
      var defer = $q.defer();

      $http.delete('/api/watch/' + id, {headers: {'x-access-token': token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      }, function(data) {
        console.log('Uh-oh, it broke...')
        response = data;
        defer.reject(response);
      });
      return defer.promise;
    },

    getWatches: function() {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/watch').then(function(data) {
        response = data.data;
        defer.resolve(response);
      });
      return defer.promise;
    },

    deleteFrontPhoto: function(id, token) {
      var response = {};
      var defer = $q.defer();
      $http.delete('/api/watch/rem-front-image/' + id,
      {headers: {'x-access-token': token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });
      return defer.promise;
    },

    deleteBackPhoto: function(id, token) {

    },

    deleteQuarterPhoto: function(id, token) {

    },

    deleteExtraPhoto: function(id, photo, token) {

    }
  }
})

},{}],7:[function(require,module,exports){
var ambassador = require('./AmbassadorService');
var calendar = require('./CalendarService');
var news = require('./NewsService');
var watch = require('./WatchService');
var press = require('./PressPhotoService');
var auth = require('./AuthService');

},{"./AmbassadorService":1,"./AuthService":2,"./CalendarService":3,"./NewsService":4,"./PressPhotoService":5,"./WatchService":6}]},{},[7]);
