/*Liri is CLI program that takes in a variety of commands to generate results 
in music, concerts, twitter, and editing of text documents. Actions and/or search requests
are generated via the Twitter API, Spotify API, and the OBMDB API. 
*/



//NPM module for Spotify API. 
var spoitfy = require("spotify");

//NPM module for OMDB API
var request = require("request");

//NPM module for logs. 
var filename = '.log.txt';

//NPM module used for logging solution
var log = require('simple-node-logger').createSimpleFileLogger(filename);

//All log information printed to log.txt
log.setLevel('all');

//---------------------------------------------------------------------------

//Program 

//Variable for action request
var action = process.argv[2];

//Optional argument to request specific information.
//Based on action type. 
var argument = "";

//Controller function that determines what action is taken, 
// and specific data to complete that action 
doSomething(action, argument);

//Switch cases that tell liri which operations to execute with query
function doSomething(action, argument){
    argument = getThirdArgument();

    switch (action){

        //Get song information.
        case "spotify-this-song":
        //First gets song title argument. 
        var songTitle = argument;
        //If no song title provided, defaults to specific song. 
        if (songTitle === ""){
            lookupSpecificSong();

        } else {
            getSongInfo(songTitle);    
        }
        break;

        //Get movie information. 
        case "movie-this":

        //Get movie title argument. 
        var movieTitle = argument;

        //If no movie title provided, defaults to specific movie. 
        if (movieTitle === "") {
            getMovieInfo("Mr.Nobody");
        } else {
            getMovieInfo(movieTitle);
        }
        break;
        //Gets text inside file, and uses it to do something.
        case "do-what-it-says":
        doWhatItSays();
        break;
    }
}
//Returns optional third argument such as additional information like a song title
function getThirdArgument(){

    //Stores all possible argument in an array 
    argumentArray = process.argv;

    //Loops through words in node argument 
    for (var i= 3; i < argumentArray.length; i++){
        argument += argumentArray[i];
    }
    return argument;
}

//Calls spotify API to retrieve song information for song title. 
function getSongInfo(songTitle) {
    spotify.search({type: 'track', query: songTitle}, function(err, data){
        if(err){
            logOutput.error(err);
            return
        }
            var artistArray = data.tracks.items[0].album.artists;

            //Array to hold artists names, when more than one artist exist for a song
            var artistsName = [];
            //Pushes artists for track to array 
            for (var i = 0; i < artistArray.length; i++){
                artistsName.push(artistArray[i].name)
            }
            //Converts artists array into a string 
            var artists =  artistsNames.join(",");

            logOutput("Artist(s): " + artists);
            logOutput("Song: " + data.tracks.items[0].name)
            logOutput("Spotify Preview URL: " + data.tracks.items[0].preview_url)
            logOutput("Album Name: " + data.tracks.items[0].album.name);
        });

    }

//When no song title is input defaults to "I want it that way"
function lookupSpecificSong(){
    //Call Spotify API to retrieve the specific track 
    /*spotify.lookup({type: 'track', id: }, function(err,data){
        if(err){
            logOutput.error(err);
            return
        }
        //Prints the artists, track name, preview url and album name
        logOutput("Artist: " + data.artists[0].name);
        logOutput("Song: " + data.name);
        logOutput("Spotify Preview URL: "+ data.preview_url);
        logOutput("Album Name: " + data.album.name);
    });
}*/

function getMovieInfo(movieTitle){

//Request API for movie 

var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=";


request(queryUrl, function(error, response, body) {

    if (!error && response.statusCode == 200){
        //If the request is successful the following lines will execute
        var movie = JSON.parse(body);

        //Prints out movie info
        logOutput("Title: "+ movie.Title);
        logOutput("Year Released: "+ movie.Year);
        logOutput("IMDB Rating: " + movie.imdbRating);
        logOutput("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
        logOutput("Country Produced: " + movie.Country);
        logOutput("Language: "+ movie.Language);
        logOutput("Plot: " + movie.Plot);
        logOutput("Actors: " + movie.Actors);
    }
});

function doWhatItSays() {
//Uses fs node package to take the text inside random.txt and write
    fs.readfile("random.txt","utf8", function(err,data){
        if(err){
            logOutput.error(err);
        }else{
            //Creates array with data
            var randomArray = data.split(",");

            //Sets action to first item in array.
            action = randomArray[0];

            //Sets optional third argument to second item in array
            argument = randomArray[1];

            //Calls main controller to do something based on action and argument
            doSomething(action,argument);
        }
    });
}

//Logs data to print in terminal 
function logOutput(logText){
    log.info(logText);
    console.log(logText);
}

