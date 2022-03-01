const navItem = document.querySelector('.nav');
const hamburger = document.querySelector('.hamburger');
const shortBtn = document.getElementById('shorten-it');
let link;

//opens and closes the mobile menu
const mobile_Menu = () => {
    navItem.classList.toggle('nav__active');
    hamburger.classList.toggle('hamburger__active');
}

//closes the menu if click outside or it or on a menu item
const closeMenu = (e) => {
    if (!(e.target.classList.contains('nav') || e.target.classList.contains('nav-menu')
        || e.target.classList.contains('hamburger')
        || e.target.classList.contains('bar'))) {
    
            navItem.classList.remove('nav__active');
            hamburger.classList.remove('hamburger__active');
        }
}

//function to manage the click for API shorten-it
const shorten_It = (e) => {
    e.preventDefault();

    const linkInput = document.getElementById('linkInput');
    console.log(linkInput.value);
};


class newLink {
    constructor() {
        this.longLink = document.getElementById('linkInput');
    }

}


// inputName.addEventListener('input', (e) => {
//     pseudo = e.target.value; //e.target.value important
// });
hamburger.addEventListener('click', mobile_Menu);
window.addEventListener('click', (e) => closeMenu(e));
shortBtn.addEventListener('click', (e) => shorten_It(e));