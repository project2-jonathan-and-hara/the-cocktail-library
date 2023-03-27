// create the app object 

const app = {}
// const ul = document.querySelector('.gallery');
//create the init method to define global variables & capture user interaction with select & button elements 

app.init = () => {
    // third party API with cocktail recipe data used for app
    // www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11007
    app.apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php';
    app.apiRecipeUrl = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?';

    // declare variable to reset the select option on page reload
    app.selectReset = document.getElementById("spirits");

    //declare a variable to capture the users preferred spirit selection
    app.spiritName;

    app.recipeCard = document.querySelector('.recipe-card');

    app.header = document.querySelector('header');
 
    app.footer = document.querySelector('footer');
    
    // target the select element & use addEventListener to update with the users spirit selection 
    app.userSelection = document.querySelector('select');
    app.userSelection.addEventListener('click', (e) => {
        app.spiritName = e.target.innerText;
        // target stir button and use addEventListener to capture users choice and display the cocktail options. Also deactivate the select display from the options. 
        app.stirBtn = document.querySelector('.stirBtn');
        app.stirBtn.addEventListener('click', (e) => {
        //  window.scrollTo(0,app.header.clientHeight). ******** 
            app.recipeCard.style.display = 'none';
            app.header.style.top = '0';
            app.footer.style.position = 'relative';
            if (app.spiritName != 'Select') {
                // reset page for new cocktail selection
                app.cocktailImg.innerHTML = '';
                app.cocktailRecipe.innerHTML = '';
                app.getCocktails();
            }
            // target the ul element in the DOM to create a gallery with 6 cocktail options for the user
            app.gallery = document.querySelector('.gallery');

            //defining a variable to reference the ul with a class of gallery
            app.ulElement = document.querySelector('.gallery');
        })
        e.stopPropagation();
    });

    app.cocktailImg = document.querySelector('.cocktail-img');
    app.cocktailRecipe = document.querySelector('.recipe');
    app.selectReset.selectedIndex = 0;
}

// declare a getCocketails method & use AJAX method to obtain the cocktails data from the third party API

app.getCocktails = () => {
    const url = new URL(app.apiUrl);
    url.search = new URLSearchParams({
        'i': app.spiritName
    });
    fetch(url)
        .then(response => {
            return response.json()
        })
        .then(drinksResult => {
            // console.log(drinksResult);
           
            app.displayImages(drinksResult);
        })
}

// created a displayImage method to populate an image gallery of cocktails & their names for the users selection

app.displayImages = (drinksArray) => {
    
    // reset the gallery 
    app.gallery.innerHTML = '';

    // use for loop to target the cocktail images & texts from the third party API and display it as a gallery
    for (let i = 0; i <= 5; i++) {
        const listItem = document.createElement('li');
        const image = document.createElement('img');
        const text = document.createElement('p');

        image.src = drinksArray.drinks[i].strDrinkThumb;
        image.alt = drinksArray.drinks[i].strDrink;
        listItem.id = drinksArray.drinks[i].idDrink;

        text.innerText = drinksArray.drinks[i].strDrink;

        listItem.appendChild(image);
        listItem.appendChild(text);
        app.gallery.appendChild(listItem);
    };
        // window.scrollTo(0,app.header.clientHeight)**********

    // add event listener to the cocktail image for the user to get recipe on a click event
    app.ulElement.childNodes.forEach(liElement => {
        liElement.addEventListener('click', (e) => {
            let idDrink = liElement.getAttribute('id');
            app.getRecipe(idDrink);
            e.stopPropagation();
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
            const image = document.createElement('img');
            image.src = idResult.drinks[0].strDrinkThumb;
            app.cocktailImg.appendChild(image);
            // console.log(idResult);
            console.log(idResult.drinks[0]);
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

