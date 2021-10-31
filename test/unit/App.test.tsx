import React from 'react';
import "@testing-library/jest-dom/extend-expect";
import { render } from '@testing-library/react';
import { Router } from 'react-router';

import { Provider } from 'react-redux';
import { initStore } from '../../src/client/store';
import { createMemoryHistory } from 'history';
import { Application } from '../../src/client/Application';
import { ExampleApi, CartApi } from '../../src/client/api';
import renderer from 'react-test-renderer';

describe('Проверка главного экрана приложения', () => {
  it('Рендерится главный экран приложения', () => {
    const history = createMemoryHistory({
      initialEntries: ['/hw/store'],
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
    const mainSnapshot = renderer.create(application).toJSON();
    const rootLink = getByRole('link', { name: /Example store/i });
    const expected = 'Example store';
  
    expect(rootLink.textContent).toBe(expected);
    expect(mainSnapshot).toMatchSnapshot();
  });

  it('Рендерится navbar c ссылками', () => {
    const history = createMemoryHistory({
      initialEntries: ['/'],
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
   
    const rootLink = getByRole('link', { name: /Example store/i });
    const catalogLink = getByRole('link', { name: /catalog/i });
    const deliveryLink = getByRole('link', { name: /delivery/i });
    const contactsLink = getByRole('link', { name: /contacts/i });
    const cartLink = getByRole('link', { name: /cart/i });

    expect(rootLink).toBeInTheDocument();
    expect(catalogLink).toBeInTheDocument();
    expect(deliveryLink).toBeInTheDocument();
    expect(contactsLink).toBeInTheDocument();
    expect(cartLink).toBeInTheDocument();

    expect(rootLink).toHaveAttribute('href', '/');
    expect(catalogLink).toHaveAttribute('href', '/catalog');
    expect(deliveryLink).toHaveAttribute('href', '/delivery');
    expect(contactsLink).toHaveAttribute('href', '/contacts');
    expect(cartLink).toHaveAttribute('href', '/cart');
  })
})
