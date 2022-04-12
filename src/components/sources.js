import React from 'react';

class SourceCheckbox extends React.Component{
    render(){
        return(
            <input className="source__checkbox" type="checkbox" name="sources" id={this.props.id} onClick={this.props.clickHandler}/>
        );
    }
}

export default class Sources extends React.Component{
    render(){
        return(
            <div className="menu content__menu">  
                <h3 className="menu__title">Sources</h3>
                <div className="menu__sources" id="sources">
                    {this.props.sources.map((source) => {
                        return (
                            <div className="source" key={source.id} >
                                <SourceCheckbox id={source.id} key={source.id} clickHandler={this.props.clickHandler}/>
                                <label className="source__label" htmlFor={source.id}>{source.name}</label>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}