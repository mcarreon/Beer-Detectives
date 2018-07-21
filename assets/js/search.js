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

//holds data from most recent api call
var holder = [];


//favorites
var favoritesList;

if (localStorage.getItem('favorites') != null && localStorage.getItem('favorites') != '') {
    favoritesList = JSON.parse(localStorage.getItem('favorites'));
}

if (!Array.isArray(favoritesList)) {
    favoritesList = [];
}
console.log("num of fav: " + favoritesList.length);

//users search params from firebase ---- should change to local storage?
var user = {
    search: '',
    results: 15,
    picked: [],
    favorites: [],
    favoritesDisplayed: false,
}


//holds search functions
//TODO: compact fill results and fill beerinfo into one function?
var ctrl = {
    //fills results, prob setting default to 10
    //handles result cards, and fills result area
    fillResults: function (array) {
        for (var i = 0; i < array.length; i++) {
            var card = $('<div>');
            card.attr('class', 'results-card card h-25 mb-3');
            card.attr('data-num', i);
            card.attr('beer-id', array[i].beer.bid);

            var body = $('<div>');
            body.attr('class', 'card-body row');

            //this col contains the img
            var col4 = $('<div>');
            col4.attr('class', 'col-4');

            //this col contains the desc
            var col6 = $('<div>');
            col6.attr('class', 'col-6');

            //need to move this down
            var col2 = $('<div>');
            col2.attr('class', 'col-2 d-flex flex-column align-items-start');

            var more = $('<div>');
            more.attr('class', 'more align-self-end');
            more.text('Click for more info!');

            var fav = $('<i>');
            fav.attr({
                'value': `${i}`,
                'class': 'save-favorite far fa-star mb-auto align-self-end'
            });

            // checks if element is already a favorite, and changes star color
            var exists = false;

            favoritesList.forEach(function (element) {
                if (element.beerID == array[i].beer.bid) {
                    exists = true;
                    return false;
                }
            })

            if (exists) {
                console.log('Found a favorite!');
                fav.css('color', '#FDCA45');
            }
            //  end of check 

            var name = $('<div>');

            name.text(array[i].beer.beer_name);
            name.attr('class', 'name large');

            var img = $('<img>');
            img.attr({
                'src': array[i].beer.beer_label,
                'alt': array[i].beer.beer_name,
                'class': 'beerImage img-thumbnail'
            });

            var sub = $('<div>');
            sub.attr('class', 'mt-2')
            sub.html(`<span class="brewery medium">${array[i].brewery.brewery_name}</span> | <span class="style">${array[i].beer.beer_style}</span>`);

            var desc = $('<div>');
            desc.text(array[i].beer.beer_description);
            if (array[i].beer.beer_description == "" || array[i].beer.beer_description == null) {
                desc.text('No description...');
            }
            desc.attr('class', 'desc mt-3');

            //creates card -> body -> (col4 -> img) + (col6 -> name, sub, desc) + col2)
            //card.append(body.append(col4.append(img), col6.append(name, sub, desc), col2)); 
            //same but without more info... use until vertical align fixed
            card.append(body.append(col4.append(img), col6.append(name, sub, desc), col2.append(fav, more)));
            //appends results to page
            $('.results-area').append(card);
        }
    },
    //clears result area
    clearResults: function () {
        $('.results-area').empty();
    },
    //fills info cards, more in def than fillResults
    //TODO: package similar code into another function
    //TODO: add more info ie. contact info
    fillBeerInfo: function (array, cardNum) {
        console.log(array);
        console.log(cardNum);

        var card = $('<div>');
        card.attr('class', 'pick-card card mb-3');
        card.attr('beer-id', array[cardNum].beer.bid);

        var body = $('<div>');
        body.attr('class', 'card-body row');

        //this col contains the img
        var col4 = $('<div>');
        col4.attr('class', 'col-3');

        //this col contains the desc
        var col6 = $('<div>');
        col6.attr('class', 'col-7');

        //need to move this down
        var col2 = $('<div>');
        col2.attr('class', 'col-2 d-flex flex-column align-items-start');

        var fav = $('<i>');
        fav.attr({
            'value': `${cardNum}`,
            'class': 'save-favorite far fa-star align-self-end'
        });

        // checks if element is already a favorite, and changes star color
        var exists = false;

        favoritesList.forEach(function (element) {
            if (element.beerID == array[cardNum].beer.bid) {
                exists = true;
                return false;
            }
        })

        if (exists) {
            console.log('Found a favorite!');
            fav.css('color', '#FDCA45');
        }
        //  end of check

        var name = $('<div>');

        name.text(array[cardNum].beer.beer_name);
        name.attr('class', 'name large');

        var img = $('<img>');
        img.attr({
            'src': array[cardNum].beer.beer_label,
            'alt': array[cardNum].beer.beer_name,
            'class': 'beerImage img-thumbnail'
        });

        //handles second row for contact info
        var contactBody = $('<div>');
        contactBody.attr('class', 'contact-body row mb-3');

        //discerns BID beer info searches, and general beer search as the layout is slightly different
        //if a favorite
        if (array[cardNum].brewery === undefined || array[cardNum].brewery === null) {
            var subtitle = $('<div>');
            subtitle.attr('class', 'medium');
            subtitle.html(`<span class="brewery">${array[cardNum].beer.brewery.brewery_name}</span> | <span class="style">${array[cardNum].beer.beer_style}</span> <br> <span class="mt-2">Country: ${array[cardNum].beer.brewery.country_name}</span>`);

            //col contains the map
            var contactCol3 = $('<div>');
            contactCol3.attr('class', 'col-3');

            //col contains the contact info
            var contactCol7 = $('<div>');
            contactCol7.attr('class', 'col-7 pl-4');

            //handles map in left column
            var latitude = array[cardNum].beer.brewery.location.lat;
            var longitude = array[cardNum].beer.brewery.location.lng;

            var mapContainer = $('<div>');
            mapContainer.attr('class', 'ml-4');
            mapContainer.html('<iframe width="75%" height="173.118" class="img-thumbnail" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=' + latitude + '%2C%20' + longitude + '&key=' + api.maps + '" allowfullscreen></iframe>');

            //handles contact info in center column
            var contactName = $('<div>');
            contactName.attr('class', 'con-name medium');
            contactName.text(array[cardNum].beer.brewery.brewery_name);

            var contactSub = $('<div>');
            contactSub.attr('class', 'con-sub');
            contactSub.text(`${array[cardNum].beer.brewery.brewery_type} | ${array[cardNum].beer.brewery.country_name}`);

            var contactInfo = $('<div>');
            contactInfo.attr('class', 'con-info');
            contactInfo.html(`${array[cardNum].beer.brewery.location.brewery_city}, ${array[cardNum].beer.brewery.location.brewery_state} | Website: <a href="${array[cardNum].beer.brewery.contact.url}" target="_blank">${array[cardNum].beer.brewery.contact.url}</a> `);


        } //else if a search
        else {
            var subtitle = $('<div>');
            subtitle.attr('class', 'medium');
            subtitle.html(`<span class="brewery">${array[cardNum].brewery.brewery_name}</span> | <span class="style">${array[cardNum].beer.beer_style}</span> <br> <span class="mt-2">Country: ${array[cardNum].brewery.country_name}</span>`);

            //col contains the map
            var contactCol3 = $('<div>');
            contactCol3.attr('class', 'col-3');

            //col contains the contact info
            var contactCol7 = $('<div>');
            contactCol7.attr('class', 'col-7 pl-4');

            //handles map in left column
            var latitude = array[cardNum].brewery.location.lat;
            var longitude = array[cardNum].brewery.location.lng;

            var mapContainer = $('<div>');
            mapContainer.attr('class', 'ml-4');
            mapContainer.html('<iframe width="75%" height="173.118" class="img-thumbnail" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=' + latitude + '%2C%20' + longitude + '&key=' + api.maps + '" allowfullscreen></iframe>');

            //handles contact info in center column
            var contactName = $('<div>');
            contactName.attr('class', 'con-name medium');
            contactName.text(array[cardNum].brewery.brewery_name);

            var contactSub = $('<div>');
            contactSub.attr('class', 'con-sub');
            contactSub.text(`${array[cardNum].brewery.brewery_type} | ${array[cardNum].brewery.country_name}`);

            var contactInfo = $('<div>');
            contactInfo.attr('class', 'con-info');
            contactInfo.html(`${array[cardNum].brewery.location.brewery_city}, ${array[cardNum].brewery.location.brewery_state} | Website: <a href="${array[cardNum].brewery.contact.url}" target="_blank">${array[cardNum].brewery.contact.url}</a> `);
        }

        var infoRow = $('<div>');
        infoRow.attr('class', 'row d-flex justify-content-around mt-3 mb-3');

        var abv = $('<div>');
        abv.html(`ABV: ${array[cardNum].beer.beer_abv}`);
        abv.attr('class', 'col-3');

        var ibu = $('<div>');
        ibu.html(`IBU: ${array[cardNum].beer.beer_ibu}`);
        ibu.attr('class', 'col-3');

        var created = $('<div>');
        created.html(`Date Created: <br> ${array[cardNum].beer.created_at}`);
        created.attr('class', 'col-6');


        var desc = $('<div>');
        desc.text(array[cardNum].beer.beer_description);
        if (array[cardNum].beer.beer_description == "" || array[cardNum].beer.beer_description == null) {
            desc.text('No description...');
        }
        desc.attr('class', 'pick-desc mt-3');

        //creates card -> body -> (col4 -> img) + (col6 -> name, sub, desc) + col2)
        //card.append(body.append(col4.append(img), col6.append(name, sub, desc), col2)); 
        //same but without more info... use until vertical align fixed
        card.append(
            body.append(
                col4.append(
                    img
                ),
                col6.append(
                    name,
                    subtitle,
                    infoRow.append(
                        abv,
                        ibu,
                        created),
                    desc
                ),
                col2.append(
                    fav
                )
            ),
            contactBody.append(
                contactCol3.append(
                    mapContainer
                ),
                contactCol7.append(
                    contactName,
                    contactSub,
                    contactInfo
                )
            )
        );
        $('.results-area').append(card);
    },
    //saves a favorite by taking ID
    saveFavorite: function (id) {
        var beerID = {
            beerID: id
        }
        console.log('saved beerID: ' + beerID.beerID);
        favoritesList.push(beerID);
        console.log(favoritesList);
        localStorage.clear();
        localStorage.setItem('favorites', JSON.stringify(favoritesList));

    },
    //fills favorites using BID searches
    fillFavorites: function () {

        var storedFavs = favoritesList;
        console.log('Locally stored favorites: ');
        console.log(storedFavs);

        var outBoundArgs = [];

        for (var i = 0; i < storedFavs.length; i++) {

            var queryUrl = buildUrlFavorites(storedFavs[i].beerID);
            console.log('query URL for favorites: ' + queryUrl);

            outBoundArgs.push(
                $.ajax({
                    url: queryUrl,
                    method: "GET"
                })
            );
        }

        $.when.apply($, outBoundArgs).then(function () {
            var args = Array.from(arguments);
            console.log(args);

            for (var i = 0; i < args.length; i++) {
                user.favorites.push(args[i][0].response);
                console.log(user.favorites[i]);
                ctrl.fillBeerInfo(user.favorites, i);
            }

            $('.save-favorite').remove();
        });
    }

}

{
    /* <div class="card">
        <div class="card-body row">
            <div class="col-4">
                <img class="card-image-left" src="https://untappd.akamaized.net/site/beer_logos/beer-5862_2189b_sm.jpeg" width="250" heigh="250"alt="">
            </div>
            <div class="col-6">
                <div>White</div>
                <div>Allagash | Year 1st Brewed</div>
                <div>Description + Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita, quidem! Voluptate
                    quis corrupti iusto quasi illum id repellat dolorem nam error aspernatur aut molestias quod rem,
                    harum sapiente, omnis fuga.Beatae id corporis magnam fuga? Nemo inventore obcaecati expedita
                    illum neque quisquam consectetur quidem repellendus, maxime quae voluptatibus magnam dolore totam
                    recusandae ullam libero explicabo eum qui enim dignissimos sunt.</div>
            </div>
            <div class="col-2">more info...</div>
        </div>
    </div> */
}

//handles events where users come from another page to look at their favorites, or have a search from the index
$(document).ready(function () {
    holder = [];

    user.search = localStorage.getItem('search-term');

    console.log(user.search);

    ctrl.clearResults();

    //if the user search is not empty, then fill results area with their search

    if (user.search != '' && user.search != null && user.search != undefined) {
        var queryUrl = buildUrlSearch();

        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (data) {
            console.log(data);

            var i = 0;

            while (i < data.response.beers.items.length) {
                holder.push(data.response.beers.items[i]);
                i++;
            }

            ctrl.fillResults(holder);
        });

    }

    user.search = '';



    //detects whether user came from other page, and displays favorites if they have
    localStorage.setItem('search-term', user.search);

    var redToSearch = localStorage.getItem('toSearchPage');

    if (redToSearch === 'true') {

        ctrl.fillFavorites();
    }

    localStorage.setItem('toSearchPage', 'false');
});
//handles search events
$(document).on('submit', '#beer-search', function () {
    holder = [];
    user.favoritesDisplayed = false;
    user.search = '';

    //save search
    user.search = $('#search-input').val().trim();
    ctrl.clearResults();
    console.log('filling results of: ' + user.search);

    //validate
    if (user.search == "") {
        $("#search-input").addClass("is-invalid");
        return false;
    } else {
        $("#search-input").removeClass("is-invalid");
    }

    //ajax call to retrieve search results
    var queryUrl = buildUrlSearch();

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (data) {
        console.log(data);

        var i = 0;

        while (i < data.response.beers.items.length) {
            holder.push(data.response.beers.items[i]);
            i++;
        }
        //fills the results
        ctrl.fillResults(holder);
    });

    console.log(holder);

    user.search = '';


    return false;
});
//refocus on card, and opens to more info
$(document).on('click', '.results-card', function (e) {
    if ($(e.target).is('i') || $(e.target).is('.col-2')) {
        e.preventDefault();
        return;
    }

    console.log('test');
    var BeerNum = $(this).attr('data-num');
    ctrl.clearResults();
    ctrl.fillBeerInfo(holder, BeerNum);

});
//saves favorites 
$(document).on('click', '.save-favorite', function () {
    var beerID = $(this).parent().parent().parent().attr('beer-id');

    //checks if beer is not already in local storage
    if (favoritesList.length != 0) {
        var exists = false;

        favoritesList.forEach(function (element) {
            if (element.beerID === beerID) {
                exists = true;
            }
        });

        if (exists === false) {
            ctrl.saveFavorite(beerID);
        }
    } //if it isnt, add it 
    else {
        ctrl.saveFavorite(beerID);
    }

    $(this).css({
        color: '#FDCA45'
    });
});
//displays favorites
$(document).on('click', '.favorites', function () {
    ctrl.clearResults();
    user.favorites = [];
    user.favoritesDisplayed = true;

    ctrl.fillFavorites();

});
//reset favorites list
$(document).on('click', '.reset-favorites', function () {
    localStorage.setItem('favorites', []);
    user.favorites = [];
    favoritesList = [];

    if (user.favoritesDisplayed) {
        ctrl.clearResults();
    }

    user.favoritesDisplayed = false;

});
//builds urls for searches
function buildUrlSearch() {
    var queryUrl2 = "https://api.untappd.com/v4/search/beer?client_id=F304D9673701ED4E38B1409B3A74A162320B4C6E&client_secret=E67EEC5F30623AA6DFB6EB45782C8E62D55E7F30&q=" + user.search;

    return queryUrl2;
}
//buidls urls for search by ID
function buildUrlFavorites(bid) {
    var queryUrl = "https://api.untappd.com/v4/beer/info/" + bid + "?client_id=F304D9673701ED4E38B1409B3A74A162320B4C6E&client_secret=E67EEC5F30623AA6DFB6EB45782C8E62D55E7F30";

    return queryUrl;
}

function checkSearch(form) {
    // ** START **
    if (form.text.value == "") {

        form.text.focus();
        return false;
    }
    // ** END **
    return true;
}