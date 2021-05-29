$(document).ready(()=>{
    loadPosts();
});




function loadPosts(){
    $.get("/api/posts",{postedBy : profileUserId},  results =>{
        console.log(results);
        outputPosts(results, $(".postsContainer"))
    })
}