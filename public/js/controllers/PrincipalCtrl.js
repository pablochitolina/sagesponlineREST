app.controller('PrincipalCtrl', function ($base64, $scope, $window, $location, $anchorScroll, $http, $routeParams) {
    console.log("PrincipalCtrl");

    var idservico = $routeParams.idservico;

    $scope.mostraDesc = false;

    $scope.enviado = 'nao';

    carregamapa = function (data) {

        if (!!navigator.geolocation) {

            var mapOptions = {
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false
            };

            var marker = new google.maps.Marker({});

            $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

            if (data && data.message === 'success') {
                $scope.mostraDesc = true;
                var icon = {};
                var status, cor;

                switch (data.servico.status) {
                    case "novo":
                        status = "Novo";
                        cor = "#d62d20";
                        icon = {
                            url: "img/pinred.png", // url
                            scaledSize: new google.maps.Size(41, 68), // scaled size
                            origin: new google.maps.Point(0, 0), // origin
                            anchor: new google.maps.Point(20, 68) // anchor
                        };
                        break;
                    case "atendido":
                        status = "Atendido"
                        cor = "#ffa700";
                        icon = {
                            url: "img/pinyellow.png", // url
                            scaledSize: new google.maps.Size(41, 68), // scaled size
                            origin: new google.maps.Point(0, 0), // origin
                            anchor: new google.maps.Point(20, 68) // anchorr
                        };
                        break;
                    case "resolvido":
                        status = "Resolvido"
                        cor = "#008744";
                        icon = {
                            url: "img/pingreen.png", // url
                            scaledSize: new google.maps.Size(41, 68), // scaled size
                            origin: new google.maps.Point(0, 0), // origin
                            anchor: new google.maps.Point(20, 68) // anchor
                        };
                        break;
                    default:
                        icon = 'img/pinred.png';
                }

                var conteudo = '<div class="googft-info-window" style="font-family: sans-serif;  height: 20em; overflow-y: auto;">' +
                    '<h2 style="color: ' + cor + '">' + status + '</h2> ' +
                    '<img src="/api/imagem/' + data.servico.filename + '" style=" background: transparent url(img/squares.svg) no-repeat scroll center center; max-width: ' + $window.innerWidth / 3 + 'px; vertical-align: top" />' +
                    '<p><strong>' + data.servico.data + '</strong> - ' + data.servico.endereco + '</p>' +
                    '<p><em>' + data.servico.desc + '</em></p>' +
                    '</div>';

                $scope.imagem = '/api/imagem/' + data.servico.filename;
                $scope.status = status
                $scope.desc = data.servico.desc
                $scope.endereco = data.servico.endereco;
                $scope.cor = cor;

                var geolocate = new google.maps.LatLng(data.servico.lat, data.servico.lng);

                marker = new google.maps.Marker({
                    map: $scope.map,
                    icon: icon,
                    position: geolocate
                });

                $scope.map.setCenter(geolocate)
                var infowindow = new google.maps.InfoWindow({
                    maxWidth: $window.innerWidth / 2
                });

                //infowindow.setContent(conteudo);
                //infowindow.open($scope.map, marker);

                google.maps.event.addListener(marker, 'click', (function (marker, conteudo, infowindow) {
                    return function () {
                        infowindow.setContent(conteudo);
                        infowindow.open($scope.map, marker);
                    };
                })(marker, conteudo, infowindow));

            } else {
                $scope.mostraDesc = false;
                console.log('nodata');

                navigator.geolocation.getCurrentPosition(function (position) {

                    var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                    $scope.map.setCenter(geolocate);

                });
            }

        } else {
            document.getElementById('map').innerHTML = 'No Geolocation Support.';
        }
    }

    if (idservico !== undefined) {
        $http.get('/api/servico/' + idservico)
            .success(function (data) {
                carregamapa(data);
            })
            .error(function (data) {
                console.log("ERR: " + JSON.stringify(data));
                $scope.mostraDesc = false;
                carregamapa(null);
            });
    } else {
        carregamapa(null);
        $scope.mostraDesc = false;

    }

    $scope.scrollTo = function (id) {
        var old = $location.hash();
        $location.hash(id);
        $anchorScroll();
        //reset to old to keep any additional routing logic from kicking in
        $location.hash(old);
    };

$scope.enviaMsg = function(valid){

    $scope.enviado = 'nao';
    if(valid){
    $http.post('/api/postmessage/',{
                name: $scope.data.name,
                email: $scope.data.email,
                message: $scope.data.message})
            .success(function (data) {
                if(data.message === 'success'){
                    $scope.enviado = 'sim';
                }else{
                    $scope.enviado = 'erro';
                }
            })
            .error(function (data) {
                $scope.enviado = 'erro';
            });
        }else{
            $scope.enviado = 'inv';
        }
}

});

app.directive('scrollTo', function ($location, $anchorScroll) {
    return function (scope, element, attrs) {

        element.bind('click', function (event) {
            event.stopPropagation();
            var off = scope.$on('$locationChangeStart', function (ev) {
                off();
                ev.preventDefault();
            });
            var location = attrs.scrollTo;
            $location.hash(location);
            $anchorScroll();
        });

    };
});