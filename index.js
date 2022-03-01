const navItem = document.querySelector('.nav');
const hamburger = document.querySelector('.hamburger');

//opens and closes the mobile menu
const mobile_Menu = () => {
    navItem.classList.toggle('nav__active');
    hamburger.classList.toggle('hamburger__active');
}

//closes the menu if click outside or it or on a menu item
function closeMenu(e) {
    if (!(e.target.classList.contains('nav') || e.target.classList.contains('nav-menu')
        || e.target.classList.contains('hamburger')
        || e.target.classList.contains('bar'))) {
    
            navItem.classList.remove('nav__active');
            hamburger.classList.remove('hamburger__active');
        }
}


hamburger.addEventListener('click', mobile_Menu);
window.addEventListener('click', (e) => closeMenu(e));