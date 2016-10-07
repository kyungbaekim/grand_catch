myAppModule.controller('topAmazonSellerController', function ($scope, itemsFactory){
  // console.log($scope.department);

  var department = ''
  if($scope.department == 'a_appliances'){
    department = '2619526011'
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

  itemsFactory.getPopularAmazonItems(department, function(res){
    // console.log(res.data.result.BrowseNodes.BrowseNode)
    $scope.itemInfo = res.data.result.BrowseNodes.BrowseNode.TopItemSet.TopItem
    for(var i=0; i<$scope.itemInfo.length; i++){
      $scope.itemInfo[i]['keywords'] = $scope.itemInfo[i].Title.replace(/[&\\#+$~%'":*?<>{}]/g,'')
      $scope.itemInfo[i]['keywords'] = $scope.itemInfo[i]['keywords'].replace(/\//g,'-')
    }
    console.log($scope.itemInfo)
  })
})
