
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

})


function createPostHtml(postData){

    var postedBy = postData.postedBy;
    if(postedBy._id === undefined){
        return console.log("User Object not populated")
    }
    var displayName = postedBy.firstName + " " + postedBy.lastName;
    var timestamp= postedBy.createdAt;

    return `<div class="post">
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
                                <button>
                                     <i class="fas fa-retweet"></i>
                                 </button>
                                 <button>
                                     <i class="fas fa-heart"></i>
                                 </button>
                            </div>
                        </div>
                    
                    </div>
                </div>
            </div>
    `
    
}