import React, { Component } from 'react';
import RadioButtons from './RadioButtons';
import StopWatch from './StopWatch';
import Avatar from './Avatar';
import FlagCount from './FlagCount';
import Canvas from './Canvas';

class MineSweeper extends Component {
    constructor(props) {
        super(props);
        this.enums = {
            DIMENSIONS  : {EASY  : 310,     MEDIUM : 620,       COMPLEX   : 930},
            MINECOUNT   : {EASY  : 10,      MEDIUM : 20,        COMPLEX   : 50},
            COMPLEXITY  : {EASY  : 'easy',  MEDIUM : 'medium',  COMPLEX   : 'complex'}, CELLWIDTH : 31,
            GAMESTATUS  : {NOPLAY: 'noplay',PLAYING: 'playing', VICTORY   : 'victory',  DEFEAT    :'defeat'},
        };

        this.state      = {
            gameLevel   : this.enums.COMPLEXITY.EASY,    //Control knob for game complexity level
            gameStatus  : this.enums.GAMESTATUS.NOPLAY,  //for game status(avatar)
            mineCount   : this.enums.MINECOUNT.EASY,
        };
        this.eventHandler = this.eventHandler.bind(this);
    }

    /*Handle the responses from the child modules - call back method*/
    eventHandler(event){
        let target = event.target || event.srcElement;
        let id = target.id;
        switch(id){
            case 'RadioButton':
                //Handling level change due to select on a Radio button
                this.setState({
                    gameLevel   : target.value,
                    mineCount   : this.enums.MINECOUNT[target.value.toUpperCase()],
                    gameStatus: this.enums.GAMESTATUS.NOPLAY
                });
                break;
            case 'Avatar':
                //Handling the click event on the Face icon
                if(this.state.gameStatus !== this.enums.GAMESTATUS.NOPLAY){
                    this.setState({
                        gameStatus: this.enums.GAMESTATUS.NOPLAY
                    });
                }
                break;
            case 'Canvas':
                //Handling Canvas events
                this.setState({
                    gameStatus  : target.flag
                });
                break;
            default:
                break;
        }
    }

    render() {
        return(
            <div className="MineSweeper">
                <h1 className="title">MineSweeper</h1>
                <RadioButtons param={this.state.gameLevel} callback={this.eventHandler}/>
                <div className="controls">
                    <StopWatch param={this.state.gameStatus}/>
                    <Avatar param={this.state.gameStatus} callback={this.eventHandler}/>
                    <FlagCount param={this.state.mineCount}/>
                </div>
                <Canvas param={this.state.gameLevel} status={this.state.gameStatus} enums={this.enums} callback={this.eventHandler}/>
            </div>
        );
    }
}
export default MineSweeper;