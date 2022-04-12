'use strict';
import React from 'react';

class Article extends React.Component{
  render(){
      return(
          <div className="card">
            <img className="card__image" src={`${this.props.image}`} alt=""/>
            <h2 className="card__title">{this.props.title}</h2>
            <p className="card__text">{this.props.text}</p>
            <a className="card__url" href={this.props.link} target="_blank">Read more on <strong>{this.props.source}</strong> &gt;&gt;</a>             
          </div>
      );
  }
}

export default class ArticlesContainer extends React.Component{
    render(){
        return(
            <div id="wrapper" className="wrapper">
                {this.props.articles.map((item, index) => {
                    return (
                        <Article title={item.title} source={item.source.name}
                                 text={item.description} link={item.url}
                                 image={item.urlToImage ? item.urlToImage : null}
                                 key={index}>
                        </Article>
                    );
                })}
                {this.props.empty ?
                  <div className="no-items">
                      There are no articles matching your request.
                  </div> : null}
            </div>
        );
    }
}
