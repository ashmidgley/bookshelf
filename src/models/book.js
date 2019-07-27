class Book {
    constructor(categoryId, ratingId, image, title, author, startedOn, finishedOn, pageCount, summary){
        this.categoryId = categoryId;
        this.ratingId = ratingId;
        this.image = image;
        this.title = title;
        this.author = author;
        this.startedOn = startedOn;
        this.finishedOn = finishedOn;
        this.pageCount = pageCount;
        this.summary = summary;
    }

    id;
    categoryId;
    ratingId;
    image;
    title;
    author;
    startedOn;
    finishedOn;
    pageCount;
    summary;
}

export default Book;