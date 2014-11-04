// Code goes here

angular.module('superlist', ['ngResource'])
  .controller('listCtrl', function ($scope, $log, items) {
    $scope.items = [];

    $scope.newItem = {
      adding: false,
      name: null
    };

    $scope.removeItem = function (item) {
      items.deleteItem(item).then(function () {
        $scope.items.splice($scope.items.indexOf(item), 1);
      }, function (error) {
        $log.error('Error deleting item', error);
      });
    };

    $scope.addNewItem = function () {
      var name = $scope.newItem.name;
      if (name) {
        $scope.newItem.adding = true;
        items.saveItem({ name: name }).then(function (newItem) {
          newItem.name = name;
          $scope.items.push(newItem);
          $scope.newItem.name = null;
          $scope.newItem.adding = false;
        }, function (error) {
          $log.error('Error saving item', error);
          $scope.newItem.adding = false;
        });
      }
    };

    // init
    items.listItems().then(function (items) {
      $scope.items = items;
    }, function (error) {
      $log.error('Error loading items', error);
    });
  })
  .factory('items', function ($log, $resource) {

    var url = 'superlist/items/:id';
    var itemsRes = $resource(url, {id: '@id'}, {
      list: {
        method: 'GET', isArray: true, transformResponse: function (data, headersGetter) {
          var response = angular.fromJson(data);
          return response._embedded && response._embedded.items || [];
        }
      },
      saveItem: { method: 'POST', transformResponse: function (data, headers) {
        var location = headers('Location');
        var newId = { id: location.substring(location.lastIndexOf('/') + 1) };
        return newId;
      }}
    });

    return {
      listItems: function () {
        return itemsRes.list().$promise;
      },
      saveItem: function (item) {
        return itemsRes.saveItem(item).$promise;
      },
      deleteItem: function (item) {
        return itemsRes.delete({id: item.id}).$promise;
      }
    };
  });
