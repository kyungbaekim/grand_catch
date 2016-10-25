myAppModule.controller('topAmazonSellerController', function ($scope, itemsFactory, $timeout){
  // console.log($scope.department);

  var department = ''
  if($scope.department == 'a_appliances'){
    department = '2619525011'
  }
  else if($scope.department == 'a_phones_accessories'){
    department = '2335753011'
  }
  else if($scope.department == 'a_fashion'){
    department = '7141124011'
  }
  else if($scope.department == 'a_computers'){
    department = '541966'
  }
  else if($scope.department == 'a_office_product'){
    department = '1084128'
  }
  else if($scope.department == 'a_health_personal_care'){
    department = '3760931'
  }
  else if($scope.department == 'a_home_kitchen'){
    department = '1063498'
  }
  else if($scope.department == 'a_luggage_travel'){
    department = '9479199011'
  }
  else if($scope.department == 'a_sports_outdoors'){
    department = '3375301'
  }
  else if($scope.department == 'a_home_improvement'){
    department = '468240'
  }
  else if($scope.department == 'a_toys_games'){
    department = '165795011'
  }

  var MAX_REQUESTS = 5;
  var counter = 0;
  var getItems = function(){
    itemsFactory.getPopularAmazonItems(department, function(res){
      console.log(res)
      if((res.result.Error && counter < MAX_REQUESTS) || (res.result.BrowseNodes.BrowseNode.TopItemSet == undefined && counter < MAX_REQUESTS)){
        console.log('error occurred', counter)
        $timeout(function(){
          getItems()
        }, 1000);
        counter++;
      }
      $scope.itemInfo = res.result.BrowseNodes.BrowseNode.TopItemSet.TopItem
      for(var i=0; i<$scope.itemInfo.length; i++){
        $scope.itemInfo[i]['keywords'] = $scope.itemInfo[i].Title.replace(/[&\\#+$~%'":*?<>{}]/g,'')
        $scope.itemInfo[i]['keywords'] = $scope.itemInfo[i]['keywords'].replace(/\//g,'-')
      }
      $scope.itemInfo = $scope.itemInfo.slice(0, -2)
    })
  }

  getItems()
})
