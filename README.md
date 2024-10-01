<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galeria de Imagens da NASA</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f0f0;
        }
        h1 {
            text-align: center;
            color: #333;
        }
        #filtro {
            margin-bottom: 20px;
            text-align: center;
        }
        #filtro input {
            padding: 5px;
            width: 300px;
        }
        #listaImagens {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }
        .imagem-item {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: transform 0.3s ease;
        }
        .imagem-item:hover {
            transform: translateY(-5px);
        }
        .imagem-item img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .imagem-item h3 {
            padding: 10px;
            margin: 0;
            font-size: 16px;
        }
        .imagem-item p {
            padding: 0 10px 10px;
            margin: 0;
            font-size: 14px;
            color: #666;
        }
        .favorito-btn {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 5px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin: 10px;
            cursor: pointer;
            border-radius: 4px;
        }
        .favorito-btn.favoritado {
            background-color: #f44336;
        }
        #carregarMais {
            display: block;
            margin: 20px auto;
            padding: 10px 20px;
            background-color: #008CBA;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>Galeria de Imagens da NASA</h1>
    <div id="filtro">
        <input type="text" id="filtroInput" placeholder="Filtrar por título...">
    </div>
    <div id="listaImagens"></div>
    <button id="carregarMais">Carregar Mais</button>

    <script>
        const apiKey = 'DEMO_KEY'; 
        const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=20`;
        let todasImagens = [];
        let imagensExibidas = [];
        let pagina = 20;
        const imagensPorPagina = Infinity;

        
        async function carregarImagens() {
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                todasImagens = todasImagens.concat(data);
                exibirImagens();
            } catch (error) {
                console.error('Erro ao carregar imagens:', error);
            }
        }

        
        function exibirImagens() {
            const listaImagens = document.getElementById('listaImagens');
            const startIndex = (pagina - 1) * imagensPorPagina;
            const endIndex = startIndex + imagensPorPagina;
            imagensExibidas = todasImagens.slice(0, endIndex);

            imagensExibidas.forEach(imagem => {
                if (!document.getElementById(`imagem-${imagem.date}`)) {
                    const imagemItem = criarElementoImagem(imagem);
                    listaImagens.appendChild(imagemItem);
                }
            });

            if (imagensExibidas.length >= todasImagens.length) {
                document.getElementById('carregarMais').style.display = 'none';
            }
        }

        
        function criarElementoImagem(imagem) {
            const imagemItem = document.createElement('div');
            imagemItem.className = 'imagem-item';
            imagemItem.id = `imagem-${imagem.date}`;

            const img = document.createElement('img');
            img.src = imagem.url;
            img.alt = imagem.title;

            const title = document.createElement('h3');
            title.textContent = imagem.title;

            const date = document.createElement('p');
            date.textContent = `Data: ${imagem.date}`;

            const favoriteBtn = document.createElement('button');
            favoriteBtn.className = 'favorito-btn';
            favoriteBtn.textContent = 'Favoritar';
            favoriteBtn.onclick = () => alternarFavorito(imagem);

            imagemItem.appendChild(img);
            imagemItem.appendChild(title);
            imagemItem.appendChild(date);
            imagemItem.appendChild(favoriteBtn);

            imagemItem.onclick = () => mostrarDetalhes(imagem);

            return imagemItem;
        }

        
        function mostrarDetalhes(imagem) {
            const imagemItem = document.getElementById(`imagem-${imagem.date}`);
            const descricaoExistente = imagemItem.querySelector('.descricao');

            if (descricaoExistente) {
                descricaoExistente.remove();
            } else {
                const descricao = document.createElement('p');
                descricao.className = 'descricao';
                descricao.textContent = imagem.explanation;
                imagemItem.appendChild(descricao);
            }
        }

        
        function alternarFavorito(imagem) {
            let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
            const index = favoritos.findIndex(fav => fav.date === imagem.date);

            if (index === -1) {
                favoritos.push(imagem);
                document.getElementById(`imagem-${imagem.date}`).querySelector('.favorito-btn').classList.add('favoritado');
            } else {
                favoritos.splice(index, 1);
                document.getElementById(`imagem-${imagem.date}`).querySelector('.favorito-btn').classList.remove('favoritado');
            }

            localStorage.setItem('favoritos', JSON.stringify(favoritos));
        }

        
        function filtrarImagens() {
            const valorFiltro = document.getElementById('filtroInput').value.toLowerCase();
            const listaImagens = document.getElementById('listaImagens');
            listaImagens.innerHTML = '';

            const imagensFiltradas = todasImagens.filter(imagem => 
                imagem.title.toLowerCase().includes(valorFiltro)
            );

            imagensFiltradas.forEach(imagem => {
                const imagemItem = criarElementoImagem(imagem);
                listaImagens.appendChild(imagemItem);
            });
        }

        
        document.getElementById('filtroInput').addEventListener('input', filtrarImagens);

        
        document.getElementById('carregarMais').addEventListener('click', () => {
            pagina++;
            carregarImagens();
        });

        
        function carregarFavoritos() {
            const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
            favoritos.forEach(fav => {
                const imagemItem = document.getElementById(`imagem-${fav.date}`);
                if (imagemItem) {
                    imagemItem.querySelector('.favorito-btn').classList.add('favoritado');
                }
            });
        }

        // Inicialização
        carregarImagens().then(() => {
            carregarFavoritos();
        });

        // Implementação do scroll infinito
        window.addEventListener('scroll', () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                if (imagensExibidas.length < todasImagens.length) {
                    pagina++;
                    exibirImagens();
                }
            }
        });
    </script>
</body>
</html>
