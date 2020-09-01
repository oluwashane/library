Task to be completed:

* 1. The admin is suppose to add a total number of copies available for a particular book

*2. Registration of a user (assume you are to issue them a library id card, so how would you identify them)

*3. The user should be able to request for a book;

*4. When a book is requested by a user, we would want to decrease the count of the available copies for rent

*5. If a book's availability is zero, then we want to respond to the user that this book is not currently available for rent

*6. The user should be able to return the borrowed book.

EndPoints for the API and methods
[post ,get, put, delete] -/books => it handles uploading and maintenance of library

[post] -/user => handles generation of library card and gives user access to borrow or return books to the library

[post, put] -/borrow => it takes in a payload =>  handles giving and updating copies of a particular book user wants  
