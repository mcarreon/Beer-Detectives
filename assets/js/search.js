//holds data from most recent api call
var holder = [];

//users search params from firebase ---- should change to local storage?
var user = {
    search: '',
    results: 10,
    picked: [],
}


//holds search functions
var ctrl = {
    //fills results, prob setting default to 10
    fillResults: function () {
        for (var i = 0; i < user.results; i++) {
            var card = $('<div>');
            card.attr('class', 'results-card card h-25 mb-3');
            card.attr('data-num', i);
    
            var body = $('<div>');
            body.attr('class', 'card-body row');
    
            //this col contains the img
            var col4 = $('<div>');
            col4.attr('class', 'col-3');
    
            //this col contains the desc
            var col6 = $('<div>');
            col6.attr('class', 'col-7');
    
            //need to move this down
            //var col2 = $('<div>');
            //col2.attr('class', 'col-2 more text-right align-text-bottom');
            //col2.text('more info...');

            var name = $('<div>');

            name.text(holder[i].beer.beer_name);
            name.attr('class', 'name');

            var img = $('<img>');
            img.attr({
                'src': holder[i].beer.beer_label,
                'alt': holder[i].beer.beer_name,
                'class': 'beerImage img-thumbnail'
            });

            var sub = $('<div>');
            sub.attr('class', 'mt-2')
            sub.html(`<span class="brewery">${holder[i].brewery.brewery_name}</span> | <span class="style">${holder[i].beer.beer_style}</span>`);

            var desc = $('<div>');
            desc.text(holder[i].beer.beer_description);
            if (holder[i].beer.beer_description == "" || holder[i].beer.beer_description == null) {
                desc.text('No description...');
            }
            desc.attr('class', 'desc mt-3');

            //creates card -> body -> (col4 -> img) + (col6 -> name, sub, desc) + col2)
            //card.append(body.append(col4.append(img), col6.append(name, sub, desc), col2)); 
            //same but without more info... use until vertical align fixed
            card.append(body.append(col4.append(img), col6.append(name, sub, desc)));
            //appends results to page
            $('.results-area').append(card);
        }       
    },
    clearResults: function () {
        $('.results-area').empty();
    },
    fillBeerInfo: function (cardNum) {
        console.log(holder);

        var card = $('<div>');
        card.attr('class', 'pick-card card mb-3');
    
        var body = $('<div>');
        body.attr('class', 'card-body row');
    
        //this col contains the img
        var col4 = $('<div>');
        col4.attr('class', 'col-3');
    
        //this col contains the desc
        var col6 = $('<div>');
        col6.attr('class', 'col-7');
    
        //need to move this down
        //var col2 = $('<div>');
        //col2.attr('class', 'col-2 more text-right align-text-bottom');            
        //col2.text('more info...');
        var name = $('<div>');

        name.text(holder[cardNum].beer.beer_name);
        name.attr('class', 'name');

        var img = $('<img>');
        img.attr({
                'src': holder[cardNum].beer.beer_label,
                'alt': holder[cardNum].beer.beer_name,
                'class': 'beerImage img-thumbnail'
            });

        var subtitle = $('<div>');
        subtitle.attr('class', 'mt-2')
        subtitle.html(`<span class="brewery">${holder[cardNum].brewery.brewery_name}</span> | <span class="style">${holder[cardNum].beer.beer_style}</span> <br> <span class="mt-2">Country: ${holder[cardNum].brewery.country_name}</span>`);

        var infoRow = $('<div>');
        infoRow.attr('class', 'row pl-3 d-flex justify-content-around mt-3 mb-3');

        var abv = $('<div>');
        abv.html(`ABV: <br> ${holder[cardNum].beer.beer_abv}`);
        abv.attr('class', 'col-3');

        var ibu = $('<div>');
        ibu.html(`IBU: <br> ${holder[cardNum].beer.beer_ibu}`);
        ibu.attr('class', 'col-3');

        var created = $('<div>');
        created.html(`Date Created: <br> ${holder[cardNum].beer.created_at}`);
        created.attr('class', 'col-6');


        var desc = $('<div>');
        desc.text(holder[cardNum].beer.beer_description);
        if (holder[cardNum].beer.beer_description == "" || holder[cardNum].beer.beer_description == null) {
                desc.text('No description...');
        }
        desc.attr('class', 'pick-desc mt-3');

        //creates card -> body -> (col4 -> img) + (col6 -> name, sub, desc) + col2)
        //card.append(body.append(col4.append(img), col6.append(name, sub, desc), col2)); 
        //same but without more info... use until vertical align fixed
        card.append(body.append(col4.append(img), col6.append(name, subtitle, infoRow.append(abv, ibu, created), desc)));
        $('.results-area').append(card);
    }

}

{/* <div class="card">
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
</div> */}

//does not work on enter
$(document).on('submit', '#beer-search', function () {
    holder = []; 
    console.log('filling results'); 
    user.search = $('#search-input').val().trim();
    ctrl.clearResults();
    console.log(user.search);

    var queryUrl = buildUrl();

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

        ctrl.fillResults();   
    });
    
    console.log(holder);

    return false;
});

$(document).on('click', '.results-card', function () {
    console.log('test');
    var BeerNum = $(this).attr('data-num');
    ctrl.clearResults();
    ctrl.fillBeerInfo(BeerNum);
    
});





function buildUrl() {
    queryUrl2 = "https://api.untappd.com/v4/search/beer?client_id=F304D9673701ED4E38B1409B3A74A162320B4C6E&client_secret=E67EEC5F30623AA6DFB6EB45782C8E62D55E7F30&q=" + user.search;

    return queryUrl2;
}

var queryUrl = "https://api.punkapi.com/v2/beers?beer_name=red"

$.ajax({
    url: queryUrl,
    method: "GET"
}).then(function (response) {
    console.log(response);
});




