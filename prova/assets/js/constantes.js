const API_BASE_URL = "https://unctuous-incorruptible-elizabet.ngrok-free.dev/api";

const AUTH_HEADERS = {
    "Content-Type": "application/json",
    "Authorization": "Bearer e801beac-f538-4201-ab8d-4db0b71ac56e", 
    "x-api-key": "e801beac-f538-4201-ab8d-4db0b71ac56e", 
    "ngrok-skip-browser-warning": "skip"
};

async function fetchApi(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: AUTH_HEADERS,
    };
    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ message: `Erro HTTP ${response.status}` }));
            throw new Error(errorBody.message || errorBody.detail || `Erro HTTP ${response.status}`);
        }

        return response.status === 204 ? null : response.json();

    } catch (error) {
        console.error("Erro na comunicação com a API:", error);
        const apiError = document.getElementById('api-erro');
        if (apiError) {
            apiError.textContent = `Erro na API: ${error.message}`;
        }
        throw error; 
    }
}


function exibirMensagemErro(campoId, mensagem) {
    const erroElement = document.querySelector(`[data-error-for="${campoId}"]`);
    if (erroElement) {
        erroElement.textContent = mensagem;
        const inputElement = document.getElementById(campoId);
        if (inputElement) {
            inputElement.style.borderColor = mensagem ? 'red' : 'green';
        }
    }
}

function limparErrosValidacao() {
    document.querySelectorAll('.erro').forEach(span => {
        span.textContent = '';
    });
    document.querySelectorAll('#edit-task-form input, #task-form input').forEach(input => {
        input.style.borderColor = ''; 
    });
}

function validarFormulario(title) { 
    limparErrosValidacao();
    let valido = true;

    if (title.trim().length < 3) {
        exibirMensagemErro('title', 'O Título da tarefa é obrigatório e deve ter no mínimo 3 caracteres.');
        valido = false;
    }
    
    return valido;
}