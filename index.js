var express = require('express'),
    http = require('http');

var ppm = require('./data/ppm.json');
var ppm = require('./data/stations.json');

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


var app = express()
    .use(express.bodyParser())
    .use(express.static('public'));


app.get('/airports/:airport', function (req, res) {
    if (typeof airports[req.params.airport] === 'undefined') {
        res.json(404, {status: 'not found - invalid airport code'});
    } else {
        res.json(airports[req.params.airport]);
    }
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


app.get('/ppm/all', function (req, res) {
    res.json(ppm);
});

app.get('/ppm/timestamp', function (req, res) {
    res.send(timestamp);
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

app.get('/ppm/sectors', function (req, res) {
    res.json(sectors);
});

app.get('/ppm/sectors/:sectorCode', function (req, res) {
    var with_sectorCode = ppm.RTPPMDataMsgV1.RTPPMData.NationalPage.Sector.filter(function (item) {
        return item.sectorCode === req.params.sectorCode;
    });

    res.json(with_sectorCode);
});

app.get('/ppm/summary/operators/:operatorCode', function (req, res) {
    var with_operatorCode = ppm.RTPPMDataMsgV1.RTPPMData.NationalPage.Operator.filter(function (item) {
        return item.code === req.params.operatorCode;
    });

    res.json(with_operatorCode);
});

app.get('/ppm/detail/operators/:operatorCode', function (req, res) {
    var with_operatorCode = ppm.RTPPMDataMsgV1.RTPPMData.OperatorPage.filter(function (item) {
        return item.Operator.code === req.params.operatorCode;
    });

    res.json(with_operatorCode);
});

app.get('/stations/all', function (req, res) {
    res.json(stations);
});

app.get('/stations/crs/:crsCode', function (req, res) {
    var with_crsCode = stations.RTPPMDataMsgV1.RTPPMData.OperatorPage.filter(function (item) {
        return item.Operator.code === req.params.operatorCode;
    });

    res.json(with_operatorCode);
});



app.get('/*', function (req, res) {
    res.json(404, {status: 'not found'});
});

http.createServer(app).listen(3000, function () {
    console.log("Server ready at http://localhost:3000");
});