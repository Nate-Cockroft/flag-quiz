// ========================================
// Flag Quiz V2
// Question Loader
// ========================================


async function loadQuestions(){

    const response = await fetch("questions.csv");


    if(!response.ok){

        throw new Error(
            "Could not load questions.csv"
        );

    }


    const csv = await response.text();


    game.questions = parseQuestions(csv);


    if(game.questions.length === 0){

        throw new Error(
            "No questions found"
        );

    }


    resetQuestionPool();


    console.log(
        `${game.questions.length} questions loaded`
    );

}




function parseQuestions(csv){

    const lines = csv
        .trim()
        .split(/\r?\n/);



    // Remove header row
    lines.shift();



    const questions = [];



    lines.forEach(line=>{


        const values =
            line.split("\t");



        // Ignore empty rows

        if(!values[1]){

            return;

        }



        const question = {

            question:
                values[0],


            image:
                values[1],


            answers:[

                values[2],
                values[3],
                values[4],
                values[5]

            ],


            correct:
                Number(values[6])-1

        };



        questions.push(question);


    });



    return questions;

}




function resetQuestionPool(){

    game.remainingQuestions =
        [...game.questions];


    shuffleArray(
        game.remainingQuestions
    );

}




function getNextQuestion(){


    if(
        game.remainingQuestions.length === 0
    ){

        resetQuestionPool();

    }



    return game.remainingQuestions.pop();

}




function shuffleArray(array){


    for(
        let i=array.length-1;
        i>0;
        i--
    ){

        const j =
            Math.floor(
                Math.random()*(i+1)
            );


        [
            array[i],
            array[j]
        ] =
        [
            array[j],
            array[i]
        ];

    }


}
