var express = require('express'),
    http = require('http');

var ppm = require('./data/ppm.json');
var airports = require('./data/airports.json');
var flights = require('./data/flights.json');
var reservations = [];


var timestamp = '{"timestamp" : "' + ppm.RTPPMDataMsgV1.timestamp + '"}';

var
    fixedmessage =      '{';
    fixedmessage +=     '"WebFixedMsg1": "' + ppm.RTPPMDataMsgV1.RTPPMData.NationalPage.WebFixedMsg1 + '",';
    fixedmessage +=     '"WebFixedMsg2": "' + ppm.RTPPMDataMsgV1.RTPPMData.NationalPage.WebFixedMsg2 + '"';
    fixedmessage +=     '}';

var national = {
    "WebDisplayPeriod": "60",
    "WebFixedMsg1": "^<5 mins; *<10 mins",
    "WebFixedMsg2": "The Public Performance Measure shows the performance of trains against the timetable, measured as the percentage of trains arriving at destination 'on time'. ",
    "WebMsgOfMoment": "FCC: Signalling failure, Hitchin and near miss, Meldreth. TPE: Unit fault Leeds. LM: Unit stood foul Birmingham New Street, Unit faults, Bletchley & New Street. Southern/FCC/LOROL: Person struck by train, New Cross Gate.",
    "StaleFlag": "N",
    "NationalPPM": {
        "Total": "18767",
        "OnTime": "17497",
        "Late": "1270",
        "CancelVeryLate": "240",
        "PPM": {
            "rag": "G",
            "ragDisplayFlag": "Y",
            "text": "93"
        },
        "RollingPPM": {
            "trendInd": "=",
            "rag": "G",
            "text": "93"
        }
    }
};

var sectors = {"Sector": [
    {
        "sectorDesc": "London and South East",
        "sectorCode": "LSE",
        "SectorPPM": {
            "Total": "10187",
            "OnTime": "9370",
            "Late": "817",
            "CancelVeryLate": "159",
            "PPM": {
                "rag": "A",
                "text": "91"
            },
            "RollingPPM": {
                "trendInd": "+",
                "rag": "G",
                "text": "93"
            }
        }
    },
    {
        "sectorDesc": "Long Distance",
        "sectorCode": "LD",
        "SectorPPM": {
            "Total": "1356",
            "OnTime": "1273",
            "Late": "83",
            "CancelVeryLate": "18",
            "PPM": {
                "rag": "G",
                "text": "93"
            },
            "RollingPPM": {
                "trendInd": "=",
                "rag": "G",
                "text": "93"
            }
        }
    },
    {
        "sectorDesc": "Regional",
        "sectorCode": "REG",
        "SectorPPM": {
            "Total": "5240",
            "OnTime": "4943",
            "Late": "297",
            "CancelVeryLate": "52",
            "PPM": {
                "rag": "G",
                "text": "94"
            },
            "RollingPPM": {
                "trendInd": "+",
                "rag": "G",
                "text": "95"
            }
        }
    },
    {
        "sectorDesc": "Scotland",
        "sectorCode": "SCO",
        "SectorPPM": {
            "Total": "2004",
            "OnTime": "1929",
            "Late": "75",
            "CancelVeryLate": "11",
            "PPM": {
                "rag": "G",
                "text": "96"
            },
            "RollingPPM": {
                "trendInd": "-",
                "rag": "A",
                "text": "90"
            }
        }
    }
]};

for (var i = 0; i < flights.length; i++) {
    flights[i].originFullName = airports[flights[i].origin].name;
    flights[i].destinationFullName = airports[flights[i].destination].name;
}

function getMatchingFlights(data) {
    return flights.filter(function (item) {
        return (item.origin === data.origin) &&
            (item.destination === data.destination);
    });
}

var app = express()
    .use(express.bodyParser())
    .use(express.static('public'));

app.get('/airports', function (req, res) {
    res.json(airports);
});

app.get('/airports/:airport', function (req, res) {
    if (typeof airports[req.params.airport] === 'undefined') {
        res.json(404, {status: 'not found - invalid airport code'});
    } else {
        res.json(airports[req.params.airport]);
    }
});

app.get('/flights', function (req, res) {
    res.json(flights);
});

app.get('/flights/:origin', function (req, res) {
    var with_origin = flights.filter(function (item) {
        return item.origin === req.params.origin;
    });

    res.json(with_origin);
});

app.get('/flights/:origin/:destination', function (req, res) {
    var matches = getMatchingFlights(req.params);

    res.json(matches);
});

app.get('/reservations', function (req, res) {
    res.json(reservations);
});

app.get('/ppm/all', function (req, res) {
    res.json(ppm);
});

app.get('/ppm/fixedmessage', function (req, res) {
    res.send(fixedmessage);
});

app.get('/ppm/national', function (req, res) {
    res.json(national);
});

app.get('/ppm/sectors', function (req, res) {
    res.json(sectors);
});

app.get('/ppm/timestamp', function (req, res) {
    res.send(timestamp);
});

app.post('/reservations', function (req, res) {
    var matches = getMatchingFlights(req.body);

    if (matches.length) {
        reservations.push(matches[0]);
        res.json(matches[0]);
    } else {
        res.status(404).end();
    }
});

app.get('/*', function (req, res) {
    res.json(404, {status: 'not found'});
});

http.createServer(app).listen(3000, function () {
    console.log("Server ready at http://localhost:3000");
});