function decadeTickPositioner() {
    const positions = []
    let i;

    for(i = 20; i <= 100; i += 10) {
        positions.push(i);
    }

    for(i = 200; i <= 1000; i += 100) {
        positions.push(i);
    }

    for(i = 2000; i <= 10000; i += 1000) {
        positions.push(i);
    }

    for(i = 20000; i <= 200000; i += 10000) {
        positions.push(i);
    }

    return positions;
}

document.addEventListener('DOMContentLoaded', function () {
    const magnitudePlot = Highcharts.chart('magnitude-plot', {
        chart: {
            type: 'line',
            zoomType: 'x',
            // alignTicks: false
        },
        title: {
            text: ''
        },
        xAxis: {
            // type: 'logarithmic',
            // min: 20,
            // max: 20000,
            plotLines: [{
                color: '#969696',
                dashStyle: 'ShortDot',
                width: 1,
                value: 39,
                label: {
                    text: 'c',
                    verticalAlign: 'bottom',
                    rotation: 0,
                    textAlign: 'right',
                    y: -2
                }
            }],
            tickPositioner: decadeTickPositioner
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
        legend: { enabled: false },
        series: [{
            name: 'Main',
            data: source1magnitude,
            color: '#ffc8c8',
            zoneAxis: 'x',
            zones: [{
                value: 27,
                color: '#ffc8c8'
            }, {
                value: 39,
                color: 'red',
            }]
        }, {
            name: 'Sub',
            data: source2magnitude,
            color: '#c8c8ff',
            zoneAxis: 'x',
            zones: [{
                value: 27,
                color: '#c8c8ff'
            }, {
                value: 54,
                color: 'blue'
            }]
        }, {
            name: 'Target',
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
        }]
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
        legend: { enabled: false },

        series: [{
            name: 'Main',
            data: source1phase,
            color: '#ffc8c8',
            zoneAxis: 'x',
            zones: [{
                value: 37,
                color: '#ffc8c8'
            }, {
                value: 51,
                color: 'red'
            }]
        }, {
            name: 'Sub',
            data: source2phase,
            color: '#c8c8ff',
            zoneAxis: 'x',
            zones: [{
                value: 37,
                color: '#c8c8ff'
            }, {
                value: 57,
                color: 'blue'
            }]
        }]
    });
});