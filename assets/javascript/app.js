$(document).ready(function(){


	var topics = ["frog", "anime", "dog", "video games", "judo", "cat"];

	function generateButton(){
		$('#gif-buttons').empty();
		for(var i = 0; i < topics.length; i++){
			$('<button>').text(topics[i]).appendTo("#gif-buttons");
		}
	}

	function findDuplicates(string){
		
		for (var i = topics.length - 1; i >= 0; i--) {
			if(topics[i] == string) return true;
		}

		topics.push(string);
		return false;

	}
	
	$('#find-gif')
		.on("click", function(){

			var gif = $('#gif-input').val().toLowerCase();

			if(gif != "") 
				if(findDuplicates(gif))
				{
					$('#message').text("Topic already exists");
				}
				else{
					$('#message').empty();
				}

			generateButton();

			return false;
		})

	var search = "funny cat"
	var giphyURL = "http://api.giphy.com/v1/gifs/search?q="+search+"&api_key=dc6zaTOxFJmzC";

	$.ajax({url:giphyURL, method: 'GET'}).done(function(response){

		console.log(response);

	})
	
	generateButton();
})