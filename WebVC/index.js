$.ready(function(){

});

function searchGames(){
    var searchInValue =  encodeURIComponent(document.getElementById('searchGamesIn').value.trim());
    var searchingText = document.getElementById('searchingIndicator');
    searchingText.style.display = 'inline-block';

    //AJAX request for games so we don't reload
    $.ajax({
        url: "/searchGames",

        data:{
            //Additional data here ie->
            searchTerm: searchInValue
        },

        success: function(data){

            //Get div where we will display results
            var resultsDiv = document.getElementById('searchResults');
            resultsDiv.innerHTML = "";

            for(var i = 0; i < data.length; i++)
            {
                //Set up game's image
                var newImg = document.createElement('img');
                newImg.src = data[i].imageLink;
                newImg.width = 80;
                newImg.height = 80;

                //set up game's title
                var titleEle = document.createElement('p');
                titleEle.innerHTML = data[i].name;

                //Add to the div
                resultsDiv.appendChild(newImg);
                resultsDiv.appendChild(titleEle);
            }
            searchingText.style.display = 'none';
        },
        error: function(data){
            console.log("Error");
            searchingText.style.display = 'none';

    }});

};
