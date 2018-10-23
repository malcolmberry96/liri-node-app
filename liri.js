require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
//added to format table 
var cTable = require('console.table');
var request = require('request');
var moment = require('moment');

//Search songs via spotify node package
//Get songs and display them in an organized manner
//Initialize search with "concert-this"

var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});
//If user types in "concert-this" initizalize bands in town search API 
//Display Time with moment.js 
if (process.argv[2] == 'concert-this'){
    var artist = process.argv.slice(3).join(" ")
    console.log(artist);

    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    
    request(queryURL, function(error, response, body){
        if (error) console.log(error);
        var result = JSON.parse(body)[0];
        console.log("Venue name " + result.venue.name)
        console.log("Venue Location " + result.venue.city)
        console.log("Date of Event " + moment(result.datetime).format("MM/DD/YYYY"));

    });

//When user types in "spotify this song" initiates call to spotify API
} else if (process.argv[2] == 'spotify-this-song'){

    var songName = process.argv.slice(3).join(" ");
//If the user doesn't type anything program auto searcehs "I want it that way"
    if (songName == undefined){
        songName = "I Want It That Way";
    }
//Search track and throw error
    spotify.search({type: 'track', query: songName, limit: 10 }, function (err,data){
        if(err){
            return console.log('Error occurred: ' + err);
        }
//Organizes results in a table format 
        var tableArray = [];

        for (var i = 0; i < data.tracks.items.length; i++ ){
            var result = {
                artist : data.tracks.items[i].album.artists[0].name,
                album_name : data.tracks.items[i].album.name,
                song_name : data.tracks.items[i].name,
                preview_url : data.tracks.items[i].preview_url
            }
            tableArray.push(result);
        }

        var table = cTable.getTable(tableArray);

        console.log(table);
    });
//If user types in "movie-this" will initiate call to the omdb api
} else if (process.argv[2] === 'movie-this'){
    var movieName = process.argv.slice(3).join(" ");
//Searches I want it that way if no user input 
    if (movieName === undefined){
        movieName === "Mr.Nobody";
    }
    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=1241965", function (error, response, body) {

    var result = JSON.parse(body);
    console.log("Title: " + result.Title);
    console.log("Year: " + result.Released);
    console.log("IMDB Rating: " + result.imdbRating );
    console.log("Rotten Tomatoes: " + result.Ratings[1].Value);
    console.log("Country: " +  result.Country);
    console.log("Language: " + result.Language);
    console.log("Movie Plot: " + result.Plot);
    console.log("Actors: " +  result.Actors);
});
//type to the random.txt
} else if (process.argv[2] === 'do-what-it-says'){
    console.log('do-what-it-says')
}

