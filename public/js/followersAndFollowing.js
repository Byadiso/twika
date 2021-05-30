const User = require("../../schemas/UserSchema");

$(document).ready(()=>{

    if(selectedTab == "followers"){
        loadFollowers();
    }
    else{
          
          loadFollowing();
        }
    });
    
    
    
    function loadFollowers(){
        $.get(`/api/users/${profileUserId}/followers`, results =>{
            console.log(results);
            outputUsers(results.followers, $(".resultsContainer"))
        })
    }
    
    
    function loadFollowing(){
        $.get(`/api/users/${profileUserId}/followers`,results =>{
            console.log(results);
            outputUsers(results.following, $(".resultsContainer"))
        })
    }


    function outputUsers(data, container){
       container.html("");

       results.forEach(result =>{
           var html = createUserHtml(result, true);
           container.append(html);
       });

       if(results.length == 0){
           container.append("<span class='noResults'>No Results found</span>")
       }
    }


    function createUserHtml(userData, showFollowButton){

        var name = userData.firstName + " " + userData.lastName;
        return `<div class="user">
                    <div class="userImageContainer">
                        <img src="${userData.profilePic}">
                    </div>
                    <div class="userDetailsContainer">
                        <div calss="header">
                            <a href="/profile/${userData.username}">${name}</a>
                            <span class="username">@${userData.username}</span>
                        </div>                        
                    </div>  

                </div>`
    }