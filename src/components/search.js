import React from 'react';
import Button from './button';

class FilterButton extends React.Component{
    render(){
        return(
            <Button  className="search__button" id="search-button" clickHandler={this.props.clickHandler}>
                Filter
            </Button>
        );
    }
}

class InputField extends React.Component{
    constructor(props){
        super(props);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    handleKeyUp(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            this.props.clickHandler();
        }
    }

    render(){
        return(
            <input className="search__input" type="search" maxLength="40" placeholder="Enter query"
                   id="search" onKeyUp={this.handleKeyUp}/>
        );
    }
}

export default class Search extends React.Component{
    render(){
        return(
            <div className="search">
                <InputField clickHandler={this.props.queryHandler}/>
                <FilterButton clickHandler={this.props.queryHandler}/>
            </div>
        );
    }
}