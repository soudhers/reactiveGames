import React from 'react';
import sinon from 'sinon';
import Enzyme from 'enzyme';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Avatar from './Avatar';
import Adapter from 'enzyme-adapter-react-15';

Enzyme.configure({ adapter: new Adapter() })

describe('<Avatar />', () => {

    it('allows us to set props', () => {
        const wrapper = mount(<Avatar param='playing' />);
        expect(wrapper.props().param).to.equal('playing');
        wrapper.setProps({param: 'victory'});
        expect(wrapper.props().param).to.equal('victory');
    });

    it('renders an `.button noplay`', () => {
        const onButtonClick = sinon.spy();
        const wrapper = mount((
            <Avatar param='noplay' callback={onButtonClick} />
        ));
        expect(wrapper.find('span').hasClass('button noplay')).to.equal(true);
    });

    it('simulates click events', () => {
        const onButtonClick = sinon.spy();
        const wrapper = mount((
            <Avatar param='victory' callback={onButtonClick} />
        ));
        wrapper.find('span').simulate('click');
        expect(onButtonClick.calledOnce).to.equal(true);
    });

    it('calls componentDidMount', () => {
        const onButtonClick = sinon.spy();
        sinon.spy(Avatar.prototype, 'render');
        const wrapper = mount(<Avatar param='victory' callback={onButtonClick}/>);
        expect(Avatar.prototype.render.calledOnce).to.equal(true);
    });

});
