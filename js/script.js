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

const bodyWaterFill = document.getElementById("body-water-fill");

// Declaração de variáveis - Controle de Calorias
const foodSearchInput = document.getElementById("food-search-input");
const foodSuggestionsList = document.getElementById("food-suggestions-list");
const foodNumberInput = document.getElementById("food-number-input");
const foodRegisterBtn = document.getElementById("food-register");
const progressBar = document.getElementById("progress-bar");

const totalCaloriesSpan = document.querySelector("#total-food span");
const metaCaloriesSpan = document.querySelector("#daily-food span");

// Variáveis de Estado para a API Edamam
const EDAMAM_APP_ID = 'cf345255';
const EDAMAM_APP_KEY = '4eca1c2c432dc6b40cf9b80bc4b3f250';

let selectedFood = null;
let searchTimeout = null;

// Definição dos usuários por padrão
const defaultUsers = [
    { username: "mateustoledo", password: "1111", idade: 24, peso: 74, altura: 175, genero: "masculino", waterHistory: [], mealHistory: [] },
    { username: "gilmartoledo", password: "3333", idade: 63, peso: 87, altura: 170, genero: "masculino", waterHistory: [], mealHistory: [] },
    { username: "marinamagalhaes", password: "2222", idade: 23, peso: 59, altura: 165, genero: "feminino", waterHistory: [], mealHistory: [] }
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

// função botão logout
function handleLogout() {
 
    localStorage.removeItem('currentUserUsername');
    window.location.href = 'login.html';
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}

// Função de atualização da meta diária e total ingerido
function updateWaterProgress() {

    if (!currentUser || !totalAguaSpan || !metaAguaSpan) return;

    const meta = calcularMeta(currentUser.peso);

    const todayHistory = getTodayHistory();
    const totalIngerido = todayHistory.reduce((sum, registro) => sum + registro.volume, 0);

    totalAguaSpan.textContent = `${totalIngerido}ml`;
    metaAguaSpan.textContent = `${meta}ml`;

    // Definição do preenchimento do corpo humano conforme ingestão de água
    let percentage = (totalIngerido / meta) * 100;
    if (percentage > 100) {
        percentage = 100;
    }
    
    const transformValue = 100 - percentage; 
    bodyWaterFill.style.transform = `translateY(${transformValue}%)`;
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
    displayWaterList();
}

// Função para ocultar a lista do histórico de ingestão de água caso vazio
function displayWaterList() {
    if (waterList.children.length === 0) {
        waterList.style.display = 'none';
    } else {
        waterList.style.display = 'block';
    }
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
    displayWaterList();

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

// Função de cálculo da taxa metabólica basal seguindo a fórmula de Mifflin-St Jeor
function calcularTMB() {
    let tmb;

    if (!currentUser || !currentUser.peso || !currentUser.altura || !currentUser.idade || !currentUser.genero) {
        console.error("Dados do usuário incompletos para calcular a TMB.");
        return 0;
    }

    if (currentUser.genero === "masculino") {
        tmb = (10 * currentUser.peso) + (6.25 * currentUser.altura) - (5 * currentUser.idade) + 5;
    } else if (currentUser.genero === "feminino") {
        tmb = (10 * currentUser.peso) + (6.25 * currentUser.altura) - (5 * currentUser.idade) - 161;
    } else { 
        console.warn("Gênero inválido para cálculo da TMB. Usando fórmula masculina como fallback.");
        tmb = (10 * currentUser.peso) + (6.25 * currentUser.altura) - (5 * currentUser.idade) + 5;
    }

    return Math.round(tmb);
}

// Função de atualização do progresso de calorias e da barra de progresso
function updateCaloriesProgress() {
    if (!currentUser || !totalCaloriesSpan || !metaCaloriesSpan) return;

    const meta = calcularTMB();

    const todayMeals = getTodayMeals();
    const totalIngerido = todayMeals.reduce((sum, registro) => sum + registro.calories, 0);

    totalCaloriesSpan.textContent = `${totalIngerido} kcal`;
    metaCaloriesSpan.textContent = `${meta} kcal`;

    let percentage = (totalIngerido / meta) * 100;

    if (percentage > 100) {
        percentage = 100;
    }

    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
}

// Função de busca de alimentos na API Edaman
async function searchFood(query) {
    if (query.length < 3) {
        foodSuggestionsList.innerHTML = '';
        selectedFood = null;
        return;
    }

    const url = `https://api.edamam.com/api/food-database/v2/parser?ingr=${query}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`;

   try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayFoodSuggestions(data.hints);
    } catch (error) {
        console.error("Erro ao buscar alimentos na API Edamam:", error);
        
        
        foodSuggestionsList.innerHTML = '<li class="suggestion-item">Erro ao buscar. Tente novamente.</li>';
        foodSuggestionsList.style.display = 'block';
    }
}

// Função para exibir as sugestões da API
function displayFoodSuggestions(hints) {
    foodSuggestionsList.innerHTML = '';

    if (!hints || hints.length === 0) {
        const listItem = document.createElement('li');
        listItem.textContent = 'Nenhum alimento encontrado.';
        foodSuggestionsList.appendChild(listItem);
        return;
    }

    hints.forEach(hint => {
        const food = hint.food;
        const listItem = document.createElement('li');
        listItem.textContent = food.label;
        listItem.className = 'suggestion-item';
        
        listItem.dataset.foodId = food.foodId;
        listItem.dataset.foodName = food.label;
        listItem.dataset.caloriesPer100g = food.nutrients ? (food.nutrients.ENERC_KCAL || 0) : 0;
        
        listItem.addEventListener('click', () => selectFoodSuggestion(food));
        foodSuggestionsList.appendChild(listItem);
    });
}

// Função para selecionar um alimento da lista de sugestões
function selectFoodSuggestion(food) {
    selectedFood = {
        id: food.foodId,
        name: food.label,
        caloriesPer100g: food.nutrients ? (food.nutrients.ENERC_KCAL || 0) : 0
    };
    foodSearchInput.value = food.label;
    foodSuggestionsList.innerHTML = '';
    foodNumberInput.focus();
}

// Função auxiliar para filtrar o registro de refeições diário
function getTodayMeals() {
    if (!currentUser) return [];
    
    return currentUser.mealHistory.filter(registro => isToday(registro.timestamp));
}

// Função para registrar a refeição
function handleRegisterMealClick() {
    if (!currentUser || !foodNumberInput || !foodRegisterBtn) return;
    if (!selectedFood) {
        alert("Por favor, busque e selecione um alimento da lista de sugestões antes de registrar.");
        return;
    }

    const quantity = parseInt(foodNumberInput.value);
    if (isNaN(quantity) || quantity <= 0) {
        alert("Por favor, insira uma quantidade válida para a refeição.");
        return;
    }

    const calculatedCalories = (selectedFood.caloriesPer100g / 100) * quantity;

    const novoRegistro = {
        mealName: selectedFood.name,
        calories: Math.round(calculatedCalories),
        quantity: quantity,
        unit: 'g',
        timestamp: Date.now()
    };
    
    currentUser.mealHistory.push(novoRegistro); 
    saveUsers(users); 

    updateCaloriesProgress();

    foodSearchInput.value = '';
    foodNumberInput.value = '';
    selectedFood = null;
}

// Inicialização das funções do módulo de calorias
if (currentUser) {

    foodSearchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout); 
        searchTimeout = setTimeout(() => {
            searchFood(e.target.value); 
        }, 1500);
    });

    if (foodRegisterBtn) {
        foodRegisterBtn.addEventListener('click', handleRegisterMealClick);
    }
    
    // renderMealHistory(); // <--- NÃO VAMOS RENDERIZAR O HISTÓRICO POR ENQUANTO
    updateCaloriesProgress();
}