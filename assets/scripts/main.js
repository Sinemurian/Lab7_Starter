// main.js

import { Router } from './Router.js';

const recipes = [
  'https://introweb.tech/assets/json/ghostCookies.json',
  'https://introweb.tech/assets/json/birthdayCake.json',
  'https://introweb.tech/assets/json/chocolateChip.json',
  'https://introweb.tech/assets/json/stuffing.json',
  'https://introweb.tech/assets/json/turkey.json',
  'https://introweb.tech/assets/json/pumpkinPie.json'
];
const recipeData = {} // You can access all of the Recipe Data from the JSON files in this variable

const router = new Router(function () {
  /** 
   * TODO - Part 1
   * fill in the function to display the home page.
   * This should be straight forward, functions here should be swapping around the "shown" class only,
   * which was given to you in the CSS. Simply add / remove this class to the corresponding <section> 
   * elements to display / hide that section. Everything is hidden by default. Make sure that you 
   * are removing any "shown" classes on <sections> you don't want to display, this home method should
   * be called more than just at the start. You should only really need two lines for this function.
   */
  //const card = document.querySelector('section.section--recipe-cards');
  document.querySelector('section.section--recipe-cards').classList.add("shown");
  document.querySelector('section.section--recipe-expand').classList.remove("shown");
  //console.log("WOOOOOOOOOOORRRRRRRRKKKKKKKK!!!!!!!!!!!!!!");
});

window.addEventListener('DOMContentLoaded', init);

// Initialize function, begins all of the JS code in this file
async function init() {
  initializeServiceWorker();

  try {
    await fetchRecipes();
  } catch (err) {
    console.log(`Error fetching recipes: ${err}`);
    return;
  }

  createRecipeCards();
  bindShowMore();
  bindEscKey();
  bindPopstate();

  // Everything starts hidden so load the initial page.
  // This allows the page to be reloaded and maintain the current page, as well
  // as minimizes the amount of "page flashing" from the home --> new page
  
  let page = window.location.hash.slice(1);
  if (page == '') page = 'home';
  //window.location.hash='/'
  router.navigate(page);
}

/**
 * Detects if there's a service worker, then loads it and begins the process
 * of installing it and getting it running
 */
function initializeServiceWorker() {
  /**
   *  TODO - Part 2
   *  Initialize the service worker set up in sw.js
   */
}

/**
 * Loading JSON into a JS file is oddly not super straightforward (for now), so
 * I built a function to load in the JSON files for you. It places all of the recipe data
 * inside the object recipeData like so: recipeData{ 'ghostcookies': ..., 'birthdayCake': ..., etc }
 */
async function fetchRecipes() {
  return new Promise((resolve, reject) => {
    recipes.forEach(recipe => {
      fetch(recipe)
        .then(response => response.json())
        .then(data => {
          // This grabs the page name from the URL in the array above
          data['page-name'] = recipe.split('/').pop().split('.')[0];
          recipeData[recipe] = data;
          if (Object.keys(recipeData).length == recipes.length) {
            resolve();
          }
        })
        .catch(err => {
          console.log(`Error loading the ${recipe} recipe`);
          reject(err);
        });
    });
  });
}

/**
 * Generates the <recipe-card> elements from the fetched recipes and
 * appends them to the page
 */
function createRecipeCards() {
  for (let i = 0; i < recipes.length; i++) {
    const recipeCard = document.createElement('recipe-card');
    recipeCard.data = recipeData[recipes[i]];
     // Makes a new recipe card

    // This gets the page name of each of the arrays - which is basically
    // just the filename minus the .json. Since this is the first element
    // in our recipes array, the ghostCookies URL, we will receive the .json
    // for that ghostCookies URL since it's a key in the recipeData object, and
    // then we'll grab the 'page-name' from it - in this case it will be 'ghostCookies'
    const page = recipeData[recipes[i]]['page-name'];
    router.addPage(page, function() {
      document.querySelector('.section--recipe-cards').classList.remove('shown');
      document.querySelector('.section--recipe-expand').classList.add('shown');
      document.querySelector('recipe-expand').data = recipeData[recipes[i]];
    });
    bindRecipeCard(recipeCard, page);

    document.querySelector('.recipe-cards--wrapper').appendChild(recipeCard);

    /**
     * TODO - Part 1
     * Create the new routes for each card with .addPage(), use bindRecipeCard()
     * to bind the 'click' event (and resulting actions) to said card.
     * We've given you an extra variable on each recipeCard so you don't have to create
     * a neat page name - it's accessible right here with recipeData[recipes[i]]['page-name'],
     * it's the filename of the .json without the .json part.
     * 
     * Also you can set the <recipe-expand> element's data the same way as a <recipe-card>,
     * using .data - feel free to peek in the RecipeExpand.js file for more info.
     * 
     * Again - the functions here should be swapping around the "shown" class only, simply
     * add this class to the correct <section> to display that section
     */
    if (i >= 3) recipeCard.classList.add('hidden');
    document.querySelector('.recipe-cards--wrapper').appendChild(recipeCard);
  }
}

/**
 * Binds the click event listeners to the "Show more" button so that when it is
 * clicked more recipes will be shown
 */
function bindShowMore() {
  const showMore = document.querySelector('.button--wrapper > button');
  const arrow = document.querySelector('.button--wrapper > img');
  const cardsWrapper = document.querySelector('.recipe-cards--wrapper');

  showMore.addEventListener('click', () => {
    const cards = Array.from(cardsWrapper.children);
    // The .flipped class rotates the little arrow on the button
    arrow.classList.toggle('flipped');
    // Check if it's extended or not
    if (showMore.innerText == 'Show more') {
      for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove('hidden');
      }
      showMore.innerText = 'Show less';
    } else {
      for (let i = 3; i < cards.length; i++) {
        cards[i].classList.add('hidden');
      }
      showMore.innerText = 'Show more';
    }
  });
}

/**
 * Binds the click event listener to the <recipe-card> elements added to the page
 * so that when they are clicked, their card expands into the full recipe view mode
 * @param {Element} recipeCard the <recipe-card> element you wish to bind the event
 *                             listeners to
 * @param {String} pageName the name of the page to navigate to on click
 */
function bindRecipeCard(recipeCard, pageName) {
  /**
   * TODO - Part 1
   * Fill in this function as specified in the comment above
   */
   recipeCard.addEventListener('click', e => {
    if (e.path[0].nodeName == 'A') return;
    router.navigate(pageName);
  });
}

/**
 * Binds the 'keydown' event listener to the Escape key (esc) such that when
 * it is clicked, the home page is returned to
 */
function bindEscKey() {
  /**
   * TODO - Part 1
   * Fill in this function as specified in the comment above
   */
   document.addEventListener("keydown", esc => {
     router.navigate('home', false);
   });

}

/**
 * Binds the 'popstate' event on the window (which fires when the back &
 * forward buttons are pressed) so the navigation will continue to work 
 * as expected. (Hint - you should be passing in which page you are on
 * in your Router when you push your state so you can access that page
 * info in your popstate function)
 */
function bindPopstate() {
  /**
   * TODO - Part 1
   * Fill in this function as specified in the comment above
   */
  window.addEventListener("popstate", function(event) {
    //console.log(event);
    console.log(event);
    //console.log(history);
    //console.log(window.history);
    if (event.state != null){
      //history.pushState();
      router.navigate(event.state.key);
      //router.navigate(history[history.length - 1]);
      //router.navigate(history.back);
      //history.back();
    }
    else{
      router.navigate('home', true);
    }
  });
}