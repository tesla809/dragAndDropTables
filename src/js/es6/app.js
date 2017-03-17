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

    // drag and drop code
    //Function handleDragStart(), Its purpose is to store the id of the draggable element.
	function handleDragStart(e) {
		e.dataTransfer.setData("text", this.id); //note: using "this" is the same as using: e.target.
	}

	//The dragenter event fires when dragging an object over the target. 
	//The css class "drag-enter" is append to the targets object.
	function handleDragEnterLeave(e) {
		if(e.type == "dragenter") {
			this.className = "drag-enter" 
		} else {
			this.className = "" //Note: "this" referces to the target element where the "dragenter" event is firing from.
		}
	}

	//Function handles dragover event eg.. moving your source div over the target div element.
	//If drop event occurs, the function retrieves the draggable element’s id from the DataTransfer object.
	function handleOverDrop(e) {
		e.preventDefault(); 
			//Depending on the browser in use, not using the preventDefault() could cause any number of strange default behaviours to occur.
		if (e.type != "drop") {
			return; //Means function will exit if no "drop" event is fired.
		}
		//Stores dragged elements ID in var draggedId
		var draggedId = e.dataTransfer.getData("text");
		//Stores referrence to element being dragged in var draggedEl
		var draggedEl = document.getElementById(draggedId);

		//if the event "drop" is fired on the dragged elements original drop target e.i..  it's current parentNode, 
		//then set it's css class to ="" which will remove dotted lines around the drop target and exit the function.
		if (draggedEl.parentNode == this) {
			this.className = "";
			return; //note: when a return is reached a function exits.
		}
		//Otherwise if the event "drop" is fired from a different target element, detach the dragged element node from it's
		//current drop target (i.e current perantNode) and append it to the new target element. Also remove dotted css class. 
		draggedEl.parentNode.removeChild(draggedEl);
		this.appendChild(draggedEl); //Note: "this" references to the current target div that is firing the "drop" event.
		this.className = "";
	}

	//Retrieve two groups of elements, those that are draggable and those that are drop targets:
	var draggable = document.querySelectorAll('[draggable]')
	var targets = document.querySelectorAll('[data-drop-target]');
	//Note: using the document.querySelectorAll() will aquire every element that is using the attribute defind in the (..)

	//Register event listeners for the"dragstart" event on the draggable elements:
	for(var i = 0; i < draggable.length; i++) {
		draggable[i].addEventListener("dragstart", handleDragStart);
	}

	//Register event listeners for "dragover", "drop", "dragenter" & "dragleave" events on the drop target elements.
	for(var i = 0; i < targets.length; i++) {
		targets[i].addEventListener("dragover", handleOverDrop);
		targets[i].addEventListener("drop", handleOverDrop);
		targets[i].addEventListener("dragenter", handleDragEnterLeave);
		targets[i].addEventListener("dragleave", handleDragEnterLeave);
	}
		

    const createTable = function(user, album, targetElement){
    	const populateTable = function(elementObject, propIgnore){
			const tableContainer = document.createElement('div');
			tableContainer.className = 'Rtable Rtable--2cols';
			tableContainer['data-drop-target'] = "true";

    		for(let prop in elementObject){
    			if(prop !== propIgnore){
    				// create columns
    				let elColumn = document.createElement('div');
    				elColumn.className = 'Rtable-cell Rtable-cell--head';
    				// fix order:0 with x using an array if value is an array.
    				elColumn.style = 'order:0;';
    				elColumn.id = `${elementObject}-${prop}`;
    				let elColumnH3 = document.createElement('h3');
    				elColumnH3.innerText = prop.toUpperCase();
    				elColumn.appendChild(elColumnH3);

    				// populate column's rows
    				let elData = document.createElement('div');
    				elData.className = 'Rtable-cell';
    				// dragging feature, might want to toggle it later
    				elData.style = 'order:1;';
    				elData.innerText = elementObject[prop];
    				elData.id = `${elementObject}-${elementObject[prop]}`;
    				elData.draggable = 'true';

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
