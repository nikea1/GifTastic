$(document).ready(function(){


	var topics = ["frog", "anime", "dog", "video games", "judo", "cat"];
	
	//create buttons from topic list
	function generateButton(){ 
		$('#gif-buttons').empty();
		for(var i = 0; i < topics.length; i++){
			$('<button>')
				.attr("data-topic", topics[i])
				.addClass('btn btn-default')
				.text(topics[i])
				.appendTo("#gif-buttons");
		}
	}

	//checks for duplicates before adding a new topic
	function findDuplicates(string){
		
		for (var i = topics.length - 1; i >= 0; i--) {
			if(topics[i] == string) return true; //scans for duplicates and returns if found
		}

		topics.push(string); //adds string if no duplicates are found
		return false;

	}
	
	$(document.body).on('click', '.gifs', function(){

		var state = $(this).data('state');
		

		if(state == "still"){

			$(this).attr('src', $(this).data('gif'));
			$(this).data('state', 'active');
		}
		else{

			$(this).attr('src', $(this).data('still'));
			$(this).data('state', 'still');

		}
	})

	//this will always check for new buttons on screen
	$(document.body).on('click', '.btn', function(){

		//alert("Hello world")
		
		var search = $(this).attr('data-topic');
		console.log(this);
		var giphyURL = "http://api.giphy.com/v1/gifs/search?q="+search+"&limit=10 &api_key=dc6zaTOxFJmzC";

		$.ajax({url:giphyURL, method: 'GET'}).done(function(response){

			//console.log(response);
			console.log(response.data);

			var data = response.data;
			var gifDiv = $('#gif-container');
			gifDiv.empty();

			for(var i = 0; i < 10; i++){
				

				//console.log("still: ", data[i].images);
				//console.log("gif: ", data[i].images);

				//$('<img>').attr('src', "http://media0.giphy.com/media/xvV3NUMbSTqSY/200_s.gif").appendTo(gifDiv);

				$('<img>')
					.addClass('gifs')
					.attr('src', data[i].images.fixed_height_still.url)//current src
					.attr('data-still', data[i].images.fixed_height_still.url)//still img
					.attr('data-gif', data[i].images.fixed_height.url)//get play
					.attr('data-state', 'still')//get state
					.appendTo(gifDiv);

			}
		

		})//end of ajax call
	
	})//end of gif button on click
	
	//on click will create a new button if it does not exists
	$('#find-gif')
		.on("click", function(){

			//converts input to lowercase
			var gif = $('#gif-input').val().toLowerCase();

			var giphyURL = "http://api.giphy.com/v1/gifs/search?q="+gif+"&limit=10 &api_key=dc6zaTOxFJmzC";

			$.ajax({url: giphyURL, method:'GET'}).done(function(response){

				if(response.data.length == 0){
					$('#message').text(gif + " does not exist");
					return false;

				}

				if(gif != "") //checks in string exists

				if(findDuplicates(gif))//checks for dupicates and pushes new string if unique
				{
					$('#message').text("Topic already exists");	//prints out message if duplicate found
				}
				else{
					$('#message').empty();
				}

				generateButton(); //creates new button
			
			})

			

			return false;
		})

	
	
	generateButton();
})//ready