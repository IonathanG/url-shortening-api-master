const navItem = document.querySelector('.nav');
const hamburger = document.querySelector('.hamburger');
const shortBtn = document.getElementById('shorten-it');
const linkInput = document.getElementById('linkInput');

// class to fetch a new link
class newLink {
    constructor(longLink) {
        this.longLink = longLink;
        this.shortLink = undefined;
    }
    //fetch the short link API
    fetch_shortLink = async () => {
        await fetch("https://api.shrtco.de/v2/shorten?url=" + this.longLink)
        .then(response => {
            if (response.ok) return response.json();
            throw new Error();
        })
        .then(data => {
            this.shortLink = data.result.short_link;
            display.linkArray.push([this.longLink, this.shortLink]);
        })
        .then(() => display.displayNewLink())
        .catch(() => display.displayError('Link is not valid or has been denied (disallowed link)'));
    }
};


//main function object
const display = {

    newlink: undefined,
    errorStatus: false,
    linkArray: [],

    //start all page events
    start: function() {
        window.addEventListener('click', (e) => this.close_Menu(e));
        hamburger.addEventListener('click', () => this.mobile_Menu());
        shortBtn.addEventListener('click', (e) => this.shorten_It(e));

        linkInput.addEventListener('input', () => {
            if (this.errorStatus == true) this.clearError();
        });

        //Find stored list if any
        if (localStorage.linkArray) {
            this.linkArray = JSON.parse(localStorage.linkArray);
            this.displayNewLink();
        }
    },

    //opens and closes the mobile menu
    mobile_Menu: function() {
        navItem.classList.toggle('nav__active');
        hamburger.classList.toggle('hamburger__active');
    },

    //closes the menu if click event outside of it or on a menu item
    close_Menu: function(e) {
        if (!(e.target.classList.contains('nav') || e.target.classList.contains('nav-menu')
            || e.target.classList.contains('hamburger') || e.target.classList.contains('bar'))) {
        
                navItem.classList.remove('nav__active');
                hamburger.classList.remove('hamburger__active');
            }
    },

    //check if url has valid format
    validURL: function(url) {
        //if input is empty
        if (url === "") {
            this.displayError('Please add a link');
            return false;
        }

        //if input is the wrong format
        else if (!url.match(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i)) {
            this.displayError('Please enter a valid format (ex: https://github.com/)');
            return false;
        }

        else return true;
    },

    //display typo error in the input field
    displayError: function(message) {
        this.errorStatus = true;

        const errorMessage = document.querySelector('.shorten__wrap--errorDisplay');
        const errorInput = document.querySelector('.shorten__wrap > input ');
        
        errorMessage.classList.add('errorDisplay_active');
        errorMessage.textContent = message;

        errorInput.classList.add('errorInput');
    },

    //clear the display of the error
    clearError: function() {
        this.errorStatus = false;

        const errorMessage = document.querySelector('.shorten__wrap--errorDisplay');
        const errorInput = document.querySelector('.shorten__wrap > input ');
        
        errorMessage.classList.remove('errorDisplay_active');
        errorMessage.textContent = "";

        errorInput.classList.remove('errorInput');
    },

    //function to manage the click for API shorten-it
    shorten_It: function(e) {
        e.preventDefault();

        if (this.validURL(linkInput.value)) {
            this.newLink = new newLink(linkInput.value);
            this.newLink.fetch_shortLink();
            linkInput.value = "";
        }
    },

    //display new link element
    displayNewLink: function() {
        const result = document.querySelector('.result');
        result.innerHTML = "";
        
        for (let i = 0; i < this.linkArray.length; i++) {
            result.innerHTML +=
            `
            <div class="result__wrap">
                <a class="result__wrap--long" href="${this.linkArray[i][0]}" target="_blank">${this.linkArray[i][0]}</a>
                <div class="result__wrap--split"></div>
                <div class="result__wrap__container">
                    <a class="result__wrap__container--short" id="link_${i}" href="${this.linkArray[i][1]}" target="_blank">${this.linkArray[i][1]}</a>
                    <button class="copy" value="link_${i}">Copy</button>
                </div>
                <svg class="result__wrap--removeIcon" id="remove_${i}" data-remove="${i}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.87 122.87"><title>remove</title><path d="M18,18A61.45,61.45,0,1,1,0,61.44,61.28,61.28,0,0,1,18,18ZM77.38,39l6.53,6.54a4,4,0,0,1,0,5.63L73.6,61.44,83.91,71.75a4,4,0,0,1,0,5.63l-6.53,6.53a4,4,0,0,1-5.63,0L61.44,73.6,51.13,83.91a4,4,0,0,1-5.63,0L39,77.38a4,4,0,0,1,0-5.63L49.28,61.44,39,51.13a4,4,0,0,1,0-5.63L45.5,39a4,4,0,0,1,5.63,0L61.44,49.28,71.75,39a4,4,0,0,1,5.63,0ZM61.44,10.54a50.91,50.91,0,1,0,36,14.91,50.83,50.83,0,0,0-36-14.91Z"/></svg>
            </div>
        `;
        }
    
        this.store();
        this.copy_Btn();
        this.remove();
    },

    //copy the new short link and change button display
    copy_Btn: function() {
        const copyBtn = document.querySelectorAll('.copy');
        copyBtn.forEach(btn => btn.addEventListener('click', (e) => {

            //reset all buttons
            for (let i = 0; i < copyBtn.length; i++) {
                copyBtn[i].classList.remove('copied');
                copyBtn[i].textContent = 'Copy';
            }

            //update display of the button clicked on
            e.target.classList.add('copied');
            e.target.textContent = 'Copied!';

            //copy new link into clipboard
            const shortLink = document.getElementById(e.target.value);
            navigator.clipboard.writeText(shortLink.textContent);
        }));
    },

    store: function() {
        localStorage.linkArray = JSON.stringify(this.linkArray);
    },

    remove: function() {
        const removeItem = document.querySelectorAll('.result__wrap--removeIcon');

        removeItem.forEach(item => item.addEventListener('click', (e) => {
                let newArr = [];
            
                for (let i = 0; i < this.linkArray.length; i++) {
                    if (i !=  e.currentTarget.dataset.remove) newArr.push(this.linkArray[i]);
                }

            this.linkArray = newArr;
            this.displayNewLink();
        }));
    }
};

display.start();