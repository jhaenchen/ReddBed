
var getInfo = function(url,mode,element){
	var request = new XMLHttpRequest();
	request.open('GET', 'http://www.reddit.com/api/info.json?url='+url, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
	    var response = JSON.parse(request.responseText);
		console.log(response);
		var post = response.data.children[0].data;
		var html = createEmbed(post.title,post.url,post.domain,post.created_utc,post.author,post.subreddit,post.num_comments,post.score,post.thumbnail,post.permalink);
		switch(mode){
		case "fill":
			element.innerHTML = html;
			break;
		case "prepend":
			element.parent.insertBefore(el, parent.firstChild);
			object.prepend(html);
			break;
		}
		console.log(html);
		
	  } else {
	    // We reached our target server, but it returned an error

	  }
	};

	request.onerror = function() {
	  // There was a connection error of some sort
	};

	request.send();
};

//Get all the embedded posts and fill them with the right html
var allPosts = document.getElementsByClassName("reddit_post");
for(var i = 0; i < allPosts.length; i++){
	getInfo(allPosts.item(i).getElementsByTagName("a").item(0).href,"fill",allPosts.item(i));
};

setInterval(function(){
         var allPosts = document.getElementsByClassName("reddit_post");
		 for(var i = 0; i < allPosts.length; i++){
			 console.log(allPosts.item(i).getElementsByClassName("title").item(0).getElementsByTagName("a").item(0).href);
			getInfo(allPosts.item(i).getElementsByClassName("title").item(0).getElementsByTagName("a").item(0).href,"fill",allPosts.item(i));
		}
    },5000);

var createEmbed = function(title,url,domain,date,user,subreddit,commentCount,score,thumbnail,link){
	return "<div class=\"item\"><div class=\"vote_container\"><div class=\"vote up\"></div><p class=\"votes\">"+score+"</p><div class=\"vote down\"></div></div><div class=\"thumbnail\"><img src=\""+thumbnail+"\"></div><div class=\"details\"><p class=\"title\"><a href=\""+url+"\">"+title+"</a><span style=\"font-size:10px;  color: rgb(136, 136, 136);\">("+domain+")</span></p><p class=\"tagline\">submitted <time title=\""+date+"\" class=\"live-timestamp\">"+timeSince(date)+" ago</time> by <a href=\"http://www.reddit.com/user/"+user+"\">"+user+"</a> to <a href=\"http://www.reddit.com/r/"+subreddit+"/\">/r/"+subreddit+"</a></p><p class=\"comment\"><a href=\"http://www.reddit.com"+link+"\"<b>View "+commentCount+" comments</b></p></div></div>";
};

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
	return floor + " months, "+Math.floor((interval%1)*30)+" days"; //i know this is bad, but it's a boring bug. someone else can fix it.
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