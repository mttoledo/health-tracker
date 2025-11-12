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

const logoutBtn = document.getElementById("logout-btn");

// Definição dos usuários por padrão
const defaultUsers = [
    { username: "mateustoledo", password: "1111", idade: 24, peso: 74, waterHistory: [] },
    { username: "gilmartoledo", password: "3333", idade: 63, peso: 87, waterHistory: [] },
    { username: "marinamagalhaes", password: "2222", idade: 23, peso: 59, waterHistory: [] }
];

// Carrega usuários do Local Storage ou usa os padrões
function loadUsers() {
    const storedUsers = localStorage.getItem('logfitUsers');
    if (!storedUsers) {
        localStorage.setItem('logfitUsers', JSON.stringify(defaultUsers));
        return defaultUsers;
    }
    return JSON.parse(storedUsers);
}

// Salva usuários no Local Storage
function saveUsers(currentUsers) {
    localStorage.setItem('logfitUsers', JSON.stringify(currentUsers));
}

let users = loadUsers(); 
let currentUser = null; 

// Protege e define o objeto currentUser (Gestão de Estado da Sessão)
function checkAuthentication() {
    const username = localStorage.getItem('currentUserUsername');
    
    if (window.location.pathname.endsWith('index.html')) {
        if (!username) {
            window.location.href = 'login.html'; 
            return;
        }
        
        currentUser = users.find(user => user.username === username);
        
        if (!currentUser) {
            localStorage.removeItem('currentUserUsername');
            window.location.href = 'login.html';
        }
    }
}
checkAuthentication();

// Função de verificação do login
function verificarLogin() {
    if (!loginUser || !loginSenha) return; 

    const usernameInput = loginUser.value.trim();
    const senhaInput = loginSenha.value.trim();

    if (!usernameInput || !senhaInput) {
        alert("Por favor, preencha o Usuário e a Senha.");
        return;
    }

    const userFound = users.find(user => 
        user.username === usernameInput && user.password === senhaInput
    )

    if (userFound) {
        localStorage.setItem('currentUserUsername', userFound.username); 
        window.location.href = 'index.html'; 
    } else {
        alert("Usuário ou senha inválidos. Tente novamente.");
    }
}

if (loginBtn) {
    loginBtn.addEventListener('click', verificarLogin);
}

// Função de atualização da meta diária e total ingerido
function updateWaterProgress() {

    if (!currentUser || !totalAguaSpan || !metaAguaSpan) return;

    const meta = calcularMeta(currentUser.peso);

    const todayHistory = getTodayHistory();
    const totalIngerido = todayHistory.reduce((sum, registro) => sum + registro.volume, 0);

    totalAguaSpan.textContent = `${totalIngerido}ml`;
    metaAguaSpan.textContent = `${meta}ml`;
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

// Função auxiliar para filtrar o registro de ingestão de água diário
function getTodayHistory() {
    if (!currentUser) return [];
    
    return currentUser.waterHistory.filter(registro => isToday(registro.timestamp));
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

// Função de manipulação do DOM para constar o histórico de ingestão
function renderWaterHistory() {

    if (!waterList || !currentUser) return;
    
    waterList.innerHTML = '';

    const todayHistory = getTodayHistory();
    
    const historicoInvertido = todayHistory.slice().reverse();

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
    if (!waterInput || !registerBtn || !currentUser) return;

    const volumeParaRegistrar = parseInt(waterInput.value);

    if (isNaN(volumeParaRegistrar) || volumeParaRegistrar <= 0) {
        alert('Por favor, insira um volume válido.');
        return;
    }
    
    const novoRegistro = {
        volume: volumeParaRegistrar,
        timestamp: Date.now()
    };
    
    currentUser.waterHistory.push(novoRegistro);
    
    saveUsers(users); 

    renderWaterHistory();
    updateWaterProgress();

    waterInput.value = ''; 
}

// Inicialização das funções do controle de ingestão de água
if (registerBtn && currentUser) { 
    
    if (waterBtns) {
        waterBtns.addEventListener('click', handleWaterButtons);
    }
    registerBtn.addEventListener('click', handleRegisterClick);
    
    renderWaterHistory();
    updateWaterProgress();
}

// função botão logout
function handleLogout() {
 
    localStorage.removeItem('currentUserUsername');
    window.location.href = 'login.html';
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}