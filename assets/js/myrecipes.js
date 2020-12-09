var apiKey = "";
var ourRecipes = document.getElementById('our-recipes');
var searchedRecipes = document.getElementById('searched-recipes');
var searchBtn = document.getElementById('search-btn');
var idArr = [];

getRecipe = recipe => {
    var savedrecipes = localStorage.getItem("recipehistory");
    if (savedrecipes) {
        idArr = JSON.parse(savedrecipes);
      }


    var recipeUrl = `https://api.spoonacular.com/recipes/informationBulk?apiKey=${apiKey}&ids=${idArr.join()}`;    
    fetch(recipeUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data)
                displayRecipes(data);
            });
        };
    });
};

displayRecipes = recipes => {
    ourRecipes.classList.add('hide');
    searchedRecipes.classList.remove('hide');
    searchedRecipes.innerHTML = ''
    searchedRecipes.scrollIntoView(true);

    var recipeHeader = document.createElement('h4');
    recipeHeader.classList.add('light-blue-text', 'text-accent-2', 'center');
    recipeHeader.textContent = 'Try one of these recipes!';
    searchedRecipes.appendChild(recipeHeader);

    // creates recipe cards
    for (var i = 0; i < recipes.length; i++) {
        var modalTrigger = document.createElement('a');
        modalTrigger.classList.add('recipe-link', 'modal-trigger')
        modalTrigger.setAttribute('href', '#recipe-modal');
        searchedRecipes.appendChild(modalTrigger); 

        var columnEl = document.createElement('div');
        columnEl.classList.add('col', 's12', 'm6', 'l4');
        modalTrigger.appendChild(columnEl);
    
        var cardEl = document.createElement('div');
        cardEl.classList.add('card', 'recipe-card', 'hoverable');
        cardEl.setAttribute('id', `card-${i}`);
        columnEl.appendChild(cardEl);

        var imgEl = document.createElement('div');
        imgEl.classList.add('card-image');
        cardEl.appendChild(imgEl);
    
        var recipeImg = document.createElement('img');
        // use placeholder if no image is available
        if (recipes[i].image) {
            recipeImg.setAttribute('src', recipes[i].image);
            recipeImg.setAttribute('alt', recipes[i].title);
        } else {
            recipeImg.setAttribute('src', 'https://via.placeholder.com/400x300?text=No+image+found!+:(')   
        }
        imgEl.appendChild(recipeImg);

        var recipeTitle = document.createElement('div');
        recipeTitle.classList.add('card-content');   
        recipeTitle.textContent = recipes[i].title;
        cardEl.appendChild(recipeTitle);
    };

    fullRecipe(recipes);
};

fullRecipe = details => {
    var recipeHeader = document.getElementById('recipe-header');
    var recipeInfoEl = document.getElementById('recipe-info');
    var recipeCards = document.querySelectorAll('.recipe-card');
    var colOne = document.getElementById('recipes-col-1');
    var colTwo = document.getElementById('recipes-col-2');
    var instructions = document.getElementById('instructions');
    var wineHeader = document.getElementById('wine-header')
    var winePairingEl = document.getElementById('wine-pairing');
    var favIcon = document.getElementById('fav-icon')
    var favBtn = document.getElementById('fav-btn');
    console.log(recipeHeader)


    for (var i = 0; i < recipeCards.length; i++) {
        recipeCards[i].addEventListener('click', function(event) {

            // clears modal from previous recipe
            colOne.textContent = '';
            colTwo.textContent = '';

            // gets index of clicked card
            var index = this.getAttribute('id').replace('card-', '');

            // header information
            recipeHeader.textContent = details[index].title;
            
            //reset fav-btn from previous recipe
            console.log(idArr)
            console.log(details[index].id)
            if (idArr.indexOf(details[index].id.toString())!==-1){
                $("#fav-btn").addClass('press').removeClass("light-blue").removeClass("accent-2");
            }
            else{
                $("#fav-btn").removeClass('press').addClass("light-blue").addClass("accent-2");
            };
            var readyTime = details[index].readyInMinutes;
            var servings = details[index].servings;
            var sourceSite = details[index].sourceName;
            var sourceUrl = details[index].sourceUrl;
            var apiId = details[index].id;
            favBtn.setAttribute('data-id', apiId);
            

            recipeInfoEl.innerHTML = `Prep Time: ${readyTime} | Servings: ${servings} | Recipe From: <a href="${sourceUrl}" target="_blank">${sourceSite}</a>`

            // favorite button
            favIcon.textContent = 'favorite_border';

            // grabs all ingredients from data
            var ingrList = details[index].extendedIngredients;

            for (var j = 0; j < ingrList.length; j++) {
                var ingrQty = ingrList[j].measures.us.amount;
                var ingrUnit = ingrList[j].measures.us.unitShort;
                var ingrName = ingrList[j].name;
                
                if (!Number.isInteger(ingrQty)) {
                    ingrQty = convertFraction(ingrQty).trim();
                }

                var ingrItem = document.createElement('p');
                ingrItem.textContent = `${ingrQty} ${ingrUnit} - ${ingrName}`;

                // alternates columns for ingredients
                if (j % 2 === 0) {
                    colOne.appendChild(ingrItem);
                } else {
                    colTwo.appendChild(ingrItem);
                }

                // recipe instructions
                instructions.innerHTML = details[index].instructions;

                // suggested wine pairing
                var winePairing = details[index].winePairing.pairingText;

                if (winePairing) { 
                    wineHeader.classList.remove('hide');
                    winePairingEl.textContent = winePairing;
                }
            }
        })
    }
};

convertFraction = num => {
    var fractionObj = math.fraction(num);
    var numerator = fractionObj.n;
    var denominator = fractionObj.d;
    var wholeNum = '';

    if (numerator > denominator) {
        wholeNum = Math.floor(numerator / denominator);
        numerator %= denominator
    }

    // identifies when the fraction is a third
    if (numerator === 333) {
        numerator = 1;
        denominator = 3;
    } else if (numerator === 666) {
        numerator = 2;
        denominator = 3;
    }
    
    return `${wholeNum} ${numerator}/${denominator}`
};

document.addEventListener('DOMContentLoaded', function() {
    var modalElems = document.querySelectorAll('.modal');
    var modalInstances = M.Modal.init(modalElems);

    var selectElems = document.querySelectorAll('select');
    var selectInstances = M.FormSelect.init(selectElems);
});
getRecipe()