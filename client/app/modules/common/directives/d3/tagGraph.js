angular.module('cri.common')
.directive('criD3Tag',['d3Service','$window',function(d3Service,$window){
        return {
            restrict : 'EA',
            scope: {
                d3TagData: '=',
                onClick: '&',
                onDblclick:'&'
            },
            link : function(scope,element,attrs){
                d3Service.d3().then(function(d3) {

                    var width = '100%',
                        height = 500

                    var svg = d3.select(element[0])
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height);

                    var force = d3.layout.force()
                        .gravity(.05)
                        .distance(100)
                        .charge(-100)
                        .size([width, height]);


                    scope.$watch('d3TagData', function(newVals, oldVals) {
                        return scope.render(newVals);
                    }, true);


                    // Browser onresize event
                    window.onresize = function() {
                        scope.$apply();
                    };

//                    Watch for resize event
                    scope.$watch(function() {
                        return angular.element($window)[0].innerWidth;
                    }, function() {
                        scope.render(scope.d3TagData);
                    });

                    scope.render = function(data) {
                        force = d3.layout.force()
                            .charge(-300)
                            .linkDistance(200)
                            .size([900, 500])
                            .nodes(data.nodes)
                            .links(data.links)
                            .start();

                        var link = svg.selectAll(".link")
                            .data(data.links)
                            .enter().append("line")
                            .attr("class", function(d) {
                                switch(d.source.group){
                                    case 2:
                                        return "link link-user";
                                        break;
                                    case 3:
                                        return "link link-challenge";
                                        break;
                                    case 4:
                                        return "link link-project";
                                        break;
                                    default:
                                        return;
                                        break;
                                }
                            });

                        var node = svg.selectAll(".node")
                            .data(data.nodes)
                            .enter().append("g")
                            .attr("class", "node")
                            .call(force.drag);


                        node.append("image")
                            .attr("xlink:href",function(d) {
                                return d.poster || "https://github.com/favicon.ico"
                            })
                            .attr("x", -16)
                            .attr("y", -16)
                            .attr("width", 32)
                            .attr("height", 32)
                            .on('click', function(d, i) {
                                return scope.onClick({item: d});
                            })


                        node.append("text")
                            .attr("dx", 36)
                            .attr("dy", ".25em")
                            .attr('class',function(d) {
                                switch(d.group){
                                    case 2:
                                        return "text-user";
                                        break;
                                    case 3:
                                        return "text-challenge";
                                        break;
                                    case 4:
                                        return "text-project";
                                        break;
                                    default:
                                        return;
                                        break;
                                }
                            })
                            .text(function(d) {
                                return d.name
                            });

                        force.on("tick", function() {
                            link.attr("x1", function(d) { return d.source.x; })
                                .attr("y1", function(d) { return d.source.y; })
                                .attr("x2", function(d) { return d.target.x; })
                                .attr("y2", function(d) { return d.target.y; });

                            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                        });
                    }
                });
            }
        }
    }])