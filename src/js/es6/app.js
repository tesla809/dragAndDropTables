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

    	const populateTable = function(elementObject, targetElement, propIgnore){
    		for(let prop in elementObject){
    			if(prop !== propIgnore){
    				// create column
	    			let el = document.createElement('div');
	    			let p = document.createElement('p');
	    			p.innerText = prop;
	    			el.appendChild(p);

	    			// create rows
	    			let elValue = document.createElement('div');
	    			elValue.innerText = elementObject[prop];
	    			el.appendChild(elValue);

	    			// append all to tableContainer
	    			targetElement.appendChild(el);
    			}
    		}
    	}

    	// create div to hold table
    	const tableContainer = document.createElement('div');
    	tableContainer.id = `user-${user.id}`;
    	tableContainer.className = 'tableFlex';

    	const table = document.createElement('div');
    	table.id = `table-${user.id}`;

    	const tableHeader = document.createElement('h2');
    	tableHeader.innerText = user.name;

    	// append elements
    	table.appendChild(tableHeader);
    	tableContainer.appendChild(table);
    	targetElement.appendChild(tableContainer);

    	populateTable(album, table, 'userId');
    	
    	// test
    	console.log(targetElement);
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

    	// create user1 table
    	createTable(user1, album1, mainContentDiv);
    	createTable(user2, album2, mainContentDiv);
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
