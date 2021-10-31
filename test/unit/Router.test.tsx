import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router';

import { Provider } from 'react-redux';
import { initStore } from '../../src/client/store';
import { createMemoryHistory } from 'history';
import { Application } from '../../src/client/Application';
import { ExampleApi, CartApi } from '../../src/client/api';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';
 
describe('Проверка работы роутера', () => {
  it('Работает переход на страницу Catalog', () => {
    const history = createMemoryHistory({
      initialEntries: ['/hw/store/catalog'],
      initialIndex: 0
    });
    const basename = '/hw/store';
    const api = new ExampleApi(basename);
    const cart = new CartApi();
  
    const store = initStore(api, cart);
  
    const application = (
      <Router history={history}>
        <Provider store={store}>
            <Application />
        </Provider>
      </Router>
    );
    
    const { getByRole } = render(application);
    userEvent.click(getByRole('link', { name: /catalog/i }));
    const header = getByRole('heading', { name: /catalog/i });

    expect(header).toBeInTheDocument();
  });

  it('Работает переход на страницу Delivery', () => {
    const history = createMemoryHistory({
      initialEntries: ['/hw/store/delivery'],
      initialIndex: 0
    });
    const basename = '/hw/store';
    const api = new ExampleApi(basename);
    const cart = new CartApi();
  
    const store = initStore(api, cart);
  
    const application = (
      <Router history={history}>
        <Provider store={store}>
          <Application />
        </Provider>
      </Router>
    );
    
    const { getByRole } = render(application);
    userEvent.click(getByRole('link', { name: /delivery/i }));
    const header = getByRole('heading', { name: /delivery/i });
    const deliverySnapshot = renderer.create(application).toJSON();

    expect(header).toBeInTheDocument();
    expect(deliverySnapshot).toMatchSnapshot();
  });

  it('Работает переход на страницу Contacts', () => {
    const history = createMemoryHistory({
      initialEntries: ['/hw/store/contacts'],
      initialIndex: 0
    });
    const basename = '/hw/store';
    const api = new ExampleApi(basename);
    const cart = new CartApi();
  
    const store = initStore(api, cart);
  
    const application = (
      <Router history={history}>
        <Provider store={store}>
            <Application />
        </Provider>
      </Router>
    );
    
    const { getByRole } = render(application);
    userEvent.click(getByRole('link', { name: /contacts/i }));
    const header = getByRole('heading', { name: /contacts/i });
    const contactsSnapshot = renderer.create(application).toJSON();

    expect(header).toBeInTheDocument();
    expect(contactsSnapshot).toMatchSnapshot();
  });

  it('Работает переход на страницу Cart', () => {
    const history = createMemoryHistory({
      initialEntries: ['/hw/store/cart'],
      initialIndex: 0
    });
    const basename = '/hw/store';
    const api = new ExampleApi(basename);
    const cart = new CartApi();
  
    const store = initStore(api, cart);
  
    const application = (
      <Router history={history}>
        <Provider store={store}>
            <Application />
        </Provider>
      </Router>
    );
    
    const { getByRole } = render(application);
    userEvent.click(getByRole('link', { name: /cart/i }));
    const header = getByRole('heading', { name: /shopping cart/i })

    expect(header).toBeInTheDocument();
  });
})
 
 