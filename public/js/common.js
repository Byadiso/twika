
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
    return postData.content
}