const main = document.querySelector(".main") // Selecting the main container.
const newQuest = document.querySelector(".new") // Selecting the new question button.
const clearBtn = document.querySelector(".clear") // Selecting the clear button.
const resultContainer = document.querySelector(".result-container")
// Function for FETCHING the data.
const getData = async () => {
    main.setAttribute("interact", "true"); // Adding the main container interactivity back when new questions fetched.
    newQuest.setAttribute("highlight", "false") // Removing the highligh on the new question button when new questions fetched.
    clearBtn.setAttribute("highlight", "false") // Removing the highligh on the clear button when new questions fetched.
    resultContainer.setAttribute("show", "false"); // if the result container is visible, then hiding it (when new questions button in result container is clicked)
    // Function to remove all event listeners of an element.
    function removeAllEventListeners(element) {
        const clone = element.cloneNode(true);
        element.parentNode.replaceChild(clone, element);
    }
    
    const myElement = document.querySelector('.submit'); // Selecting the submit button for removing all event listeners while calling the getData method.
    removeAllEventListeners(myElement); // Calling the remove all event listeners to remove all event listeners from the submit button element  

    document.querySelector(".main").innerHTML = "" // Making the main container empty, so then new questions come, old questions will be removed.
    document.querySelector(".loader-wrapper").setAttribute("show", "true"); // Making the LOADER visible
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10') // Fetching the QUESTIONS
        const data = await response.json() // Converting the response to json object.
        const result = data.results // Getting the ACTUAL RESULT from the response
        create(result) // Calling the create method for adding All questions to the DOM
    } catch (err) {
        const result = [{ "type": "multiple", "difficulty": "medium", "category": "History", "question": "What is the bloodiest event in United States history, in terms of casualties?", "correct_answer": "Battle of Antietam", "incorrect_answers": ["Pearl Harbor", "September 11th", "D-Day"] }, { "type": "multiple", "difficulty": "hard", "category": "History", "question": "Which naval battle was considered the turning point of the Pacific Ocean Theater during World War 2?", "correct_answer": "Battle of Midway", "incorrect_answers": ["Attack on Truk Island", "Attack on Pearl Harbor", "Battle of the Coral Sea"] }, { "type": "multiple", "difficulty": "hard", "category": "Animals", "question": "What is the Gray Wolf&#039;s scientific name?", "correct_answer": "Canis Lupus", "incorrect_answers": ["Canis Aureus", "Canis Latrans", "Canis Lupus Lycaon"] }, { "type": "multiple", "difficulty": "medium", "category": "Entertainment: Video Games", "question": "In the &quot;Call Of Duty: Zombies&quot; map &quot;Moon&quot;, there is a secondary called the QED. What does QED stand for?", "correct_answer": "Quantum Entanglement Device", "incorrect_answers": ["Quad Ectoplasmic Driver", "Question Every Dog", "Quality Edward Device"] }, { "type": "multiple", "difficulty": "medium", "category": "Entertainment: Film", "question": "In the 1999 movie Fight Club, which of these is not a rule of the &quot;fight club&quot;?", "correct_answer": "Always wear a shirt", "incorrect_answers": ["You do not talk about FIGHT CLUB", "Only two guys to a fight", "Fights will go on as long as they have to"] }, { "type": "multiple", "difficulty": "medium", "category": "Entertainment: Japanese Anime &amp; Manga", "question": "What studio animated Fullmetal Alchemist?", "correct_answer": "Bones", "incorrect_answers": ["Trigger", "Pierrot", "xebec"] }, { "type": "multiple", "difficulty": "medium", "category": "Entertainment: Japanese Anime &amp; Manga", "question": "In &quot;A Certain Magical Index,&quot; what is Accelerator able to control?", "correct_answer": "Vectors", "incorrect_answers": ["Velocity", "Quantums", "Wormholes"] }, { "type": "multiple", "difficulty": "easy", "category": "Entertainment: Music", "question": "How many members are there in the band Nirvana?", "correct_answer": "Three", "incorrect_answers": ["Two", "Four", "Five"] }, { "type": "multiple", "difficulty": "easy", "category": "Geography", "question": "What colour is the circle on the Japanese flag?", "correct_answer": "Red", "incorrect_answers": ["White", "Yellow", "Black"] }, { "type": "multiple", "difficulty": "easy", "category": "Entertainment: Video Games", "question": "When was the top-down online RPG &quot;Space Station 13&quot; released?", "correct_answer": "2003", "incorrect_answers": ["2000", "2010", "2006"] }]
        create(result) // Calling the create method for adding All offline questions to the DOM
    } finally {
        document.querySelector(".loader-wrapper").setAttribute("show", "false"); // Hiding the LOADER.
    }
}
getData() // initial calling of getData.

// Function for adding question to the DOM.
const create = (result) => {
    // Looping through each of the QUESTIONS.
    result.forEach((res, index) => {
        const wrapper = document.createElement("div")
        main.append(wrapper)
        wrapper.className = "wrapper"
        const question = document.createElement("div")
        wrapper.append(question)
        question.innerHTML = `${index + 1}. ${res.question}` // adding QUESTION to the dom

        const optWrapper = document.createElement("div")
        wrapper.append(optWrapper)
        optWrapper.className = "opt-wrapper"

        const options = res.incorrect_answers // Adding INCORRECT ans to options array
        options.splice(Math.ceil((Math.random() * 4) - 1), 0, res.correct_answer) // Adding CORRECT answers to options array
        options.forEach((opt) => {
            const optionContainer = document.createElement("div") 
            optWrapper.append(optionContainer)
            optionContainer.className = "opt-container"
            optionContainer.innerHTML = opt
            optionContainer.setAttribute("selected", false)
            optionContainer.addEventListener("click", (e) => {
                e.target.setAttribute("ans", "false")
                const status = optionContainer.getAttribute("selected")
                optionContainer.setAttribute("selected", status == "false") // toggle between SELECT and UNSELECT

                const all = optionContainer.parentElement.children 
                for (el of all) {
                    if (el != e.target) {
                        el.setAttribute("selected", false) // UNSELECT all other options except the currently selected one.
                    }
                }
            })
        })
    })
    // adding event listener for the SUBMIT button
    document.querySelector(".submit").addEventListener("click", () => {
        const optionWrapper = document.querySelectorAll(".opt-wrapper")
        let score = 0; // Setting initial score.
        optionWrapper.forEach((wrapper, index) => {
            const opt = wrapper.childNodes 
            opt.forEach((o) => {
                if (o.getAttribute("selected") == "true") {
                    // Checking the SELECTED option is correct or not.
                    if (o.innerHTML == result[index].correct_answer) {
                        score++; // Incrementing the score by 1 if it is correct.
                    } else {
                        o.setAttribute("ans", "no") // Visually showing the selected option is wrong.
                        o.setAttribute("selected", false) // Unselecting the option, because it is not the right answer.
                    }
                }
                if (o.innerHTML == result[index].correct_answer) {
                    o.setAttribute("ans", "yes") // Visually showing the correct answer when submit button is clicked
                }
            })
        })
        // setting FINAL SCORE
        document.querySelector(".final").innerText = `${score}/10`
        document.querySelector(".result-container").setAttribute("show", "true");
        main.setAttribute("interact", "false"); // making main container non interactable when it is submitted.
        newQuest.setAttribute("highlight", "true") // Highlighting the new question button when the container is non interactable.
        clearBtn.setAttribute("highlight", "true") // Highlighting the clear button when the container is non interactable.
    })
    // adding event listener for the CLEAR button
    document.querySelector(".clear").addEventListener("click", () => {
        main.setAttribute("interact", "true"); // Adding the main container interactivity back when the clear button is clicked.
        newQuest.setAttribute("highlight", "false") // Removing the highligh on the new question button when the clear button is clicked.
        clearBtn.setAttribute("highlight", "false") // Removing the highligh on the clear button when the clear button is clicked.
        const selectedOptions = document.querySelectorAll(".opt-container")
        selectedOptions.forEach((opt) => {
            opt.setAttribute("selected", false)
            opt.setAttribute("ans", "null")
        })
        // resetting the score to NULL when clear button is clicked
        document.querySelector(".final").innerText = "?/10"
    })
}
// Event listener for close button in result shower.
document.querySelector(".close-btn").addEventListener("click", () => {
    resultContainer.setAttribute("show", "false");
})