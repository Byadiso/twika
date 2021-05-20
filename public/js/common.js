
$("#postTextarea").keyup((event)=>{
    var textbox =$(event.target);
    var value = textbox.val().trim();
    console.log(value);
    var submitButton = $("#submitPostButton");

    if(submitButton.lenght == 0) return alert("No submmit button found");

    if(value ==""){
        submitButton.prop("disabled", true);
        return;
    }

    submitButton.prop("disabled", false);
})


$("#submitPostButton").click((event)=>{
    var button = $(event.target);
    var textbox = $("#postTextarea");

    var data = {
        content: textbox.val()
    }

    $.post("/api/posts", data, (postData, status, xhr)=>{
        console.log(postData)
        var html = createPostHtml(postData);
        $(".postsContainer").prepend(html);
        textbox.val("");
        button.prop("disabled", true)
        
    })

});


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

function getPostIdFromElement(element){
    var isRoot = element.hasClass("post");
    var rootElement = isRoot ? element: element.closest(".post");
    var postId = rootElement.data().id;

    if(postId === undefined) return alert("post id undefined");
          return postId
}


function createPostHtml(postData){

    var postedBy = postData.postedBy;
    if(postedBy._id === undefined){
        return console.log("User Object not populated")
    }
    var displayName = postedBy.firstName + " " + postedBy.lastName;
    var timestamp= timeDifference(new Date(), new Date(postData.createdAt));

    var likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : ""

    return `<div class="post" data-id='${postData._id}'>
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
                                <button>
                                    <i class="fas fa-comment"></i>
                                </button>
                            </div>
                            <div class="postButtonContainer green">
                                <button class="retweet">
                                     <i class="fas fa-retweet"></i>
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