// Selecionando os elementos do DOM
const textInput = document.querySelector("#text");
const uploadInput = document.querySelector("#upload");
const voiceSelect = document.querySelector("#voice");
const listenBtn = document.querySelector("#listen-btn");
const downloadBtn = document.querySelector("#download-btn");


const speechUtterance = new SpeechSynthesisUtterance();

let availableVoices = [];

const populateVoiceList = () => {

    availableVoices = window.speechSynthesis.getVoices();


    voiceSelect.innerHTML = '';


    availableVoices.forEach((voiceItem, index) => {
        const option = document.createElement("option");
        option.value = index;

        option.textContent = `${voiceItem.name} (${voiceItem.lang})`;
        voiceSelect.appendChild(option);
    });



    const ptBrVoice = availableVoices.find(voiceItem => voiceItem.lang === 'pt-BR');

    if (ptBrVoice) {
        speechUtterance.voice = ptBrVoice;

        voiceSelect.value = availableVoices.indexOf(ptBrVoice);
    } else if (availableVoices.length > 0) {

        speechUtterance.voice = availableVoices[0];
        voiceSelect.value = 0;
    }


    if (speechUtterance.voice) {
        speechUtterance.lang = speechUtterance.voice.lang;
    }

    console.log("Vozes disponíveis e selecionada:", availableVoices, speechUtterance.voice);
};



window.speechSynthesis.onvoiceschanged = populateVoiceList;



populateVoiceList();


voiceSelect.addEventListener("change", () => {
    const selectedVoice = availableVoices[voiceSelect.value];
    speechUtterance.voice = selectedVoice;

    speechUtterance.lang = selectedVoice.lang;
    console.log("Voz selecionada:", speechUtterance.voice.name, "Idioma do texto definido para:", speechUtterance.lang);
});


listenBtn.addEventListener("click", () => {
    speechUtterance.text = textInput.value;

    window.speechSynthesis.speak(speechUtterance);
});


downloadBtn.addEventListener("click", () => {
    const downText = textInput.value;


    const blob = new Blob([downText], { type: "text/plain" });


    const url = URL.createObjectURL(blob);


    const a = document.createElement("a");
    a.href = url;
    a.download = "texto_convertido.txt";
    a.click();

    URL.revokeObjectURL(url);


    alert("Este botão baixa o TEXTO digitado, não o áudio. A API Web Speech não permite baixar o áudio diretamente.");
});


uploadInput.addEventListener("change", (event) => {
    const archive = event.target.files[0];
    if (archive) {
        const reader = new FileReader();
        reader.onload = (e) => {
            textInput.value = e.target.result;
        };
        reader.readAsText(archive);
    }
});