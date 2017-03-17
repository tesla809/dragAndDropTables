"use strict";
const app = function() {
  document.addEventListener("DOMContentLoaded", (event) => {
  	const $ = require('jquery');
    console.log("DOM fully loaded and parsed");
    console.log(`jquery works ${$}`);

    const rootUrl = 'https://jsonplaceholder.typicode.com';

    const callback = (user1, user2, album1, album2) => {
    	console.log('done');
    	user1 = user1[0];
    	user2 = user2[0];
    	album1 = album1[0];
    	album2 = album2[0];

    	console.log(user1);
    	console.log(user2);
    	console.log(album1);
    	console.log(album2);
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
   	).then(callback);
  });

}();
