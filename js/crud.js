// pegando os dados dos usuários
let usuarios = users;
//Define o id de um novo usuario ao ser inserido na lista
let novoid = usuarios.length + 1;

//Gera HTML da tabela de usuários
function gerarTabelaUsuarios() {

    let tab = document.getElementById("tab");
    //Se existir uma tabela antiga exclui  
    if (tab){
        tab.remove();
    }

    // criando a tabela
    let tabela = document.createElement("table");
    tabela.setAttribute("id", "tab");

    //criando o cabeçalho da tabela
    let cabecalho = tabela.createTHead();
    let linhaCabecalho = cabecalho.insertRow();

    //pega o nome das chave do objeto json(colunas da tabela)
    let chaves = Object.keys(usuarios[0]);
    let colunas = chaves;
    colunas.forEach(coluna => {
        let th = document.createElement('th');
        th.textContent = coluna;
        linhaCabecalho.appendChild(th);
    });

    // criando o corpo da tabela
    let corpo = tabela.createTBody();
    usuarios.forEach(usuario => {
        let linha = corpo.insertRow();
        Object.values(usuario).forEach(valor => {
            let cell = linha.insertCell();
            cell.textContent = valor;
        });
    });
    let divtab = document.getElementById("divtab");
    divtab.appendChild(tabela);
}

//Adiciona na tabela a coluna no CRUD
function adicionarColunaCRUD() {
    const btns = ["Editar", "Excluir"];
    let tabela = document.getElementById("tab");
    let thead = tabela.getElementsByTagName("thead")[0];
    let tbody = tabela.getElementsByTagName("tbody")[0];

    //Adiciona o cabeçalho da nova coluna CRUD
    let novaCelulaCabecalho = document.createElement("th");
    novaCelulaCabecalho.textContent = "CRUD";
    thead.rows[0].appendChild(novaCelulaCabecalho);

    //Cria os botões e as linhas da tabela
    for (i = 0; i < tbody.rows.length; i++) {
        let novaCelula = tbody.rows[i].insertCell(-1);

        btns.forEach(btn => {
            const botao = document.createElement("button");
            if (btn == "Editar") {
                botao.setAttribute("onclick", "editarLinha(this)")
            } else {
                botao.setAttribute("onclick", "excluirUsuarios(this)")
            }
            botao.textContent = btn;
            novaCelula.appendChild(botao);
        });
    }
}

//Limpa os inputs do form
function limparFormulario() {
    //Pega todos os inputs do form
    const inputs = document.querySelectorAll('input');

    //itera pelo array de inputs limpando o campo
    inputs.forEach(input => {
        input.value = "";
    });
}

//Captura o usuário da linha em que o botão foi clicado
function editarLinha(button) {
    //Pega a tr da linha do botão clicado
    const linha = button.closest("tr");

    //Pega todas as células da linha
    const colunas = linha.getElementsByTagName("td");

    //Cria um objeto json para transferir os dados do usuário]
    const user = {
        id: colunas[0].textContent,
        nome: colunas[1].textContent,
        email: colunas[2].textContent,
        cidade: colunas[3].textContent,
        telefone: colunas[4].textContent
    };

    console.log(user);
    jsonToForm(user);

    //Posiciona a pagina com scroll mostrando o form 
    var section = document.querySelector(".container");
    //Rola a tela lentamente para cima
    section.scrollIntoView({behavior:'smooth'});
}

//Atualizar a tabela e a coluna do CRUD
function atualizaTabela(){
    //Limpa os input do form 
    limparFormulario();
    //Chama a função que gera a tabela novamente quado o array de usuarios é atualizado
    gerarTabelaUsuarios();
    //Chama a função que adiciona a coluna do CRUD
    adicionarColunaCRUD();
}

//Tranfere os dados da linha da tabela para o form
function jsonToForm(user) {
    for (const key in user) {
        const input = document.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = user[key];
        }
    }
}

//Transfere os dados do formulário para um user json
//Transfere o user para o array de usuários
//Atualiza os dados da Tabela
function formToJSON(event){
    event.preventDefault();

    let user = {id: "", nome: "", email: "", cidade: "", telefone: ""}

    //Seleciona todos os inputs do form
    const inputs = document.querySelectorAll('input');

    //Pega os valores dos inputs e transfere para o ojeto Json user
    inputs.forEach(input => {
        user[input.name] = input.value;
    });
    
    if(user.id != ""){
        let index = usuarios.findIndex(usuario => usuario.id === user.id)

        if(index !== -1){
            usuarios[index] = user;
        }
    }else{
        inserirUsuario
    }

    console.log(user);

    atualizaTabela();

}

//Insere o usuario no array json
function inserirUsuario(user){
    user.id = novoid.toString();
    novoid += 1;
    usuarios.push(user);
}

//Exclui o usuario da linha em que o button for clicado na tabela 
function excluirUsuarios(button){
    //Pega a linha em que o botão foi clicado
    const linha = button.closest('tr');
    //Pega todas as colunas da linha 
    const colunas = linha.getElementsByTagName('td');
    //Pega o id do Usuario
    const userId = colunas[0].textContent;
    //Percorre o array de usuarios para encontrar o usuario pelo ID
    const index = usuarios.findIndex(user => user.id === userId);
    console.log("Excluindo: " + index);
    
    if(index !== -1){
        usuarios.splice(index, 1);
        atualizaTabela();
        console.log(`Usuário com id ${userId} excluído com sucesso.`)
    }
    else{
        console.log(`Usuário com id ${userId} não encontrado.`)
    }
}