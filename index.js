const navItem = document.querySelector('.nav');
const hamburger = document.querySelector('.hamburger');
const shortBtn = document.getElementById('shorten-it');
const linkInput = document.getElementById('linkInput');

class newLink {
    constructor(longLink) {
        this.longLink = longLink;
        this.shortLink = undefined;
    }
    //fetch the short link API
    fetch_shortLink = async () => {
        await fetch("https://api.shrtco.de/v2/shorten?url=" + this.longLink)
        .then(response => (response.json()))
        .then(data => this.shortLink = data.result.short_link)
        .then(() => display.displayNewLink(this.longLink, this.shortLink));
    }
};

const display = {

    newlink: undefined,
    linkIndex: 0,
    errorStatus: false,

    //start all page events
    start: function() {
        window.addEventListener('click', (e) => this.close_Menu(e));
        hamburger.addEventListener('click', () => this.mobile_Menu());
        shortBtn.addEventListener('click', (e) => this.shorten_It(e));

        linkInput.addEventListener('input', (e) => {
            if (this.errorStatus == true) this.clearError();
        });
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
            console.log('empty');
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
    displayNewLink: function(long, short) {
        document.querySelector('.result').innerHTML +=
        `
        <div class="result__wrap">
            <a class="result__wrap--long" href="${long}" target="_blank">${long}</a>
            <div class="result__wrap--split"></div>
            <div class="result__wrap__container">
                <a class="result__wrap__container--short" id="link_${this.linkIndex}" href="${short}" target="_blank">${short}</a>
                <button class="copy" value="link_${this.linkIndex}">Copy</button>
            </div>
        </div>
        `;

        this.linkIndex++;
        this.copy_Btn();
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
    }
};

display.start();