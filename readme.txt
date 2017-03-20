Notes on the project.
This should be a readme.md, but just in case your computer doesn’t recognize the .md extension, I am using a .txt extension.

The actual js source code is in the directory src/js/es6/app.js
The css is compiled from LESS. Its directory is src/less/source.less

Open-me folder:
The open-me folder is just an easy drag and drop way to see the project without having to install Grunt or the Grunt CLI.

Just drag and drop the index.html file to Chrome and play around with the page.
Its still a rough sketch of what would be ideal. 

Notes:
This is still rough sketch. It requires some refactoring to make the code more modular and transform the drag and drop api into a reusable library. Also the createTable function could be broken up into smaller more modular pieces. But you get the picture. 

Also, This is mostly written in pure javascript with little use for jQuery. For the next round of refactoring, perhaps the non library parts that are core to just the app.js should be re-written in jQuery. The library should be written in pure JS to reduce dependancies.
