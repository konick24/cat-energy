const pageBar = document.querySelector('.page-header__bar');
const pageToggle = document.querySelector('.page-header__toggle');

pageBar.classList.remove('page-header__bar--nojs');

pageToggle.addEventListener('click', function() {
  if (pageBar.classList.contains('page-header__bar--closed')) {
    pageBar.classList.remove('page-header__bar--closed');
    pageBar.classList.add('page-header__bar--opened');
  } else {
    pageBar.classList.add('page-header__bar--closed');
    pageBar.classList.remove('page-header__bar--opened');
  }
});
