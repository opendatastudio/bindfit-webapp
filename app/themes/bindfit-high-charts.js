var chartTheme =  {
    colors: ["#79BCB8", "#EE6C4D", "#0B4F6C", "#FA8334", "#197BBD", "#033860", "#47A8BD", "#1E3888"],
    chart: {
        marginTop: 50,
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
        align: 'left',
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
        },
        opposite: true,
    },
    plotOptions: {
        candlestick: {
            lineColor: '#404048'
        }
    }
};

export default chartTheme;
