"use strict"

const waterInput = document.getElementById("water-input");
const waterBtns = document.getElementById("water-btns");
const registerBtn = document.getElementById("register-btn");
const waterList = document.getElementById("waterHistoryList");

const cadastroUser = document.getElementById("cadastro-user");
const cadastroSenha = document.getElementById("cadastro-senha");
const cadastroIdade = document.getElementById("cadastro-idade");
const cadastroPeso = document.getElementById("cadastro-peso");

const loginUser = document.getElementById("login-user");
const loginSenha = document.getElementById("login-senha");
const loginBtn = document.getElementById("login-btn");

const totalAguaSpan = document.getElementById("total-agua"); 
const metaAguaSpan = document.getElementById("meta-agua");



// Função de verificação do login
function verificarLogin() {
    if (!loginUser || !loginSenha) return null;
    
    const usernameInput = loginUser.value.trim();
    const senhaInput = loginSenha.value.trim();

    if (!usernameInput || !senhaInput) {
        alert("Por favor, preencha o Usuário e a Senha.");
        return null;
    }

    const userFound = users.find(user => 
        user.username === usernameInput && user.password === senhaInput
    )

    if (userFound) {
        window.location.href = 'index.html'; 
        return userFound; 
    } else {
        alert("Usuário ou senha inválidos. Tente novamente.");
        return null;
    }
}

if (loginBtn) {
    loginBtn.addEventListener('click', verificarLogin);
}




// Função de cálculo da meta diária
function calcularMeta(peso) {
    if (isNaN(peso) || peso <= 0) {
        return 2000;
    }
    const metaMl = peso * 35;
    return Math.round(metaMl)
}

// Função auxiliar para verificar se o registro é de hoje
function isToday(timestamp) {
    const today = new Date().toDateString();
    const registerDate = new Date(timestamp).toDateString();
    return today === registerDate;
}






// Função de adição do volume de água ao input através dos botões
function handleWaterButtons(e) {
    if (!waterInput || !waterBtns) return;

    const button = e.target.closest('button'); 

    if (!button || button.id === 'register-btn') {
        return;
    }

    const valorAtual = parseInt(waterInput.value) || 0;
    let volumeString = button.textContent;

    volumeString = volumeString
        .replace('+', '')
        .replace('ml', '')
        .trim();

    const soma = parseInt(volumeString);

    if (!isNaN(soma) && soma > 0) {
        waterInput.value = valorAtual + soma;
    }
}

if (waterBtns) {
    waterBtns.addEventListener('click', handleWaterButtons);
}


let waterHistory = [];

// Função de manipulação do DOM para constar o histórico de ingestão
function renderWaterHistory() {
    if (!waterList) return;
    
    waterList.innerHTML = ''; 

    const historicoInvertido = waterHistory.slice().reverse();

    historicoInvertido.forEach(registro => {
        const listItem = document.createElement('li');

        const horaFormatada = new Date(registro.timestamp).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        listItem.textContent = `💧 ${registro.volume}ml às ${horaFormatada}`;
        waterList.appendChild(listItem);
    });
}

// Função de registro do volume ingerido
function handleRegisterClick() {
    if (!waterInput || !registerBtn) return;

    const volumeParaRegistrar = parseInt(waterInput.value);

    if (isNaN(volumeParaRegistrar) || volumeParaRegistrar <= 0) {
        alert('Por favor, insira um volume válido.');
        return;
    }
    
    const novoRegistro = {
        volume: volumeParaRegistrar,
        timestamp: Date.now()
    };
    
    waterHistory.push(novoRegistro);
    renderWaterHistory();
    waterInput.value = ''; 
}

if (registerBtn) { 
    registerBtn.addEventListener('click', handleRegisterClick);
}