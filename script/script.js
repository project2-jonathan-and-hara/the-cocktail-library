// create the app object 
const app = {}

//create the init method to define global variables & capture user interaction with select & button elements 
app.init = () => {
    // third party API with cocktail recipe data used for app
    app.apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php';

    app.apiRecipeUrl = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?';

    app.selectReset = document.getElementById("spirits");

    app.spiritName;

    app.recipeCard = document.querySelector('.recipe-card');

    app.header = document.querySelector('header');

    app.footer = document.querySelector('footer');

    app.cocktailImg = document.querySelector('.cocktail-img');

    app.cocktailRecipe = document.querySelector('.recipe');

    app.userSelection = document.querySelector('select');

    // define a variable to target the div with class of gallery                      
    app.gallery = document.getElementById('gallery');

    // target the select element & use addEventListener to update with the users spirit selection 
    app.userSelection.addEventListener('change', (e) => {
        app.spiritName = e.target.selectedOptions[0].innerText;
        e.stopPropagation();
    });
    // on browser refresh reset drop down to 'select'
    app.selectReset.selectedIndex = 0;

    // target stir button and use addEventListener to capture users preferred spirit and display the cocktail options
    // also prevent the select title from being an option 
    app.stirBtn = document.querySelector('.stirBtn');
    app.stirBtn.addEventListener('click', (e) => {
        app.recipeCard.style.display = 'none';
        app.footer.style.position = 'relative';
        if (app.spiritName !== 'Select' && app.spiritName !== undefined) {
            app.header.style.top = '0';
            app.getCocktails();
        }
        e.stopPropagation();
    })
}

// declare a getCocktails method & use AJAX method to obtain the cocktails data from the third party API
app.getCocktails = () => {
    const url = new URL(app.apiUrl);
    url.search = new URLSearchParams({
        'i': app.spiritName
    });
    fetch(url)
        .then(response => {
          if(response.ok){
            return response.json();
          } else {
            throw new Error("We're having trouble mixing your cocktail,please come back later!");
          }
        })
        .then(drinksResult => {
            app.gallery.innerHTML = '';
            app.displayImages(drinksResult);
        })
        .catch((error)=> {
          error = "We're having trouble mixing your cocktail, please come back later!";
          alert(error);
        })
}

// created a displayImages method to populate an image gallery of cocktails & their names for the users selection
app.displayImages = (drinksArray) => {

    // use for loop to target the cocktail images & texts from the third party API and display it as a gallery
    for (let i = 0; i <= 5; i++) {
        const listItem = document.createElement('li');
        const image = document.createElement('img');
        const text = document.createElement('p');

        image.src = drinksArray.drinks[i].strDrinkThumb;
        image.alt = drinksArray.drinks[i].strDrink;
        listItem.setAttribute('data-id', drinksArray.drinks[i].idDrink);
        // to make the listItem in the gallery tabbable
        listItem.setAttribute("tabindex",'0');

        text.innerText = drinksArray.drinks[i].strDrink;

        listItem.appendChild(image);
        listItem.appendChild(text);
        app.gallery.appendChild(listItem);
    };

    // addEventListener to the cocktail image for the user to get recipe on a click event
    app.gallery.childNodes.forEach(liElement => {
        liElement.addEventListener('click', (e) => {
            let idDrink = liElement.getAttribute('data-id');
            app.getRecipe(idDrink);
            e.stopImmediatePropagation();
        });
        // allow user to use the enter key on the tabbable gallery to get recipe
        liElement.addEventListener("keyup", (event) => {
            let idDrink = liElement.getAttribute('data-id');
            if (event.keyCode === 13) {
                app.getRecipe(idDrink);
            }
        });
    })
}

// declaring app.getRecipe method to fetch the cocktail recipe for the user
app.getRecipe = (idDrink) => {
    // reset the selected cocktail img & recipe 
    app.cocktailImg.innerHTML = '';
    app.cocktailRecipe.innerHTML = '';
    app.recipeCard.style.display = 'flex';

    const url = new URL(app.apiRecipeUrl);
    url.search = new URLSearchParams({
        'i': idDrink
    });

    fetch(url)
        .then(response => {
          if(response.ok){
            return response.json();
          } else{
            throw new Error("We're having trouble mixing your cocktail,please come back later!");
          }
        }) 
        .then(idResult => {
            // define a variable for the image, get the image and add it to the cocktail image div 
            const image = document.createElement('img');
            image.src = idResult.drinks[0].strDrinkThumb;
            app.cocktailImg.appendChild(image);

            // define variables for the cocktail object, recipe list and instructions
            const cktlObj = idResult.drinks[0];
            const recipeUl = document.createElement('ul');
            const instructions = document.createElement('p');
            // set the inner text for the p element 
            instructions.innerText = cktlObj['strInstructions']

            // create a for loop to iterate over the object and print the ingredients, measurements and instructions
            for (let i = 1; i < 16; i++) {
                // create a li element in the DOM for the recipe list 
                const recipeList = document.createElement('li');
                // remove null and empty property values for the selected cocktail object
                if (cktlObj[`strIngredient${i}`] === null || (cktlObj[`strMeasure${i}`] === "" && cktlObj[`strMeasure${i}`] === null)) {
                    break;
                }
                if (cktlObj[`strMeasure${i}`] === null) {
                    cktlObj[`strMeasure${i}`] = "";
                }
                // append the ingredients and the measurement to the recipe list
                recipeList.innerText = cktlObj[`strMeasure${i}`] + " " + cktlObj[`strIngredient${i}`]
                recipeUl.appendChild(recipeList);
            }
            app.cocktailRecipe.appendChild(recipeUl);
            app.cocktailRecipe.appendChild(instructions);
        })
        .catch((error)=> {
          error = "We're having trouble mixing your cocktail, please come back later!";
          alert(error);      
})
}

// call the init method to initiate the app
app.init();



