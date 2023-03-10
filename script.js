// create the app object 

const app = {}

//create the init method to define global variables & capture user interaction with select & button elements 

app.init =() =>{
    // third party API with cocktail recipe data used for app
    app.apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php';

    //declare a variable to capture the users preferred spirit selection
    app.spiritName;
    // target the select element & use addEventListener to update with the users spirit selection 
    app.userSelection = document.querySelector('select');
    app.userSelection.addEventListener('click', (e) =>{
    app.spiritName = e.target.innerText;

    // target stir button and use addEventListener to capture users choice and display the cocktail options. Also deactivate the select display from the options. 
    app.stirBtn = document.querySelector('.stirBtn'); 
    app.stirBtn.addEventListener('click',(e) =>{
    if (app.spiritName != 'Select'){
        app.getCocktails();
    }
}) 
    // target the ul element in the DOM to create a gallery with 6 cocktail options for the user
    app.gallery = document.querySelector('.gallery');
});
}

    // declare a getCocketails method & use AJAX method to obtain the cocktails data from the third party API

app.getCocktails = () => {
    const url = new URL(app.apiUrl);
    url.search = new URLSearchParams({
        'i':app.spiritName
    });
    fetch(url)
        .then(response => {
            return response.json()
        })
        .then(drinksResult => {
            app.displayImages(drinksResult);
        })
    }
    
    // created a displayImage method to populate an image gallery of cocktails & their names for the users selection
    
    app.displayImages = (drinksArray) =>{
     
    // reset the gallery 
    app.gallery.innerHTML = '';
    
    // use for loop to target the cocktail images & texts from the third party API and display it as a gallery
    for (let i = 0; i <=5; i++) {    
                const listItem = document.createElement('li');
                const image = document.createElement('img');
                const text = document.createElement('p');

                image.src = drinksArray.drinks[i].strDrinkThumb;
                image.alt = drinksArray.drinks[i].strDrink;
                text.innerText = drinksArray.drinks[i].strDrink;

                listItem.appendChild(image);
                listItem.appendChild(text);
                app.gallery.appendChild(listItem);
    };
}


// call the init method to initiate the app
app.init();

