import React, { Component } from 'react';

class FlagCount extends Component {
    render() {
        return (
            <div className="FlagCount">
                <span className="count">{this.props.param}</span>
            </div>
        );
    }
}
export default FlagCount;