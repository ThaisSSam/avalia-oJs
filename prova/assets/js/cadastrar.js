const botao = document.getElementById("enviar");

async function cadastrarTarefa(dadosDaTarefa){
    const response = await fetch(`${API_BASE_URL}/todos`, {
        method: "POST", 
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

botao.addEventListener("click", async (e) => {
    e.preventDefault();
    
    const usuarioElement = document.getElementById("usuario");
    const tarefaElement = document.getElementById("tarefa");
    const detalhesTarefaElement = document.getElementById("det-tarefa"); 
    const tagElement = document.getElementById("tag");
    const tarefaTagElement = document.getElementById("tarefa-tag");

    const resultado = document.getElementById("resultado");


    const usuario = usuarioElement?.value || '';
    const tarefa = tarefaElement?.value || '';
    const detalhesTarefa = detalhesTarefaElement?.value || '';
    const tag = tagElement?.value || '';
    const tarefaTag = tarefaTagElement?.value || '';


    if(!usuario) {
        resultado.textContent = "Digite um nome de usuário";
        return;
    }
    if(!tarefa) {
        resultado.textContent = "Digite uma tarefa";
        return;
    }

    const dadosParaCadastro = {
        tarefa: tarefa,
        usuario: usuario,
        detalhesTarefa: detalhesTarefa, 
        tag: tag,
        tarefaTag: tarefaTag
    };

    try {

        const resposta = await cadastrarTarefa(dadosParaCadastro);

        if (!resposta.ok) {

            const erroDados = await resposta.json().catch(() => ({ message: `Erro HTTP ${resposta.status}` }));
            
            if (resposta.status === 401) {
                resultado.textContent = "Acesso negado. Token inválido.";
            } else if (resposta.status === 403) {
                resultado.textContent = "Limite de requisições atingido ou permissão negada.";
            } else {
                resultado.textContent = `Falha ao cadastrar: ${erroDados.message || erroDados.detail || erroDados.error || 'Erro desconhecido'}`;
            }
            return;
        }

        const dados = await resposta.json();

        resultado.innerHTML = `
            <h3>Tarefa Cadastrada</h3>
            <p> Usuário: ${dados.usuario || dadosParaCadastro.usuario} </p>
            <p> Tarefa: ${dados.tarefa || dadosParaCadastro.tarefa} </p>
            <p> Detalhes Tarefa: ${dados.detalhesTarefa || dadosParaCadastro.detalhesTarefa} </p>
            <p> Tag: ${dados.tag || dadosParaCadastro.tag} </p>
            <p> Tarefa Tag: ${dados.tarefaTag || dadosParaCadastro.tarefaTag} </p>
            `;
    } catch (error) {
        console.error("Erro de conexão:", error);
        resultado.textContent ="Erro de conexão com a API.";
    }
});