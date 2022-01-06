let currentPage;
let maxPages;

// used to create a lazy load or flicker images once the last image is reached
const lastImageObserver = new IntersectionObserver(entries => {
    // get the first entry, it will always be one in our case
    // because we get the last list item from our list
    const lastImage = entries[0];
    // if not last image, stop
    if (!lastImage.isIntersecting) return;
    // if reached the end of the flicker pages, stop
    if (++currentPage > maxPages) return;
    // stop observing the last list item because we are going to append new ones
    lastImageObserver.unobserve(lastImage.target);

    // fetch and populate flicker images
    flickerFetchAndPopulate(currentPage);
});

// get images xml from flicker
async function flickrFetch (page = 1) {
    // get flicker images, this returns xml
    const xml = await axios.get('https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&extras=url_s&api_key=aabca25d8cd75f676d3a74a72dcebf21&per_page=100&page=' + page);
    // create instance for xml parser
    const parser = new DOMParser();
    // return the xml documnet, this will allow of to traverse it
    return parser.parseFromString(xml.data, 'text/xml');
}

// set current page and max pages based on flicker results
function setPagesRanges (photos) {
    // set current page of the flicker fetched data
    
    currentPage = parseInt(photos.getAttribute('page'));
    // set max pages of the flicker fetched data
    
    maxPages = parseInt(photos.getAttribute('pages'));
}

// loop flicker photos and append each photo to our flicker list
function appendPhotos (photos) {
    // get flicker images container
    const $flickerPhotos = document.querySelector('.flicker-photos');

    // loop our parsed xml structure and append each image to the clicker images container
    Array.prototype.forEach.call(photos.children, child => {
        // create all needed elements
        const $li    = document.createElement('li');
        const $a     = document.createElement('a');
        const $image = document.createElement('img');
        var norep=[];
        var rep=[];
        // add all relevant attributes
        $image.src = child.getAttribute('url_s');
        //norep es para verificar si se publico la foto
         norep=parseInt(child.getAttribute('id'));
         
        

        $a.href = 'flicker-image.html?url=' + $image.src;
        

        // append every element to its parent until we append to flicker images container
        $a.append($image);
        $li.append($a);
        $flickerPhotos.append($li);
       
        
    });

    // start observing the last list item
    lastImageObserver.observe(document.querySelector('.flicker-photos li:last-child'));


}

// the complete process to fetch and populate flicker photos

async function flickerFetchAndPopulate (page = 1) {
    // get flicker images in a parsable xml format
    const xml = await flickrFetch();
    // get photos tag from the xml
    const $photos = xml.querySelector('photos');
    
    // self explanatory - set pages ranges
    setPagesRanges($photos);
    // self explanatory - append each flicker photo to out flicker photos container
    appendPhotos($photos);

    console.log($photos);

    
}




// initial fetch and populate flicker images
flickerFetchAndPopulate();
