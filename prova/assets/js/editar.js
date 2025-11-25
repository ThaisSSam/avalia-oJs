const editTaskForm = document.getElementById("edit-task-form");
const taskIdInput = document.getElementById("task-id");
const apiErrorMessage = document.getElementById("api-erro");

async function buscarEPreencherTarefa(taskId) {
    apiErrorMessage.textContent = '';
    try {
   
        const task = await fetchApi(`/todos/${taskId}`, 'GET');

        if (task) {
            taskIdInput.value = task.id;
            document.getElementById('title').value = task.title || '';
            document.getElementById('description').value = task.description || '';
            document.getElementById('completed').checked = task.completed || false; 
            
        } else {
            throw new Error("Tarefa não encontrada.");
        }
    } catch (error) {
        console.error("Erro ao carregar a tarefa:", error);
        alert(`Erro ao carregar a tarefa: ${error.message}`);
     
        window.location.href = 'index.html'; 
    }
}

async function salvarEdicao(taskId, dadosParaEdicao) {
    apiErrorMessage.textContent = '';
    try {
        await fetchApi(`/todos/${taskId}`, 'PUT', dadosParaEdicao);

        alert("Tarefa salva com sucesso!");
        window.location.href = 'index.html'; 

    } catch (error) {
        console.error("Falha ao salvar a edição:", error);
    }
}


editTaskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const taskId = taskIdInput.value;

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

    await salvarEdicao(taskId, dadosParaEdicao);
});


document.addEventListener("DOMContentLoaded", () => {

    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');

    if (taskId) {
      
        buscarEPreencherTarefa(taskId);
    } else {
        alert("ID da tarefa não fornecido. Redirecionando.");
        window.location.href = 'index.html';
    }
});