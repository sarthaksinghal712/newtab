window.mylocation = {
    latitude: '',
    longitude: '',
    text: '',
};
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
} else {
    mylocation.text = "Location Access Required";
}


function showPosition(position) {
    mylocation.latitude = position.coords.latitude;
    mylocation.longitude = position.coords.longitude;
    mylocation.text = "Location Approved"
    parselocation(mylocation)
}

function parselocation(loc) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://us1.locationiq.com/v1/reverse.php?key=pk.6560de4b4cb1246d025cc19b6a185eee&lat=" +
            loc.latitude + "&lon=" + loc.longitude + "&format=json",
        "method": "GET"
    }
    $.ajax(settings).done(function (response) {
        city = response.address.city;
        cc = response.address.country_code;
        state = response.address.state;
        getCases(city, state, response)
        getCases1(city, cc, response)
    });
}



function getCases(city, state, response) {
    $.ajax({
        url: "https://api.covid19india.org/state_district_wise.json",
        jsonp: true,
        method: "GET",
        dataType: "json",
        success: function (res) {
            // console.log(response)
            // console.log(res[state].districtData)
            // console.log(city, state)
            try {
                activeCases = res[state].districtData[city].active
                recoveredCases = res[state].districtData[city].recovered
                deceased = res[state].districtData[city].deceased
                $("#CityState").text(city + ", " + state)
                $("#acases").html("Active Cases: " + activeCases +
                    "<br>Recovered: " + recoveredCases + "<br>Deceased: " + deceased
                )
            } catch (err) {
                $("#CityState").text(city + ", " + state)
                $("#acases").text("Data Discrepancy, no data found for your city")

            }
        }
    });
}


// Client ID and API key from the Developer Console
var CLIENT_ID = '88839280987-mnnroumv9hbhq8jkrao1d1i1aevncevi.apps.googleusercontent.com';
var API_KEY = 'AIzaSyB05dD_vIsDpl1Ijmk_kmdKt1WfuMeXXCg';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest", "https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/spreadsheets ";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function (error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        $("#authbtn").hide()
        signoutButton.style.display = 'block';
        $("#today_btn").show();
        $("#all_btn").show();
        $("#all_btn").click(function () {
            $("#lis").empty()
            listUpcomingEvents()
        })
        $("#today_btn").click(function () {
            $("#lis").empty()
            listUpcomingEvents((new Date()).toISOString());
        });
        listUpcomingEvents()
        makeApiCall(window.prompt("Enter Your Spreadsheet ID"))
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    $("#lis").empty()
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.createElement('li');
    var lis = document.getElementById("lis")
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
    lis.appendChild(pre)
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents(timeMax = null) {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'timeMax': timeMax,
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 5,
        'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;


        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                window.event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;

                }
                appendPre(event.summary + ' (' + moment(when).format(
                    'MMMM Do YYYY, h:mm a') + ')\n')
            }
        } else {
            appendPre('Relax! You have no events pending for today ;)');
        }
    });
}


$("a").attr("target", "_blank");
d = new Date()
var message = new Object()
window.hours = d.getHours()
if (hours >= 04 && hours < 12) {
    message.Text = "Good Morning, Sarthak!"
} else if (hours >= 12 && hours < 16) {
    message.Text = "Good Afternoon, Sarthak!"
} else if (hours >= 16 && hours < 21) {
    message.Text = "Good Evening, Sarthak!"
} else if (hours >= 21 && hours < 24) {
    message.Text = "Good Night, Sarthak!"
}
$("#mes").text(message.Text)



function getCases1(city, cc, response) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + cc + "&appid=6b3ca7162b50112b86e02db7b5ebb88f&units=metric",
        jsonp: true,
        method: "GET",
        dataType: "json",
        success: function (res) {
            // console.log(res);
            $("#temp").text(res.main.temp.toFixed() + "° C, " + res.weather[0].main + "y")
            $("#ccc").text(city + ", " + response.address.country)
        }
    });
}

function makeApiCall(spid) {
    try {
        var params = {
            spreadsheetId: spid,
            range: "Sheet1",
        };
        var request = gapi.client.sheets.spreadsheets.values.get(params);
        request.then(function (response) {
            rr = response.result["values"]
            for (var i = 0; i < rr.length; i++) {
                notea = document.getElementById("hehehe")
                tn = document.createTextNode(rr[i][0])
                ele = document.createElement("p")
                ele.appendChild(tn)
                notea.appendChild(ele)
                console.log(rr[i][0])

            }
            $("#hehehe").animate({
                scrollTop: $('#hehehe').prop("scrollHeight")
            }, 1000);
        }, function (reason) {
            console.error('error: ' + reason.result.error.message);
            $("#hehe").text("Unknown Spreadsheet ID, could not load or dump data")
        });
    } catch {

    }
}