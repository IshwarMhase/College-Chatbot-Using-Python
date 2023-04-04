$(function() {
    $("#chat-message-input").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("#chat-message-submit").click();
        }
    });

    $("#chat-message-submit").click(function() {
        var message = $("#chat-message-input").val();
        if (message.trim() == "") {
            return false;
        }

        $("#chat-log").append("<li class='user'><b>You:</b> " + message + "</li>");
        $("#chat-message-input").val("");

        $.ajax({
            type: "POST",
            url: "/get_bot_response",
            contentType: "application/json",
            data: JSON.stringify({ "message": message }),
            success: function(response) {
                if (response.response.text) {
                    // If the response includes Quick Replies, display them as buttons
                    var buttons = response.response.quick_replies;
                    var buttonText = "";
                    for (var i = 0; i < buttons.length; i++) {
                        buttonText += "<button class='quick-reply' data-payload='" + buttons[i].payload + "'>" + buttons[i].title + "</button>";
                    }
                    $("#chat-log").append("<li class='bot'><b>Bot:</b> " + response.response.text + "<br>" + buttonText + "</li>");
                } else {
                    $("#chat-log").append("<li class='bot'><b>Bot:</b> " + response.response + "</li>");
                }
                $("#chat-log").animate({ scrollTop: $("#chat-log").prop("scrollHeight") }, 500);
            }
        });

        $("#chat-log").animate({ scrollTop: $("#chat-log").prop("scrollHeight") }, 500);
    });

    // Handle clicks on Quick Reply buttons
    $(document).on("click", ".quick-reply", function() {
        var payload = $(this).data("payload");
        $("#chat-message-input").val(payload);
        $("#chat-message-submit").click();
    });
});