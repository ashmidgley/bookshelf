class Book {
    constructor(image, title, author, startedOn, finshedOn, pageCount, category, summary){
        this.image = image;
        this.title = title;
        this.author = author;
        this.startedOn = startedOn;
        this.finshedOn = finshedOn;
        this.pageCount = pageCount;
        this.category = category;
        this.summary = summary;
    }

    id;
    image;
    title;
    author;
    startedOn;
    finishedOn;
    pageCount;
    category;
    summary;
}

export default Book;