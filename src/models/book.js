class Book {
    constructor(categoryId, image, title, author, startedOn, finishedOn, pageCount){
        this.categoryId = categoryId;
        this.image = image;
        this.title = title;
        this.author = author;
        this.startedOn = startedOn;
        this.finishedOn = finishedOn;
        this.pageCount = pageCount;
    }

    id;
    categoryId;
    image;
    title;
    author;
    startedOn;
    finishedOn;
    pageCount;
    summary;
}

export default Book;