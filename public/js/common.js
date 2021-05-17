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