// script.js - Código JavaScript para validar e processar cadastro de alunos

// Função para validar o formulário de cadastro
function validarFormulario() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const dataNascimento = document.getElementById('dataNascimento').value;
    const curso = document.getElementById('curso').value;
    const telefone = document.getElementById('telefone').value.trim();

    if (nome.length < 3) {
        alert('Por favor, insira um nome válido com pelo menos 3 caracteres.');
        return false;
    }

    // Validação simples de e-mail usando regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return false;
    }

    if (!dataNascimento) {
        alert('Por favor, selecione a data de nascimento.');
        return false;
    }

    const hoje = new Date();
    const dataNasc = new Date(dataNascimento);
    if (dataNasc >= hoje) {
        alert('A data de nascimento deve ser anterior à data atual.');
        return false;
    }

    if (!curso) {
        alert('Por favor, selecione um curso.');
        return false;
    }

    const telefoneRegex = /^$$\d{2}$$ \d{4,5}-\d{4}$/;
    if (!telefoneRegex.test(telefone)) {
        alert('Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX.');
        return false;
    }

    return true;
}

// Função para processar o envio do formulário
function processarCadastro(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    if (validarFormulario()) {
        // Captura os dados do formulário
        const aluno = {
            nome: document.getElementById('nome').value.trim(),
            email: document.getElementById('email').value.trim(),
            dataNascimento: document.getElementById('dataNascimento').value,
            curso: document.getElementById('curso').value,
            telefone: document.getElementById('telefone').value.trim()
        };

        // Aqui você pode enviar os dados para um servidor via fetch/AJAX,
        // ou armazenar localmente, por exemplo, no localStorage:

        // Exemplo de armazenamento local:
        let alunos = JSON.parse(localStorage.getItem('alunos')) || [];
        alunos.push(aluno);
        localStorage.setItem('alunos', JSON.stringify(alunos));

        alert('Aluno cadastrado com sucesso!');

        // Limpa o formulário após cadastro
        document.getElementById('cadastroAluno').reset();
    }
}

// Adiciona o listener para o evento submit do formulário
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('cadastroAluno');
    if (form) {
        form.addEventListener('submit', processarCadastro);
    }
});
