import axios from 'axios';
import dompurify from 'dompurify';

function searchResultHTML(stores) {
  return stores.map((store) => {
    return `
    <a href="/store/${store.slug}" class="search__result">
      <strong>${store.name}</strong>
    </a>
    `
  }).join('');
}

function typeAhead(search) {
  if (!search) return
  const inputSearch = search.querySelector('input[name="search"]');
  const searchResult = search.querySelector('.search__results');

  inputSearch.on('input', function () {
    if (!this.value) {
      searchResult.style.display = 'none';
      return;
    }
    searchResult.style.display = 'block';
    
    axios
    .get(`/api/search?q=${this.value}`)
    .then(res => {
      if (res.data.length) {
        searchResult.innerHTML = dompurify.sanitize(searchResultHTML(res.data));
        // searchResult.firstChild.classList.add(activeClass);
      } else {
      searchResult.innerHTML = dompurify.sanitize(`<div class="search__result">There no data for ${this.value}</div>`)
      };
      })
      .catch((err) => {
        console.error(err);
      });
  });
  inputSearch.on('keyup', (e) => {
    if (![38, 40, 13].includes(e.keyCode)) {
      return;
    }
    const activeClass = 'search__result--active';
    const current = searchResult.querySelector(`.${activeClass}`);
    const items = searchResult.querySelectorAll('.search__result');
    let next;
    if (e.keyCode === 40 && current) {
      next = current.nextElementSibling || items[0];
    } else if (e.keyCode === 40) {
      next = items[0];
    } else if (e.keyCode === 38 && current) {
      next = current.previousElementSibling || items[items.length - 1];
    } else if (e.keyCode === 38) {
      next = items[items.length - 1];
    } else if (e.keyCode === 13 && current.href) {
      window.location = current.href; 
    }
    console.log(next);
    if (current) {
     current.classList.remove(activeClass)
    }
    next.classList.add(activeClass);
  })
};




export default typeAhead;