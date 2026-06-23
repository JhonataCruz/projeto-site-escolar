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
        abrirPagamento();
    }
}

// ── SISTEMA DE PAGAMENTO ──
let metodoSelecionado = null;

function abrirPagamento() {
    const modal = document.getElementById('pagamentoModal');
    if (modal) modal.classList.remove('modal-hidden');
}

function fecharPagamento() {
    const modals = ['pagamentoModal', 'pixModal', 'cartaoModal'];
    modals.forEach(id => {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('modal-hidden');
    });
    metodoSelecionado = null;
}

function abrirPix() {
    const modal = document.getElementById('pagamentoModal');
    if (modal) modal.classList.add('modal-hidden');
    const pixModal = document.getElementById('pixModal');
    if (pixModal) pixModal.classList.remove('modal-hidden');
    
    const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
    document.querySelector('.pix-value').textContent = `R$ ${total.toFixed(2)}`;
}

function abrirCartao(tipo) {
    metodoSelecionado = tipo;
    const modal = document.getElementById('pagamentoModal');
    if (modal) modal.classList.add('modal-hidden');
    const cartaoModal = document.getElementById('cartaoModal');
    if (cartaoModal) cartaoModal.classList.remove('modal-hidden');
    
    const title = document.getElementById('cartaoTitle');
    title.textContent = tipo === 'credito' ? 'Informações do Cartão de Crédito' : 'Informações do Cartão de Débito';
    
    const parcelDiv = document.getElementById('parcelamentoDiv');
    if (tipo === 'credito') {
        parcelDiv.style.display = 'block';
        atualizarParcelamento();
    } else {
        parcelDiv.style.display = 'none';
    }
}

function atualizarParcelamento() {
    const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
    const select = document.getElementById('parcelamento');
    select.innerHTML = '';
    
    for (let i = 1; i <= 10; i++) {
        const valorParcela = total / i;
        let juros = 0;
        let etiqueta = '';
        
        if (i <= 6) {
            etiqueta = `${i}x sem juros - R$ ${valorParcela.toFixed(2)}`;
        } else {
            juros = total * 0.20;
            const totalComJuros = total + juros;
            const parcelaComJuros = totalComJuros / i;
            etiqueta = `${i}x com juros - R$ ${parcelaComJuros.toFixed(2)} (Total: R$ ${totalComJuros.toFixed(2)})`;
        }
        
        const option = document.createElement('option');
        option.value = i;
        option.textContent = etiqueta;
        select.appendChild(option);
    }
    
    select.addEventListener('change', exibirInfoParcelamento);
    exibirInfoParcelamento();
}

function exibirInfoParcelamento() {
    const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
    const select = document.getElementById('parcelamento');
    const parcelas = parseInt(select.value);
    const info = document.getElementById('parcelamentoInfo');
    
    if (parcelas <= 6) {
        info.textContent = `✓ Sem juros - ${parcelas} parcelas de R$ ${(total / parcelas).toFixed(2)}`;
        info.style.color = '#2e7d32';
    } else {
        const juros = total * 0.20;
        const totalComJuros = total + juros;
        const parcelaComJuros = totalComJuros / parcelas;
        info.textContent = `⚠ Com 20% de juros - ${parcelas} parcelas de R$ ${parcelaComJuros.toFixed(2)} (Juros: R$ ${juros.toFixed(2)})`;
        info.style.color = '#dc2626';
    }
}

function validarCartao() {
    const numero = document.getElementById('numeroCartao').value.replace(/\s/g, '');
    const validade = document.getElementById('validade').value;
    const cvv = document.getElementById('cvv').value;
    const nome = document.getElementById('nomeTitular').value;
    
    if (numero.length !== 16 || !/^\d+$/.test(numero)) {
        alert('Número do cartão inválido!');
        return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(validade)) {
        alert('Validade no formato MM/AA inválido!');
        return false;
    }
    if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
        alert('CVV inválido!');
        return false;
    }
    if (nome.trim().length < 3) {
        alert('Nome do titular inválido!');
        return false;
    }
    return true;
}

function confirmarPagamento(tipo) {
    if (tipo === 'pix') {
        alert('PIX confirmado! Copie o número de PIX e envie o comprovante. ✓');
    } else if (tipo === 'cartao') {
        if (!validarCartao()) return;
        
        const parcelas = metodoSelecionado === 'credito' ? document.getElementById('parcelamento').value : 1;
        const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
        
        if (metodoSelecionado === 'credito' && parcelas > 6) {
            const juros = total * 0.20;
            alert(`Pagamento de ${parcelas}x confirmado!\nValor com 20% de juros: R$ ${(total + juros).toFixed(2)} ✓`);
        } else {
            alert(`Pagamento confirmado!\nValor: R$ ${total.toFixed(2)} ✓`);
        }
    }
    
    carrinho = [];
    salvarEAtualizar();
    fecharPagamento();
}

// Inicializar listeners de pagamento
document.addEventListener('DOMContentLoaded', function(){
    // Botão comprar
    const botaoComprar = document.getElementById('botao-comprar');
    if (botaoComprar) botaoComprar.addEventListener('click', btnComprar);
    
    // Fechar modals de pagamento
    const pagClose = document.getElementById('pagClose');
    const pagOverlay = document.getElementById('pagOverlay');
    const pixClose = document.getElementById('pixClose');
    const pixOverlay = document.getElementById('pixOverlay');
    const cartaoClose = document.getElementById('cartaoClose');
    const cartaoOverlay = document.getElementById('cartaoOverlay');
    
    if (pagClose) pagClose.addEventListener('click', fecharPagamento);
    if (pagOverlay) pagOverlay.addEventListener('click', fecharPagamento);
    if (pixClose) pixClose.addEventListener('click', () => { abrirPagamento(); document.getElementById('pixModal').classList.add('modal-hidden'); });
    if (pixOverlay) pixOverlay.addEventListener('click', () => { abrirPagamento(); document.getElementById('pixModal').classList.add('modal-hidden'); });
    if (cartaoClose) cartaoClose.addEventListener('click', () => { abrirPagamento(); document.getElementById('cartaoModal').classList.add('modal-hidden'); });
    if (cartaoOverlay) cartaoOverlay.addEventListener('click', () => { abrirPagamento(); document.getElementById('cartaoModal').classList.add('modal-hidden'); });
    
    // Métodos de pagamento
    const paymentBtns = document.querySelectorAll('.payment-btn');
    paymentBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            if (method === 'pix') abrirPix();
            else if (method === 'credito') abrirCartao('credito');
            else if (method === 'debito') abrirCartao('debito');
        });
    });
    
    // PIX
    const pixConfirm = document.getElementById('pixConfirm');
    const pixBack = document.getElementById('pixBack');
    if (pixConfirm) pixConfirm.addEventListener('click', () => confirmarPagamento('pix'));
    if (pixBack) pixBack.addEventListener('click', () => { abrirPagamento(); document.getElementById('pixModal').classList.add('modal-hidden'); });
    
    // Cartão
    const cartaoConfirm = document.getElementById('cartaoConfirm');
    const cartaoBack = document.getElementById('cartaoBack');
    if (cartaoConfirm) cartaoConfirm.addEventListener('click', () => confirmarPagamento('cartao'));
    if (cartaoBack) cartaoBack.addEventListener('click', () => { abrirPagamento(); document.getElementById('cartaoModal').classList.add('modal-hidden'); });
});

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
