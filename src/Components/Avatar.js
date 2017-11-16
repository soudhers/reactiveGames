import React, { Component } from 'react';

class Avatar extends Component {

    render() {
        return (
            <div>
                <span  id="Avatar" className={"button "+this.props.param} onClick={this.props.callback}/>
            </div>
        );
    }
}
export default Avatar;