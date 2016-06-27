export function genChartDataLinked(x, 
                                   y1, y2, 
                                   y1names, y2names,
                                   y1namessuffix, y2namessuffix, 
                                   xlabel, ylabel, 
                                   xunits, yunits, 
                                   y1type, y1marker, y1linewidth,
                                   y2type, y2marker, y2linewidth,
                                   nlimit) {
    // Generate Highcharts series formatted fit data
    var series = [];

    var data_x = x;
    var data_y = y1;
    var fit_y  = y2;
    console.log("CHART HELPER");
    console.log(data_x);
    console.log(data_y);
    console.log(fit_y);
    
    // Assume all data and fits match data.y[0] length
    // TODO if not throw error
    var y_len  = data_y.length;
    if (y_len > nlimit) {
        y_len = nlimit;
    }

    // Temporary storage for each series added to chart
    var data_series = [];
    var fit_series  = [];

    // For each observation
    for (let obs = 0; obs < y_len; obs++) {
        data_series = [];
        fit_series = [];

        // Create [[geq, y], [geq, y]...] array for each obs 
        // For each point in current observation
        for (let i = 0; i < data_x.length; i++) {
            data_series.push({x: data_x[i], 
                              y: data_y[obs][i],
                              xLabel: xlabel,
                              yLabel: ylabel,
                              xUnits: xunits,
                              yUnits: yunits});
            fit_series.push( {x: data_x[i], 
                              y: fit_y[obs][i],
                              xLabel: xlabel,
                              yLabel: ylabel,
                              xUnits: xunits,
                              yUnits: yunits});
        }

        series.push({
            name: y1names[obs]+" "+y1namessuffix,
            type: y1type,
            marker: {enabled: y1marker},
            lineWidth: y1linewidth,
            data: data_series
        });

        series.push({
            linkedTo: ":previous",
            name: y2names[obs]+" "+y2namessuffix,
            type: y2type,
            marker: {enabled: y2marker},
            lineWidth: y2linewidth,
            data: fit_series
        });
    }

    return series;
}

export function genChartData(x, y, ynames, ynamessuffix, xlabel, ylabel, xunits, yunits, type, marker, linewidth, nlimit) {
    // Limit amount of datasets plotted
    var y_len  = y.length;
    if (y_len > nlimit) {
        y_len = nlimit;
    }
    
    // Generate Highcharts series formatted chartData
    var series = [];
        
    // Temporary storage for each y added to chart
    var data  = [];

    // For each y dataset 
    for (let yi = 0; yi < y_len; yi++) {
        // Clear previously added series
        data = [];

        // Create [[x, y], [x, y]...] array for this y dataset 
        for (let xi = 0; xi < x.length; xi++) {
            data.push({x: x[xi], 
                       y: y[yi][xi],
                       xLabel: xlabel,
                       yLabel: ylabel,
                       xUnits: xunits,
                       yUnits: yunits});
        }

        series.push({
            name: ynames[yi]+" "+ynamessuffix,
            type: type,
            marker: {enabled: marker},
            lineWidth: linewidth,
            data: data
        });
    }

    return series;
}

export function genChartOptions(chartLabel, xlabel, ylabel, xunits, yunits, ylimits) {
    // Generate Highcharts chartOptions object formatted with custom labels

    var opts = {
        title: {
            text: chartLabel,
        },
        xAxis: {
            title: {
                text: xlabel
            },
            labels: {
                format: "{value} "+xunits
            }
        },
        yAxis: { // Primary y axis
            title: {
                text: ylabel
            },
            labels: {
                format: "{value} "+yunits
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
        },
        legend: {
            align: "right",
            layout: "vertical"
        },
        chart: {
            marginTop: 10,
            marginBottom: 50,
            marginRight: 150,
        }
    };

    if (ylimits) {
        opts.yAxis.min = ylimits[0];
        opts.yAxis.max = ylimits[1];
    }

    return opts;
}

var defaultChartTheme = {
    colors: ["#79BCB8", "#0B4F6C", "#197BBD", "#033860", "#47A8BD", "#1E3888", "#EE6C4D", "#FA8334"],
    chart: {
        marginTop: 50,
        marginLeft: 100, // For chart stacking consistency w/
                         // differing axis label lengths
        backgroundColor: null,
        style: {'font-family': 'Lato, Helvetica, Arial, Verdana', 'text-transform': 'none'}
    },
    title: {
        text: "",
        style: {
            fontSize: '16px',
            fontWeight: 'bold',
        }
    },
    subtitle: {
        text: ""
    },
    tooltip: {
        shared: true,
        crosshairs: [true, false],
        borderWidth: 0,
        backgroundColor: 'rgba(219,219,216,0.8)',
        shadow: false,

        useHTML: true,
        headerFormat: '<span style="font-size: 10px">x: {point.key:.4f}</span><br/><table>',
        pointFormat: '<tr>'+
            '<td style="color: {point.color}">\u25CF {series.name}</td>'+
            '<td style="text-align: right"><b>{point.y} {point.yUnits}</b></td>'+
            '</tr>',
        footerFormat: '</table>',
        valueDecimals: 4
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
