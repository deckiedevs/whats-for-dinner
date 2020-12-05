const apiKey = '';
const sugRecipes = document.getElementById('suggested-recipes');
const searchedRecipes = document.getElementById('searched-recipes');
const searchBtn = document.getElementById('search-btn'); // may need to edit this later

getInput = event => {
    event.preventDefault();

    var ingrInput = document.getElementById('ingredients') // will need to edit based on search form
        .value
        .trim()
        .toLowerCase();
    var ingrArr = [];
    if (ingrInput) {
        ingrArr.push(ingrInput.replace(/,/g, '').split(' '));
    } else {
        errorMsg('Please enter at least one ingredient!')
    };

    getData(ingrArr);
};

errorMsg = message => {
    const errorModal = document.getElementById('error-modal');
    const instances = M.Modal.init(errorModal);
    const instance = M.modal.getinstance(errorModal);
    instance.open();

    const errorMessage = document.getElementById('error-message');
    errorMessage = message;
};

// uses first API to get recipe IDs
getData = ingr => {
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&includeIngredients=${ingr}`;

    fetch(apiUrl).then(function(response) {

        if (response.ok) {
            response.json().then(function(data) {

                if (data.results.length > 0) {
                    getRecipe(data);
                } else {
                    errorMsg('No recipes found!  Try using fewer search parameters.');
                }
            });
        } else {
            errorMsg(`Error: ${response.statusText}`);
        }
    })
    .catch(function(error) {
        errorMsg('Unable to load recipes.  Please try again later.');
    })
};

// uses recipe IDs to return detailed recipe info
getRecipe = recipe => {
    const idArr = [];
    for (i = 0; i < recipe.results.length; i++) {
        idArr.push(recipe.results[i].id);
    };

    const recipeUrl = `https://api.spoonacular.com/recipes/informationBulk?apiKey=${apiKey}&ids=${idArr.join()}`;    
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
    sugRecipes.classList.add('hide');
    searchedRecipes.classList.remove('hide');

    // creates recipe cards
    for (let i = 0; i < 9; i++) {
        let recipeHeader = document.createElement('h4');
        recipeHeader.classList.add('light-blue-text', 'text-accent-2', 'center');
        recipeHeader.textContent = 'Try one of these recipes!';
        searchedRecipes.appendChild(recipeHeader);

        let modalTrigger = document.createElement('a');
        modalTrigger.classList.add('recipe-link', 'modal-trigger')
        modalTrigger.setAttribute('href', '#recipe-modal');
        modalTrigger.setAttribute('id', `recipe-${i}`);
        searchedRecipes.appendChild(modalTrigger); 

        let columnEl = document.createElement('div');
        columnEl.classList.add('col', 's12', 'm6', 'l4');
        modalTrigger.appendChild(columnEl);
    
        let cardEl = document.createElement('div');
        cardEl.classList.add('card', 'hoverable');
        columnEl.appendChild(cardEl);

        let imgEl = document.createElement('div');
        imgEl.classList.add('card-image');
        cardEl.appendChild(imgEl);
    
        let recipeImg = document.createElement('img');
        recipeImg.setAttribute('src', recipes[i].image);
        recipeImg.setAttribute('alt', recipes[i].title);
        imgEl.appendChild(recipeImg);

        let recipeTitle = document.createElement('div');
        recipeTitle.classList.add('card-content');   
        recipeTitle.textContent = recipes[i].title;
        cardEl.appendChild(recipeTitle);
    };
};

document.addEventListener('DOMContentLoaded', function() {
    var modalElems = document.querySelectorAll('.modal');
    var modalInstances = M.Modal.init(modalElems);

    var selectElems = document.querySelectorAll('select');
    var selectInstances = M.FormSelect.init(selectElems);
});

searchBtn.addEventListener('click', getInput);