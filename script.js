

    const apiKey = 'DEMO_KEY'; 
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=10`; // Reduzido para 10 para facilitar o carregamento
    let todasImagens = [];
    let imagensExibidas = 0;
    const imagensPorPagina = 10; // Definir um número realista para carregamento por página

    // Função para carregar imagens da API
    async function carregarImagens() {
        try {
            const response = await fetch(`${apiUrl}&start_date=2023-01-01`); // Exemplo de como filtrar por data
            const data = await response.json();
            todasImagens = todasImagens.concat(data);
            exibirImagens();
        } catch (error) {
            console.error('Erro ao carregar imagens:', error);
        }
    }

    // Função para exibir imagens
    function exibirImagens() {
        const listaImagens = document.getElementById('listaImagens');
        const imagensParaExibir = todasImagens.slice(imagensExibidas, imagensExibidas + imagensPorPagina);
        imagensParaExibir.forEach(imagem => {
            const imagemItem = criarElementoImagem(imagem);
            listaImagens.appendChild(imagemItem);
        });
        imagensExibidas += imagensParaExibir.length; // Atualiza o contador de imagens exibidas
        if (imagensExibidas >= todasImagens.length) {
            document.getElementById('carregarMais').style.display = 'none';
        }
    }

    // As outras funções permanecem inalteradas...

    // Event listener para carregar mais imagens ajustado para a nova lógica
    document.getElementById('carregarMais').addEventListener('click', exibirImagens);

    // Inicialização
    carregarImagens();

    // Implementação do scroll infinito ajustada para a nova lógica
    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && imagensExibidas < todasImagens.length) {
            exibirImagens();
        }
    });

