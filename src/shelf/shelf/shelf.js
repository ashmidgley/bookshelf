import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./shelf.css";
import Loading from "../../shared/loading/loading";
import InfiniteScroll from "react-infinite-scroller";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { fetchBooks } from "../../shared/book.service";
import { fetchCategories } from "../../shared/category.service";
import { fetchRatings } from "../../shared/rating.service";
import { parseUser } from "../../shared/token.service";
import _ from "lodash";

const Shelf = ({ match }) => {
  const { paramsId } = match.params.id;
  const entriesPerPage = 12;

  const [userId, setUserId] = useState();
  const [storageId, setStorageId] = useState();
  const [columnClass, setColumnClass] = useState("column is-one-third child");
  const [queryOptions, setQueryOptions] = useState();
  const [books, setBooks] = useState();
  const [hasMore, setHasMore] = useState();
  const [categories, setCategories] = useState();
  const [ratings, setRatings] = useState();
  const [years, setYears] = useState();
  const [categoryMenu, setCategoryMenu] = useState();
  const [ratingMenu, setRatingMenu] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    checkDimensions();
    window.addEventListener("resize", checkDimensions);

    const id = parseInt(match.params.id);
    setUserId(id);

    const token = localStorage.getItem("token");
    if (token) {
      const user = parseUser(token);
      setStorageId(user.id);
    }

    const options = { page: 0, entriesPerPage: entriesPerPage };
    getBooks(id, options);

    fetchCategories(id)
      .then((response) => {
        setCategories(response);
        setCategoryMenu(getMenu(response.length + 1));
      })
      .catch(() => {
        handleError();
      });

    fetchRatings(id)
      .then((response) => {
        setRatings(response);
        setRatingMenu(getMenu(response.length + 1));
      })
      .catch(() => {
        handleError();
      });

    return () => {
      window.removeEventListener("resize", checkDimensions);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const id = parseInt(paramsId);
    if (!isNaN(id) && id !== userId) {
      window.location.reload(false);
    }
    // eslint-disable-next-line
  }, [paramsId]);

  const getBooks = (id, options, viewMore = false) => {
    fetchBooks(id, options)
      .then((response) => {
        const result = viewMore ? books.concat(response.books) : response.books;
        setBooks(result);
        setHasMore(response.hasMore);
        setYears(getYears(result));
        setQueryOptions(options);
        setLoading(false);
      })
      .catch(() => {
        handleError();
      });
  };

  const checkDimensions = () => {
    let newVal = "column is-one-third child";
    if (window.innerWidth > 1000 && window.innerWidth < 1200) {
      newVal = "column is-one-quarter child";
    } else if (window.innerWidth > 1200) {
      newVal = "column is-2";
    }
    setColumnClass(newVal);
  };

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const getYears = (response) => {
    const distinctYears = [...new Set(response.map((item) => item.year))];
    let result = [];
    distinctYears.forEach((year) => result.push({ value: year, show: true }));
    return result;
  };

  const getMenu = (length) => {
    let menu = new Array(length).fill(false);
    menu[0] = true;
    return menu;
  };

  const searchSubmit = (e) => {
    e.persist();
    debouncedSearch(e.target.value.toLowerCase());
  };

  const debouncedSearch = _.debounce((text) => {
    const options = {
      ...queryOptions,
      search: text,
      page: 0,
    };

    getBooks(userId, options);
  }, 1000);

  const displayAllCategories = () => {
    var menu = categoryMenu.fill(false);
    menu[0] = true;
    setCategoryMenu(menu);

    const options = {
      ...queryOptions,
      category: null,
      page: 0,
    };

    getBooks(userId, options);
  };

  const categorySelected = (category) => {
    var menu = categoryMenu.fill(false);
    menu[categories.indexOf(category) + 1] = true;
    setCategoryMenu(menu);

    const options = {
      ...queryOptions,
      category: category.id,
      page: 0,
    };

    getBooks(userId, options);
  };

  const displayAllRatings = () => {
    var menu = ratingMenu.fill(false);
    menu[0] = true;
    setRatingMenu(menu);

    const options = {
      ...queryOptions,
      rating: null,
      page: 0,
    };

    getBooks(userId, options);
  };

  const ratingSelected = (rating) => {
    var menu = ratingMenu.fill(false);
    menu[ratings.indexOf(rating) + 1] = true;
    setRatingMenu(menu);

    const options = {
      ...queryOptions,
      rating: rating.id,
      page: 0,
    };

    getBooks(userId, options);
  };

  const toggleYear = (value) => {
    let result = years;
    const index = years.map((year) => year.value).indexOf(value);
    result[index].show = !result[index].show;
    setYears(result);
  };

  const loadMore = () => {
    if ((queryOptions.page + 1) * entriesPerPage != books.length) {
      return;
    }

    const options = {
      ...queryOptions,
      page: queryOptions.page + 1,
    };

    getBooks(userId, options, true);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="shelf-container">
          <Helmet>
            <title>
              Bookshelf - An online shelf to keep track of your reads
            </title>
            <meta
              name="description"
              content={
                books &&
                books
                  .slice(0, 10)
                  .map((x) => x.title)
                  .join(", ")
              }
            />
          </Helmet>
          <div className="shelf-menu-items columns card hide-mobile">
            <div className="columns">
              <div className="column is-three-fifths">
                <input
                  className="input"
                  type="text"
                  placeholder="Search by title or author..."
                  onChange={searchSubmit}
                  disabled={error}
                />
              </div>
              <div className="column is-one-fifth hide-mobile">
                <button
                  className={
                    categoryMenu && categoryMenu[0]
                      ? "button selected"
                      : "button"
                  }
                  onClick={displayAllCategories}
                  style={{ padding: "0 23px" }}
                ></button>
                {categories &&
                  categoryMenu &&
                  categories.map((category, index) => (
                    <button
                      className={
                        categoryMenu[index + 1] ? "button selected" : "button"
                      }
                      key={category.id}
                      onClick={() => categorySelected(category)}
                    >
                      <span role="img" aria-label="Category emoji">
                        {category.code}
                      </span>
                    </button>
                  ))}
              </div>
              <div className="column is-one-fifth hide-mobile">
                <button
                  className={
                    ratingMenu && ratingMenu[0] ? "button selected" : "button"
                  }
                  onClick={displayAllRatings}
                  style={{ padding: "0 23px" }}
                ></button>
                {ratings &&
                  ratingMenu &&
                  ratings.map((rating, index) => (
                    <button
                      className={
                        ratingMenu[index + 1] ? "button selected" : "button"
                      }
                      key={rating.id}
                      onClick={() => ratingSelected(rating)}
                    >
                      <span role="img" aria-label="Rating emoji">
                        {rating.code}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
          {error ? (
            <div className="notification is-danger">
              Error pulling user data. Please refresh and try again.
            </div>
          ) : (
            <div>
              {books.length === 0 && (
                <div className="notification is-link shelf-notification">
                  No books to display.&nbsp;
                  {storageId === userId && (
                    <Link to="/search-form">Add one?</Link>
                  )}
                </div>
              )}
              <InfiniteScroll
                pageStart={0}
                loadMore={loadMore}
                hasMore={hasMore}
                loader={
                  <div key={0} className="has-text-centered mb-20">
                    Loading ...
                  </div>
                }
              >
                <div>
                  {years.map((year, index) => (
                    <div
                      key={index}
                      className={index > 0 ? "child-toggle" : ""}
                    >
                      {books.some((x) => x.year === year.value) && (
                        <div className="year-toggle-container">
                          <button
                            className="button is-link"
                            onClick={() => toggleYear(year.value)}
                          >
                            {year.value}
                            {year.show ? (
                              <i className="fa fa-sort-down shelf-year-dropdown"></i>
                            ) : (
                              <i className="fa fa-sort-up shelf-year-dropdown"></i>
                            )}
                          </button>
                        </div>
                      )}
                      <div className="columns is-multiline is-mobile shelf-tiles">
                        {books
                          .filter(
                            (book) => book.year === year.value && year.show
                          )
                          .map((book, index) => (
                            <div key={index} className={columnClass}>
                              <div className="shelf-tile">
                                <Link
                                  to={`/review/${book.id}`}
                                  className="tile-link"
                                >
                                  <img
                                    src={book.imageUrl}
                                    className="tile-image"
                                    alt="Shelf tile"
                                  />
                                </Link>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </InfiniteScroll>
            </div>
          )}
        </div>
      )}
    </>
  );
};

Shelf.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default Shelf;
