// parse and get current url query
const urlSearchParams = new URLSearchParams(window.location.search);
const params          = Object.fromEntries(urlSearchParams.entries());

// create a image element
const $image = document.createElement('img');
// set the image url from our parsed query
$image.src   = params.url;

// append it to our page, body tag
document.querySelector('body').append($image);
