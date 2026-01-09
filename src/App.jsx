/* eslint-disable jsx-a11y/accessible-emoji */
import classNames from 'classnames';
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    categoryFromServer => categoryFromServer.id === product.categoryId,
  ); // find by product.categoryId
  const user = usersFromServer.find(
    userFromServer => userFromServer.id === category.ownerId,
  ); // find by category.ownerId

  return {
    ...product,
    category,
    user,
  };
});

function isCategorySelected(categoryList, categoryId) {
  return categoryList.some(
    categoryFromList => categoryFromList.id === categoryId,
  );
}

function normalizeQuery(query) {
  return query.trim().toLowerCase();
}

function filterProductList(
  productsList,
  filterBy,
  filterByQuery,
  selectedCategotyList,
) {
  let resArray = productsList;

  if (selectedCategotyList.length !== 0) {
    resArray = resArray.filter(category => {
      return selectedCategotyList.includes(category.categoryId);
    });
  }

  if (filterByQuery) {
    const normilizedQuery = normalizeQuery(filterByQuery);

    resArray = resArray.filter(product => {
      return product.name.toLowerCase().includes(normilizedQuery);
    });
  }

  if (filterBy) {
    resArray = resArray.filter(
      product => product.category.ownerId === filterBy,
    );
  }

  return resArray;
}

export const App = () => {
  const [listSelectedCategory, setListSelectedCategory] = useState([]);
  const [filterByUserId, setFilterByUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  function filterByUser(user) {
    setFilterByUserId(user);
  }

  function handleSearchValue(query) {
    setSearchQuery(query);
  }

  function handleSelectedCategory(categoryId) {
    if (isCategorySelected(listSelectedCategory, categoryId)) {
      setListSelectedCategory(
        listSelectedCategory.filter(
          selectedCategory => selectedCategory.id === categoryId,
        ),
      );
    } else {
      listSelectedCategory.push(categoryId);
      setListSelectedCategory([...listSelectedCategory]);
    }
  }

  function handleResetButton() {
    setFilterByUserId('');
    setSearchQuery('');
    setListSelectedCategory([]);
  }

  function handleClearSelectedCategory() {
    setListSelectedCategory([]);
  }

  const filteredProducts = filterProductList(
    products,
    filterByUserId,
    searchQuery,
    listSelectedCategory,
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/all"
                onClick={() => {
                  filterByUser('');
                }}
                className={classNames({ 'is-active': filterByUserId === '' })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href={`#${user.id}`}
                  className={classNames({
                    'is-active': user.id === filterByUserId,
                  })}
                  onClick={() => {
                    filterByUser(user.id);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={event => {
                    handleSearchValue(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchQuery ? (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => {
                        handleSearchValue('');
                      }}
                    />
                  </span>
                ) : (
                  false
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames('button', 'is-success', 'mr-6', {
                  'is-outlined': listSelectedCategory.length !== 0,
                })}
                onClick={() => handleClearSelectedCategory()}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={classNames('button', 'mr-2', 'my-1', {
                    'is-info': listSelectedCategory.includes(category.id),
                  })}
                  href="#/"
                  onClick={() => handleSelectedCategory(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetButton}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={classNames({
                        'has-text-link': product.user.sex === 'm',
                        'has-text-danger': product.user.sex === 'f',
                      })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
