//TODO: Temporary
$(document).ready(function(){
    $('#signup-form').submit(function(e){
        if($('#password').val() != $('#checkpass').val())
        {
            alert("Passwords do not match!");
            e.preventDefault();
        }
    });
});

