const readline = require('readline');
const fs = require('fs');

let askedQuestions = [];

function getRandomQuestion(questionsData) {
    const remainingQuestions = Object.values(questionsData).filter(question => !askedQuestions.includes(question));
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    return remainingQuestions[randomIndex];
}

function findKeyword(answer, questionsData) {
    const keywords = Object.keys(questionsData);
    const foundKeywords = keywords.filter(keyword => answer.includes(keyword));
    const remainingQuestions = Object.values(questionsData).filter(question => !askedQuestions.includes(question));
    for (const keyword of foundKeywords) {
        const matchingQuestions = remainingQuestions.filter(question => questionsData[keyword] === question);
        if (matchingQuestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * matchingQuestions.length);
            return keyword;
        }
    }
    return null;
}

async function promptQuestions(questionsData) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let count = 0;
    let currentQuestion = getRandomQuestion(questionsData);
    let previousQuestion = "";

    while (count < 5 && currentQuestion) {
        const answer = await new Promise((resolve) => {
            rl.question(currentQuestion, resolve);
        });

        askedQuestions.push(currentQuestion);
        count++;

        const keyword = findKeyword(answer, questionsData);
        if (keyword && questionsData[keyword] && !askedQuestions.includes(questionsData[keyword]) && questionsData[keyword] !== previousQuestion) {
            console.log(questionsData[keyword]);
            previousQuestion = currentQuestion;
            currentQuestion = questionsData[keyword];
        } else {
            currentQuestion = getRandomQuestion(questionsData);
        }
    }

    rl.close();
}

fs.readFile('questions.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading JSON file:", err);
        return;
    }

    try {
        const questionsData = JSON.parse(data);
        promptQuestions(questionsData);
    } catch (err) {
        console.error("Error parsing JSON data:", err);
    }
});
