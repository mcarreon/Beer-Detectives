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
        // dataRef.ref().on("child_added", function (childSnapshot) {

        //     // Log everything that's coming out of snapshot
        //     console.log(childSnapshot.val().beerName);

        //     $("#full-member-list").append("<div class='well'><span class='member-name'> " + childSnapshot.val().name);
        //     // Handle the errors
        // }, function (errorObject) {
        //     console.log("Errors handled: " + errorObject.code);
        // });


        // beerType = $("#beer-Type").val().trim();
        // locations = $("#location").val().trim();

        // var Favorites ={
        //     Beer: beerName,
        //     // Type: beerType,
        //     // Locations: locations,
        // }
    })
});

// Then use the variables to pull load Favorites from DB

// 

