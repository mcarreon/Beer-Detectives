//  When loading the page, initialize the DB

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAoo3LMSf4V3n2IvSshg-JJmDIGv-Flvzw",
    authDomain: "beerdetectives-becda.firebaseapp.com",
    databaseURL: "https://beerdetectives-becda.firebaseio.com",
    projectId: "beerdetectives-becda",
    storageBucket: "beerdetectives-becda.appspot.com",
    messagingSenderId: "428567815464"
};
firebase.initializeApp(config);
// Create a variable to reference the database
var database = firebase.database();

// Initial Variables (SET the first set IN FIREBASE FIRST)
// Note remember to create these same variables in Firebase!
var beerName = "";
var beerType = "";
var locations = "";

// Click Button changes what is stored in firebase
$(document).ready(function () {
    $("#search-button").on("click", function (event) {

        // Prevent the page from refreshing
        event.preventDefault();

        // Get inputs
        beerName = $("#beer-Name").val().trim();

        // database.ref().push(Favorites);
        database.ref().push({
            Beer: beerName,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    })
});


    var queryURL = "https://api.punkapi.com/v2/beers/random";
    var call1 = $.ajax({
      url: queryURL,
      method: "GET"
    });
    var call2 = $.ajax({
      url: queryURL,
      method: "GET"
    });
    var call3 = $.ajax({
      url: queryURL,
      method: "GET"
    });
    
    $.when(call1, call2, call3)
    .then(function(response1, response2, response3) {
        // debugger;
        var beer = response1[0][0];
        // var suggestionWrapper = $('<div class="suggestion">')
        var beerName = $("<p>").text(beer.name);
        var beerType = $("<p>").text(beer.tagline);
        var beerImage = $("<img>").attr("src", beer.image_url);
        var suggestionWrapper = $('<a class="suggestion">');
        suggestionWrapper.append(beerImage);


        // suggestionWrapper.append(beerName, beerType, beerImage);
        $("#suggestions-div").empty().append(suggestionWrapper).append(suggestionWrapper2);
        
    });

// Then use the variables to pull load Favorites from DB


