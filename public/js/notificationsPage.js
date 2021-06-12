$(document).ready(()=>{
    $.get("/api/notifications", (results) =>{        
        outputPosts(results, $(".resultsContainer"))
    })
})

