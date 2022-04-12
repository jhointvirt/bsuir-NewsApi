import React from 'react';
import Button from './button';

export default class MoreButton extends React.Component{
    render(){
        return(
            this.props.visible ?
            <Button  id="load-more" class="load-more__text" clickHandler={this.props.clickHandler}>
                Load more
            </Button> : null
        );
    }
}