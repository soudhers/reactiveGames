import React, { Component } from 'react';
import flagImage from '../assets/images/icn_flag_01.png';
import mineImage from '../assets/images/mine.ico';

class Canvas extends Component {
    constructor(props){
        super(props);
        //Calculated constants for canvas based on the selected complexity
        this.enums      = props.enums;
        this.gameLevel  = props.param;
        this.CELLWIDTH  = props.enums.CELLWIDTH;
        this.WIDTH      = props.enums.DIMENSIONS[this.gameLevel.toUpperCase()];
        this.HEIGHT     = props.enums.DIMENSIONS[props.enums.COMPLEXITY.EASY.toUpperCase()];
        this.ROWS       = this.HEIGHT/this.CELLWIDTH;
        this.COLS       = this.WIDTH/this.CELLWIDTH;
        this.matrix     = [];
        this.MINE       = -1;
        this.MOUSE_LEFT = 1;
        this.MOUSE_RIGHT= 3;
        this.PLAYING    = true;
        this.STATUS     = props.enums.GAMESTATUS.NOPLAY;
        this.COLORS     = ['orange','green','gray','red','black','coral','navyblue','purple'];
        this.cellState  = {CLOSED : 0,
                           FLAGGED: 1,
                           OPENED : 2};
        //Binding methods to 'this'.
        this.updateCanvas       = this.updateCanvas.bind(this);
        this.createMineMatrix   = this.createMineMatrix.bind(this);
        this.countMinesAround   = this.countMinesAround.bind(this);
        this.inBounds           = this.inBounds.bind(this);
        this.canvasEventDispatch= this.canvasEventDispatch.bind(this);
        this.mouseDownEvents    = this.mouseDownEvents.bind(this);
        this.contextMenuEvents  = this.contextMenuEvents.bind(this);
        this.sendEvent          = this.sendEvent.bind(this);
        this.viewToModel        = this.viewToModel.bind(this);
        this.modelToView        = this.modelToView.bind(this);
        this.renderMine         = this.renderMine.bind(this);
        this.renderFlag         = this.renderFlag.bind(this);
        this.renderNumber       = this.renderNumber.bind(this);
        this.renderCell         = this.renderCell.bind(this);
        this.renderMapLogic     = this.renderMapLogic.bind(this);
    }

    //Component lifecycle events.
    componentDidMount(){
        this.canvas = this.refs.canvas;
        this.updateCanvas();
        this.createMineMatrix();
        this.canvas.removeEventListener('contextmenu', this.contextMenuEvents);
        this.canvasEventDispatch(true);
    }

    componentDidUpdate(){
        this.HEIGHT     = this.props.enums.DIMENSIONS[this.props.enums.COMPLEXITY.EASY.toUpperCase()];
        this.ROWS       = this.HEIGHT/this.CELLWIDTH;
        this.canvas     = this.refs.canvas;
        this.PLAYING    = true;
        if(this.STATUS !== this.props.enums.GAMESTATUS.NOPLAY && this.props.status === this.props.enums.GAMESTATUS.NOPLAY){
            //Avatar was clicked, hence game status changed. Canvas size remains same.
            //OR, when game is ongoing and radio button is clicked.
            this.STATUS     = this.props.status;
            this.gameLevel  = this.props.param;
            this.WIDTH      = this.props.enums.DIMENSIONS[this.gameLevel.toUpperCase()];
            this.COLS       = this.WIDTH/this.CELLWIDTH;
            this.matrix = [];
            this.updateCanvas();
            this.createMineMatrix();
        }else if(this.gameLevel !== this.props.param){
            //Radio button clicked that changed Game Level. So canvas size changes.
            this.gameLevel  = this.props.param;
            this.WIDTH      = this.props.enums.DIMENSIONS[this.gameLevel.toUpperCase()];
            this.COLS       = this.WIDTH/this.CELLWIDTH;
            this.matrix = [];
            this.updateCanvas();
            this.createMineMatrix();
        }
        if(this.STATUS === this.props.enums.GAMESTATUS.NOPLAY || this.STATUS === this.props.enums.GAMESTATUS.PLAYING) {
            this.canvasEventDispatch(true);
        }
    }

    //This method creates a matrix of values corresponding to each cell on the minesweeper.
    //matrix array is of size ROWS x COLS of the minesweeper
    createMineMatrix(){
        //Fill all the matrix with zeros. -1 is a mine
        for(let row=0; row<this.ROWS; row++){
            this.matrix.push([]);
            for(let col=0; col<this.COLS; col++){
                this.matrix[row].push({ mine        : 0,
                                        cellState   : this.cellState.CLOSED,
                                        minesAround : 0})
            }
        }
        //Deploy mines
        let mines = this.enums.MINECOUNT[this.gameLevel.toUpperCase()];
        for (let m = 0; m < mines; ++m) {
            let x = 0, y = 0;
            do {
                y = Math.floor(Math.random() * this.ROWS);
                x = Math.floor(Math.random() * this.COLS);
            } while (this.matrix[y][x].mine === this.MINE);
            this.matrix[y][x].mine = this.MINE;
        }
        //Initialize the count of mines around
        for (let y = 0; y < this.ROWS; ++y) {
            for (let x = 0; x < this.COLS; ++x) {
                if (this.matrix[y][x].mine !== this.MINE) {
                    this.matrix[y][x].minesAround = this.countMinesAround(y, x);
                }
            }
        }
        this.renderMapLogic();
    }

    //Count all the mines around a given cell, if the cell doesn't have a mine
    countMinesAround(y,x){
        let count = 0;
        for (let dy = -1; dy <= 1; ++dy) {
            for (let dx = -1; dx <= 1; ++dx) {
                if (dx === 0 && dy === 0) { continue; }
                let yy = y + dy,
                    xx = x + dx;
                if (this.inBounds(yy, xx)) {
                    if (this.matrix[yy][xx].mine === this.MINE) { ++count; }
                }
            }
        }
        return count;
    }

    //Check if the co-ordinates (x,y) are within the canvas bounds.
    inBounds(y, x) {
        return y >= 0 && x >= 0
            && x < this.COLS && y < this.ROWS;
    }

    //Draw the initial canvas, where mines are not yet deployed/initialization of matrix array pending.
    updateCanvas() {
        const ctx = this.canvas.getContext('2d');
        ctx.fillStyle   = '#66BB55';
        ctx.strokeStyle = 'block';
        this.drawWarfield(ctx, this.ROWS, this.COLS, this.CELLWIDTH);
    }

    //Draw the cells across the canvas to reprecent the minesweeper
    drawWarfield(ctx, rows, cols, cellWidth){
        for(let y=0; y<rows; ++y) {
            for(let x=0; x<cols; ++x){
                this.drawCell(ctx, cellWidth, cellWidth, x, y);
            }
        }
    }

    //Each Cell drawing method for canvas.
    drawCell(ctx, cWidth, cHeight, x, y){
        ctx.fillRect(x * cWidth, y * cHeight, cWidth, cHeight);
        ctx.strokeRect(x * cWidth, y * cHeight, cWidth, cHeight);
    }


    //Handle events from canvas
    canvasEventDispatch(add){
        if(add && this.PLAYING){
            //Add Mouse Event Listeners for canvas
            this.canvas.addEventListener('mousedown', this.mouseDownEvents);
            this.canvas.addEventListener('contextmenu', this.contextMenuEvents);
        }else{
            //Remove Mouse Event Listeners for canvas
            this.canvas.removeEventListener('mousedown', this.mouseDownEvents);
            //this.canvas.removeEventListener('contextmenu', this.contextMenuEvents);
        }
    }

    //Convert view co-ordinates into model co-ordinates
    viewToModel(y, x) {
        return {
            y: Math.floor(y / this.CELLWIDTH),
            x: Math.floor(x / this.CELLWIDTH)
        };
    };

    //Utility method to send the event to parent(Component which embeds Canvas component)
    sendEvent(gameStatus){
        let canvasEvent ={target: {
            id  : 'Canvas',
            flag: gameStatus
        }};
        this.props.callback(canvasEvent);
    }

    //Reveal the Cell
    openCell(y, x) {
        console.log('openCell...');
        //If this Cell is flagged, don't open it.
        if ((this.matrix[y][x].cellState === this.cellState.FLAGGED)||
            (this.matrix[y][x].cellState === this.cellState.OPENED)){
            return;
        }else{ //This CELL is in CLOSED state
               //If it is a mine, then open all the other mines, and accept the defeat.
            if (this.matrix[y][x].mine === this.MINE) {
                this.STATUS  = this.props.enums.GAMESTATUS.DEFEAT;
                this.sendEvent(this.STATUS);
                this.PLAYING = false;
                this.revealMatrix(false);
                return;
            }else{ //Not a Mine, open it and also try to open neighbours recursively.
                this.matrix[y][x].cellState = this.cellState.OPENED;
                this.recursiveOpenCell(y, x);
                //See if Victorious.
                if (this.checkVictory()) {
                    this.STATUS = this.props.enums.GAMESTATUS.VICTORY;
                    this.PLAYING = false;
                    this.sendEvent(this.props.enums.GAMESTATUS.VICTORY);
                    this.revealMatrix(true); //alert('You are victorious!');
                }
            }
        }
    }

    //Logic to recursively open the cells around a non-numbered cell.
    recursiveOpenCell(y, x) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                let yy = y + dy, xx = x + dx;
                if (this.inBounds(yy, xx)) {
                    if (this.matrix[yy][xx].cellState !== this.cellState.OPENED) {
                        if (this.matrix[yy][xx].cellState === this.cellState.FLAGGED){
                            continue;
                        }
                        if (this.matrix[yy][xx].mine === this.MINE) {
                            continue;
                        }
                        else if (this.matrix[yy][xx].minesAround !== 0) {
                            this.matrix[yy][xx].cellState = this.cellState.OPENED;
                            continue;
                        }else if (this.matrix[yy][xx].minesAround === 0){
                            this.matrix[yy][xx].cellState = this.cellState.OPENED;
                            this.recursiveOpenCell(yy, xx);
                        }
                    }
                }
            }
        }
    }

    //Check if all the mines are discovered
    checkVictory() {
        for (let y = 0; y < this.ROWS; ++y) {
            for (let x = 0; x < this.COLS; ++x) {
                if (this.matrix[y][x].mine !== this.MINE) {
                    if (this.matrix[y][x].cellState !== this.cellState.OPENED) {
                        return false;
                    }
                }
                if (this.matrix[y][x].mine === this.MINE) {
                    if (this.matrix[y][x].cellState !== this.cellState.FLAGGED) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    //Set a flag where you expect a mine
    flagCell(y, x) {
        if (this.matrix[y][x].cellState === this.cellState.OPENED) {
            return;
        }
        this.matrix[y][x].cellState = 1 - this.matrix[y][x].cellState;
        if (this.checkVictory()) {
            this.STATUS  = this.props.enums.GAMESTATUS.VICTORY;
            this.sendEvent(this.props.enums.GAMESTATUS.VICTORY);
            this.PLAYING = false;
            this.revealMatrix(true); //alert('You are victorious!');
        }
    }

    //Open the Matrix when game is over
    revealMatrix(victorious) {
        console.log('reveal matrix with victory= '+victorious);
        for (let y = 0; y < this.ROWS; ++y) {
            for (let x = 0; x < this.COLS; ++x) {
                if(victorious){
                    if(this.matrix[y][x].mine === this.MINE){
                        this.matrix[y][x].cellState = this.cellState.FLAGGED;
                    }else{
                        this.matrix[y][x].cellState = this.cellState.OPENED;
                    }
                }else{ //Defeat case
                    if(this.matrix[y][x].mine === this.MINE){
                        //Reveal only mines
                        this.matrix[y][x].cellState = this.cellState.OPENED;
                    }else{ //Do not reveal the unrevealed non-mine cells
                        continue;
                    }
                }
            }
        }
        this.renderMapLogic();
        this.canvasEventDispatch(false);
    }

    //Convert co-ordinates from model to view location
    modelToView(y, x) {
        return {
            y: y * this.CELLWIDTH,
            x: x * this.CELLWIDTH
        };
    }

    //Render a mine at the given Cell
    renderMine(y, x) {
        let viewCoordinates = this.modelToView(y, x);
        let ctx = this.canvas.getContext('2d');
        let w   = this.CELLWIDTH;
        let h   = this.CELLWIDTH;
        let img = new Image();
        img.onload = function(e){
            ctx.drawImage(img, viewCoordinates.x, viewCoordinates.y, w, h);
        };
        img.src = mineImage;
    }

    //Render a flag at the given Cell
    renderFlag(y, x) {
        let view    = this.modelToView(y, x);
        let ctx     = this.canvas.getContext('2d');
        let cb      = this.sendEvent;
        let play    = this.props.enums.GAMESTATUS.PLAYING;
        let noPlay  = this.props.enums.GAMESTATUS.NOPLAY;
        let width   = this.CELLWIDTH/2;
        let height  = this.CELLWIDTH/2;
        let status  = this.STATUS;
        let img     = new Image();
        img.onload  = function(e){
            ctx.drawImage(img, view.x+8, view.y+8, width, height);
            if(status === noPlay){
                cb(play);
            }
        };
        img.src = flagImage;
        this.STATUS = play;
    }

    //Render a number at the given Cell
    renderNumber(y, x) {
        let view = this.modelToView(y, x);
        let ctx  = this.canvas.getContext('2d');
        ctx.fillStyle = this.COLORS[this.matrix[y][x].minesAround];
        ctx.font = '15pt Verdana';
        let textSizeM = ctx.measureText('M'),
            textSizeNumber = ctx.measureText(this.matrix[y][x].mine);
        ctx.fillText(
            this.matrix[y][x].minesAround,
            view.x + Math.floor(this.CELLWIDTH / 2) - textSizeNumber.width / 2,
            view.y + Math.floor(this.CELLWIDTH / 2) + textSizeM.width / 2
        );
    }

    //Render a Cell
    renderCell(y, x) {
        let view = this.modelToView(y, x);
        let ctx  = this.canvas.getContext('2d');
        if(this.matrix[y][x].cellState === this.cellState.CLOSED){        //CLOSED CELL
            ctx.fillStyle = '#999';
            ctx.strokeStyle = 'black';
            ctx.fillRect(view.x, view.y, this.CELLWIDTH, this.CELLWIDTH);
            ctx.strokeRect(view.x, view.y, this.CELLWIDTH, this.CELLWIDTH);
            return;
        }else if(this.matrix[y][x].cellState === this.cellState.FLAGGED){ //FLAGGED CELL
            this.renderFlag(y, x);
        }else{                                                            //OPENED CELL
            ctx.fillStyle = '#ddd';
            ctx.strokeStyle = 'black';
            ctx.fillRect(view.x, view.y, this.CELLWIDTH, this.CELLWIDTH);
            ctx.strokeRect(view.x, view.y, this.CELLWIDTH, this.CELLWIDTH);
            if(this.matrix[y][x].mine === this.MINE){
                this.renderMine(y, x);
            }else{
                switch (this.matrix[y][x].minesAround) {
                    case 0:
                        break;
                    default:                      //OR A NUMBER
                        this.renderNumber(y, x);
                }
            }
        }
    }

    //Initializes all the Cells with Mines or Numbers images
    renderMapLogic() {
        for (let y = 0; y < this.ROWS; ++y) {
            for (let x = 0; x < this.COLS; ++x) {
                this.renderCell(y, x);
            }
        }
    }

    mouseDownEvents(e){
        if(this.PLAYING) {
            //Send new found 'PLAYING' gameStatus to parent.
            if(this.STATUS === this.props.enums.GAMESTATUS.NOPLAY){
                this.STATUS = this.props.enums.GAMESTATUS.PLAYING;
                this.sendEvent(this.props.enums.GAMESTATUS.PLAYING);
            }
            let rect  = this.canvas.getBoundingClientRect();
            let x     = e.clientX - rect.left;
            let y     = e.clientY - rect.top;
            let modelCoordinates = this.viewToModel(x, y);
            console.log(modelCoordinates);
            switch (e.which) {
                case this.MOUSE_LEFT:
                    this.openCell(modelCoordinates.x, modelCoordinates.y);
                    break;
                case this.MOUSE_RIGHT:
                    this.flagCell(modelCoordinates.x, modelCoordinates.y);
                    break;
                default:
                    break;
            }
            this.renderMapLogic();
            e.preventDefault();
            e.stopPropagation();
        }
    }

    contextMenuEvents(e){
        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        let levelU  = this.props.param.toUpperCase();
        let width   = this.enums.DIMENSIONS[levelU];
        let height  = this.enums.DIMENSIONS[this.enums.COMPLEXITY.EASY.toUpperCase()];
        return (
            <div className="Canvas">
                <canvas ref="canvas" width={width} height={height}/>
            </div>
        );
    }
}
export default Canvas;