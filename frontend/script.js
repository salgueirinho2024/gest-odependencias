document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroForm');
    const pendenciasList = document.getElementById('pendenciasList');
    const editModal = document.getElementById('editModal');
    const closeModalBtn = document.querySelector('.close');
    const editForm = document.getElementById('editForm');

    let editIndex = -1;  // Índice do item a ser editado

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const empresa = document.getElementById('empresa').value;
            const pendencia = document.getElementById('pendencia').value;
            const categoria = document.getElementById('categoria').value;
            const imagem = document.getElementById('imagem').files[0];

            const reader = new FileReader();
            reader.onload = function() {
                const imagemData = reader.result;
                adicionarPendencia(empresa, pendencia, categoria, imagemData);
                salvarPendencias();
                cadastroForm.reset();
            };
            if (imagem) {
                reader.readAsDataURL(imagem);
            } else {
                adicionarPendencia(empresa, pendencia, categoria, null);
                salvarPendencias();
                cadastroForm.reset();
            }
        });
    }

    function adicionarPendencia(empresa, pendencia, categoria, imagemData) {
        const pendenciaItem = document.createElement('div');
        pendenciaItem.classList.add('pendencia-item');
        pendenciaItem.innerHTML = `
            <h3>${empresa}</h3>
            <p>${pendencia}</p>
            <p><strong>Categoria:</strong> ${categoria}</p>
            ${imagemData ? `<img src="${imagemData}" alt="Imagem da Pendência">` : ''}
            <button class="edit">Editar</button>
            <button class="delete">Excluir</button>
        `;
        pendenciasList.appendChild(pendenciaItem);

        // Adicionar eventos de edição e exclusão
        pendenciaItem.querySelector('.edit').addEventListener('click', () => abrirModalEdicao(pendenciaItem));
        pendenciaItem.querySelector('.delete').addEventListener('click', () => excluirPendencia(pendenciaItem));
    }

    function abrirModalEdicao(pendenciaItem) {
        editIndex = Array.from(pendenciasList.children).indexOf(pendenciaItem);
        const empresa = pendenciaItem.querySelector('h3').innerText;
        const pendencia = pendenciaItem.querySelector('p:nth-of-type(1)').innerText;
        const categoria = pendenciaItem.querySelector('p:nth-of-type(2)').innerText.replace('Categoria: ', '');

        document.getElementById('editEmpresa').value = empresa;
        document.getElementById('editPendencia').value = pendencia;
        document.getElementById('editCategoria').value = categoria;

        editModal.style.display = 'block';
    }

    closeModalBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == editModal) {
            editModal.style.display = 'none';
        }
    });

    editForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const empresa = document.getElementById('editEmpresa').value;
        const pendencia = document.getElementById('editPendencia').value;
        const categoria = document.getElementById('editCategoria').value;
        const imagem = document.getElementById('editImagem').files[0];

        const reader = new FileReader();
        reader.onload = function() {
            const imagemData = reader.result;
            atualizarPendencia(editIndex, empresa, pendencia, categoria, imagemData);
            salvarPendencias();
            editModal.style.display = 'none';
            editForm.reset();
        };
        if (imagem) {
            reader.readAsDataURL(imagem);
        } else {
            atualizarPendencia(editIndex, empresa, pendencia, categoria, null);
            salvarPendencias();
            editModal.style.display = 'none';
            editForm.reset();
        }
    });

    function atualizarPendencia(index, empresa, pendencia, categoria, imagemData) {
        const pendenciaItem = pendenciasList.children[index];
        pendenciaItem.innerHTML = `
            <h3>${empresa}</h3>
            <p>${pendencia}</p>
            <p><strong>Categoria:</strong> ${categoria}</p>
            ${imagemData ? `<img src="${imagemData}" alt="Imagem da Pendência">` : ''}
            <button class="edit">Editar</button>
            <button class="delete">Excluir</button>
        `;
        pendenciaItem.querySelector('.edit').addEventListener('click', () => abrirModalEdicao(pendenciaItem));
        pendenciaItem.querySelector('.delete').addEventListener('click', () => excluirPendencia(pendenciaItem));
    }

    function excluirPendencia(pendenciaItem) {
        pendenciaItem.remove();
        salvarPendencias();
    }

    function salvarPendencias() {
        const pendencias = [];
        document.querySelectorAll('.pendencia-item').forEach(item => {
            const empresa = item.querySelector('h3').innerText;
            const pendencia = item.querySelector('p:nth-of-type(1)').innerText;
            const categoria = item.querySelector('p:nth-of-type(2)').innerText.replace('Categoria: ', '');
            const imagem = item.querySelector('img') ? item.querySelector('img').src : null;
            pendencias.push({ empresa, pendencia, categoria, imagem });
        });

        // Salvar no backend
        fetch('http://localhost:3000/pendencias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pendencias)
        }).then(response => response.text())
          .then(data => console.log(data))
          .catch(error => console.error('Error:', error));
    }

    function carregarPendencias() {
        fetch('http://localhost:3000/pendencias')
            .then(response => response.json())
            .then(pendencias => {
                pendencias.forEach(p => adicionarPendencia(p.empresa, p.pendencia, p.categoria, p.imagem));
            });
    }

    carregarPendencias();
});
