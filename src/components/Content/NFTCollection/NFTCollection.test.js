import { render } from '@testing-library/react';
import NFT from './NFTCollection';

import Enzyme from 'enzyme';
import { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

describe('NFT Collection tests', () =>

  it('Input Value is correct', () => {
    Enzyme.configure({ adapter: new Adapter() });
    const mockCallBack = jest.fn();
    const nft = shallow(<NFT />);
    setTimeout(() => {
      expect(nft.find("#form-control").props.value).not.toEqual("");
    }, 1000);
  }),

  it('Input Value below Zero', () => {
    Enzyme.configure({ adapter: new Adapter() });
    const mockCallBack = jest.fn();
    const nft = shallow(<NFT />);
    setTimeout(() => {
      expect(nft.find("#form-control").props.value).toBeGreaterThan(0);
    }, 1000);
  }),

  it('Button Buy click event', () => {
    Enzyme.configure({ adapter: new Adapter() });
    const mockCallBack = jest.fn();
    const nft = shallow(<NFT />);
    setTimeout(() => {
      const btnBuy = nft.find('#btn btn-success');
      btnBuy.simulate('click');
    }, 1000);
  }),

  it('Button Cancel click event', () => {
    Enzyme.configure({ adapter: new Adapter() });
    const mockCallBack = jest.fn();
    const nft = shallow(<NFT />);
    setTimeout(() => {
      const btnBuy = nft.find('#btn btn-danger');
      btnBuy.simulate('click');
    }, 1000);
  }),
  it('Button Offer click event', () => {
    Enzyme.configure({ adapter: new Adapter() });
    const mockCallBack = jest.fn();
    const nft = shallow( <NFT />);
    setTimeout(() => {
      const btnBuy = nft.find('#btn btn-secondary');
      btnBuy.simulate('click');
    }, 1000);
  })
)