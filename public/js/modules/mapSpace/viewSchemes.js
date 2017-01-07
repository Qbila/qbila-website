(function(){

  geoInterface.controller('ViewSchemes', ['$scope', '$http', "$uibModal", function($scope, $http, $uibModal){

    $scope.active = {};

    $scope.schemes = {
      set_properties: {

      },
      set : [
        {
          id: 1,
          cover_image: '/public/img/usersData/2016/august/27/1.jpg',
          images:  [
            {
              src: '/public/img/usersData/2016/august/27/1.jpg',
              caption: ''
            },
            {
              src: '/public/img/usersData/2016/august/27/2.png',
              caption: ''
            }
          ],
          title: 'toilet for girls in government high school bari',
          place: {
            village: {
              id: 2867,
              name: 'bari' // all the information
            },
            panchayat: {
              id: 4720,
              name: 'bari'
            },
            block: {
              id: 5468,
              name: 'sulah'
            },
            tehsil: {
              id: 15,
              name: 'palampur'
            },
            district: {
              id: 3,
              name: 'kangra'
            },
            state: {
              id: 2,
              name: 'himachal pradesh'
            },
            ac: {
              id: 6048,
              name: 'sulah'
            },
            pc: {

            }
          },
          status: 'completed',
          health: 'excellent',
          scheme_year: '2016',
          scheme_head: 'SDP',
          amount: {
            'completed': {
              type: 'spent',
              value: 70000
            },
            'sanctioned': {
              type: 'sanctioned',
              value: 70000
            },
            'entered': {
              type: 'proposed',
              value: 70000
            },
            'inProgress': {
              type: 'spent so far',
              value: 70000
            }
          },
          executing_agency: {
            id: '',
            title: 'Block Development Officer'
          },
          task_categories: [
            'education', 'sanitation', 'water supply',
            'girl child'
          ]
        },
        {
          id: 1,
          cover_image: '/public/img/usersData/2016/august/27/1.jpg',
          images:  [
            {
              src: '/public/img/usersData/2016/august/27/1.jpg',
              caption: ''
            },
            {
              src: '/public/img/usersData/2016/august/27/2.png',
              caption: ''
            }
          ],
          title: 'toilet for girls in government high school bari',
          place: {
            village: {
              id: 2867,
              name: 'bari' // all the information
            },
            panchayat: {
              id: 4720,
              name: 'bari'
            },
            block: {
              id: 5468,
              name: 'sulah'
            },
            tehsil: {
              id: 15,
              name: 'palampur'
            },
            district: {
              id: 3,
              name: 'kangra'
            },
            state: {
              id: 2,
              name: 'himachal pradesh'
            },
            ac: {
              id: 6048,
              name: 'sulah'
            },
            pc: {

            }
          },
          status: 'completed',
          health: 'excellent',
          scheme_year: '2016',
          scheme_head: 'SDP',
          amount: {
            'completed': {
              type: 'spent',
              value: 70000
            },
            'sanctioned': {
              type: 'sanctioned',
              value: 70000
            },
            'entered': {
              type: 'proposed',
              value: 70000
            },
            'inProgress': {
              type: 'spent so far',
              value: 70000
            }
          },
          executing_agency: {
            id: '',
            title: 'Block Development Officer'
          },
          task_categories: [
            'education', 'sanitation', 'water supply',
            'girl child'
          ]
        },
        {
          id: 1,
          cover_image: '/public/img/usersData/2016/august/27/1.jpg',
          images:  [
            {
              src: '/public/img/usersData/2016/august/27/1.jpg',
              caption: ''
            },
            {
              src: '/public/img/usersData/2016/august/27/2.png',
              caption: ''
            }
          ],
          title: 'toilet for girls in government high school bari',
          place: {
            village: {
              id: 2867,
              name: 'bari' // all the information
            },
            panchayat: {
              id: 4720,
              name: 'bari'
            },
            block: {
              id: 5468,
              name: 'sulah'
            },
            tehsil: {
              id: 15,
              name: 'palampur'
            },
            district: {
              id: 3,
              name: 'kangra'
            },
            state: {
              id: 2,
              name: 'himachal pradesh'
            },
            ac: {
              id: 6048,
              name: 'sulah'
            },
            pc: {

            }
          },
          status: 'completed',
          health: 'excellent',
          scheme_year: '2016',
          scheme_head: 'SDP',
          amount: {
            'completed': {
              type: 'spent',
              value: 70000
            },
            'sanctioned': {
              type: 'sanctioned',
              value: 70000
            },
            'entered': {
              type: 'proposed',
              value: 70000
            },
            'inProgress': {
              type: 'spent so far',
              value: 70000
            }
          },
          executing_agency: {
            id: '',
            title: 'Block Development Officer'
          },
          task_categories: [
            'education', 'sanitation', 'water supply',
            'girl child'
          ]
        },
        {
          id: 1,
          cover_image: '/public/img/usersData/2016/august/27/1.jpg',
          images:  [
            {
              src: '/public/img/usersData/2016/august/27/1.jpg',
              caption: ''
            },
            {
              src: '/public/img/usersData/2016/august/27/2.png',
              caption: ''
            }
          ],
          title: 'toilet for girls in government high school bari',
          place: {
            village: {
              id: 2867,
              name: 'bari' // all the information
            },
            panchayat: {
              id: 4720,
              name: 'bari'
            },
            block: {
              id: 5468,
              name: 'sulah'
            },
            tehsil: {
              id: 15,
              name: 'palampur'
            },
            district: {
              id: 3,
              name: 'kangra'
            },
            state: {
              id: 2,
              name: 'himachal pradesh'
            },
            ac: {
              id: 6048,
              name: 'sulah'
            },
            pc: {

            }
          },
          status: 'completed',
          health: 'excellent',
          scheme_year: '2016',
          scheme_head: 'SDP',
          amount: {
            'completed': {
              type: 'spent',
              value: 70000
            },
            'sanctioned': {
              type: 'sanctioned',
              value: 70000
            },
            'entered': {
              type: 'proposed',
              value: 70000
            },
            'inProgress': {
              type: 'spent so far',
              value: 70000
            }
          },
          executing_agency: {
            id: '',
            title: 'Block Development Officer'
          },
          task_categories: [
            'education', 'sanitation', 'water supply',
            'girl child'
          ]
        },
        {
          id: 1,
          cover_image: '/public/img/usersData/2016/august/27/1.jpg',
          images:  [
            {
              src: '/public/img/usersData/2016/august/27/1.jpg',
              caption: ''
            },
            {
              src: '/public/img/usersData/2016/august/27/2.png',
              caption: ''
            }
          ],
          title: 'toilet for girls in government high school bari',
          place: {
            village: {
              id: 2867,
              name: 'bari' // all the information
            },
            panchayat: {
              id: 4720,
              name: 'bari'
            },
            block: {
              id: 5468,
              name: 'sulah'
            },
            tehsil: {
              id: 15,
              name: 'palampur'
            },
            district: {
              id: 3,
              name: 'kangra'
            },
            state: {
              id: 2,
              name: 'himachal pradesh'
            },
            ac: {
              id: 6048,
              name: 'sulah'
            },
            pc: {

            }
          },
          status: 'completed',
          health: 'excellent',
          scheme_year: '2016',
          scheme_head: 'SDP',
          amount: {
            'completed': {
              type: 'spent',
              value: 70000
            },
            'sanctioned': {
              type: 'sanctioned',
              value: 70000
            },
            'entered': {
              type: 'proposed',
              value: 70000
            },
            'inProgress': {
              type: 'spent so far',
              value: 70000
            }
          },
          executing_agency: {
            id: '',
            title: 'Block Development Officer'
          },
          task_categories: [
            'education', 'sanitation', 'water supply',
            'girl child'
          ]
        },
        {
          id: 1,
          cover_image: '/public/img/usersData/2016/august/27/1.jpg',
          images:  [
            {
              src: '/public/img/usersData/2016/august/27/1.jpg',
              caption: ''
            },
            {
              src: '/public/img/usersData/2016/august/27/2.png',
              caption: ''
            }
          ],
          title: 'toilet for girls in government high school bari',
          place: {
            village: {
              id: 2867,
              name: 'bari' // all the information
            },
            panchayat: {
              id: 4720,
              name: 'bari'
            },
            block: {
              id: 5468,
              name: 'sulah'
            },
            tehsil: {
              id: 15,
              name: 'palampur'
            },
            district: {
              id: 3,
              name: 'kangra'
            },
            state: {
              id: 2,
              name: 'himachal pradesh'
            },
            ac: {
              id: 6048,
              name: 'sulah'
            },
            pc: {

            }
          },
          status: 'completed',
          health: 'excellent',
          scheme_year: '2016',
          scheme_head: 'SDP',
          amount: {
            'completed': {
              type: 'spent',
              value: 70000
            },
            'sanctioned': {
              type: 'sanctioned',
              value: 70000
            },
            'entered': {
              type: 'proposed',
              value: 70000
            },
            'inProgress': {
              type: 'spent so far',
              value: 70000
            }
          },
          executing_agency: {
            id: '',
            title: 'Block Development Officer'
          },
          task_categories: [
            'education', 'sanitation', 'water supply',
            'girl child'
          ]
        }
      ]
    };



    $scope.hideInformationMissingAlert = function(e, ele){
      angular.element(e.target).parent().css('display', 'none');
    };


    $scope.addMissingSchemeInformation = function(e, ele){
      $scope.active.scheme = ele.sch;

      $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'imageSlidesInModal.html',
        controller: 'ModalImageGallery',
        resolve: {
          items: function () {
            return $scope.active.scheme.images;
          }
        }
      });
    };


    $scope.changeInfrastructureStatus = function(e, ele){
      $scope.active.scheme = ele.sch;

      $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'imageSlidesInModal.html',
        controller: 'ModalImageGallery',
        resolve: {
          items: function () {
            return $scope.active.scheme.images;
          }
        }
      });
    };


    $scope.viewOrLocateOnMap = function(e, ele){
      $scope.active.scheme = ele.sch;

      var modal = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'googleMapInModal.html',
                    controller: 'ModalGoogleMap',
                    windowTopClass: 'a-fullWidthModal',
                    resolve: {
                      items: function () {
                        return $scope.active.scheme.images;
                      }
                    }
                  });

      modal.rendered.then(function(){
          console.log('ok now what?');
          initMap();
        },
        function(){
          console.log('what is on ?')
        }
      );
    };


    $scope.showSchemeImagesGallery = function(e, ele){
      $scope.active.scheme = ele.sch;

      var modal = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'imageSlidesInModal.html',
                    controller: 'ModalImageGallery',
                    resolve: {
                      items: function () {
                        return $scope.active.scheme.images;
                      }
                    }
                  });

      modal.opened.then(function(){
          console.log('ok now what?');
        },
        function(){
          console.log('what is on ?')
        }
      );
    };

  }]);


  geoInterface.controller('ModalImageGallery', ['$scope', '$uibModalInstance', 'items', function($scope, $uibModalInstance, items){
    $scope.images = items;
    $scope.activeSlide = 0;
    $scope.slidesInterval = 5000;
    $scope.noWrapSlides = false;
  }]);


  geoInterface.controller('ModalGoogleMap', ['$scope', function($scope){

  }]);


}());
