$(document).ready(function(){

	$('.glyphicon').hide(); //hides icon at the start
	
	var topics = ["frog", "anime", "dog", "video games", "judo", "cat"]; //iniitial button topics
	
	var clicked; //used to remember which button is the active button
	
	//create buttons from topic list
	function generateButton(){ 
		
		$('#gif-buttons').empty(); //clear out buttons
		
		for(var i = 0; i < topics.length; i++){	//generate new buttons
			
			$('<button>')
				.attr("data-topic", topics[i])
				.addClass('topic-btn btn ' + (clicked != topics[i] ? 'btn-default' : 'btn-primary active')) //remebers is the active button
				.text(topics[i])
				.appendTo("#gif-buttons");
		
		}//end of for loop
	
	}//end of generate button function

	//checks for duplicates before adding a new topic
	function findDuplicates(string){
		
		for (var i = topics.length - 1; i >= 0; i--) {
			if(topics[i] == string) return true; //scans for duplicates and returns if found
		}

		topics.push(string); //adds string to array if no duplicates are found
		return false;

	}
	
	$(document.body).on('click', '.gifs', function(){

		
		//gets current state of gif
		var state = $(this).data('state');
		

		if(state == "still"){ //if gif is still play gif and update state

			$(this).attr('src', $(this).data('gif'));
			$(this).data('state', 'active');
		}
		else{	//if gif is being played stop it and update state

			$(this).attr('src', $(this).data('still'));
			$(this).data('state', 'still');

		}
	})

	//this will always check for new buttons on screen
	$(document.body).on('click', '.btn', function(){

		clicked = $(this).data('topic'); //remembers what button is active

		$('.topic-btn').each(function(i){ //goes through all buttons and sets them to default
			$(this).removeClass('btn-primary active').addClass('btn-default');
		})

		//sets current button to active
		$(this).addClass('active btn-primary').removeClass('btn-default');	
		
		var search = $(this).attr('data-topic'); //gets data stored in button
		
		var giphyURL = "http://api.giphy.com/v1/gifs/search?q="+search+"&limit=10 &api_key=dc6zaTOxFJmzC";

		$.ajax({url:giphyURL, method: 'GET'}).done(function(response){

			
			console.log(response.data);

			var data = response.data; //array of gif information

			var gifDiv = $('#gif-container'); //reference to gifDiv on page
			
			gifDiv.empty();//clear out the div

			for(var i = 0; i < 10; i++){
				
				//create container to hold ratings and gifs
				var gc = $('<div>')
					.addClass('gif-panel pull-left'); 

				//get gif rating	
				var rating = data[i].rating

				//create rating display and attach to gif container
				$('<p>').text('Rating: ' + (rating == '' ? "Not rated" : rating)).appendTo(gc);

				//create img element and attach to gif container
				$('<img>')
					.addClass('gifs')
					.attr('src', data[i].images.fixed_height_still.url)			//current image
					.attr('data-still', data[i].images.fixed_height_still.url)	//still img
					.attr('data-gif', data[i].images.fixed_height.url)			//gif img
					.attr('data-state', 'still')								//get state
					.appendTo(gc);
				
				//attach gif container to page
				gc.appendTo(gifDiv);	

			}//end of for loop	

		});//end of ajax call
	
	});//end of gif button on click
	
	//submit button will create a new button from the search if it does not exist already
	$('#find-gif')
		.on("click", function(){

			//converts input to lowercase
			var gif = $('#gif-input').val().trim().toLowerCase();

			var giphyURL = "http://api.giphy.com/v1/gifs/search?q="+gif+"&limit=10 &api_key=dc6zaTOxFJmzC";

			$.ajax({url: giphyURL, method:'GET'}).done(function(response){

				if(response.data.length == 0){ //if gif does not exist in the JSON
					//display message 
					$('#message').text(gif != '' ? ((gif) + " does not exist.") : "Nothing is entered in search.");
					$('.form-group').addClass('has-error');	//change form color to indicate problem
					$('.glyphicon').show();	//show error icon
					return false; //return since the search failed

				}

				if(findDuplicates(gif))//checks for dupicates and pushes new string if unique
				{
					$('#message').text("Topic already exists");	//prints out message if duplicate found
					$('.form-group').addClass('has-error');	//changes forms color it indicate problem
					$('.glyphicon').show();	//show error icon
				}
				else{
					$('#message').html('<br>');	//erase message
					$('.form-group').removeClass('has-error'); //reverts form color
					$('.glyphicon').hide();	//hide icon
				}

				generateButton(); //creates new button
			
			});	//end of ajax

			return false;
		});//#find-gif onclick function end

	generateButton();
})//ready