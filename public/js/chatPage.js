$(document).ready(()=>{
    $.get("/api/chats/${chatId}", (data) =>{
        $('#chatName').text(getChatName(data))
        console.log(results);
        outputPosts(results, $(".postsContainer"))
    })
})




$("#chatNameButton").click(()=>{
    var name = $("#chatNameTextbox").val().trim();

    $/ajax({
        url:"api/chats/" + chatId,
        type: "PUT",
        data:{ chatName : name},
        success: (data, status, xhr)=>{
            if(xhr.status !=24){
                alert("could not update")
            }
            else{
                location.reload();
            }
        }
    })
})


$(".sendMessageButton").click(()=>{
   messageSubmitted();
})


$(".inputTextbox").keydown((event)=>{
    if(event.which === 13){
        messageSubmitted();
        return false
    }
    
 })


function messageSubmitted (){
    console.log("yes subietted smS")
}
