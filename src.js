//This gets the info for a particular reddit post, parses it, then uses "mode" to determine how to interact with the "element" paramater. Based on "mode" the function will either append or fill.
var getPostInfo = function(url,mode,element){
	var request = new XMLHttpRequest();
	request.open('GET', 'http://www.reddit.com/api/info.json?url='+url, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
	    var response = JSON.parse(request.responseText);
		var post = response.data.children[0].data;
		var childToKeep;
		for(var j = 0; j < element.childNodes.length; j++){
			if(element.childNodes[j].className === "child"){
				childToKeep = element.childNodes[j];
			};
		}
		//var childToKeep = element.children("child");

		
		var html = createEmbed(post.title,post.url,post.domain,post.created_utc,post.author,post.subreddit,post.num_comments,post.score,post.thumbnail,post.permalink,childToKeep);


		
		switch(mode){
		case "initialize":
			//console.log(element.children);
			for(var f = 0; f < element.children.length; f++){
				if(element.children[f].tagName === "A" || element.children[f].tagName === "a"){
					var link = element.children[f];
				}
			}
			var count = html.length;
			for(var m = 0; m < count; m++){
				link.parentNode.insertBefore(html[0],link);
			}
			link.remove();
			//element.innerHTML = toInsert.innerHTML;
			break;
		case "update":

			element.parentElement.insertBefore(toInsert, parent.firstChild);
			break;
		}
		
	  } else {
	    // We reached our target server, but it returned an error

	  }
	};

	request.onerror = function() {
	  // There was a connection error of some sort
	};

	request.send();
};

//This gets the front page for a subreddit. You pass the subreddit name and the element you'd like to FILL (ONLY FILL).
var getSubredditFrontPage = function(subreddit,element){
	var request = new XMLHttpRequest();
	request.open('GET', 'http://api.reddit.com/r/'+subreddit, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
	    var data = JSON.parse(request.responseText);
		console.log(data.data.children);
		var posts = data.data.children;
		var frontPost;
		for (i = 0; i < data.data.children.length-1; i++) {
		    if (data.data.children[i].data.url.length > 0) { 
				frontPost = data.data.children[i].data.url;
				getPostInfo(frontPost,"prepend",element);
			};
		}
	  } else {
	    // We reached our target server, but it returned an error

	  }
	};

	request.onerror = function() {
	  // There was a connection error of some sort
	};

	request.send();
	
	
	
	
};

//Section: Comment
//This gets information about a comment, parses it, then puts it in the element you direct it to using the mode parameter(not there yet)
var getCommentInfo = function(commentId,element){
	var mode = "fill";
	var request = new XMLHttpRequest();
	request.open('GET', 'http://www.reddit.com/api/info.json?id=t1_'+commentId, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
	    var data = JSON.parse(request.responseText);
		var commentData = data.data.children[0].data;
		var html = createCommentEmbed(commentData.body,commentData.score,commentData.created,commentData.author,commentData.subreddit,"permagoeshere");
		var div = document.createElement('div');
		div.innerHTML = html;
		console.log(data);
		var toInsert = div.firstChild;

		switch(mode){
		case "fill":
			element.innerHTML = toInsert.innerHTML;
			break;
		case "prepend":
			console.log(element.parentElement);
			element.parentElement.insertBefore(toInsert, parent.firstChild);
			break;
		}
		
	  } else {
	    // We reached our target server, but it returned an error

	  }
	};

	request.onerror = function() {
	  // There was a connection error of some sort
	};

	request.send();
	
	
	
	
};
//This simply formats a string to take the individual pieces of information for any comment and return the properly formed HTML div.
var createCommentEmbed = function(text,voteCount,date,user,subreddit,permalink){
	return "<div class=\"red-comment\"><p class=\"red-comment-text\">"+text+"</p><div class=\"red-comment-footer\"><div class=\"red-comment-vote-container\"><p class=\"red-comment-vote\">"+voteCount+"</p></div><p class=\"red-comment-tagline\"><a class=\"comment-perma\"href=\""+permalink+"\">submitted</a> <time title=\""+date+"\" class=\"red-comment-live-timestamp\">"+timeSince(date)+"</time> ago by <a href=\"http://www.reddit.com/user/"+user+"\">"+user+"</a> to <a href=\"http://www.reddit.com/r/"+subreddit+"\">/r/"+subreddit+"</a></p></div></div>";
};

//This simply formats a string to take the individual pieces of information for any comment and return the properly formed HTML div.
var createEmbed = function(title,url,domain,date,user,subreddit,commentCount,score,thumbnail,link,child){
		var parentdiv = document.createElement("div");
		parentdiv.innerHTML = child;
		var newChild = parentdiv.firstChild;
		//console.log(child.innerHTML);
		if(child !== null){
		
			var initString = "<div class=\"red-vote_container\"><div class=\"red-up\"></div><p class=\"red-votes\">"+score+"</p><div class=\"red-down\"></div></div><div class=\"red-thumbnail\"><img src=\""+thumbnail+"\"></div><div class=\"red-details\"><p class=\"red-title\"><a href=\""+url+"\">"+title+"</a><span style=\"font-size:10px;  color: rgb(136, 136, 136);\"> ("+domain+")</span></p><p class=\"red-tagline\">submitted <time title=\""+date+"\" class=\"red-live-timestamp\">"+timeSince(date)+" ago</time> by <a href=\"http://www.reddit.com/user/"+user+"\">"+user+"</a> to <a href=\"http://www.reddit.com/r/"+subreddit+"/\">/r/"+subreddit+"</a></p><p class=\"red-comment-count\"><a href=\"http://www.reddit.com"+link+"\"><b>View "+commentCount+" comments</b></a></p></div>";
			var div = document.createElement('div');
			div.innerHTML = initString;
			console.log(initString);
			return div.children;
		}
		else{
			console.log("nochild");
			return "<div class=\"red-item\"><div class=\"red-vote_container\"><div class=\"red-up\"></div><p class=\"red-votes\">"+score+"</p><div class=\"red-down\"></div></div><div class=\"red-thumbnail\"><img src=\""+thumbnail+"\"></div><div class=\"red-details\"><p class=\"red-title\"><a href=\""+url+"\">"+title+"</a><span style=\"font-size:10px;  color: rgb(136, 136, 136);\"> ("+domain+")</span></p><p class=\"red-tagline\">submitted <time title=\""+date+"\" class=\"red-live-timestamp\">"+timeSince(date)+" ago</time> by <a href=\"http://www.reddit.com/user/"+user+"\">"+user+"</a> to <a href=\"http://www.reddit.com/r/"+subreddit+"/\">/r/"+subreddit+"</a></p><p class=\"red-comment-count\"><a href=\"http://www.reddit.com"+link+"\"<b>View "+commentCount+" comments</b></p></div></div>";
		}
		
	};

//This gets all comments on the page and then gets the information and fills the div with the properly formed HTML.
var allComments = document.getElementsByClassName("red-comment");
if(allComments != null){
	for(var f = 0; f < allComments.length; f++){
		var element = allComments.item(f);
		var div1 = document.createElement('div');
		var split = allComments.item(f).getElementsByTagName("a").item(0).href.split("/");
		getCommentInfo(split[split.length-1],allComments.item(f))
		
		//console.log(allComments.item(f).getElementsByTagName("a").item(0).href.split("/r/")[1]);
		//getCommentInfo(allComments.item(f).getElementsByTagName("a").item(0).href.split("/r/")[1],allComments.item(f))
	};
}

//Gets all subreddit elements, gets the data and calls the helper function that will cycle through the results and populate posts.
var allSubreddits = document.getElementsByClassName("reddit_subreddit");
if(allSubreddits != null){
	for(var g = 0; g < allSubreddits.length; g++){
		console.log(allSubreddits.item(g).getElementsByTagName("a").item(0).href.split("/r/")[1]);
		getSubredditFrontPage(allSubreddits.item(g).getElementsByTagName("a").item(0).href.split("/r/")[1],allSubreddits.item(g))
	};
}

//Get all the embedded posts and fill them with the right html
var allPosts = document.getElementsByClassName("red-item");
if(allPosts != null){
	for(var i = 0; i < allPosts.length; i++){
		getPostInfo(allPosts.item(i).getElementsByTagName("a").item(0).href,"initialize",allPosts.item(i));
	};
}


//Update post functionality
setInterval(function(){
         var allPosts = document.getElementsByClassName("red-item");
		 for(var i = 0; i < allPosts.length; i++){
			 console.log(allPosts.item(i));
			//getPostInfo(allPosts.item(i).getElementsByClassName("red-title").item(0).getElementsByTagName("a").item(0).href,"fill",allPosts.item(i));
		}
    },5000);
	

	var styleEl = document.createElement('style');
	  styleEl.setAttribute("id","reddbed-style");
  // Append style element to head
  document.head.appendChild(styleEl);

  // Grab style sheet
  //styleSheet = styleEl.sheet;

   document.getElementById('reddbed-style').innerHTML = ".red-title { font-family: verdana, arial, helvetica, sans-serif; font-kerning: auto; font-size: 16px; font-stretch: normal; font-style: normal; font-variant: normal; font-variant-ligatures: normal; font-weight: 400; margin-right: .4em; position: relative; top: px; margin-top: 0; margin-bottom: 5px; } .red-tagline { font-family: verdana, arial, helvetica, sans-serif; font-kerning: auto; font-size: 10px; font-stretch: normal; font-style: normal; font-variant: normal; font-variant-ligatures: normal; font-weight: 400; margin-top: -5px; margin-bottom: 0; } .red-details { margin-left: 135px; } .red-thumbnail, .item { float: left; margin-right: 5px; vertical-align: top; } .red-vote { height: 14px; width: 15px; } .red-up { background-image: url(reddit-images.png); background-position: -63px -818px; background-repeat: no-repeat; bottom-margin: 0; height: 14px; width: 15px; margin: 2px auto auto; } .red-down { background-image: url(reddit-images.png); background-position: -21px -818px; background-repeat: no-repeat; bottom-margin: 0; height: 14px; width: 15px; margin: auto; } .red-item a:hover { text-decoration: underline; } .red-item { height: auto; width: 100%; -webkit-border-radius: 10px; -moz-border-radius: 10px; border-radius: 10px; border: 2px solid #000; background-color: #F0F0F0; padding-left: 5px; margin-right: 5px; margin-bottom: 2px; overflow: hidden; } .red-comment-count { font-family: verdana, arial, helvetica, sans-serif; font-kerning: auto; font-size: 10px; font-stretch: normal; font-style: normal; font-variant: normal; font-variant-ligatures: normal; font-weight: 400; margin-top: 2px; margin-bottom: 2px; } .red-vote_container { width: 37px; float: left; height: 48px; text-align: center; padding-right: 10px; padding-left: 3px; } .red-vote_container p { margin-top: 1px; margin-bottom: 0; font-family: verdana, arial, helvetica, sans-serif; font-kerning: auto; font-size: 13px; font-stretch: normal; font-style: normal; font-variant: normal; font-variant-ligatures: normal; font-weight: 700; color: #c6c6c6; } .red-item img { width: 70px; } .red-item a, .red-title a, .red-title a:hover { text-decoration: none; } .child{ margin-left:5px; margin-right:13px; margin-bottom:20px; margin-top:20px; }";
	//styleEl.innerHTML("body{font-size:12px;}\n.title{font-size:22;}");


	
	

   //This calculates how long it has been in human readable time since a certain date.
    function timeSince(date) {
   var seconds = Math.floor(((new Date().getTime()/1000) - date)),

   interval = seconds / 31536000;
   var floor = Math.floor(interval);
   if (floor > 1){
   	return floor + " years, "+Math.floor((interval%1)*12)+" months";
   }; 

   interval = seconds / 2592000;
   var floor = Math.floor(interval);
   if (floor > 1){
   	return floor + " months, "+Math.floor((interval%1)*30)+" days"; //i know this is bad, but it's a boring bug. someone else can fix it. 30 days.
   };

   interval = seconds / 86400;
   var floor = Math.floor(interval);
   if (floor >= 1){
   	return floor + " days, "+Math.floor((interval%1)*24)+" hours";
   };

   interval = seconds / 3600;
   var floor = Math.floor(interval);
   if (floor >= 1){
   	return floor + " hours, "+Math.floor((interval%1)*60)+" minutes";
   };

   interval = seconds / 60;
   var floor = Math.floor(interval);
   if (floor > 1){
   	return floor + " minutes, "+Math.floor((interval%1)*60)+" seconds";
   }; 

   return Math.floor(seconds) + " seconds";
   }