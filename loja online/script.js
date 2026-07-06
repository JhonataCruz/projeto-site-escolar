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
const areaProdutos = document.getElementById("produtos");
// 3. Renderização da Vitrine de Produtos
// Mapeia o array de produtos transformando cada um card
function renderizarProdutos() {
    areaProdutos.innerHTML = produtos.map(produto => `
        <div class="card" data-id="${produto.id}">
            <div class="overlay-desc" data-id="${produto.id}">Descrição</div>
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p class="price">R$ ${produto.preco.toFixed(2)}</p>
            <button onclick="abrirEscolhaTamanho(${produto.id})">Adicionar</button>
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

    // --- Janelinha de tamanho do kimono ---
    const tamanhoClose = document.getElementById('tamanhoClose');
    const tamanhoOverlay = document.getElementById('tamanhoOverlay');
    const botoesTamanho = document.querySelectorAll('.btn-tamanho');
    const corClose = document.getElementById('corClose');
    const corOverlay = document.getElementById('corOverlay');

    if (tamanhoClose) tamanhoClose.addEventListener('click', () => fecharEscolhaTamanho(true));
    if (tamanhoOverlay) tamanhoOverlay.addEventListener('click', () => fecharEscolhaTamanho(true));
    if (corClose) corClose.addEventListener('click', fecharEscolhaCor);
    if (corOverlay) corOverlay.addEventListener('click', fecharEscolhaCor);

    // Cada botão A1, A2, A3, A4 abre a janelinha de cor em seguida
    botoesTamanho.forEach(btn => {
        btn.addEventListener('click', function() {
            const tamanho = this.getAttribute('data-tamanho');
            selecionarTamanho(tamanho);
        });
    });
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

// 4. Escolher tamanho e cor antes de adicionar no carrinho
let produtoPendente = null;
let tamanhoPendente = null;

function isKimonoITG(produto) {
    return produto && produto.nome.includes('ITG');
}

function coresDisponiveis(produto) {
    return isKimonoITG(produto) ? ['Branco', 'Azul', 'Preto'] : ['Branco', 'Azul'];
}

function calcularPrecoComCor(precoBase, cor) {
    if (cor === 'Azul') return Math.round(precoBase * 1.05 * 100) / 100;
    return precoBase;
}

// Abre a janelinha no meio da tela perguntando o tamanho
function abrirEscolhaTamanho(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    produtoPendente = produto;
    tamanhoPendente = null;

    const modal = document.getElementById('tamanhoModal');
    const titulo = document.getElementById('tamanhoTitulo');
    if (titulo) titulo.textContent = `Tamanho do ${produto.nome}`;
    if (modal) modal.classList.remove('modal-hidden');
}

function fecharEscolhaTamanho(limparProduto = true) {
    const modal = document.getElementById('tamanhoModal');
    if (modal) modal.classList.add('modal-hidden');
    if (limparProduto) {
        produtoPendente = null;
        tamanhoPendente = null;
    }
}

function selecionarTamanho(tamanho) {
    if (!produtoPendente) return;

    tamanhoPendente = tamanho;
    fecharEscolhaTamanho(false);
    abrirEscolhaCor();
}

function abrirEscolhaCor() {
    if (!produtoPendente || !tamanhoPendente) return;

    const modal = document.getElementById('corModal');
    const titulo = document.getElementById('corTitulo');
    const opcoes = document.getElementById('corOpcoes');
    const cores = coresDisponiveis(produtoPendente);

    if (titulo) titulo.textContent = `Cor do ${produtoPendente.nome} · ${tamanhoPendente}`;
    if (opcoes) {
        opcoes.innerHTML = cores.map(cor => {
            const extra = cor === 'Azul' ? ' (+5%)' : '';
            return `<button class="btn-cor btn-cor-${cor.toLowerCase()}" data-cor="${cor}">${cor}${extra}</button>`;
        }).join('');

        opcoes.querySelectorAll('.btn-cor').forEach(btn => {
            btn.addEventListener('click', function() {
                adicionarAoCarrinho(tamanhoPendente, this.getAttribute('data-cor'));
            });
        });
    }

    if (modal) modal.classList.remove('modal-hidden');
}

function fecharEscolhaCor() {
    const modal = document.getElementById('corModal');
    if (modal) modal.classList.add('modal-hidden');
    produtoPendente = null;
    tamanhoPendente = null;
}

function adicionarAoCarrinho(tamanho, cor) {
    if (!produtoPendente) return;

    const precoFinal = calcularPrecoComCor(produtoPendente.preco, cor);
    const item = {
        ...produtoPendente,
        tamanho,
        cor,
        preco: precoFinal
    };

    carrinho.push(item);
    fecharEscolhaCor();
    salvarEAtualizar();
}

// 5. Remover Item do Carrinho
function removerItem(index) {
    carrinho.splice(index, 1);
    salvarEAtualizar();
}

// 6. Atualizar a Interface do Carrinhp
function atualizarCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    lista.innerHTML = ""; // Limpa o HTML interno antigo para evitar duplicados

    // Percorre o carrinho atual e reconstrói a lista do HTML com os novos itens
    carrinho.forEach((item, index) => {
        const tamanhoTexto = item.tamanho ? `<span class="item-tamanho">${item.tamanho}</span>` : '';
        const corTexto = item.cor ? `<span class="item-cor item-cor-${item.cor.toLowerCase()}">${item.cor}</span>` : '';
        lista.innerHTML += `
            <li>
                <span class="item-info">
                    ${item.nome} ${tamanhoTexto} ${corTexto}
                    <small>R$ ${item.preco.toFixed(2)}</small>
                </span>
                <button onclick="removerItem(${index})">X</button>
            </li>
        `;
    });

    // Chama a função para recaalcular o valor financeiro
    atualizarTotal();
}

// 7. Calcular Valores de Tutal
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
    if (tipo === 'cartao') {
        if (!validarCartao()) return;
    }

    carrinho = [];
    salvarEAtualizar();
    fecharPagamento();
    abrirAvaliacao();
}

// --- Sistema de avaliação (aparece quando a compra termina) ---
let notaAvaliacao = 0;
let fotosAvaliacao = [];

function resetarAvaliacao() {
    notaAvaliacao = 0;
    fotosAvaliacao = [];

    const areaComentario = document.getElementById('areaComentario');
    const avaliacaoPrompt = document.getElementById('avaliacaoPrompt');
    const notaTexto = document.getElementById('notaEscolhida');
    const comentario = document.getElementById('comentarioAvaliacao');
    const inputFotos = document.getElementById('fotosAvaliacao');
    const uploadBox = document.getElementById('uploadBox');
    const preview = document.getElementById('previewFotos');

    if (notaTexto) notaTexto.textContent = '';
    if (comentario) comentario.value = '';
    if (inputFotos) inputFotos.value = '';
    if (uploadBox) uploadBox.innerHTML = '<span>Toque aqui ou arraste imagens</span>';
    if (preview) preview.innerHTML = '';
    if (areaComentario) {
        areaComentario.classList.remove('area-comentario--visible');
        areaComentario.classList.add('area-comentario--hidden');
        areaComentario.style.display = 'none';
    }
    if (avaliacaoPrompt) {
        avaliacaoPrompt.classList.remove('modal-hidden');
        avaliacaoPrompt.style.display = 'block';
    }
    document.querySelectorAll('.estrela').forEach(e => e.classList.remove('ativa'));
}

function abrirAvaliacao() {
    resetarAvaliacao();
    const modal = document.getElementById('avaliacaoModal');
    if (modal) modal.classList.remove('modal-hidden');
}

function escolherNota(nota) {
    notaAvaliacao = nota;
    pintarEstrelas(nota);

    const notaTexto = document.getElementById('notaEscolhida');
    const areaComentario = document.getElementById('areaComentario');
    const avaliacaoPrompt = document.getElementById('avaliacaoPrompt');

    if (notaTexto) notaTexto.textContent = `Você deu ${nota} estrela${nota > 1 ? 's' : ''}!`;
    if (areaComentario) {
        areaComentario.classList.remove('area-comentario--hidden');
        areaComentario.classList.add('area-comentario--visible');
        areaComentario.style.display = 'flex';
    }
    if (avaliacaoPrompt) {
        avaliacaoPrompt.classList.add('modal-hidden');
        avaliacaoPrompt.style.display = 'none';
    }
}

function fecharAvaliacao() {
    const modal = document.getElementById('avaliacaoModal');
    if (modal) modal.classList.add('modal-hidden');
    resetarAvaliacao();
}

function pintarEstrelas(nota) {
    document.querySelectorAll('.estrela').forEach(estrela => {
        const valor = Number(estrela.getAttribute('data-nota'));
        if (valor <= nota) estrela.classList.add('ativa');
        else estrela.classList.remove('ativa');
    });
}

function renderizarPreviewFotos() {
    const preview = document.getElementById('previewFotos');
    const uploadBox = document.getElementById('uploadBox');

    if (!preview) return;

    if (fotosAvaliacao.length === 0) {
        preview.innerHTML = '';
        if (uploadBox) uploadBox.innerHTML = '<span>Toque aqui ou arraste imagens</span>';
        return;
    }

    preview.innerHTML = fotosAvaliacao.map((foto, index) => `
        <div class="preview-item">
            <img src="${foto.url}" alt="Foto ${index + 1}">
            <button type="button" class="preview-remove" data-index="${index}" aria-label="Remover imagem">×</button>
        </div>
    `).join('');

    if (uploadBox) {
        uploadBox.innerHTML = `<span>${fotosAvaliacao.length} foto${fotosAvaliacao.length > 1 ? 's' : ''} pronta${fotosAvaliacao.length > 1 ? 's' : ''}</span>`;
    }

    preview.querySelectorAll('.preview-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = Number(this.getAttribute('data-index'));
            fotosAvaliacao.splice(index, 1);
            renderizarPreviewFotos();
        });
    });
}

function tratarArquivosSelecionados(files) {
    const arquivosValidos = Array.from(files || [])
        .filter(file => file.type.startsWith('image/'))
        .slice(0, 4 - fotosAvaliacao.length);

    if (arquivosValidos.length === 0) return;

    const novasFotos = arquivosValidos.map(file => ({
        file,
        url: URL.createObjectURL(file)
    }));

    fotosAvaliacao = [...fotosAvaliacao, ...novasFotos].slice(0, 4);
    renderizarPreviewFotos();
}

function configurarUploadAvaliacao() {
    const input = document.getElementById('fotosAvaliacao');
    const uploadBox = document.getElementById('uploadBox');

    if (!input || !uploadBox) return;

    uploadBox.addEventListener('click', () => input.click());
    uploadBox.addEventListener('dragover', (event) => {
        event.preventDefault();
        uploadBox.classList.add('dragover');
    });
    uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('dragover');
    });
    uploadBox.addEventListener('drop', (event) => {
        event.preventDefault();
        uploadBox.classList.remove('dragover');
        tratarArquivosSelecionados(event.dataTransfer.files);
    });
    input.addEventListener('change', () => {
        tratarArquivosSelecionados(input.files);
    });
}

function enviarAvaliacao() {
    if (notaAvaliacao < 1) {
        alert('Escolha ao menos uma estrela antes de enviar sua avaliação.');
        return;
    }

    const comentario = document.getElementById('comentarioAvaliacao').value.trim();
    let msg = `Obrigado pela avaliação de ${notaAvaliacao} estrela${notaAvaliacao > 1 ? 's' : ''}!`;
    if (comentario) msg += '\nSeu comentário foi registrado.';
    if (fotosAvaliacao.length > 0) {
        msg += `\n${fotosAvaliacao.length} foto${fotosAvaliacao.length > 1 ? 's' : ''} anexada${fotosAvaliacao.length > 1 ? 's' : ''}.`;
    }
    alert(msg);
    fecharAvaliacao();
}

// inicializa de pagamento
document.addEventListener('DOMContentLoaded', function(){
    // Botão comprar
    const botaoComprar = document.getElementById('botao-comprar');
    if (botaoComprar) botaoComprar.addEventListener('click', btnComprar);
    
    // Fechar modal de pagamento
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
    
    // metodos de pagamento
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

    // Avaliação depois da compra
    const avaliacaoClose = document.getElementById('avaliacaoClose');
    const avaliacaoOverlay = document.getElementById('avaliacaoOverlay');
    const estrelas = document.querySelectorAll('.estrela');
    const enviarBtn = document.getElementById('enviarAvaliacao');

    configurarUploadAvaliacao();

    if (avaliacaoClose) avaliacaoClose.addEventListener('click', fecharAvaliacao);
    if (avaliacaoOverlay) avaliacaoOverlay.addEventListener('click', fecharAvaliacao);

    estrelas.forEach(estrela => {
        estrela.addEventListener('click', function() {
            escolherNota(Number(this.getAttribute('data-nota')));
        });
        // preview ao passar o mouse 
        estrela.addEventListener('mouseenter', function() {
            pintarEstrelas(Number(this.getAttribute('data-nota')));
        });
    });

    const containerEstrelas = document.getElementById('estrelasAvaliacao');
    if (containerEstrelas) {
        containerEstrelas.addEventListener('mouseleave', function() {
            if (notaAvaliacao > 0) pintarEstrelas(notaAvaliacao);
            else document.querySelectorAll('.estrela').forEach(e => e.classList.remove('ativa'));
        });
    }

    if (enviarBtn) enviarBtn.addEventListener('click', enviarAvaliacao);
});

// 8. Persistência de Dados e Sincronização
function salvarEAtualizar() {
    // Converte o array para texto JSON e salva no armazenamento local do navegador
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    // re desenha o carrinho
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
        labelTema.textContent = ' o contrário de preto*';
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
