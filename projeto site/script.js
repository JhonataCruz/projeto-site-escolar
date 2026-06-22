// 1. Função que cria a estrutura HTML de um botão do menu
function criarBotaoMenu(texto, link){
    return ` 
        <a href="${link}" class="botao-menu">
            ${texto}
        </a>
    `;
}

// Captura a tag <nav id="menu"> do HTML
const menu = document.getElementById("menu");

// Insere os botões dentro do menu automaticamente em qualquer página que use este script
menu.innerHTML += criarBotaoMenu("Início", "index.html");
menu.innerHTML += criarBotaoMenu("Contato", "contato.html");
menu.innerHTML += criarBotaoMenu("🛍️ Loja de Kimonos", "../loja online/index.html");
menu.innerHTML += ` <a href="#" class="botao-menu" id="provadorBtn">Provador</a>`;

// animação curta antes de seguir para a lojinha
document.addEventListener('click', function(e){
    const lojaLink = document.querySelector('#menu a[href="../loja online/index.html"]');
    if (!lojaLink) return;
    if (e.target === lojaLink || e.target.closest('#menu a[href="../loja online/index.html"]')){
        e.preventDefault();
        lojaLink.classList.add('click-animate');
        const href = lojaLink.getAttribute('href');
        setTimeout(() => { window.location.href = href; }, 240);
    }
});

// --- Logics do Provador ---
function sugestaoKimono(altura, peso){
    altura = Number(altura);
    peso = Number(peso);
    if (!altura || !peso) return null;

    if (altura <= 165 && peso <= 75) return 'A1';
    if (altura <= 175 && peso <= 85) return 'A2';
    if (altura <= 185 && peso <= 100) return 'A3';
    return 'A4';
}

// Abre a janelinha
function abrirProvador(){
    const modal = document.getElementById('provadorModal');
    if (modal) modal.classList.remove('modal-hidden');
}

// Fecha a janelinha e limpa os campinhos
function fecharProvador(){
    const modal = document.getElementById('provadorModal');
    const resultado = document.getElementById('resultadoProvador');
    if (modal) modal.classList.add('modal-hidden');
    if (resultado) resultado.textContent = '';
    const alturaInput = document.getElementById('alturaInput');
    const pesoInput = document.getElementById('pesoInput');
    if (alturaInput) alturaInput.value = '';
    if (pesoInput) pesoInput.value = '';
}

document.addEventListener('click', function(e){
    const provadorBtn = document.getElementById('provadorBtn');
    if (provadorBtn && e.target === provadorBtn) {
        e.preventDefault();
        abrirProvador();
    }
});

document.addEventListener('DOMContentLoaded', function(){
    const fechar = document.getElementById('provadorClose');
    const overlay = document.getElementById('provadorOverlay');
    const calcular = document.getElementById('calcularBtn');

    if (fechar) fechar.addEventListener('click', fecharProvador);
    if (overlay) overlay.addEventListener('click', fecharProvador);
    if (calcular) calcular.addEventListener('click', function(){
        const altura = document.getElementById('alturaInput').value;
        const peso = document.getElementById('pesoInput').value;
        const resultado = document.getElementById('resultadoProvador');
        const tamanho = sugestaoKimono(altura, peso);
        if (!tamanho){
            resultado.textContent = 'mlk burro coloca esse negocio direito ai';
            return;
        }
        resultado.textContent = `Teu Tamanho:  ${tamanho}`;
    });
});
