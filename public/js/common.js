

$("#postTextarea, #replyTextarea").keyup((event)=>{
    var textbox =$(event.target);
    var value = textbox.val().trim();
    // console.log(value);

    var isModal = textbox.parents(".modal").length == 1 ; 
    var submitButton = isModal ? $("#submitReplyButton") : $("#submitPostButton");

    if(submitButton.lenght == 0) return alert("No submmit button found");

    if(value ==""){
        submitButton.prop("disabled", true);
        return;
    }

    submitButton.prop("disabled", false);
})


$("#submitPostButton , #submitReplyButton").click((event)=>{
    var button = $(event.target);

    var isModal = button.parents(".modal").length == 1;
    var textbox = isModal ? $("#replyTextarea"):  $("#postTextarea");

    var data = {
        content: textbox.val()
    }

    if(isModal){
        var id = button.data().id;
        if(id == null) return alert("Butoon id is null")
        data.replyTo = id ;
    }

    $.post("/api/posts", data, (postData, status, xhr)=>{
        console.log(postData)
        var html = createPostHtml(postData);
        $(".postsContainer").prepend(html);
        textbox.val("");
        button.prop("disabled", true)
        
    })

});

$("#replyModal").on("show.bs.modal", (event )=>{
    // console.log("hi")
    var button = $(event.relatedTarget)
    var postId = getPostIdFromElement(button);
    $("#submitReplyButton").data("id",postId);

    $.get("/api/posts/" + postId , results =>{
        outputPosts(results , $("#originalPostContainer"))
        // outputPosts(results, $(".postsContainer"))
    })
    

})


$("#replyModal").on("hidden.bs.modal", ( )=> $("#originalPostContainer").html(""))

$(document).on("click",".likeButton", (event)=>{    
    var button = $(event.target)
    var postId = getPostIdFromElement(button);
  
    if(postId === undefined )return ;
    $.ajax({
        url:`api/posts/${postId}/like`,
        type: "PUT",
        success: (postData)=>{
            button.find("span").text(postData.likes.length || "" );
            
            if(postData.likes.includes(userLoggedIn._id)){
                button.addClass("active");
            } else {
                button.removeClass("active");
            }
        }
    })

});



$(document).on("click",".retweetButton", (event)=>{    
    var button = $(event.target)
    var postId = getPostIdFromElement(button);
  
    if(postId === undefined )return ;
    $.ajax({
        url:`api/posts/${postId}/retweet`,
        type: "POST",
        success: (postData)=>{
          
            button.find("span").text(postData.retweetUsers.length || "" );
            
            if(postData.retweetUsers.includes(userLoggedIn._id)){
                button.addClass("active");
            } else {
                button.removeClass("active");
            }
        }
    })

});

function getPostIdFromElement(element){
    var isRoot = element.hasClass("post");
    var rootElement = isRoot ? element: element.closest(".post");
    var postId = rootElement.data().id;

    if(postId === undefined) return alert("post id undefined");
          return postId
}

function createPostHtml(postData) {  
     
    if(postData == null ) return alert('post object is null');   
   
    // check if this is a retweet
    var isRetweet = postData.retweetData !== undefined ;
     // get the user who retweeted
    var retweetedBy = isRetweet ? postData.postedBy.username : null;  

    postData = isRetweet ? postData.retweetData : postData ; 
 

    var postedBy = postData.postedBy;
   
    if(postedBy._id === undefined){
        return console.log("User Object not populated")
    }
    var displayName = postedBy.firstName + " " + postedBy.lastName;
    var timestamp= timeDifference(new Date(), new Date(postData.createdAt));

    var likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    var retweeetButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : ""

    var retweetText = "";
    if(isRetweet){
        retweetText = `<span>
                              <i class="fas fa-retweet"></i>
                              Retweeted by <a href="/profile/${retweetedBy}">@${retweetedBy}</a>
                      </span>`
    }

    return `<div class="post" data-id='${postData._id}'>
              <div class="postActionContainer">
                ${retweetText}
              </div>
                <div class="mainContentContainer">
                    <div class="userImageContainer">
                         <img src="${postedBy.profilePic}">
                    </div>
                    <div class="postContentContainer">
                        <div class="header">
                            <a href="/profile/${postedBy.username}">${displayName}</a>
                            <span class="username">@${postedBy.username}</span>
                            <span class="username">${timestamp}</span>
                        </div>
                        <div class="postBody">
                            <span>${postData.content}</span>
                        </div>
                        
                        <div class="postFooter">
                            <div class="postButtonContainer">
                                <button data-toggle="modal" data-target="#replyModal">
                                    <i class="fas fa-comment"></i>
                                </button>
                            </div>
                            <div class="postButtonContainer green">
                                <button class="retweetButton ${retweeetButtonActiveClass}">
                                     <i class="fas fa-retweet"></i>
                                     <span>${postData.retweetUsers.length || ""}</span>
                                 </button>
                            </div>
                            <div class="postButtonContainer red">
                                 <button class="likeButton ${likeButtonActiveClass}">
                                     <i class="fas fa-heart"></i>
                                     <span>${postData.likes.length || ""}</span>
                                 </button>
                            </div>
                            
                        </div>
                    
                    </div>
                </div>
            </div>
    `
    
}



function outputPosts(results, container){
    container.html("");

    if(!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result =>{    
           
        var html = createPostHtml(result);
        // console.log(html)
        container.append(html);        
    })

    if(results.length === 0 ){
        container.append("<span class='noResults'> Nothing to show.</span>")
    }

}


function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000 <30) return "Just now";

        return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}