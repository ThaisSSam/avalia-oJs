const editForm = document.getElementById("edit-form");
const idInput = document.getElementById("id");
const apiErrorMessage = document.getElementById("api-erro");

async function buscarEPreencherTarefa(id) {
    apiErrorMessage.textContent = '';
    try {
   
        const form = await fetchApi(`/todos/${id}`, 'GET');

        if ( form) {
            idInput.value = form.id;
            document.getElementById('title').value = form.title || '';
            document.getElementById('description').value = form.description || '';
            document.getElementById('completed').checked = form.completed || false; 
            
        } else {
            throw new Error("Tarefa não encontrada.");
        }
    } catch (error) {
        console.error("Erro ao carregar a tarefa:", error);
        alert(`Erro ao carregar a tarefa: ${error.message}`);
     
        window.location.href = 'index.html'; 
    }
}

async function salvarEdicao(id, dadosParaEdicao) {
    apiErrorMessage.textContent = '';
    try {
        await fetchApi(`/todos/${id}`, 'PUT', dadosParaEdicao);

        alert("Tarefa salva com sucesso!");
        window.location.href = 'index.html'; 

    } catch (error) {
        console.error("Falha ao salvar a edição:", error);
    }
}


editTaskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const id = idInput.value;

    const titleElement = document.getElementById("title");
    const descriptionElement = document.getElementById("description");
    const completedElement = document.getElementById("completed");

    const title = titleElement?.value || '';
    const description = descriptionElement?.value || '';
    const completed = completedElement?.checked || false;


    if (!validarFormulario(title)) { 
        return;
    }

    const dadosParaEdicao = {
        title: title.trim(),
        description: description.trim(), 
        completed: completed
    };

    await salvarEdicao(id, dadosParaEdicao);
});


document.addEventListener("DOMContentLoaded", () => {

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
      
        buscarEPreencherTarefa(id);
    } else {
        alert("ID da tarefa não fornecido. Redirecionando.");
        window.location.href = 'index.html';
    }
});