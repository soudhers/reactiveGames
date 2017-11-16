import React from 'react';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Enzyme from 'enzyme';
import { expect, assert } from 'chai';
import chai from 'chai';
import { mount } from 'enzyme';
import StopWatch from './StopWatch';
import Adapter from 'enzyme-adapter-react-15';

Enzyme.configure({ adapter: new Adapter() });
chai.use(sinonChai);

describe('<StopWatch />', () => {
    var GAMESTATUS;
    beforeEach(() => {
        GAMESTATUS   =  {NOPLAY: 'noplay',PLAYING: 'playing', VICTORY   : 'victory',  DEFEAT    :'defeat'};
    });

    it('allows us to set props', () => {
        const wrapper = mount(<StopWatch param={GAMESTATUS.NOPLAY} enums={GAMESTATUS}/>);
        expect(wrapper.props().param).to.equal(GAMESTATUS.NOPLAY);
        wrapper.setProps({param: GAMESTATUS.PLAYING});
        expect(wrapper.props().param).to.equal(GAMESTATUS.PLAYING);
    });

    it('calls componentDidUpdate', () => {
        sinon.spy(StopWatch.prototype, 'componentDidUpdate');
        const wrapper = mount(<StopWatch param={GAMESTATUS.NOPLAY} enums={GAMESTATUS} />);
        expect(StopWatch.prototype.componentDidUpdate.calledOnce).to.equal(false);
    });

    it('calls render', () => {
        sinon.spy(StopWatch.prototype, 'render');
        const wrapper = mount(<StopWatch param={GAMESTATUS.NOPLAY} enums={GAMESTATUS} />);
        expect(StopWatch.prototype.render.calledOnce).to.equal(true);
    });

    it('timer updates when gamestatus change', function(done){
        const wrapper = mount(<StopWatch param={GAMESTATUS.NOPLAY} enums={GAMESTATUS}/>);
        expect(wrapper.props().param).to.equal(GAMESTATUS.NOPLAY);
        wrapper.setProps({param: GAMESTATUS.PLAYING});
        console.log('New state after the game status changed from NOPLAY to PLAYING');
        setTimeout(function(){
            let newState = wrapper.state();
            console.log(newState.elapsedTime);
            done();
        }, 4000);
    });
});