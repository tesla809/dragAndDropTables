// technical debt:
// refactor populateTable- seperate columns and rows creation
// make $.when more DRY
// add parameter for toggle features.
"use strict";
const app = function() {
    document.addEventListener("DOMContentLoaded", (event) => {
        const $ = require('jquery');
        console.log("DOM fully loaded and parsed");
        console.log(`jquery works ${$}`);

        const rootUrl = 'https://jsonplaceholder.typicode.com';
        const mainContentDiv = document.querySelector('div#main-content');

        const createTable = function(user, album, targetElement) {
            const populateTable = function(elementObject, propIgnore) {
                const tableContainer = document.createElement('div');
                tableContainer.className = 'Rtable Rtable--2cols';

                for (let prop in elementObject) {
                    if (prop !== propIgnore) {
                        // create columns
                        let elColumn = document.createElement('div');
                        elColumn.className = 'Rtable-cell Rtable-cell--head';
                        // fix order:0 with x using an array if value is an array.
                        elColumn.style = 'order:0;';
                        elColumn.id = `${elementObject.id}-${prop}`;
                        let elColumnH3 = document.createElement('h3');
                        elColumnH3.innerText = prop.toUpperCase();
                        elColumn.appendChild(elColumnH3);

                        // populate column's rows
                        let elData = document.createElement('div');
                        elData.className = 'Rtable-cell';
                        elData.style = 'order:1;';
                        elData.innerText = elementObject[prop];
                        elData.id = `${elementObject.id}-${elementObject[prop]}`;
                        elData.setAttribute('draggable', 'true');

                        tableContainer.appendChild(elColumn);
                        tableContainer.appendChild(elData);
                    }
                }
                return tableContainer;
            }

            // create table
            const table = document.createElement('div');
            table.id = `table-${user.name}`;

            // create table's name
            const userHeader = document.createElement('h3');
            userHeader.innerText = user.name;
            userHeader.className = 'user-title';

            // populate table
            const tableInfo = populateTable(album, 'userId');

            targetElement.appendChild(userHeader);
            targetElement.appendChild(table);
            table.appendChild(tableInfo);
        }

        const allAjaxCompleteCB = (user1, user2, album1, album2) => {
            let dragSrcEl = null;

            function handleDragStart(e) {
                this.style.opacity = '0.4';
                this.style.border = '2px dashed #000';

                dragSrcEl = this;

                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', this.innerHTML);
            }

            function handleDragOver(e) {
                // feature detection
                if (e.preventDefault) {
                    // allows us to drop
                    e.preventDefault();
                }
                e.dataTransfer.dropEffect = 'move';
                const parentNode = e.target.parentNode;
                parentNode.style.backgroundColor = 'rgba(200,50,10,0.1)';

                return false;
            }

            function handleDragEnter(e) {
                // this / e is the current hover target
                const parentNode = e.target.parentNode;
                parentNode.style.backgroundColor = 'rgba(200,50,10,0.1)';

                this.classList.add('over');
                console.log('enter');
            }

            function handleDragLeave(e) {
                const parentNode = e.target.parentNode;
                parentNode.style.backgroundColor = 'rgba(112,128,144,.2)';
                // this / e is the previous hover target
                this.classList.remove('over');
                console.log('leave')
            }

            function handleDrop(e) {
                // this / e is the current hover target
                if (e.stopPropagation) {
                    e.stopPropagation();
                }

                // >>> add the new row feature here <<<

                // Don't do anything if dropping the same column we're dragging.
                if (dragSrcEl != this) {
                    // Set the source column's HTML to the HTML of the column we dropped on.
                    dragSrcEl.innerHTML = this.innerHTML;
                    this.innerHTML = e.dataTransfer.getData('text/html');
                }

                return false;
            }

            function handleDragEnd(e) {
                [].forEach.call(rowItems, function(item) {
                    item.classList.remove('over');
                });
            }

            console.log('done');
            user1 = user1[0];
            user2 = user2[0];
            album1 = album1[0];
            album2 = album2[0];

            // create user1 table
            createTable(user1, album1, mainContentDiv);
            createTable(user2, album2, mainContentDiv);

            // test
            console.log(mainContentDiv);

            const test = document.createElement('div');
            mainContentDiv.appendChild(test);

            const rowItems = document.querySelectorAll('.Rtable-cell');
            // change to for statment
            [].forEach.call(rowItems, function(item) {
                item.addEventListener('dragstart', handleDragStart, false);
                item.addEventListener('dragenter', handleDragEnter, false);
                item.addEventListener('dragover', handleDragOver, false);
                item.addEventListener('dragleave', handleDragLeave, false);
                item.addEventListener('drop', handleDrop, false);
                item.addEventListener('dragend', handleDragEnd, false);
            });
        }

        // make DRY, iterable
        $.when(
            // get users
            $.get(rootUrl + "/users/" + '1', function(data) {
                console.log("calling /users/1 ...");
            })
            .done(function() {
                console.log('call to users/1 a success');
            })
            .fail(function() {
                console.log('call to users/1 failed');
            }),
            $.get(rootUrl + "/users/" + '2', function(data) {
                console.log("calling /users/2 ...");
            })
            .done(function() {
                console.log('call to users/2 a success');
            })
            .fail(function() {
                console.log('call to users/2 failed');
            }),
            // get albums
            $.get(rootUrl + "/albums/" + '1', function(data) {
                console.log("calling /albums/1 ...");
            })
            .done(function() {
                console.log('call to /albums/1 a success');
            })
            .fail(function() {
                console.log('call to /albums/1 failed');
            }),
            $.get(rootUrl + "/albums/" + '2', function(data) {
                console.log("calling /albums/2 ...");
            })
            .done(function() {
                console.log('call to /albums/2 a success');
            })
            .fail(function() {
                console.log('call to /albums/2 failed');
            }),
        ).then(allAjaxCompleteCB);
    });
}();
