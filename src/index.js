import './site.css';

const API_KEY = '93dbe96ca8fd470ba02ae1e85f22307e';

async function loadNews({ sources, pageSize, page, q }) {
    let url = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}&language=en&pageSize=${pageSize}&page=${page}`;
    if (sources && sources.length) url += `&sources=${sources.join(',')}`;
    if (q) url += `&q=${q}`;
    const response = await fetch(encodeURI(url));

    return response.json();
}

async function loadSources() {
    const url = `https://newsapi.org/v2/top-headlines/sources?apiKey=${API_KEY}&language=en`;
    const response = await fetch(encodeURI(url));

    return response.json();
}

function addNewsToPage(articles, showMore, clearBefore) {
    const wrapper = document.getElementById('wrapper');
    if (clearBefore) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        while (wrapper.lastElementChild) {
            wrapper.removeChild(wrapper.lastElementChild);
        }
    }
    const articleTemplate = document.getElementById('templates').querySelector('.card');
    if (wrapper.lastElementChild && wrapper.lastElementChild.classList.contains('load-more')) {
        wrapper.removeChild(wrapper.lastElementChild);
    }
    for (const article of articles) {
        const node = articleTemplate.cloneNode(true);
        const title = node.querySelector('.card__title');
        title.innerText = article.title;
        const description = node.querySelector('.card__text');
        description.innerText = article.description;
        const image = node.querySelector('.card__image');
        image.src = article.urlToImage;
        const link = node.querySelector('.card__url');
        link.href = article.url;
        link.innerText = `Read more on ${article.source.name} >>`;
        wrapper.appendChild(node);
    }
    if (!wrapper.children.length) {
        wrapper.appendChild(document.getElementById('templates').querySelector('.no-items').cloneNode(true));
    } else if (showMore) {
        const loadMoreTemplate = document.getElementById('templates').querySelector('.load-more');
        const loadMoreElement = loadMoreTemplate.cloneNode(true);
        loadMoreElement.onclick = loadNextPage;
        wrapper.appendChild(loadMoreElement);
    }
}

function showSources(sources) {
    const sourceTemplate = document.getElementById('templates').children[2];
    const sourceElements = sources.map(source => {
        const element = sourceTemplate.cloneNode(true);
        const checkbox = element.querySelector('.source__checkbox');
        checkbox.id = source.id;
        const label = element.querySelector('.source__label');
        label.htmlFor = source.id;
        label.innerText = source.name;
        element.onchange = filterBySources;
        return element;
    });
    const sourcesContainer = document.getElementById('sources');
    sourcesContainer.append(...sourceElements.slice(0, 100));
}

function NewsStore() {
    this.state = {
        pageSize: 5,
        page: 1,
        sources: [],
        q: '',
        showMore: true
    };

    this.loadPage = (state) => {
        state = Object.assign({}, this.state, state);
        loadNews(state)
            .then(json => {
                this.state = state;
                this.state.showMore = (state.page * state.pageSize) < Math.min(40, json.totalResults);
                return Promise.resolve(json.articles);
            })
            .then(articles => {
                addNewsToPage(articles, this.state.showMore, this.state.page === 1);
            });
    };

    this.loadNextPage = () => {
        this.loadPage({ page: this.state.page + 1 });
    };

    this.filterBySources = (sources) => {
        this.loadPage({ page: 1, sources });
    };

    this.filterByQuery = (q) => {
        this.loadPage({ page: 1, q });
    };
}

const store = new NewsStore();

function loadFirstPage() {
    loadSources().then(json => showSources(json.sources));
    store.loadPage();
}

function loadNextPage() {
    store.loadNextPage();
}

function filterBySources() {
    const sourcesContainer = document.getElementById('sources');
    const sources = [...sourcesContainer.children]
        .map(div => div.querySelector('.source__checkbox'))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.id);
    store.filterBySources(sources);
}

function filterByQuery() {
    const query = document.getElementById('search').value;
    store.filterByQuery(query);
}

document.getElementById('search').onchange = filterByQuery;

document.getElementById('search-button').onclick = filterByQuery;

loadFirstPage();
