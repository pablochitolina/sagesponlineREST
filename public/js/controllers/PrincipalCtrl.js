        app.controller('PrincipalCtrl', function (Cidades, $base64, $scope, $window, $location, $anchorScroll, $http, $routeParams) {

            var idservico = $routeParams.idservico;

            $scope.mostraDesc = false;

            $scope.altMapTop = $window.innerHeight/2;

            var Cidades = Cidades.all();

            $scope.enviado = 'nao';
            var img = document.getElementById('imagem'); 
            setWindowSize();

            $window.addEventListener('resize', setWindowSize);

            function setWindowSize() {
              $scope.mapSize = img.clientWidth;

            }

        var mapOptions = {
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };

            carregamapadesc = function (data) {

                var marker = new google.maps.Marker({});             

                if (!!navigator.geolocation) { 

                    $scope.mapdesc = new google.maps.Map(document.getElementById('mapdesc'), mapOptions); 

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
                            map: $scope.mapdesc,
                            icon: icon,
                            position: geolocate
                        });

                        $scope.mapdesc.setCenter(geolocate);

                        var infowindow = new google.maps.InfoWindow({
                            maxWidth: $window.innerWidth / 2
                        });

                        google.maps.event.addListener(marker, 'click', (function (marker, conteudo, infowindow) {
                            return function () {
                                infowindow.setContent(conteudo);
                                infowindow.open($scope.mapdesc, marker);
                            };
                        })(marker, conteudo, infowindow));

                    } else {

                        var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        $scope.mapdesc.setCenter(geolocate);

                        $scope.mostraDesc = false;
                        
                    }

                } else {
                    $scope.mostraDesc = false;
                    document.getElementById('map').innerHTML = 'Sem suporte a Geolocalização.';
                }
            }

            carregamapa = function () {

                if (!!navigator.geolocation) { 

                    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

                    navigator.geolocation.getCurrentPosition(function (position) {

                        var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        geocodeLatLng(geolocate);
                        $scope.map.setCenter(geolocate);

                    });

                } else {

                    document.getElementById('map').innerHTML = 'Sem suporte a Geolocalização.';

                }

            }

            google.maps.event.addDomListener($window, 'load', carregamapa);

            if (idservico !== undefined) {
                $http.get('/api/servico/' + idservico)
                    .success(function (data) {
                        carregamapadesc(data);
                    })
                    .error(function (data) {
                        console.log("ERR: " + JSON.stringify(data));
                        $scope.mostraDesc = false;
                    });
            } else {
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

        function geocodeLatLng(latlng) {

        var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'location': latlng }, function (results, status) {
           
              if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                  enderecoReversoCidade = 'nf';
                  enderecoReversoEstado = 'nf';

                  var arrAddress = results[0].address_components;

                  for (ac = 0; ac < arrAddress.length; ac++) {
                    if (arrAddress[ac].types[0] == "locality") {
                      enderecoReversoCidade = arrAddress[ac].long_name;
                    } 
                    if (arrAddress[ac].types[0] == "administrative_area_level_1") {
                      enderecoReversoEstado = arrAddress[ac].short_name;
                    } 
                  }

                  console.log("cidade " + enderecoReversoCidade);

                  var cidades = JSON.search(Cidades, '//*[Estado="' + enderecoReversoEstado + '"]');
                  console.log("cidades: " + JSON.stringify(cidades));
                  
                  if (cidades.length > 0) {

                    var mun = JSON.search(cidades, '//*[contains(Nome,"' + enderecoReversoCidade + '")]');
                    console.log("mun: " + JSON.stringify(mun));

                    if (mun.length == 1) {

                      $scope.getPontos(mun[0].ID);

                    } 
                  }
                             
                } else {
                  console.log('Endereço não encontrado');
                }
              } else {
                console.log('Geocoder falhou por: ' + status);
              }
            });
          }

          $scope.getPontos = function (cidade) {

                $http.defaults.headers.common["Content-Type"] = 'application/json';
                $http.defaults.headers.common["cidade"] = cidade;

                $http.get('/api/servicolistlatlngcidade/')
                    .success(function (data, status, headers, config) {
                        
                        if (data.message === 'success') {

                            console.log(JSON.stringify(data));

                            angular.forEach(data.servicos, function (item) {

                                //console.log(item);
                                var icon = {};
                                var status, cor;

                                switch (item.status) {
                                    case "novo":
                                        $scope.contNovo++;
                                        status = "Novo";
                                        cor = "#d62d20";
                                        icon = {
                                            url: "img/pinred.png", // url
                                            scaledSize: new google.maps.Size(21, 34), // scaled size
                                            origin: new google.maps.Point(0, 0), // origin
                                            anchor: new google.maps.Point(10, 34) // anchor
                                        };
                                        break;
                                    case "atendido":
                                        $scope.contAtend++;
                                        status = "Atendido"
                                        cor = "#ffa700";
                                        icon = {
                                            url: "img/pinyellow.png", // url
                                            scaledSize: new google.maps.Size(21, 34), // scaled size
                                            origin: new google.maps.Point(0, 0), // origin
                                            anchor: new google.maps.Point(10, 34) // anchor
                                        };
                                        break;
                                    case "resolvido":
                                        $scope.contRes++;
                                        status = "Resolvido"
                                        cor = "#008744";
                                        icon = {
                                            url: "img/pingreen.png", // url
                                            scaledSize: new google.maps.Size(21, 34), // scaled size
                                            origin: new google.maps.Point(0, 0), // origin
                                            anchor: new google.maps.Point(10, 34) // anchor
                                        };
                                        break;
                                    default:
                                        icon = 'img/pinred.png';
                                }
                                var conteudo = '<div class="googft-info-window" style="font-family: sans-serif;  height: 20em; overflow-y: auto;">' +
                                    '<h2 style="color: ' + cor + '">' + status + '</h2> ' +
                                    '<img src="https://www.sagesponline.com.br/api/imagem/' + item.filename + '" style=" background: transparent url(img/squares.svg) no-repeat scroll center center; max-width: ' + $window.innerWidth / 3 + 'px; vertical-align: top" />' +
                                    '<p><strong>' + item.data + '</strong> - ' + item.endereco + '</p>' +
                                    '<p><em>' + item.desc + '</em></p>' +
                                    '</div>';

                                var infowindow = new google.maps.InfoWindow({
                                    maxWidth: $window.innerWidth / 2
                                });

                                marker = new google.maps.Marker({
                                    map: $scope.map,
                                    icon: icon,
                                    position: new google.maps.LatLng(item.lat, item.lng)
                                });

                                google.maps.event.addListener(marker, 'click', (function (marker, conteudo, infowindow) {
                                    return function () {
                                        infowindow.setContent(conteudo);
                                        infowindow.open($scope.map, marker);
                                    };
                                })(marker, conteudo, infowindow));

                            });

                        }

                    })
                    .error(function (data, status, headers, config) {
                       
                        console.log('status ' + status);
                        
                    });
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