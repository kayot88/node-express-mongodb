// import axios from 'axios';
const axios = require('axios');
// const fetch = require('fetch');
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
          searchResult.innerHTML = searchResultHTML(res.data);
        }
      });
  });
};

export default typeAhead;