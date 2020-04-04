# Bookshelf
Mid last year I found myself between jobs and reading more than usual. I was after a cool way to keep an eye on the stuff I was reading but there was only a couple of options available. Being the pretentious developer that I am, I thought to myself, 'Sh*t, surely I could make something better than that'.

The result has proved:
 * No, I can't.
 * Making sites that look pretty, have users and pull data from different places is actually pretty tricky eh.

Anyway, [this bloody thing](https://bookshelf.co.nz) lets you keep an eye on the books you've read. You can share your shelf with others, customize the categories and ratings that you add books to and manage your account. All the book data is pulled from the [Google Books API](https://developers.google.com/books).

The frontend is written in [React](https://reactjs.org/) and the backend is a [.NET Core Web API](https://docs.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-3.1). It's the first proper hair-brained scheme that I've implemented from start to finish, so it's answered a bunch of questions that I had:
 - [What are security headers and how do I use em in .NET Core?](https://www.hanselman.com/blog/EasilyAddingSecurityHeadersToYourASPNETCoreWebAppAndGettingAnAGrade.aspx)
 - [How do I send emails in .NET Core?](https://dotnetcoretutorials.com/2017/11/02/using-mailkit-send-receive-email-asp-net-core/)
 - [How do you install Nginx on a Linux server?](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04)
 - [How do you setup SSL certs for Nginx?](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04)
 - [Is my SSL certificate in good nick?](https://www.ssllabs.com/ssltest/)
 
Thank goodness for smart people writing articles about stuff on the internet.

## Running locally
1. Add API url to .env file.
2. `npm install`
3. `npm start`
