import React from 'react';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Enzyme from 'enzyme';
import { expect, assert } from 'chai';
import chai from 'chai';
//import assert from 'chai';
import { mount } from 'enzyme';
import RadioButtons from './RadioButtons';
import Adapter from 'enzyme-adapter-react-15';

Enzyme.configure({ adapter: new Adapter() });
chai.use(sinonChai);

describe('<RadioButtons />', () => {

    it('allows us to set props', () => {
        const obj={BYE: 'bye'};
        const onChange = sinon.spy();
        const wrapper = mount(<RadioButtons param='easy' enums={{HI: 'hi'}} callback={onChange}/>);
        expect(wrapper.props().param).to.equal('easy');
        wrapper.setProps({param: 'medium'});
        expect(wrapper.props().param).to.equal('medium');
        wrapper.setProps({enums: obj});
        expect(wrapper.props().enums).to.eql({BYE: 'bye'});
    });

    it('simulates onChange events', () => {
        const enums = {EASY  : 'easy',  MEDIUM : 'medium',  COMPLEX   : 'complex'};
        const response = {target: {id:'RadioButton', value: 'easy'}};
        const onChange = sinon.spy();
        const wrapper = mount((
            <RadioButtons param='easy' enums={enums} callback={onChange} />
        ));
        wrapper.find('.easy').simulate('change');
        expect(onChange.calledOnce).to.equal(true);
        wrapper.find('.easy').simulate('change');
        var args = onChange.callCount;
        //console.log(args);
        var args = onChange.getCalls()[0].args[0];
        //console.log(args);
        //console.log('_______________________________________________________________')
        //var args = onChange.getCalls()[1].args[0];
        //console.log(args);

        //expect(onChange.calledWith(response)).to.be.true;
        //assertEquals({target: {id:'RadioButton', value: 'easy'}}, onChange.args[0][0]);
        //assert(onChange.calledWith());
        //expect(onChange).to.have.been.calledWith(response);
        //have.been.calledWith(response);
    });

    it('calls componentDidMount', () => {
        const enums = {EASY  : 'easy',  MEDIUM : 'medium',  COMPLEX   : 'complex'};
        const onChange = sinon.spy();
        sinon.spy(RadioButtons.prototype, 'render');
        const wrapper = mount(<RadioButtons param='victory' enums={enums}  callback={onChange}/>);
        expect(RadioButtons.prototype.render.calledOnce).to.equal(true);
    });

});
