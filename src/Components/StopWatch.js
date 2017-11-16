import React, { Component } from 'react';

class StopWatch extends Component {
    constructor(props){
        super(props);
        this.enums      = {NOPLAY: 'noplay',PLAYING: 'playing', VICTORY   : 'victory',  DEFEAT    :'defeat'};
        this.state      = {
                            elapsedTime : '0',
                            gameStatus  : props.param
                          };
    }

    componentDidUpdate(){
        if( (this.state.gameStatus === this.enums.NOPLAY) &&
            (this.props.param === this.enums.PLAYING)){
            this.startTime = new Date();
            this.timerID = setInterval(() => {
                if(this.startTime){
                    this.setState({
                        elapsedTime : ''+Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000),
                        gameStatus  : this.props.param
                    });
                }else{
                    this.setState({
                        elapsedTime : '0',
                        gameStatus  : this.props.param
                    });
                }
            }, 1000);
        }else if( (this.state.gameStatus !== this.enums.NOPLAY) &&
                  (this.props.param === this.enums.NOPLAY)){
            //For cases where new state becomes NOPLAY from PLAYING, reset the timer. don't start it.
            clearInterval(this.timerID);
            this.startTime = null;
            this.setState({
                elapsedTime : '0',
                gameStatus  : this.props.param
            });
        } else if( (this.state.gameStatus === this.enums.NOPLAY ||
                    this.state.gameStatus === this.enums.PLAYING) &&
                    (this.props.param === this.enums.VICTORY ||
                    this.props.param === this.enums.DEFEAT)){
            //For cases: VICTORY and DEFEAT, stop the timer. don't reset it.
            clearInterval(this.timerID);
            this.startTime = null;
            this.setState({
                gameStatus  : this.props.param
            });
        } else{ //PLAYING to PLAYING (or same to same).. do nothing
        }
    }

    render() {
        return (
            <div className="StopWatch">
                <span className="time">{this.state.elapsedTime}</span>
            </div>
        );
    }
}
export default StopWatch;