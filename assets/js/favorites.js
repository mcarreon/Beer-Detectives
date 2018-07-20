$(document).on('click', '.favorites', function () {
    var toSearch = true;
    
    localStorage.setItem('toSearchPage', toSearch);
});