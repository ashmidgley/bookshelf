class Entry {
    constructor(image, title, author, startedOn, finshedOn, pageCount, category, content){
        this.image = image;
        this.title = title;
        this.author = author;
        this.startedOn = startedOn;
        this.finshedOn = finshedOn;
        this.pageCount = pageCount;
        this.category = category;
        this.content = content;
    }

    id;
    image;
    title;
    author;
    startedOn;
    finishedOn;
    pageCount;
    category;
    content;
}

export default Entry;