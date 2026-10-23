import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import useShelf from "../use-shelf";
import LibraryShelf from "../library-shelf/library-shelf";
import { useQuickAdd } from "../../books/quick-add/quick-add-context";

const ShelfPage = ({ match }) => {
  const shelf = useShelf(match.params.id);
  const { openQuickAdd } = useQuickAdd();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [match.params.id]);

  return (
    <>
      <Helmet>
        <title>Bookshelf - An online shelf to keep track of your reads</title>
        <meta
          name="description"
          content={shelf.books
            .slice(0, 10)
            .map((x) => x.title)
            .join(", ")}
        />
      </Helmet>
      <LibraryShelf shelf={shelf} onAdd={openQuickAdd} />
    </>
  );
};

ShelfPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({ id: PropTypes.string.isRequired }),
  }),
};

// key forces fresh state when moving between users' shelves
const Shelf = (props) => <ShelfPage key={props.match.params.id} {...props} />;

Shelf.propTypes = ShelfPage.propTypes;

export default Shelf;
