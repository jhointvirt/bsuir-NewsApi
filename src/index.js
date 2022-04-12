import './site.css';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Sources from './components/sources';
import LoadMoreButton from './components/load-more-button';
import Search from "./components/search";
import NewsApi from "./components/news-api";
import ArticlesContainer from "./components/articles";

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            sources: [],
            articles: [],
            content: [],
            query: "top-headlines?language=en",
            newsDisplayed: 0,
        };

        this.PAGE_CAPACITY = NewsApi.PAGE_CAPACITY;
        this.CHUNK_SIZE = NewsApi.CHUNK_SIZE;

        this.loadMoreClick = this.loadMoreClick.bind(this);
        this.sourceClick = this.sourceClick.bind(this);
        this.filterClick = this.filterClick.bind(this);
    }

    loadMoreClick() {
        this.setState({
            content: this.state.content.concat(this.state.articles.slice(this.state.newsDisplayed,
                this.state.newsDisplayed + this.CHUNK_SIZE)),
            newsDisplayed: this.state.newsDisplayed + this.CHUNK_SIZE,
        });
    }

    sourceClick(event) {
        const sourcesContainer = document.getElementById('sources');
        const sources = [...sourcesContainer.children]
            .map(div => div.querySelector('.source__checkbox'))
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.id);
        this.setState({selected: sources}, () =>{
            this.performRequest();
        });
    }

    filterClick() {
        const newQuery = document.querySelector('#search').value;
        if (newQuery.length > 0) {
            this.setState({query: `everything?q=${newQuery}`}, () =>{
                this.performRequest();
            });
        }
    }

    componentDidMount() {
        NewsApi.loadSources().then(data => {
            this.setState({
                sources: data.sources
            });
        });
        this.performRequest();
    }

    performRequest(){
        NewsApi.loadRequest(this.state.query, this.state.selected).then(data => {
            this.setState({newsDisplayed: 0});
            if(data.articles.length) {
                this.setState({
                    articles: data.articles,
                    content: data.articles.slice(this.state.newsDisplayed, this.state.newsDisplayed + this.CHUNK_SIZE),
                    newsDisplayed: this.state.newsDisplayed + this.CHUNK_SIZE,
                });
            }else{
                this.setState({
                    articles: [],
                    content: []
                });
            }
        });
    }

    render() {
        return (
            <main className="content">
                <div className="content__data">
                    <Search queryHandler={this.filterClick}/>
                    <ArticlesContainer articles={this.state.content} empty={this.state.newsDisplayed == 0}/> 
                    <div className="load-more">                  
                        <LoadMoreButton clickHandler={this.loadMoreClick}
                                    visible={this.state.newsDisplayed < this.PAGE_CAPACITY
                                    && this.state.newsDisplayed < this.state.articles.length
                                    && this.state.newsDisplayed > 0}/>
                    </div>
                </div>
                <Sources sources={this.state.sources} clickHandler={this.sourceClick}/>
            </main>
        );
    }
}

ReactDOM.render(<Main />, document.querySelector('.content'));