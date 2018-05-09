//---------------------------------------
// API
//---------------------------------------
const unsplash = {
  endpoint(path, params) {
    const base = 'https://api.unsplash.com' + '/';
    const paths = path.join('/');
    const client_id = `?client_id=fa4cb58fcc23b782d0bf64c077b4fa450273cd34e880cc9b78a774de041ac625`;
    const paramsQs = '&' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return base + paths + client_id + paramsQs;
  },
  checkCache(url) {
    return new Promise((resolve, reject) => {
      if ('caches' in window) {
        caches.match(url).then(res => {
          if (res) {
            res.json().then(json => resolve(json))
          } else {
            reject();
          }
        })
      }
    });
  },
  makeRequest(url){
    return new Promise((resolve, reject) => {
      this.checkCache(url).then(json => resolve(json)).catch(() => {
        fetch(url, { method: 'GET', cache: 'force-cache' }).then(res => res.json().then(res2 => resolve(res2)))
      });
    });
  },
  search(options) {
    const url = this.endpoint(['search', 'photos'], options);
    return this.makeRequest(url);  
  },
  curated(options) {
    const url = this.endpoint(['photos', 'curated'], options);
    return this.makeRequest(url);  
  },
  buildImage(o) {
    return `<div class="img" data-link="${o.links.html}" style=background-image:url("${o.urls.regular})"><span>Photo by <a href="${o.user.links.html}" target="_blank">${o.user.name}</a> on <a href="https://unsplash.com" target="_blank">Unsplash</a></span></div>`;
  }
}

//---------------------------------------
// Elements
//---------------------------------------
const imageWrapper = document.getElementById('all-images');
const input = document.querySelector('input[type="text"]');
const resultsText = document.getElementById('resultsText');

//---------------------------------------
// State Management
//---------------------------------------
let loadingData = true;
let page = 1;
let searchQuery = null;

//---------------------------------------
// Initial Load
//---------------------------------------
function fnLoadCurated(append) {
  resultsText.innerHTML = `Today's Favorites`;
  if (!append) imageWrapper.innerHTML = '';
  unsplash.curated({ per_page: 30, page: page, order_by: 'popular' }).then(images => {
    images.forEach(image => {
      imageWrapper.innerHTML += `${unsplash.buildImage(image)}`;
    })
    loadingData = false;
  })
}
fnLoadCurated();

//---------------------------------------
// Search
//---------------------------------------
function fnSearch(query, append) {
  resultsText.innerHTML = `Results for <em>${query}</em>`
  if (!append) imageWrapper.innerHTML = '';
  unsplash.search({ query: query, per_page: 10, page: page }).then(data => {
    data.results.forEach(image => {
      imageWrapper.innerHTML += `${unsplash.buildImage(image)}`;
    })
    loadingData = false;
  })
}

//---------------------------------------
// Input Search
//---------------------------------------
input.addEventListener('keyup', (e) => {
  if ((e.which || e.keyCode) == 13) {
    if (e.target.value.trim() != '') {
      page = 1;
      searchQuery = e.target.value;
      fnSearch(e.target.value);
    } else {
      searchQuery = null;
      page = 1;
      fnLoadCurated();
    }
  }
})

//---------------------------------------
// Image Click Event
//---------------------------------------
document.addEventListener('click', (e) => {
  if (event.target.classList.contains('img')) {
    const link = event.target.dataset.link;
    window.open(link);
  }
})

//---------------------------------------
// Infinite Scrolling
//---------------------------------------
document.addEventListener('scroll', function () {
  let scrollTop = window.pageYOffset;
  let windowHeight = window.innerHeight
  let bodyHeight = document.body.scrollHeight - windowHeight;
  let scrollPercentage = (scrollTop / bodyHeight);

  // if the scroll is more than 90% from the top, load more content.
  if (!loadingData && scrollPercentage > 0.9) {
    loadingData = true;
    page++;
    if (searchQuery) {
      fnSearch(searchQuery, true);
    } else {
      fnLoadCurated(true);
    }
  }
});