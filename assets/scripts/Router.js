// router.js

/** Some hints for this router:
  *   - it shouldn't be a terribly long file, each function is pretty short.
  *   - the functions being passed in should mostly be stored so that
  *     you can call them later when you want to navigate to a page
  *   - you should be pushing to history (only when the 'popstate' event
  *     hasn't fired) so that you can use forward / backward buttons
  *   - You should be using hashes to update the URL (e.g. 
  *     https://somewebsite.com#somePage) - the hash is the #somePage part.
  *     It's accessible via window.location.hash and using them lets you
  *     easily modify the URL without refreshing the page or anything
  */

export class Router {
  /**
   * Sets up the home function, the page name should always be 'home', which
   * is why no page name variable is passed in.
   * @param {Function} homeFunc The function to run to set the home route
   *                            visually
   */
  constructor(homeFunc) {
    /**
     * TODO Part 1
     * Fill in this function as specified in the comment above
     */
    //this.addPage('home', homeFunc);
    //this.navigate('home', false);
    //console.log(window.location);
    this['home'] = homeFunc;
  }

  /**
   * Adds a page name & function so to the router so that the function
   * can be called later when the page is passed in
   * @param {String} page The name of the page to route to (this is used
   *                      as the page's hash as well in the URL)
   * @param {Function} pageFunc The function to run when the page is called
   */
  addPage(page, pageFunc) {
    /**
     * TODO Part 1
     * Fill in this function as specified in the comment above
     */
    this[page] = pageFunc;
  }

  /**
   * Changes the page visually to the page that has been passed in. statePopped
   * is used to avoid pushing a new history state on back/forward button presses
   * @param {String} page The name of the page to route to
   * @param {Boolean} statePopped True if this function is being called from a
   *                              'popstate' event instead of a normal card click
   */
  navigate(page, statePopped) {
    /**
     * TODO Part 1
     * Fill in this function as specified in the comment above
     */
    //history.pushState();
    //console.log("before");
    if (this[page] == null){
      console.log('error');
      return;
    }
    //console.log("after");
    let hash;
    if (page == 'home'){
      hash = "";
    }
    else{
      hash = '#' + page;
    }
    let obj = {"key": page};
    //console.log(page);
    //console.log(hash != window.location.hash);
    //console.log(window.location.hash);
    //console.log(!statePopped);
    if (!statePopped && window.location.hash != hash){
      //call pushstate
      //console.log(obj);
      history.pushState(obj, "", window.location.origin + hash);
      //console.log(history);
    }
    //console.log(this[page]);
    this[page]();
    //window[this[page]]
  }
}