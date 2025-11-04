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

const users = [
    {
        username: "mateustoledo",
        password: "1111",
        idade: 24,
        peso: 74,
    },
    {
        username: "marinamagalhaes",
        password: "2222",
        idade: 23,
        peso: 62,
    }
]

// Função de verificação do login
function verificarLogin() {

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
        alert(`Login bem-sucedido! Bem-vindo(a), ${userFound.username}!`);  
        return userFound; 
    } else {
        alert("Usuário ou senha inválidos. Tente novamente.");
        return null;
    }
}

loginBtn.addEventListener('click', verificarLogin);


// Função de adição do volume de água ao input através dos botões
function handleWaterButtons(e) {
    const target = e.target;
    
    if (target.tagName !== 'BUTTON' || target.id === 'register-btn') {
        return;
    }

    const valorAtual = parseInt(waterInput.value) || 0;
    
    let volumeString = target.textContent; 

    volumeString = volumeString
        .replace('+', '')
        .replace('ml', '')
        .trim();

    const soma = parseInt(volumeString);

    if (!isNaN(soma) && soma > 0) {
        waterInput.value = valorAtual + soma;
    }
}

waterBtns.addEventListener('click', handleWaterButtons);


let waterHistory = [];

// Função de manipulação do DOM para constar o histórico de ingestão
function renderWaterHistory() {
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

registerBtn.addEventListener('click', handleRegisterClick);