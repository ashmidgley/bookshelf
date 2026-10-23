import React from "react";
import LabelManager from "../../shared/label-manager/label-manager";
import {
  fetchCurrentUserCategories,
  createCategory,
  updateCategory,
  removeCategory,
} from "../../shared/category.service";

const SUGGESTIONS = ["📖", "🧟", "🧠", "🚀", "🔎", "💘", "🏛️", "🌍", "🧪", "🎭", "🍳", "✍️"];

const ManageCategories = () => (
  <LabelManager
    noun="category"
    title="Categories"
    subtitle="The drawers your library is filed into."
    pageTitle="Manage Categories - Bookshelf"
    bookField="categoryId"
    suggestions={SUGGESTIONS}
    fetchAll={fetchCurrentUserCategories}
    create={createCategory}
    update={updateCategory}
    remove={removeCategory}
  />
);

export default ManageCategories;
