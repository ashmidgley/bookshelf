class Book {
    constructor(userId, categoryId, ratingId, imageUrl, title, author, finishedOn, pageCount, summary){
        this.userId = userId;
        this.categoryId = categoryId;
        this.ratingId = ratingId;
        this.imageUrl = imageUrl;
        this.title = title;
        this.author = author;
        this.finishedOn = finishedOn;
        this.pageCount = pageCount;
        this.summary = summary;
    }

    id;
    userId;
    categoryId;
    ratingId;
    imageUrl;
    title;
    author;
    finishedOn;
    pageCount;
    summary;
}

export default Book;