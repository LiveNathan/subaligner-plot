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

const colorPairs = {
    red: { light: '#ffc8c8', dark: 'red'},
    orange: { light: '#ffedcc', dark: 'orange'},
    yellow: { light: '#ffffcc', dark: 'yellow'},
    lime: { light: '#ccffcc', dark: 'lime'},
    aqua: { light: '#ccffff', dark: 'aqua'},
    indigo: { light:'#ccccff', dark: 'indigo'},
    violet: { light:'#ebccff', dark: 'violet'},
    blue: { light: '#c8c8ff', dark: 'blue'}
};

let magnitudeSeriesData = [];
sources.forEach((source, i) => {
    let sourceColor;
    if (i === 0)
        sourceColor = colorPairs.red;
    else if (i === sources.length - 1)
        sourceColor = colorPairs.blue;
    else
        sourceColor = colorPairs[Math.floor(Math.random() * colorPairs.length)];

    magnitudeSeriesData.push({
        name: `${i+1}`,
        data: source.magnitude,
        color: sourceColor.light,
        zoneAxis: 'x',
        zones: [
            { value: xovrStart, color: sourceColor.light},
            { value: xovrEnd, color: sourceColor.dark}
        ]
    });
    magnitudeSeriesData.push({
        name: `${i+1}`,
        data: source.coherence,
        yAxis: 1,
        color: sourceColor.dark,
        dashStyle: 'Dot',
        opacity: 0.5
    });
});

magnitudeSeriesData.push({
    name: `Target (${targetBw}oct)`,
    data: target,
    color: 'black',
    dashStyle: 'ShortDash'
}, {
    name: 'Sum',
    data: sum,
    color: 'magenta',
    dashStyle: 'ShortDot'
});
magnitudeSeriesData = magnitudeSeriesData.map(series => Highcharts.merge(series, commonStates));

let phaseSeriesData = sources.map((source, i) => {
    let sourceColor;
    if (i === 0)
        sourceColor = colorPairs.red;
    else if (i === sources.length - 1)
        sourceColor = colorPairs.blue;
    else
        sourceColor = colorPairs[Math.floor(Math.random() * colorPairs.length)];

    return {
        name: `${i+1}`,
        data: source.phase,
        color: sourceColor.light,
        zoneAxis: 'x',
        zones: [
            { value: corridor60degStart, color: sourceColor.light},
            { value: corridor60degEnd, color: sourceColor.dark }
        ]
    };
});
phaseSeriesData = phaseSeriesData.map(series => Highcharts.merge(series, commonStates));


// let phaseSeriesData = [{
//     name: 'Main',
//     data: source1phase,
//     color: '#ffc8c8',
//     zoneAxis: 'x',
//     zones: [{
//         value: corridor60degStart,
//         color: '#ffc8c8'
//     }, {
//         value: corridor60degEnd,
//         color: 'red'
//     }]
// }, {
//     name: `Sub (${source2delay}ms)`,
//     data: source2phase,
//     color: '#c8c8ff',
//     zoneAxis: 'x',
//     zones: [{
//         value: corridor60degStart,
//         color: '#c8c8ff'
//     }, {
//         value: corridor60degEnd,
//         color: 'blue'
//     }]
// }];
//
// phaseSeriesData = phaseSeriesData.map(series => Highcharts.merge(series, commonStates));

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
                value: xovrCenter,
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
            crosshair: true,
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
            crosshair: true,
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
