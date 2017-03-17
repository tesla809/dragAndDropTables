// technical debt:
// refactor populateTable- seperate columns and rows creation
// make $.when more DRY
"use strict";
const app = function() {
  document.addEventListener("DOMContentLoaded", (event) => {
  	const $ = require('jquery');
    console.log("DOM fully loaded and parsed");
    console.log(`jquery works ${$}`);

    const rootUrl = 'https://jsonplaceholder.typicode.com';
    const mainContentDiv = document.querySelector('div#main-content');

    const createTable = function(user, album, targetElement){
    	console.log(user, album, user.id, album.id);

    	const populateTable = function(elementObject, propIgnore){
			const tableContainer = document.createElement('div');
			tableContainer.className = 'Rtable Rtable--2cols';

    		for(let prop in elementObject){
    			if(prop !== propIgnore){
    				// create columns
    				let elColumn = document.createElement('div');
    				elColumn.className = 'Rtable-cell Rtable-cell--head';
    				elColumn.style = 'order:0;';
    				elColumn.id = `${elementObject}-${prop}`;
    				let elColumnH3 = document.createElement('h3');
    				elColumnH3.innerText = prop.toUpperCase();
    				elColumn.appendChild(elColumnH3);


    				// populate column's rows
    				let elData = document.createElement('div');
    				elData.className = 'Rtable-cell';
    				elData.style = 'order:1;';
    				elData.innerText = elementObject[prop];
    				elData.id = `${elementObject}-${elementObject[prop]}`

    				tableContainer.appendChild(elColumn);
    				tableContainer.appendChild(elData);
    			}
    		}
    		return tableContainer;
    	}

    	// create table
    	const table = document.createElement('div');
    	table.id = `table-${user.name}`;


    	const userHeader = document.createElement('h3');
    	userHeader.innerText = user.name;
    	userHeader.className = 'user-title';

    	const tableInfo = populateTable(album, 'userId');
    	console.log(tableInfo);

    	targetElement.appendChild(userHeader);
    	targetElement.appendChild(table);
    	table.appendChild(tableInfo);
    }

    const allAjaxCompleteCB = (user1, user2, album1, album2) => {
    	console.log('done');
    	user1 = user1[0];
    	user2 = user2[0];
    	album1 = album1[0];
    	album2 = album2[0];

    	console.log(user1);
    	console.log(user2);
    	console.log(album1);
    	console.log(album2);

    	const allTablesContainer = document.createElement('div');
    	allTablesContainer.className = '';
    	allTablesContainer.id = 'all-table-container';

    	// append main table container to mainContent Div
    	mainContentDiv.appendChild(allTablesContainer);

    	// create user1 table
    	createTable(user1, album1, allTablesContainer);
    	createTable(user2, album2, allTablesContainer);

    	// test
    	console.log(mainContentDiv);
    }


	// make DRY, iterable
    $.when(
    	// get users
    	$.get(rootUrl + "/users/" + '1', function(data) {
    		console.log( "calling /users/1 ..." );
    	})
    		.done(function(){
    			console.log('call to users/1 a success');
    		})
	    	.fail(function(){
	    		console.log('call to users/1 failed');
	    	}),
    	$.get(rootUrl + "/users/" + '2', function(data) {
    		console.log( "calling /users/2 ..." );
    	})
    		.done(function(){
    			console.log('call to users/2 a success');
    		})
	    	.fail(function(){
	    		console.log('call to users/2 failed');
	    	}),
    	// get albums
    	$.get(rootUrl + "/albums/" + '1', function(data) {
			console.log( "calling /albums/1 ..." );
    	})
    	   .done(function(){
    			console.log('call to /albums/1 a success');
    		})
	    	.fail(function(){
	    		console.log('call to /albums/1 failed');
	    	}),
    	$.get(rootUrl + "/albums/" + '2', function(data) {
    		console.log( "calling /albums/2 ..." );
    	})   	   
    		.done(function(){
    			console.log('call to /albums/2 a success');
    		})
	    	.fail(function(){
	    		console.log('call to /albums/2 failed');
	    	}),
   	).then(allAjaxCompleteCB);
  });

}();
