import {transferFunctions} from './tf.js';

let sources = [];
let frequencyArray = null;

try {
    let i = 0;
    for (let sourceName in transferFunctions) {
        if (sourceName.toUpperCase().startsWith('ALIGNED')) {
            let source = transferFunctions[sourceName];

            if (!frequencyArray && source.frequencyArray.length > 0) {
                frequencyArray = source.frequencyArray;
            }

            sources[i++] = {
                magnitude: createPairs(frequencyArray, source.magnitudeArray),
                phase: createPairs(frequencyArray, source.phaseArray),
                coherence: createPairs(frequencyArray, source.coherenceArray)
            };
        }
    }
} catch (e) {
    console.error(e.message);
}

let sum;
try {
    if (!frequencyArray && transferFunctions.SUM.frequencyArray.length > 0) {
        frequencyArray = transferFunctions.SUM.frequencyArray;
    }
    const sumYvalues = transferFunctions.SUM.magnitudeArray;
    sum = createPairs(frequencyArray, sumYvalues);
} catch (e) {
    console.error(e.message);
}

let target;
try {
    if (!frequencyArray && transferFunctions.TARGET.frequencyArray.length > 0) {
        frequencyArray = transferFunctions.TARGET.frequencyArray;
    }
    const targetYvalues = transferFunctions.TARGET.magnitudeArray;
    target = createPairs(frequencyArray, targetYvalues);
} catch (e) {
    console.error(e.message);
}

let corridor60degStart, corridor60degEnd, xovrStart, xovrEnd, xovrCenter, targetBw;
if (!transferFunctions || !transferFunctions.OTHER || !transferFunctions.OTHER[0] || !transferFunctions.OTHER[0].transferFunctionDetailsDTO) {
    console.error('Relevant data is missing.');
} else {
    try {
        corridor60degStart = transferFunctions.OTHER[0].transferFunctionDetailsDTO.corridor60degStart;
        corridor60degEnd = transferFunctions.OTHER[0].transferFunctionDetailsDTO.corridor60degEnd;
        xovrStart = transferFunctions.OTHER[0].transferFunctionDetailsDTO.xovrStart;
        xovrEnd = transferFunctions.OTHER[0].transferFunctionDetailsDTO.xovrEnd;
        xovrCenter = transferFunctions.OTHER[0].transferFunctionDetailsDTO.xovrCenter;
        targetBw = parseFloat(transferFunctions.OTHER[0].transferFunctionDetailsDTO.bandwidth.toFixed(1));
    } catch (e) {
        console.error(e.message);
    }
}

function createPairs(x, y) {
    return y.map((item, index) => [x[index], isNaN(item) ? null : item]);
}