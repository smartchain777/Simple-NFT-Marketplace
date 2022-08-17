import { render } from '@testing-library/react';
import MINT from './MintForm';

import Enzyme from 'enzyme';
import { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

describe('MINT Collection tests', () =>

  it('Input Value is correct', () => {
    Enzyme.configure({ adapter: new Adapter() });
    const mockCallBack = jest.fn();
    const nft = shallow(<MINT />);
    setTimeout(() => {
      expect(nft.find("#form-control").props.value).not.toEqual("");
    }, 1000);
  }),

  it('Input Value below Zero', () => {
    Enzyme.configure({ adapter: new Adapter() });
    const mockCallBack = jest.fn();
    const nft = shallow(<MINT />);

    setTimeout(() => {
      expect(nft.find("#form-control").props.value).toBeGreaterThan(0);
    }, 1000);
  }),

  it('Button mint click event', () => {
    Enzyme.configure({ adapter: new Adapter() });
    const mockCallBack = jest.fn();
    const nft = shallow(<MINT />);
    setTimeout(() => {
      const btnBuy = nft.find('#btn btn-lg btn-info text-white btn-block mt-2');
      btnBuy.simulate('click');
    }, 1000);
  })
)