let carrinho = [];
let contadorCarrinho = 0;

function abrirModalConfirmacao(produto, preco) {
    document.getElementById('produtoModal').textContent = produto;
    document.getElementById('precoModal').textContent = preco;
    document.getElementById('modalConfirmacao').setAttribute('data-produto', produto);
    document.getElementById('modalConfirmacao').setAttribute('data-preco', preco);
    let modal = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
    modal.show();
}

function confirmarAdicao() {
    let produto = document.getElementById('modalConfirmacao').getAttribute('data-produto');
    let preco = parseFloat(document.getElementById('modalConfirmacao').getAttribute('data-preco'));
    carrinho.push({ produto, preco });
    contadorCarrinho++;
    document.getElementById('contadorCarrinho').textContent = contadorCarrinho;
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    let modal = bootstrap.Modal.getInstance(document.getElementById('modalConfirmacao'));
    modal.hide();
}

function carregarCarrinho() {
    // Corrigido para usar a variável global `carrinho` sem sobrescrevê-la.
    carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let carrinhoTabela = document.getElementById('carrinhoTabela');
    let totalPreco = 0;
    let detalhesCompra = [];

    carrinhoTabela.innerHTML = '';
    carrinho.forEach((item, index) => {
        carrinhoTabela.innerHTML += `
            <tr>
                <td>${item.produto}</td>
                <td>${item.preco}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removerItem(${index})">Remover</button>
                </td>
            </tr>
        `;
        totalPreco += item.preco;
        detalhesCompra.push(`${item.produto} - ${item.preco} MZN`);
    });

    document.getElementById('totalPreco').textContent = totalPreco;

    const mensagemWhatsApp = `
        Olá, Alfredo! Gostaria de finalizar a compra com os seguintes itens:\n
        ${detalhesCompra.join('\n')}
        
        Total: ${totalPreco} MZN
    `.trim().replace(/\n/g, '%0A'); // Substitui novas linhas por %0A para URL

    const whatsappLink = `https://api.whatsapp.com/send?phone=+258844465042&text=${mensagemWhatsApp}`;
    document.getElementById('finalizarCompraBtn').setAttribute('href', whatsappLink);
}

function removerItem(index) {
    carrinho.splice(index, 1); // Remove o item pelo índice
    localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Atualiza o localStorage
    carregarCarrinho(); // Recarrega o carrinho após remover o item
    document.getElementById('contadorCarrinho').textContent = carrinho.length; // Atualiza o contador
}

// Carrega o carrinho ao carregar a página
window.onload = carregarCarrinho;
