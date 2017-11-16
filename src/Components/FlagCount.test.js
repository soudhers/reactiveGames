import React from 'react';
import sinon from 'sinon';
import Enzyme from 'enzyme';
import { expect } from 'chai';
import { mount } from 'enzyme';
import FlagCount from './FlagCount';
import Adapter from 'enzyme-adapter-react-15';

Enzyme.configure({ adapter: new Adapter() })

describe('<FlagCount />', () => {

    it('allows us to set props', () => {
        const wrapper = mount(<FlagCount param='10' />);
        expect(wrapper.props().param).to.equal('10');
        wrapper.setProps({param: '20'});
        expect(wrapper.props().param).to.equal('20');
    });

    it('calls render', () => {
        sinon.spy(FlagCount.prototype, 'render');
        const wrapper = mount(<FlagCount param='10'/>);
        expect(FlagCount.prototype.render.calledOnce).to.equal(true);
    });

});
