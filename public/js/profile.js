$(document).ready(()=>{
    loadPosts();
});



function loadPosts(){
    $.get("/api/posts",{postedBy : profileUserId, isReply: false},  results =>{
        console.log(results);
        outputPosts(results, $(".postsContainer"))
    })
}