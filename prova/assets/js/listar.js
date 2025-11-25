async function listarTarefa(dadosDaTarefa){
    const response = await fetch(`${API_BASE_URL}/todos`, {
        method: "GET", 
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer 5ad54208-c98a-4920-946c-a715d75a63a9",
            "x-api-key": "5ad54208-c98a-4920-946c-a715d75a63a9",
            "ngrok-skip-browser-warning": "skip"
        }, 
        body: JSON.stringify(dadosDaTarefa)
    });
    return response;
}

document.addEventListener("DOMContentLoaded", async()=>{

    try{
        const response = await fetch(`${API_BASE_URL}/todos`);
        if(!response.ok)throw new Error("Falha ao carregar");
        const dados =await response.json();
        document.getElementById('tarefa').value = dados.tarefa;
        document.getElementById('usuario').value = dados.usuario;
        document.getElementById('det-tarefa').value = dados.detalhesTarefa;
        document.getElementById('tag').value = dados.tag;
        document.getElementById('tarefas-tag').value = dados.tarefasTag;
    }catch(erro){
        
    }

    const tarefa = document.getElementById("tarefa");
    const usuario = document.getElementById("usuario");
    const detalhesTarefa = document.getElementById("det-tarefa");
    const tag = document.getElementById("tag");
    const tarefaTag = document.getElementById(tarefa-tag);
    parametros.textContent = `Tarefa: ${tarefa || "Não encontrado"} Usuário: ${usuario || "Não encontrado"} Detalhes Tarefa: ${detalhesTarefa || "Não encontrado"} Tag: ${tag || "Não encontrado"} Tarefa Tag: ${tarefaTag || "Não encontrado"}`
})