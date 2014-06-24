angular.module('cri.common')
.directive('d3TagCloud',['d3Service',function(d3Service){
        return{
            restrict : 'EA',
            scope : {
                tags : '=',
                onClick: '&',
                options: '='
            },
            link : function(scope,element,attrs){
                d3Service.d3().then(function(d3) {
                    var fill = d3.scale.category20(),
                        width = 300,
                        height = 300;
                    if(scope.options){
                        width = scope.options.width;
                        height = scope.options.height;
                        if(scope.options.center){
                            console.log(element.find('svg'))
                            element.find('svg').attr('style',"margin:auto auto;");
                        }
                    }

                    d3.layout.cloud().size([width, height])
                        .words(scope.tags.map(function(d) {
                                return {text: d.title, size: 10 + d.number/10 * 120};
                            }))
                        .padding(5)
                        .rotate(function() { return ~~(Math.random() * 2) * 90; })
                        .font("Impact")
                        .fontSize(function(d) { return d.size; })
                        .on("end", draw)
                        .start();

                    function draw(words) {
                        d3.select(element[0]).append("svg")
                            .attr("width", width)
                            .attr("height", height)
                            .append("g")
                            .attr("transform", "translate("+width/2+","+height/2+")")
                            .selectAll("text")
                            .data(words)
                            .enter().append("text")
                            .style("font-size", function(d) { return d.size + "px"; })
                            .style("font-family", "Impact")
                            .style("fill", function(d, i) { return fill(i); })
                            .style('cursor',"pointer")
                            .attr("text-anchor", "middle")
                            .attr("transform", function(d) {
                                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                            })
                            .text(function(d) { return "#"+d.text; })
                            .on('click',function(d) {
                                return scope.onClick({item: d});
                        })
                    }

            })
        }}
    }])