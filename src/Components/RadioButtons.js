import React, { Component } from 'react';

class RadioButtons extends Component {
    constructor(props){
        super(props);
        this.gameLevels = {EASY  : 'easy',  MEDIUM : 'medium',  COMPLEX   : 'complex'};
    }
    

    render() {

        let radios = Object.values(this.gameLevels).map(opt => {
                            return <label key={opt}><input id="RadioButton" className={opt} type="radio" value={opt}
                                onChange={this.props.callback} checked={opt===this.props.param}/> {opt} </label>
                            });
        return (
            <div className="RadioButtons">
                {radios}
            </div>
        );
    }
}

export default RadioButtons;