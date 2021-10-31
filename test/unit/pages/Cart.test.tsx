import { screen, render, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as redux from 'react-redux';
import React from 'react';
import { Provider } from 'react-redux';
import { CartApi, ExampleApi } from '../../../src/client/api';
import { initStore } from '../../../src/client/store';
import { BrowserRouter } from 'react-router-dom';
import { Cart } from '../../../src/client/pages/Cart';
import userEvent from '@testing-library/user-event';

describe('Проверка Корзины товаров', () => {
  const spy = jest.spyOn(redux, 'useSelector');
  spy.mockReturnValue({
    0: {
      name: 'iphone',
      price: 150,
      count: 1,
    },
    1: {
      name: 'notebook',
      price: 300,
      count: 3,
    },
  });

  const basename = '/hw/store/catalog/:id';
  const api = new ExampleApi(basename);
  const cart = new CartApi();
  const store = initStore(api, cart);

  it('Товары добавляются в корзину', () => {
    const cart = (
      <Provider store={store}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </Provider>
    )
    
    const { getByRole } = render(cart);

    const row = getByRole('row', { name: /1 iphone \$150 1 \$150/i });

    expect(within(row).getByRole('cell', { name: /iphone/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /clear shopping cart/i })).toBeInTheDocument();
    expect(getByRole('cell', { name: /notebook/i })).toBeInTheDocument();
    expect(getByRole('cell', { name: /\$900/i })).toBeInTheDocument();
    expect(getByRole('cell', { name: /\$1050/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /checkout/i })).toBeInTheDocument();
  });

  it('Нельзя отправить пустую форму заказа', () => {
    const cart = (
      <Provider store={store}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </Provider>
    )

    const { getByText, getByRole } = render(cart);

    userEvent.click(getByRole('button', { name: /checkout/i }));

    expect(getByText(/please provide your name/i)).toBeInTheDocument();
    expect(getByText(/please provide a valid phone/i)).toBeInTheDocument();
    expect(getByText(/please provide a valid address/i)).toBeInTheDocument();
  });

  it('Работает заполнение формы заказа', () => {
    const cart = (
      <Provider store={store}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </Provider>
    )

    const { getByRole } = render(cart);

    userEvent.type(getByRole('textbox', { name: /name/i }), 'Ivanov Ivan Ivanovich');
    userEvent.type(getByRole('textbox', { name: /phone/i }), '88007553535');
    userEvent.type(getByRole('textbox', { name: /address/i }), 'Russia, Moscow');

    expect(getByRole('textbox', { name: /name/i })).toHaveValue('Ivanov Ivan Ivanovich');
    expect(getByRole('textbox', { name: /phone/i })).toHaveValue('88007553535');
    expect(getByRole('textbox', { name: /address/i })).toHaveValue('Russia, Moscow');
  });
});