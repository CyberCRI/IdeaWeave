angular.module('cri.d3')
.directive('d3TagCloud',['d3Service',function(d3Service){
        return{
            restrict : 'EA',
            scope : {
                tags : '=',
                onClick: '&',
                options: '='
            },
            link : function(scope,element,attrs){
                console.log(scope.options)
                if(!scope.tags){
                    scope.tags = [];
                }
                if(!scope.options){
                    scope.options = {
                        width : 300,
                        height : 300
                    }
                }
                var tags = scope.tags.map(function(tag){
                    return '#'+tag.title;
                })
                d3Service.d3().then(function(d3) {
                    var fill = d3.scale.category20();

                    d3.layout.cloud().size([scope.options.width, scope.options.height])
                        .words(tags.map(function(d) {
                                return {text: d, size: 10 + Math.random() * 50};
                            }))
                        .rotate(function() { return ~~(Math.random() * 2) * 90; })
                        .font("Impact")
                        .fontSize(function(d) { return d.size; })
                        .on("end", draw)
                        .start();

                    function draw(words) {
                        d3.select("d3-tag-cloud").append("svg")
                            .attr("width", scope.options.width)
                            .attr("height", scope.options.height)
                            .style('background','white')
                            .append("g")
                            .attr("transform", "translate(150,150)")
                            .selectAll("text")
                            .data(words)
                            .enter().append("text")
                            .style("font-size", function(d) { return d.size + "px"; })
                            .style("font-family", "Impact")
                            .style("fill", function(d, i) { return fill(i); })
                            .attr("text-anchor", "middle")
                            .attr("transform", function(d) {
                                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                            })
                            .text(function(d) { return d.text; });
                    }


            })
        }}
    }])