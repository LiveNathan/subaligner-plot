const commonStates = {
    states: {
        hover: {
            enabled: false
        },
        inactive: {
            opacity: 1
        }
    }
};

let magnitudeSeriesData = [{
    name: 'Main',
    data: source1magnitude,
    color: '#ffc8c8',
    zoneAxis: 'x',
    zones: [{
        value: 60,
        color: '#ffc8c8'
    }, {
        value: 100,
        color: 'red',
    }]
}, {
    name: 'Sub',
    data: source2magnitude,
    color: '#c8c8ff',
    zoneAxis: 'x',
    zones: [{
        value: 60,
        color: '#c8c8ff'
    }, {
        value: 100,
        color: 'blue'
    }]
}, {
    name: `Target (${targetBw}oct)`,
    data: target,
    color: 'black',
    dashStyle: 'ShortDash'
}, {
    name: 'Sum',
    data: sum,
    color: 'magenta',
    dashStyle: 'ShortDot'
}, {
    name: 'Main Coherence',
    data: source1coherence,
    yAxis: 1,
    color: 'red',
    dashStyle: 'Dot',
    opacity: 0.5
}, {
    name: 'Sub Coherence',
    data: source2coherence,
    yAxis: 1,
    color: 'blue',
    dashStyle: 'Dot',
    opacity: 0.5
}];

magnitudeSeriesData = magnitudeSeriesData.map(series => Highcharts.merge(series, commonStates));

let phaseSeriesData = [{
    name: 'Main',
    data: source1phase,
    color: '#ffc8c8',
    zoneAxis: 'x',
    zones: [{
        value: 60,
        color: '#ffc8c8'
    }, {
        value: 100,
        color: 'red'
    }]
}, {
    name: `Sub (${source2delay}ms)`,
    data: source2phase,
    color: '#c8c8ff',
    zoneAxis: 'x',
    zones: [{
        value: 60,
        color: '#c8c8ff'
    }, {
        value: 100,
        color: 'blue'
    }]
}];

phaseSeriesData = phaseSeriesData.map(series => Highcharts.merge(series, commonStates));

document.addEventListener('DOMContentLoaded', function () {

    function syncExtremes(e) {
        const thisChart = this.chart;
        if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
            Highcharts.charts.forEach(function (chart) {
                if (chart !== thisChart) {
                    if(chart.xAxis[0].setExtremes) { // It is null while updating
                        chart.xAxis[0].setExtremes(e.min <= 0 ? 1 : e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
                    }
                }
            });
        }
    }

    const magnitudePlot = Highcharts.chart('magnitude-plot', {
        chart: {
            type: 'line',
            zoomType: 'x'
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'logarithmic',
            lineColor: '#969696',
            tickColor: '#969696',
            labels: {
                style: {
                    color: '#969696',
                }
            },
            crosshair: true,
            plotLines: [{
                color: '#969696',
                dashStyle: 'ShortDot',
                width: 1,
                value: 80,
                label: {
                    text: 'c',
                    verticalAlign: 'bottom',
                    rotation: 0,
                    textAlign: 'right',
                    y: -2
                }
            }],
            events: {
                afterSetExtremes: syncExtremes
            }
        },
        yAxis: [{
            min: -18,
            max: 6,
            tickInterval: 6,
            title: {
                text: 'Magnitude', reserveSpace: false, style: {
                    color: '#969696'
                }
            },
            labels: {
                format: '{value}dB',
                align: 'right',
                x: 6,
                y: -2,
                style: {
                    color: '#969696'
                }
            }
        }, { // Secondary yAxis
            title: {
                text: 'Coherence',
                reserveSpace: false,
            },
            opposite: true,
            min: 0,
            max: 1,
            // tickInterval: 0.5,
            labels: {
                align: 'right',
                x: -6,
                y: -2
            }
        }],
        legend: {enabled: false},
        tooltip: {
            enabled: false
        },
        series: magnitudeSeriesData
    });

    const phasePlot = Highcharts.chart('phase-plot', {
        chart: {
            type: 'line',
            zoomType: 'x'
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'logarithmic',
            lineColor: '#969696',
            tickColor: '#969696',
            labels: {
                style: {
                    color: '#969696',
                }
            },
            crosshair: true,
            events: {
                afterSetExtremes: syncExtremes
            }
        },
        yAxis: {
            min: -180,
            max: 180,
            tickInterval: 60,
            title: {
                text: 'Phase', reserveSpace: false, style: {
                    color: '#969696'
                }
            },
            labels: {
                format: '{value} °',
                align: 'right',
                x: 4,
                y: -2,
                style: {
                    color: '#969696'
                }
            }
        },
        legend: {enabled: false},
        tooltip: {
            enabled: false
        },
        series: phaseSeriesData
    });

    ['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
        document.getElementById('magnitude-plot').addEventListener(eventType, function (e) {
            const chart = phasePlot,
                event = chart.pointer.normalize(e),
                point = chart.series[0].searchPoint(event, true);

            if (point) {
                chart.xAxis[0].drawCrosshair(e, point);
            }
        });

        document.getElementById('phase-plot').addEventListener(eventType, function (e) {
            const chart = magnitudePlot,
                event = chart.pointer.normalize(e),
                point = chart.series[0].searchPoint(event, true);

            if (point) {
                chart.xAxis[0].drawCrosshair(e, point);
            }
        });
    });

    Highcharts.Pointer.prototype.reset = function () {
        return undefined;
    };
});
