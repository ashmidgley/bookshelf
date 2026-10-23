import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchBooks } from "../shared/book.service";
import { fetchCategories } from "../shared/category.service";
import { fetchRatings } from "../shared/rating.service";
import { parseUser } from "../shared/token.service";
import { subscribeBookAdded } from "../books/quick-add/quick-add-context";

const ENTRIES_PER_PAGE = 24;

// Data + filter state for a user's shelf.
const useShelf = (userIdParam) => {
  const userId = parseInt(userIdParam);

  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [categories, setCategories] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(null);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const requestId = useRef(0);

  const isOwner = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      return parseUser(token).id === userId;
    } catch (e) {
      return false;
    }
  }, [userId]);

  const load = useCallback(
    (nextPage = 0) => {
      const id = ++requestId.current;
      if (nextPage === 0) setLoading(true);
      else setLoadingMore(true);

      const options = {
        page: nextPage,
        entriesPerPage: ENTRIES_PER_PAGE,
        search: search || null,
        category,
        rating,
      };

      fetchBooks(userId, options)
        .then((response) => {
          if (id !== requestId.current) return;
          setBooks((prev) =>
            nextPage === 0 ? response.books : prev.concat(response.books)
          );
          setHasMore(response.hasMore);
          setPage(nextPage);
          setError(false);
        })
        .catch(() => {
          if (id !== requestId.current) return;
          setError(true);
        })
        .finally(() => {
          if (id !== requestId.current) return;
          setLoading(false);
          setLoadingMore(false);
        });
    },
    [userId, search, category, rating]
  );

  // Debounce only the free-text search; filter clicks apply immediately.
  useEffect(() => {
    const timer = setTimeout(() => load(0), search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  useEffect(() => {
    fetchCategories(userId)
      .then(setCategories)
      .catch(() => setCategories([]));
    fetchRatings(userId)
      .then(setRatings)
      .catch(() => setRatings([]));
  }, [userId]);

  useEffect(() => subscribeBookAdded(() => load(0)), [load]);

  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading) load(page + 1);
  }, [hasMore, loadingMore, loading, load, page]);

  const categoryById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  );
  const ratingById = useMemo(
    () => Object.fromEntries(ratings.map((r) => [r.id, r])),
    [ratings]
  );

  const byYear = useMemo(() => {
    const groups = [];
    books.forEach((book) => {
      let group = groups.find((g) => g.year === book.year);
      if (!group) {
        group = { year: book.year, books: [] };
        groups.push(group);
      }
      group.books.push(book);
    });
    return groups;
  }, [books]);

  const stats = useMemo(() => {
    const pages = books.reduce((sum, b) => sum + (b.pageCount || 0), 0);
    const thisYear = new Date().getFullYear();
    const thisYearBooks = books.filter((b) => b.year === thisYear);
    return {
      count: books.length,
      pages,
      thisYear,
      thisYearCount: thisYearBooks.length,
      thisYearPages: thisYearBooks.reduce((s, b) => s + (b.pageCount || 0), 0),
    };
  }, [books]);

  const filtering = !!(search || category || rating);

  return {
    userId,
    isOwner,
    books,
    byYear,
    stats,
    categories,
    ratings,
    categoryById,
    ratingById,
    search,
    setSearch,
    category,
    setCategory,
    rating,
    setRating,
    filtering,
    clearFilters: () => {
      setSearch("");
      setCategory(null);
      setRating(null);
    },
    loading,
    loadingMore,
    hasMore,
    loadMore,
    error,
  };
};

export default useShelf;
