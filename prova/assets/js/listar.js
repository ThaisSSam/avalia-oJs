const form = document.getElementById("form");
const listaDeTarefas = document.getElementById("lista-de-tarefas");
const apiErrorMessage = document.getElementById("api-erro"); 

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

    document.querySelectorAll('.error-message').forEach(span => { 
        span.textContent = '';
    });
    document.querySelectorAll('#form input').forEach(input => {
        input.style.borderColor = '';
    });
}

function validarFormulario(title) {
    limparErrosValidacao();
    let valido = true;
    const titleTrim = title.trim();


    if (titleTrim.length < 3) {
        exibirMensagemErro('title', 'O Título é obrigatório e deve ter no mínimo 3 caracteres.');
        valido = false;
    }
    return valido;
}


function renderItem(item) {
    const status = item.completed ? '✅ Concluída' : '⏳ Pendente';
    const li = document.createElement('li');
    li.innerHTML = `
        <strong>${item.title}</strong> (${status})
        <p style="margin-left: 20px; font-size: 0.9em;">Descrição: ${item.description || 'N/A'}</p>
        <div class="botoes">
            <button href="editar.html?id=${item.id}" style="margin-left: 10px;">Editar</button> 
            <button data-id="${item.id}" class="excluir-btn" style="margin-left: 10px;">Excluir</button>
        </div>
    `;
    return li;
}

function renderLista(data) {
    listaDeTarefas.innerHTML = '';
    if (data && Array.isArray(data)) {
        data.forEach(item => {
            listaDeTarefas.appendChild(renderItem(item));
        });
    } else {
        listaDeTarefas.innerHTML = '<li>Nenhuma tarefa encontrada.</li>';
    }
}



async function carregarTarefas() {
    apiErrorMessage.textContent = '';
    try {
        const response = await fetch(`${API_BASE_URL}/todos`, {
             method: "GET", 
             headers: AUTH_HEADERS
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP ao carregar tarefas: ${response.status}`);
        }

        const dados = await response.json();
        renderLista(dados);

    } catch (erro) {
        console.error("Erro ao carregar tarefas:", erro);
        apiErrorMessage.textContent = `Falha ao carregar tarefas. Tente novamente. (${erro.message})`;
        renderLista(null);
    }
}


async function criarTarefa(dadosParaCadastro) {
    apiErrorMessage.textContent = '';
    try {
        const response = await fetch(`${API_BASE_URL}/todos`, {
            method: "POST", 
            headers: AUTH_HEADERS,
            body: JSON.stringify(dadosParaCadastro)
        });

        if (!response.ok) {
            const responseText = await response.text();
            let errorMessage = `Erro HTTP ${response.status}`;
            
            try {
                const errorBody = JSON.parse(responseText);
                errorMessage = errorBody.message || errorBody.detail || 
                               (errorBody.errors ? JSON.stringify(errorBody.errors) : errorMessage);
            } catch (e) {
                if (responseText.length < 200) { 
                     errorMessage += `: ${responseText}`;
                }
            }
            throw new Error(errorMessage);
        }

        const dados = await response.json();
        alert(`Tarefa cadastrada com sucesso: ${dados.title}`);
        
        carregarTarefas(); 

    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);
        apiErrorMessage.textContent = `Falha ao cadastrar a tarefa: ${erro.message}`;
    }
}


async function excluirTarefa(tarefaId) {
    apiErrorMessage.textContent = ''; 
    const url = `${API_BASE_URL}/todos/${tarefaId}`;

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: AUTH_HEADERS
        });

        if (!response.ok) {
            const erroDados = await response.json().catch(() => ({ message: `Erro HTTP ${response.status}` }));
            throw new Error(erroDados.message || erroDados.detail || 'Erro desconhecido ao excluir.');
        }

        alert(`Tarefa ID ${tarefaId} excluída com sucesso!`);
        carregarTarefas(); 

    } catch (erro) {
        console.error("Erro ao excluir:", erro);
        apiErrorMessage.textContent = `Falha ao excluir a tarefa: ${erro.message}`;
    }
}



 form.addEventListener("submit", async (e) => {
    e.preventDefault();
    

    const titleElement = document.getElementById("title");
    const descriptionElement = document.getElementById("description");
    const completedElement = document.getElementById("completed");

    const title = titleElement?.value || '';
    const description = descriptionElement?.value || '';
    const completed = completedElement?.checked || false;


    if (!validarFormulario(title)) { 
        return; 
    }

    
    const dadosParaCadastro = {
        title: title.trim(),
        description: description.trim(),
        completed: completed
    };

    await criarTarefa(dadosParaCadastro);

});


listaDeTarefas.addEventListener("click", (e) => {
    if (e.target.classList.contains('excluir-btn')) {
        const tarefaId = e.target.getAttribute('data-id');
        if (confirm(`Tem certeza que deseja excluir a tarefa ID ${tarefaId}?`)) {
            excluirTarefa(tarefaId);
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    carregarTarefas();
});