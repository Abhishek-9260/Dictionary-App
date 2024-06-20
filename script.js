const form = document.querySelector('form');
const resultDiv = document.querySelector('.result');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    getWordInfo(form.elements[0].value);
});

const getWordInfo = async (word) => {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        displayWordInfo(data);
    } catch (error) {
        console.error('Error fetching the word information:', error);
    }
};

const displayWordInfo = (data) => {
    resultDiv.innerHTML = '';
    if (data && data.length > 0) {
        const wordData = data[0];
        
        // Display the word
        const word = document.createElement('h2');
        word.textContent = wordData.word;
        resultDiv.appendChild(word);
        
        // Add pronunciation button
        const audioButton = document.createElement('button');
        audioButton.textContent = '🔊 Pronounce';
        audioButton.classList.add('pronounce-button');
        audioButton.addEventListener('click', () => {
            speakWord(wordData.word);
        });
        resultDiv.appendChild(audioButton);

        // Display meanings and definitions
        wordData.meanings.forEach((meaning) => {
            const partOfSpeech = document.createElement('h3');
            partOfSpeech.textContent = meaning.partOfSpeech;
            resultDiv.appendChild(partOfSpeech);

            const definitionsContainer = document.createElement('div');
            definitionsContainer.classList.add('definitions-container');
            resultDiv.appendChild(definitionsContainer);

            const maxDefinitionsToShow = 2;
            meaning.definitions.forEach((definition, index) => {
                const def = document.createElement('p');
                def.textContent = definition.definition;
                if (index >= maxDefinitionsToShow) {
                    def.style.display = 'none';
                }
                definitionsContainer.appendChild(def);
            });

            if (meaning.definitions.length > maxDefinitionsToShow) {
                const readMoreButton = document.createElement('button');
                readMoreButton.textContent = 'Read More';
                readMoreButton.classList.add('read-more-button');
                readMoreButton.addEventListener('click', () => {
                    const hiddenDefs = definitionsContainer.querySelectorAll('p');
                    hiddenDefs.forEach((def) => {
                        def.style.display = 'block';
                    });
                    readMoreButton.style.display = 'none';
                });
                resultDiv.appendChild(readMoreButton);
            }
        });
    } else {
        resultDiv.textContent = 'No definitions found.';
    }
};

const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    speechSynthesis.speak(utterance);
};
