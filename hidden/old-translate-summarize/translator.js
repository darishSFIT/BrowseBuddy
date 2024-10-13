const translationHistory = [];

function translateText() {
    const inputText = document.getElementById('inputText').value;
    const targetLanguage = document.getElementById('targetLanguage').value;
    // Simulated translation logic (replace with actual translation API)
    const translatedText = `Translated (${targetLanguage}): ${inputText}`; // Placeholder translation

    // Update translation history
    translationHistory.push({ text: inputText, translated: translatedText });
    displayTranslation(translatedText);
    displayHistory();
}

function displayTranslation(translatedText) {
    document.getElementById('translationOutput').innerText = translatedText;
}

function displayHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = ''; // Clear existing history
    translationHistory.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.text} => ${entry.translated}`;
        historyList.appendChild(li);
    });
}
