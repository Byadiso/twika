$(document).ready(()=>{
if(selectedTab == "replies"){
    loadReplies();
}
else{
    loadPosts();
    }   
});



function loadPosts(){
    $.get("/api/posts",{postedBy : profileUserId, isReply: false},  results =>{
        console.log(results);
        outputPosts(results, $(".postsContainer"))
    })
}


function loadReplies(){
    $.get("/api/posts",{postedBy : profileUserId, isReply: true},  results =>{
        console.log(results);
        outputPosts(results, $(".postsContainer"))
    })
}