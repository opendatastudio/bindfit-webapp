export function genChartData(data, fit, labels, nlimit) {
    // Generate Highcharts series formatted fit data
    var series = [];
    var i = 0;

    var d = data;
    var f = fit;

    // If model has been populated
    if (d && f) {
        console.log("genChartData: data");
        console.log(d.labels.y[0]);

        var data_y = d.y[0];
        var fit_y  = f.y[0];
        
        // Assume all data and fits match data.y[0] length
        // TODO if not throw error
        var y_len  = data_y.length;
        if (y_len > nlimit) {
            y_len = nlimit;
        }

        // Calculate geq for x axis
        var data_x = [];
        var h0 = d.x[0];
        var g0 = d.x[1];
        for (i = 0; i < g0.length; i++) {
            data_x.push(g0[i]/h0[i]);
        }

        // Temporary storage for each series added to chart
        var data_series = [];
        var fit_series  = [];

        // For each observation
        for (var obs = 0; obs < y_len; obs++) {
            data_series = [];
            fit_series = [];

            // Create [[geq, y], [geq, y]...] array for each obs 
            // For each point in current observation
            for (i = 0; i < data_x.length; i++) {
                data_series.push({x: data_x[i], 
                                  y: data_y[obs][i],
                                  xLabel: labels.x.label,
                                  yLabel: labels.y.label,
                                  xUnits: labels.x.units,
                                  yUnits: labels.y.units});
                fit_series.push( {x: data_x[i], 
                                  y: fit_y[obs][i],
                                  xLabel: labels.x.label,
                                  yLabel: labels.y.label,
                                  xUnits: labels.x.units,
                                  yUnits: labels.y.units});
            }

            series.push({
                name: d.labels.y[obs]+" fit",
                type: "line",
                marker: {enabled: true},
                lineWidth: 0,
                data: data_series
            });

            series.push({
                linkedTo: ":previous",
                name: d.labels.y[obs]+" data",
                type: "spline",
                marker: {enabled: false},
                lineWidth: 2,
                data: fit_series
            });
        }
    }

    return series;
}

export function genChartDataResiduals(data, fit, labels, nlimit) {
    // Generate Highcharts series formatted fit residual data

    var series = [];
    var i = 0;

    var d = data;
    var f = fit;
        
    // If model has been populated
    if (d && f) {

        // Only use first dataset
        var y = f.residuals[0];
        
        // Limit plot length
        var y_len  = y.length;
        if (y_len > nlimit) {
            y_len = nlimit;
        }

        // Calculate geq for x axis
        var x  = [];
        var h0 = d.x[0];
        var g0 = d.x[1];
        for (i = 0; i < g0.length; i++) {
            x.push(g0[i]/h0[i]);
        }

        // Temporary storage for each series added to chart
        var obs_series  = [];

        // For each observation
        for (var obs = 0; obs < y_len; obs++) {
            obs_series = [];

            // Create [[geq, y], [geq, y]...] array for each obs 
            // For each point in current observation
            for (i = 0; i < x.length; i++) {
                obs_series.push({x: x[i], 
                                 y: y[obs][i],
                                 xLabel: labels.x.label,
                                 yLabel: labels.y.label,
                                 xUnits: labels.x.units,
                                 yUnits: labels.y.units});
            }

            series.push({
                name: d.labels.y[obs]+" residuals",
                type: "line",
                marker: {enabled: true},
                lineWidth: 2,
                data: obs_series
            });
        }
    }

    return series;
}

export function genChartOptions(labels) {
    // Generate Highcharts options formatted fit labels
    var x = labels.x;
    var y = labels.y;

    var opts = {
        title: {
            text: "",
        },
        subtitle: {
            text: "",
        },
        xAxis: {
            title: {
                text: x.label
            },
            labels: {
                format: "{value} "+x.units
            }
        },
        yAxis: { // Primary y axis
            title: {
                text: y.label
            },
            labels: {
                format: "{value} "+y.units
            }
        },
        tooltip: {
            useHTML: true,
            headerFormat: '<span style="font-size: 10px">x: {point.key:.4f}</span><br/><table>',
            pointFormat: '<tr>'+
                '<td style="color: {point.color}">\u25CF {series.name}</td>'+
                '<td style="text-align: right"><b>{point.y} {point.yUnits}</b></td>'+
                '</tr>',
            footerFormat: '</table>',
            valueDecimals: 4
        }
    };

    return opts;
}

var defaultChartTheme = {
    colors: ["#79BCB8", "#EE6C4D", "#0B4F6C", "#FA8334", "#197BBD", "#033860", "#47A8BD", "#1E3888"],
    chart: {
        marginTop: 50,
        marginLeft: 100, // For chart stacking consistency w/
                         // differing axis label lengths
        backgroundColor: null,
        style: {'font-family': 'Lato, Helvetica, Arial, Verdana', 'text-transform': 'none'}
    },
    title: {
        style: {
            fontSize: '16px',
            fontWeight: 'bold',
        }
    },
    tooltip: {
        shared: true,
        crosshairs: [true, false],
        borderWidth: 0,
        backgroundColor: 'rgba(219,219,216,0.8)',
        shadow: false
    },
    legend: {
        layout: 'horizontal',
        floating: true,
        align: 'center',
        verticalAlign: 'top',
        borderWidth: 0,
        itemStyle: {
            fontWeight: 'bold',
            fontSize: '14px'
        }
    },
    xAxis: {
        gridLineWidth: 1,
        minorTickInterval: null,
        labels: {
            style: {
                fontSize: '12px'
            }
        }
    },
    yAxis: {
        gridLineWidth: 1,
        minorTickInterval: null,
        title: {
            style: {
            }
        },
        labels: {
            style: {
                fontSize: '12px'
            }
        }
        // opposite: true,
    },
    plotOptions: {
        candlestick: {
            lineColor: '#404048'
        }
    }
};

export var defaultChartTheme;
