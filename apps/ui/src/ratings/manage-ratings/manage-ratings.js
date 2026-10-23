import React from "react";
import LabelManager from "../../shared/label-manager/label-manager";
import {
  fetchCurrentUserRatings,
  createRating,
  updateRating,
  removeRating,
} from "../../shared/rating.service";

const SUGGESTIONS = ["🥉", "🥈", "🥇", "🏆", "⭐", "🌟", "❤️", "👍", "👎", "😐", "🔥", "💤"];

const ManageRatings = () => (
  <LabelManager
    noun="rating"
    title="Ratings"
    subtitle="The medals you hand out when you finish a book."
    pageTitle="Manage Ratings - Bookshelf"
    bookField="ratingId"
    suggestions={SUGGESTIONS}
    fetchAll={fetchCurrentUserRatings}
    create={createRating}
    update={updateRating}
    remove={removeRating}
  />
);

export default ManageRatings;
