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

    // target the select element & use addEventListener to update with the users spirit selection 
    app.userSelection = document.querySelector('select');
    app.userSelection.addEventListener('change', (e) => {
        app.spiritName = e.target.selectedOptions[0].innerText;
        e.stopPropagation();
    });

    app.cocktailImg = document.querySelector('.cocktail-img');

    app.cocktailRecipe = document.querySelector('.recipe');

    app.selectReset.selectedIndex = 0;

    // target stir button and use addEventListener to capture users choice and display the cocktail options. 
    // also deactivate 'select' as an option  from the drop down  
    app.stirBtn = document.querySelector('.stirBtn');
    app.stirBtn.addEventListener('click', (e) => {
        app.recipeCard.style.display = 'none';
        app.header.style.top = '0';
        app.footer.style.position = 'relative';
        if (app.spiritName !== 'Select') {
            app.getCocktails();
        }

        //defining a variable to reference the ul with a class of gallery
        app.ulElement = document.querySelector('.gallery');

        // target the ul element in the DOM to create a gallery with 6 cocktail options for the user                         
        app.gallery = document.getElementById('gallery');
        
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
            return response.json();
        })
        .then(drinksResult => {
            app.gallery.innerHTML = '';
            app.displayImages(drinksResult);
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

        text.innerText = drinksArray.drinks[i].strDrink;

        listItem.appendChild(image);
        listItem.appendChild(text);
        app.gallery.appendChild(listItem);
        app.gallery.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
        });
    };

    // addEventListener to the cocktail image for the user to get recipe on a click event
    app.ulElement.childNodes.forEach(liElement => {
        liElement.addEventListener('click', (e) => {
            let idDrink = liElement.getAttribute('data-id');
            app.getRecipe(idDrink);
            e.stopImmediatePropagation();
        });
    })
}

// declaring app.getRecipe method to fetch the cocktail recipe for the user
app.getRecipe = (idDrink) => {
    // reset the selected cocktail
    app.cocktailImg.innerHTML = '';
    app.cocktailRecipe.innerHTML = '';

    app.recipeCard.style.display = 'flex';

    const url = new URL(app.apiRecipeUrl);
    url.search = new URLSearchParams({
        'i': idDrink
    });

    fetch(url)
        .then(response => {
            return response.json()
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
}

// call the init method to initiate the app
app.init();



