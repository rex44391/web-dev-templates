angular.module('myApp', []).controller('myCtrl', function ($scope) {
      $scope.chartOptions = {
        width: 1000,
        height: 200
      };
  
      var dataset = [];

      for (var i = 0; i < 21; i++) {
        dataset.push( parseInt(Math.random()*10000) );
      }
  
      $scope.chartData = dataset;
  
      setTimeout(function(){
        $scope.chartData = [];
        for (var i = 0; i < 35; i++) {
          $scope.chartData.push( parseInt(Math.random()*10000) );
        }
      }, 2000);
}).directive('bars', function ($parse) {
  return {
    restrict: 'E',
    scope: { data: '=', options: '='},
    replace: true,
    template: '<div class="chart"></div>',
    link: function (scope, element, attrs) {
      
      //reuseable chart generating function(idea from Mike Bostock)
      function chart() {
        console.log(d3.select('svg'))
        var width = 1000;
        var height = 200;
        var paddingLeft = 40;
        var paddingBottom = 30;
        var barPadding = 1;
      
        var innerWidth = width - paddingLeft - 10;
        var innerHeight = height - paddingBottom;

        function barChartGen() {
          
          var svgBar = d3.select('.chart')
                        .append('svg')
                        .attr({
                          width: width,
                          height: height
                        });
          
          var yScale = d3.scale.linear()
                  .domain([0, d3.max(scope.data)])
                  .range([0, innerHeight]);
      
          var xAxisScale = d3.scale.linear()
                        .domain([0, scope.data.length])
                        .range([0, innerWidth]);
      
          var yAxisScale = d3.scale.linear()
                        .domain([0, d3.max(scope.data)])
                        .range([innerHeight, 0]);
      
          var xAxis = d3.svg.axis()
                        .scale(xAxisScale)
                        .orient('bottom')
                        .ticks(scope.data.length);
      
          var yAxis = d3.svg.axis()
                        .scale(yAxisScale)
                        .orient('left');
          
          svgBar.selectAll('rect')
                .data(scope.data)
                .enter()
                .append('rect')
                .attr('x', function (d, i) {
                  return innerWidth/scope.data.length*i + barPadding + paddingLeft;
                })
                .attr('y', function (d) {
                  return height - yScale(d) - 20;
                })
                .attr({
                  width: innerWidth/scope.data.length - barPadding
                })
                .attr('height', function (d, i) {
                  return yScale(d);
                })
                .attr('fill', function (d) {
                  return 'rgba(255, 136, ' + parseInt(yScale(d)*255/150) + ', 1)';
                });
          
          svgBar.selectAll('text')
                .data(scope.data)
                .enter()
                .append('text')
                .text(function (d) {
                  return d;
                })
                .attr('x', function (d, i) {
                  return innerWidth/scope.data.length*i + (innerWidth/scope.data.length - barPadding)/2 + paddingLeft;
                })
                .attr('y', function (d, i) {
                  return height - yScale(d) - 20;
                })
                .attr({
                  'font-size': '12px',
                  'fill': '#333',
                  'text-anchor': 'middle'
                });
      
          svgBar.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + paddingLeft + ', 180)')
                .call(xAxis);

          svgBar.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + paddingLeft + ', 10)')
                .call(yAxis);
        }//end of function barChartGen()

        barChartGen.width = function(value) {
          if (!arguments.length) return width;
            width = value;
            return barChartGen;
          };

        barChartGen.height = function(value) {
          if (!arguments.length) return height;
            height = value;
            return barChartGen;
        };

        return barChartGen;
      }
      
      
      var barChart = chart();
            
      scope.$watch('data', function(newValue, oldValue) {
        //watching the data and update it
        if (newValue) {
          barChart();
          console.log('update')
        }
      });
              
    }//end of link: function() 
  };//end of return
});
