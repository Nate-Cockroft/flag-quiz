// ========================================
// Flag Quiz V2
// Question Loader
// ========================================

async function loadQuestions(){

    const all = await loadQuestionsData();

    game.questions = all.filter(questionIncluded);

    if(game.questions.length === 0){

        throw new Error(
            "No questions match your selected tags"
        );

    }

    resetQuestionPool();

    console.log(
        `${game.questions.length} questions loaded`
    );

}




function questionIncluded(question){


    if(
        question.tags.length === 0
    ){

        return true;

    }


    const excluded = loadExcludedTags();


    return !question.tags.some(
        tag => excluded.includes(tag)
    );

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
