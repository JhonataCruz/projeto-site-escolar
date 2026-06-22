// 1. Inicialização do Estado
// Tenta buscar o carrinho salvo no LocalStorage. Se não existir, inicia como um array vazio [].
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// 2. Banco de Dados Simulado
// Array de objetos representando os produtos disponíveis na loja (com descrições)
const produtos = [
    { id: 1, nome: "Kimono Adidas",        preco: 999,  imagem: "imagens/adidas.jpg", descricao: "Kimono leve, ideal para treinos e competições; tecido respirável e corte clássico." },
    { id: 2, nome: "Kimono ITG",           preco: 380,  imagem: "imagens/itg.jpg", descricao: "Modelo resistente com reforços nas costuras; ótimo custo-benefício para iniciantes." },
    { id: 3, nome: "Kimono Nagashima",     preco: 690,  imagem: "imagens/nagashima.jpg", descricao: "Acabamento premium, tecido encorpado e durável; recomendado para praticantes regulares." },
    { id: 4, nome: "Kimono Sakura (Approved)", preco: 1600, imagem: "imagens/sakura.jpg", descricao: "Edição especial com bordados e forro reforçado; visual elegante para apresentações." }
];

// Captura a seção do HTML onde os produtos serão inseridos
const areaProdutos = document.getElementById("produtos");

// 3. Renderização da Vitrine de Produtos
// Mapeia o array de produtos transformando cada um em um bloco HTML (card)
function renderizarProdutos() {
    areaProdutos.innerHTML = produtos.map(produto => `
        <div class="card" data-id="${produto.id}">
            <div class="overlay-desc" data-id="${produto.id}">Descrição</div>
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p class="price">R$ ${produto.preco.toFixed(2)}</p>
            <button onclick="adicionarCarrinho(${produto.id})">Adicionar</button>
        </div>
    `).join(""); // O .join("") remove as vírgulas geradas pelo método .map()
}

// Executa a função imediatamente para desenhar a vitrine na tela
renderizarProdutos();

// Anima os kamono com delay para ficar mais bonito
function animarProdutos(){
    const cards = document.querySelectorAll('#produtos .card');
    cards.forEach((c, i) => {
        c.style.animationDelay = (i * 80) + 'ms';
        // pequenos atrasos internos para preço e botão
        const price = c.querySelector('p');
        const btn = c.querySelector('button');
        if (price) price.style.animationDelay = (i * 80 + 120) + 'ms';
        if (btn) btn.style.animationDelay = (i * 80 + 180) + 'ms';
        c.classList.add('animate-in');
    });
}

document.addEventListener('DOMContentLoaded', function(){
    // caso os produtos já tenham sido renderizados
    setTimeout(animarProdutos, 60);
    
    // abre a janelinha quando clica nos botoes 
    const area = document.getElementById('produtos');
    area.addEventListener('click', function(e){
        const overlay = e.target.closest('.overlay-desc');
        const card = e.target.closest('.card');
        if (overlay || (card && !e.target.matches('button'))){
            const id = Number((overlay || card).getAttribute('data-id'));
            abrirDescricao(id);
        }
    });

    const fechar = document.getElementById('descClose');
    const overlayModal = document.getElementById('descOverlay');
    if (fechar) fechar.addEventListener('click', fecharDescricao);
    if (overlayModal) overlayModal.addEventListener('click', fecharDescricao);
});

function abrirDescricao(id){
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;
    const modal = document.getElementById('descricaoModal');
    const titulo = document.getElementById('descTitulo');
    const texto = document.getElementById('descTexto');
    titulo.textContent = produto.nome;
    texto.textContent = produto.descricao;
    if (modal) modal.classList.remove('modal-hidden');
}

function fecharDescricao(){
    const modal = document.getElementById('descricaoModal');
    if (modal) modal.classList.add('modal-hidden');
}

// 4. Adicionar Item ao Carrinho
function adicionarCarrinho(id) {
    // Procura no "banco de dados" o produto que possui o ID clicado
    const produto = produtos.find(p => p.id === id);
    // Adiciona uma cópia do produto ao array do carrinho
    carrinho.push(produto);
    // Dispara a rotina de salvamento e atualização visual
    salvarEAtualizar();
}

// 5. Remover Item do Carrinho
function removerItem(index) {
    // Remove 1 item do array com base no seu índice de posição
    carrinho.splice(index, 1);
    // Dispara a rotina de salvamento e atualização visual
    salvarEAtualizar();
}

// 6. Atualizar a Interface do Carrinho
function atualizarCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    lista.innerHTML = ""; // Limpa o HTML interno antigo para evitar duplicados

    // Percorre o carrinho atual e reconstrói a lista do HTML com os novos itens
    carrinho.forEach((item, index) => {
        lista.innerHTML += `
            <li>
                ${item.nome} - R$ ${item.preco.toFixed(2)}
                <button onclick="removerItem(${index})">X</button>
            </li>
        `;
    });

    // Chama a função para recalcular o valor financeiro total
    atualizarTotal();
}

// 7. Calcular Valores de Totalização
function atualizarTotal() {
    // Usa o .reduce() para somar a propriedade 'preco' de todos os itens do carrinho
    const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
    
    // Atualiza os textos do HTML com duas casas decimais fixas (.toFixed(2))
    document.getElementById("total").textContent = total.toFixed(2);
    // Atualiza a bolinha de quantidade de itens no cabeçalho
    document.getElementById("quantidade").textContent = carrinho.length;
}
// BOTAO DE FORTALECIMENTO (NÃO FUNCIONA AINDA, MAS VAI FUNCIONAR UM DIA)
function atualizarBotaoComprar() {
    const botao = document.getElementById('botao-comprar');
    if (!botao) return;
    botao.style.display = carrinho.length > 0 ? 'block' : 'none';
}

function btnComprar() {
    if (carrinho.length > 0) {
        alert('Pedido finalizado com sucesso!');
    }
}

// 8. Persistência de Dados e Sincronização
function salvarEAtualizar() {
    // Converte o array para texto JSON e salva no armazenamento local do navegador
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    // Redesenha o carrinho na interface visual
    atualizarCarrinho();
    atualizarBotaoComprar();
}

// 9. Inicialização da Interface
// Ao carregar ou recarregar a página, lê o que estava no LocalStorage e exibe em tela
atualizarCarrinho();
atualizarBotaoComprar();

// 10. o contrario de branco (no caso o preto kkk) Adicionado a partir do código do menu reutilizável
const checkbox = document.getElementById('temaChecbox');
const labelTema = document.getElementById('labelTema');

checkbox.addEventListener('change', function(){
    if(checkbox.checked){
        document.body.classList.add('dark-mode');
        localStorage.setItem('temaEscuro', 'ativado');
        labelTema.textContent = ' o contrário de preto';
    }else{
         document.body.classList.remove('dark-mode');
         localStorage.setItem('temaEscuro', 'desativado');
         labelTema.textContent = ' o contrário de branco';
    }
});

// Restaura o contrário de branco ao carregar a página se estava ativado
if(localStorage.getItem('temaEscuro') === 'ativado'){
    checkbox.checked = true;
    document.body.classList.add('dark-mode');
    labelTema.textContent = ' o contrário de preto';
}
