// technical debt:
// refactor populateTable- seperate columns and rows creation
// make $.when more DRY
// make this more modular
// add parameter for toggle features.
// refactor drag and drop functions as a general re-usable library
"use strict";
const app = function() {
    document.addEventListener("DOMContentLoaded", (event) => {
        const $ = require('jquery');
        console.log("DOM fully loaded and parsed");
        const rootUrl = 'https://jsonplaceholder.typicode.com';
        const mainContentDiv = document.querySelector('div#main-content');

        const createTable = function(user, album, targetElement) {
            const populateTable = function(elementObject, propIgnore) {
                const tableContainer = document.createElement('div');
                tableContainer.className = 'Table';

                let rowHeader = document.createElement('div');
                rowHeader.className = 'Table-row Table-header';
                rowHeader.id = 'row-header';

                let rowData = document.createElement('div');
                rowData.className = 'Table-row row-data';

                // create an array of elements,
                // the odd ones are added as headers
                // the even ones are added as values
                // if more than one value as value, added as an multi dimensional array
                let elArray  = [];
                for (let prop in elementObject) {
                    if (prop !== propIgnore) {
                        // create columns
                        let elColumn = document.createElement('div');
                        elColumn.className = 'Table-row-item Rtable-cell Rtable-cell--head';
                        elColumn.id = `${elementObject.id}-${prop}`;
                        let elColumnH3 = document.createElement('h3');
                        elColumnH3.innerText = prop.toUpperCase();
                        elColumn.appendChild(elColumnH3);

                        // populate column's rows
                        let elData = document.createElement('div');
                        elData.className = 'Table-row-item Rtable-cell';
                        elData.innerText = elementObject[prop];
                        elData.id = `${elementObject.id}-${elementObject[prop]}`;
                        elData.setAttribute('draggable', 'true');

                        elArray.push(elColumn);
                        elArray.push(elData);
                    }
                }

                // since key values come in pairs, 
                // then header will be divisible by 2 aka even
                // value will be odd
                for(let x = 0; x < elArray.length; x++){
                	if(x % 2 === 0){
                		rowHeader.appendChild(elArray[x]);
                	} else {
                		rowData.appendChild(elArray[x]);
                	}
                }

                tableContainer.appendChild(rowHeader);
                tableContainer.appendChild(rowData);
                return tableContainer;
            }

            // create table
            const table = document.createElement('div');
            table.id = `table-${user.name}`;
            table.setAttribute('user-id', user.id);

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

        function getTableElements(e){
            const targetRow = e.target.parentNode;
            const table = e.target.parentNode.parentNode;
            const headers = table.firstChild;

            return {
            	targetRow: targetRow,
            	table: table,
            	headers: headers
            }
        }
        function moveRow(el, targetElement){
        	const targetRow = el.parentNode;
        	targetRow.className = 'Table-row row-data';
        	const elRowChildren = el.parentNode.children;
        	targetElement.appendChild(targetRow);
        	return targetElement;
        }

        function getStyle(element, property){
        	return window.getComputedStyle(element, null).getPropertyValue(property);
        }
        const allAjaxCompleteCB = (user1, user2, album1, album2) => {
        	// the dragged source element
            let dragSrcEl = null;
             // dragStart
            // higher scope variable to get origin table in dragStart
           	let dragStartOrigin = null;

           	// original data before its moved;
           	let originalElData = null;

            // is assigned new data of tables after drag and drop is complete
            let newData = null;

            // user Id
            let userId = null;

            const defaultHeaderBackground = 'rgba(242,242,242, 0.8)';
            const defaultBackground = 'rgba(242,242,242, 0.3)';
            const defaultBorder = '';
            const defaultOpacity = '1';

            const selectedBackground = 'rgba(200,50,10,0.1)';
            const selectedBorder = '2px dashed #000';
            const selectedOpacity = '0.4';

            const evenBackgroundColor = '#ffffff';

            console.log('done');
            user1 = user1[0];
            user2 = user2[0];
            album1 = album1[0];
            album2 = album2[0];

            // create user1 table
            createTable(user1, album1, mainContentDiv);
            createTable(user2, album2, mainContentDiv);

            const rowItems = document.querySelectorAll('.Rtable-cell');
            // test
            console.log(mainContentDiv);

            // drag functions for event handlers - hoists to the top
            function handleDragStart(e) {
	        	const targetRow = getTableElements(e).targetRow;
        		targetRow.style.opacity = selectedOpacity;
                targetRow.style.border = selectedBorder;
               	dragSrcEl = this;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', this.innerHTML);
                
                // get origin table
                dragStartOrigin = getTableElements(e).table;
                originalElData = getUpdatedData(dragStartOrigin);
            }

            function handleDragOver(e) {
                // feature detection
                if (e.preventDefault) {
                    // allows us to drop
                    e.preventDefault();
                }
                e.dataTransfer.dropEffect = 'move';
                const parentNode = e.target.parentNode;
                parentNode.style.backgroundColor = selectedBackground;
                return false;
            }

            function handleDragEnter(e) {
                // this / e is the current hover target
                this.classList.add('over');
                // color change
                const parentNode = e.target.parentNode;
                parentNode.style.backgroundColor = selectedBackground;
            }

            function handleDragLeave(e) {
                // this / e is the previous hover target
                this.classList.remove('over');
                // color change
                const parentNode = e.target.parentNode;
                if(parentNode.classList.contains('Table-header')){
                	parentNode.style.backgroundColor = defaultHeaderBackground;
                } else {
                	parentNode.style.backgroundColor = defaultBackground;
                }
            }

            function handleDrop(e) {
                // this / e is the current hover target
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                const parentTable = e.target.parentNode.parentNode;
                const parentNode = e.target.parentNode;
                if (dragSrcEl != this) {
                // >>> add the new row feature here <<<
                    moveRow(dragSrcEl, parentTable);
                }
                if (parentNode.classList.contains('Table-header')){
                	parentNode.style.backgroundColor = defaultHeaderBackground;
                } else {
                	parentNode.style.backgroundColor = defaultBackground;
                }
                return false;
            }

            function handleDragEnd(e) {
                [].forEach.call(rowItems, function(item) {
                    item.classList.remove('over');
                });

                const elements = getTableElements(e);
                const post = []

                elements.targetRow.style.backgroundColor = defaultBackground;
                elements.targetRow.style.border = defaultBorder;
                elements.targetRow.style.opacity = defaultOpacity;

                elements.headers.style.backgroundColor = defaultHeaderBackground;
				if (elements.table.children.length > 1) {
				    for (let x = 1; x < elements.table.children.length; x++) {
				        if (x % 2 === 0) {
				            elements.table.children[x].style.backgroundColor = evenBackgroundColor;
				        } else {
				            elements.table.children[x].style.backgroundColor = defaultBackground;
				        }
				    }
				}
				// gets new data from updated data;
				newData = updateData(e);
				sendData(newData);
				console.log('end!');				
            }

            // add event handlers for dragging.
            [].forEach.call(rowItems, function(item) {
                item.addEventListener('dragstart', handleDragStart, false);
                item.addEventListener('dragenter', handleDragEnter, false);
                item.addEventListener('dragover', handleDragOver, false);
                item.addEventListener('dragleave', handleDragLeave, false);
                item.addEventListener('drop', handleDrop, false);
                item.addEventListener('dragend', handleDragEnd, false);
            });

	        function updateData(e){
	    		let targetRow = e.target.parentNode;
	    		let parentTable = targetRow.parentNode;
	    		let destinationTable = getUpdatedData(parentTable);
	    		let originTable = getUpdatedData(dragStartOrigin);

	    		let updatedTables = {
	    			sender: originTable,
	    			senderOriginal: originalElData,
	    			reciever: destinationTable
	    		}
	    		console.log('>>>//>>> here! <<<//<<<');
	    		console.log(updatedTables);
	    		return updatedTables;
	        }
			function getUpdatedData(table){
				let prop = table.querySelectorAll('.Table-header > .Table-row-item');
				let value = table.querySelectorAll('.row-data > .Table-row-item');
				let tableName = table.parentNode.previousSibling.innerText;
				let userId = table.parentNode.getAttribute('user-id');
				let columnPropArr = [];
				// idArr and titleArr go into rowValueArr
				let rowValueArr = [];
				let idArr = [];
				let titleArr = [];
				// final table
				let result = {};
				// get column ids
				for (let x = 0; x < prop.length; x++){
					let property = prop[x].innerText.toLowerCase();
					// eliminate extra line at end of string
					property = property.replace(/(\r\n|\n|\r)/gm,"");
					columnPropArr.push(property);
				}
				// get and sort value data
				for (let x = 0; x < value.length; x ++) {
					if(x % 2 === 0){
					    idArr.push(value[x].innerText);
					} else {
						titleArr.push(value[x].innerText);
					}
				}
				rowValueArr.push(idArr);
				rowValueArr.push(titleArr);
				// create table object
				for (let x = 0; x < columnPropArr.length; x++){
					result[columnPropArr[x]] = rowValueArr[x];
				}

				return {
					tableName: tableName,  
					table: result,
					userId: userId
				}
			}
	        function sendData(dataObj){
	        	putData(dataObj.reciever);
	        	deleteData(dataObj.senderOriginal);
	        	// update user with new album lists
	        	function putData(dataSend){
	        		console.log('dataSend');
	        		console.log(dataSend);
	        		let dataExport = {
						id: dataSend.table.id,
				    	title: dataSend.table.title,
				    	userId: dataSend.userId
					};

        			$.ajax({
					    url: rootUrl + `/posts/${dataExport.userId}`,
					    type:'PUT',
					    data: {
					    	id: JSON.stringify(dataExport.id),
					    	title: JSON.stringify(dataExport.title)
					    },
					    dataType: 'json',
					    success: function() {
					    	// I could add a svg that spins or a check mark
					    	// that appears
					       console.log(`data sent!`);
					   }
					}).then(function(data){
						console.log(`This is the data sent:`);
						console.log(data);
					});
	        	}
	        	function deleteData(dataDelete){
	        		let dataExport = {
						id: dataDelete.table.id,
						title: dataDelete.table.title,
						userId: dataDelete.userId
					};
		    		$.ajax({
					    url: rootUrl + `/posts/${dataExport.userId}`,
					    type:'DELETE',
					    data: {
					    	id: '',
					    	title: ''
					    },
					    dataType: 'json',
					    success: function() {
					    	// I could add a svg that spins or a check mark
					    	// that appears
					       console.log(`data deleted!`);
					   }
					}).then(function(data){
						console.log(`This is the data deleted:`);
						console.log(dataExport);
					});
	        	}
	        }
        }
        // ajax call
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
