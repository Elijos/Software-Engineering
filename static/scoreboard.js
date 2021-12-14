/*Scoreboard.js */
/* Author: Muiz Demilade Adebayo */
/* Group 2 */

var cols = ['name', 'score']

 /* A function to assign the names and scores gotten from guess what*/
function guessWhat( data ) {
    let completeString = ""
    let count = 1
    for (let key in data) {
	/* Assigning name and score to the data being loaded in scoreboard.html*/
        let name = data[key][cols[0]]
        let score = data[key][cols[1]]
	
	/* Assigning name and score to the name_bar class and score to the points class*/
        let string = `<div class="lboard_mem"><div class="name_bar"><p><span>${count}.</span>${name}</p><div class="bar_wrap"><div class="inner_bar" style="width: 95%"></div></div></div><div class="points">${score} points</div></div>`
        completeString += string
        count++;
    }
    document.getElementById("replace").innerHTML = completeString
}
    function scoreBoard() {
	let x = document.createElement("FORM");
        let form_data = new FormData(x);
        form_data.append('amount', "100");
        $(() => {
            /* ajax to fetch data from the backend and guesswhat then load the data onto the scoreboad.html*/

            $.ajax({
                type: 'POST',
                url: '/getScoreBoard',
                data: form_data,
                contentGET: false,
                cache: false,
                processData: false,
                success: (data) => {
                  data = JSON.parse(data)
                  guessWhat(data)
                },
            });
        });
    }
