class NewBook {
    constructor(title, author, userId, categoryId, ratingId, finishedOn) {
        this.title = title;
        this.author = author;
        this.userId = userId;
        this.categoryId = categoryId;
        this.ratingId = ratingId;
        this.finishedOn = finishedOn;
    }

    title;
    author;
    userId;
    categoryId;
    ratingId;
    finishedOn;
}

export default NewBook;