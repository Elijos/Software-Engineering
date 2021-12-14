/* 
 * Author: Evan Lucas-Currie (Whole File)
 */

$('#loginButton').click(function() {
    $('#loginButton').fadeOut("slow", function() {
        $("#container").fadeIn();
        TweenMax.from("#container", .4, { scale: 0, ease: Sine.easeInOut });
        TweenMax.to("#container", .4, { scale: 1, ease: Sine.easeInOut });
    });
});

$(".closeBtn").click(function() {
    TweenMax.from("#container", .4, { scale: 1, ease: Sine.easeInOut });
    TweenMax.to("#container", .4, { left: "0px", scale: 0, ease: Sine.easeInOut });
    $("#container, #forgotten-container").fadeOut(800, function() {
        $("#loginButton").fadeIn(800);
    });
});

/* Forgotten Password */
$('#forgotten').click(function() {
    $("#container").fadeOut(function() {
        $("#forgotten-container").fadeIn();
    });
});

$('.forgetBtn').click(function() {
    let password = $('#passwordReset').val();
    let confirmPassword = $('#confirmPasswordReset').val();
    let username = $("#usernameReset").val();
    let secret = $("#secret").val();
    let post = true;
    if (password != confirmPassword || password.length <= 5) {
        post = false;
        $('#error').removeAttr('hidden');
        $('#error').html("Passwords do not match or <br>Password length is not at least 6 characters")
        $('#forgotten-container').height("440px")
    }

    let check = secret.replace(" ", "");
    let check2 = username.replace(" ", "");
    if (check.length < 6 || check2.length < 6) {
        post = false;
        $('#error').removeAttr('hidden');
        $('#error').html("Recovery password/username<br> must be greater than 6 charaters not including spaces")
        $('#forgotten-container').height("440px")
    }

    if (post) {
        let form_data = new FormData(document.getElementById("forgottenForm"));

        $(() => {
            $.ajax({
                type: 'POST',
                url: '/adminReset',
                data: form_data,
                contentType: false,
                cache: false,
                processData: false,
                success: (data) => {

                    info = JSON.parse(data);
                    if (info.result == false) {
                        $('#error').removeAttr('hidden');
                        $('#error').html("Invalid Credentials")
                        $('#forgotten-container').height("420px")
                    } else {
                        $("#error").attr("hidden", true)
                        $('#passwordReset').val("");
                        $('#confirmPasswordReset').val("");
                        $("#usernameReset").val("");
                        $("#secret").val("");
                        $("#forgotten-container").height("380px");
                        alert("Password has now been changed");

                        $("#loginButton, #forgotten-container").fadeOut("slow", function() {
                            $("#container").fadeIn();
                        });

                    }
                },
            });
        });
    }

});

$('#loginBtn').click(function() {
    let password = $('#password').val();
    let username = $("#username").val();
    let form_data = new FormData(document.getElementById("loginForm"));
    form_data.append("username", username);
    form_data.append("password", password);
    $(() => {
        $.ajax({
            type: 'POST',
            url: '/adminLogin',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            success: (data) => {
                console.log(data)

                info = JSON.parse(data);
                if (info.result == false) {
                    $('#errorLogin').removeAttr('hidden');
                    $('#errorLogin').html("Invalid Credentials")
                    $('#container').height("280px")
                } else {
                    console.log(info.url)
                    window.location.href = '/admin/' + info.url;
                }

            },
        });
    });
});
