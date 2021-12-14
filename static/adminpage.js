function play(file) {
    document.getElementById("aside").innerHTML = `<audio id="audio" src="/static/audio/${file}"></audio>`
    var audio = document.getElementById("audio");
    audio.play();
}

$('#submit').click(function() {
    let form_data = new FormData(document.getElementById("form"));
    url = '/submit/' + $('#getUrl').html();
    $(() => {
        $.ajax({
            type: 'POST',
            url: url,
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            success: (data) => {
                console.log(data)
                document.getElementById("getUrl").innerHTML = data.newID;
                alert("Audio has been update\nNote: Close tab and reload if you are unable to hear changes.");

            }
        });
    });
});
