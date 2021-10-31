import { screen, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as redux from 'react-redux';
import React from 'react';
import { Provider } from 'react-redux';
import { Product } from '../../../src/client/pages/Product';
import { CartApi, ExampleApi } from '../../../src/client/api';
import { initStore } from '../../../src/client/store';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('Проверка карточки товара', () => {
  const spy = jest.spyOn(redux, 'useSelector');
  spy.mockReturnValue({
    id: 1,
    name: 'notebook',
    price: 300,
    description: 'some description about the product',
    material: 'steel',
    color: 'grey',
  });

  const basename = '/hw/store/catalog/:id';
  const api = new ExampleApi(basename);
  const cart = new CartApi();
  const store = initStore(api, cart);

  it('Показать информацию о товаре', () => {
    const product = (
      <Provider store={store}>
        <BrowserRouter>
          <Product />
        </BrowserRouter>
      </Provider>
    );

    const { getByRole, getByText, container} = render(product);

    const color = container.querySelector('.ProductDetails-Color').innerHTML;
    const material = container.querySelector('.ProductDetails-Material').innerHTML;
    
    expect(getByRole('heading', { name: /notebook/i })).toBeInTheDocument();
    expect(getByText(/some description about the product/i)).toBeInTheDocument();
    expect(getByText(/\$300/i)).toBeInTheDocument();
    expect(getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
    expect(getByText(/color/i)).toBeInTheDocument();
    expect(color).toEqual('grey');
    expect(getByText(/material/i)).toBeInTheDocument();
    expect(material).toEqual('steel');
  });

  it('При клике на добавить в Корзину показывается информация о добавлении', () => {
    const product = (
      <Provider store={store}>
        <BrowserRouter>
          <Product />
        </BrowserRouter>
      </Provider>
    );

    const { getByRole, getByText } = render(product);

    userEvent.click(getByRole('button', { name: /add to cart/i }));
    waitFor(() => expect(getByText('Item in cart')).toBeInTheDocument());
  });

  it('При повторном добавлении товара в корзину увеличивается его количество', async () => {
    const product = (
      <Provider store={store}>
        <BrowserRouter>
          <Product />
        </BrowserRouter>
      </Provider>
    );

    let countCurProductInCart = cart.getState()?.[1]?.count;

    const { getByRole } = render(product);

    const addToCartBtn = getByRole('button', { name: /add to cart/i });

    await userEvent.click(addToCartBtn);

    expect(countCurProductInCart).toEqual(1);
    countCurProductInCart = cart.getState()?.[1]?.count;
    await userEvent.click(addToCartBtn);
    expect(countCurProductInCart).toEqual(2);
  });
});