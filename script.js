// script.js
const form = document.getElementById('cadastroAluno');
const campoTelefone = document.getElementById('telefone');
const mensagem = document.getElementById('mensagem');
const listaAlunos = document.getElementById('listaAlunos');
const mensagemVazia = document.getElementById('mensagemVazia');
const botaoLimpar = document.getElementById('limparFormulario');

let editandoIndex = null; // Índice do aluno que está sendo editado, null se for novo cadastro

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = 'status ' + tipo;
}

function limparMensagem() {
  mensagem.textContent = '';
  mensagem.className = 'status';
}

function formatarTelefone(valor) {
  let numeros = valor.replace(/\D/g, '').slice(0, 11);

  if (numeros.length <= 10) {
    numeros = numeros.replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*/, function(_, ddd, parte1, parte2) {
      let resultado = '';
      if (ddd) resultado += '(' + ddd;
      if (ddd.length === 2) resultado += ') ';
      if (parte1) resultado += parte1;
      if (parte2) resultado += '-' + parte2;
      return resultado;
    });
  } else {
    numeros = numeros.replace(/^(\d{0,2})(\d{0,5})(\d{0,4}).*/, function(_, ddd, parte1, parte2) {
      let resultado = '';
      if (ddd) resultado += '(' + ddd;
      if (ddd.length === 2) resultado += ') ';
      if (parte1) resultado += parte1;
      if (parte2) resultado += '-' + parte2;
      return resultado;
    });
  }

  return numeros;
}

function validarNome(nome) {
  return nome.trim().length >= 3;
}

function validarEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validarDataNascimento(dataNascimento) {
  if (!dataNascimento) return false;

  const hoje = new Date();
  const data = new Date(dataNascimento + 'T00:00:00');

  if (isNaN(data.getTime())) return false;
  if (data >= hoje) return false;

  return true;
}

function validarCurso(curso) {
  return curso.trim() !== '';
}

function validarTelefone(telefone) {
  const telefoneLimpo = telefone.replace(/\D/g, '');
  return telefoneLimpo.length === 10 || telefoneLimpo.length === 11;
}

function formatarDataBR(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

function obterAlunos() {
  return JSON.parse(localStorage.getItem('alunos')) || [];
}

function salvarAlunos(alunos) {
  localStorage.setItem('alunos', JSON.stringify(alunos));
}

function renderizarAlunos() {
  const alunos = obterAlunos();
  listaAlunos.innerHTML = '';

  if (alunos.length === 0) {
    mensagemVazia.style.display = 'block';
    return;
  }

  mensagemVazia.style.display = 'none';

  alunos.forEach((aluno, index) => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.email}</td>
      <td>${formatarDataBR(aluno.dataNascimento)}</td>
      <td>${aluno.curso}</td>
      <td>${aluno.telefone}</td>
      <td>
        <button type="button" class="btn-secondary btn-edit" data-index="${index}">Editar</button>
        <button type="button" class="btn-secondary btn-delete" data-index="${index}">Excluir</button>
      </td>
    `;
    listaAlunos.appendChild(linha);
  });

  // Eventos dos botões editar
  document.querySelectorAll('.btn-edit').forEach(botao => {
    botao.addEventListener('click', function () {
      const idx = Number(this.getAttribute('data-index'));
      carregarAlunoParaEdicao(idx);
    });
  });

  // Eventos dos botões excluir
  document.querySelectorAll('.btn-delete').forEach(botao => {
    botao.addEventListener('click', function () {
      const idx = Number(this.getAttribute('data-index'));
      excluirAluno(idx);
    });
  });
}

function carregarAlunoParaEdicao(index) {
  const alunos = obterAlunos();
  const aluno = alunos[index];
  if (!aluno) return;

  document.getElementById('nome').value = aluno.nome;
  document.getElementById('email').value = aluno.email;
  document.getElementById('dataNascimento').value = aluno.dataNascimento;
  document.getElementById('curso').value = aluno.curso;
  document.getElementById('telefone').value = aluno.telefone;

  editandoIndex = index;
  mostrarMensagem('Editando cadastro do aluno: ' + aluno.nome, 'success');

  form.querySelector('button[type="submit"]').textContent = 'Salvar alterações';
}

function excluirAluno(index) {
  if (!confirm('Tem certeza que deseja excluir este aluno?')) return;

  const alunos = obterAlunos();
  alunos.splice(index, 1);
  salvarAlunos(alunos);
  mostrarMensagem('Aluno excluído com sucesso!', 'success');

  // Se estava editando este aluno, cancela edição
  if (editandoIndex === index) {
    form.reset();
    editandoIndex = null;
    form.querySelector('button[type="submit"]').textContent = 'Cadastrar aluno';
  } else if (editandoIndex !== null && index < editandoIndex) {
    // Ajusta índice de edição se necessário
    editandoIndex--;
  }

  renderizarAlunos();
}

campoTelefone.addEventListener('input', function () {
  this.value = formatarTelefone(this.value);
});

form.addEventListener('submit', function (event) {
  event.preventDefault();
  limparMensagem();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const dataNascimento = document.getElementById('dataNascimento').value;
  const curso = document.getElementById('curso').value;
  const telefone = document.getElementById('telefone').value.trim();

  if (!validarNome(nome)) {
    mostrarMensagem('Informe um nome válido com pelo menos 3 caracteres.', 'error');
    document.getElementById('nome').focus();
    return;
  }

  if (!validarEmail(email)) {
    mostrarMensagem('Informe um e-mail válido.', 'error');
    document.getElementById('email').focus();
    return;
  }

  if (!validarDataNascimento(dataNascimento)) {
    mostrarMensagem('A data de nascimento deve ser válida e anterior à data atual.', 'error');
    document.getElementById('dataNascimento').focus();
    return;
  }

  if (!validarCurso(curso)) {
    mostrarMensagem('Selecione um curso.', 'error');
    document.getElementById('curso').focus();
    return;
  }

  if (!validarTelefone(telefone)) {
    mostrarMensagem('Telefone inválido. Use (11) 9999-9999 ou (11) 99999-9999.', 'error');
    document.getElementById('telefone').focus();
    return;
  }

  const aluno = { nome, email, dataNascimento, curso, telefone };
  const alunos = obterAlunos();

  if (editandoIndex !== null) {
    alunos[editandoIndex] = aluno;
    mostrarMensagem('Cadastro atualizado com sucesso!', 'success');
    editandoIndex = null;
    form.querySelector('button[type="submit"]').textContent = 'Cadastrar aluno';
  } else {
    alunos.push(aluno);
    mostrarMensagem('Aluno cadastrado com sucesso!', 'success');
  }

  salvarAlunos(alunos);
  form.reset();
  renderizarAlunos();
});

botaoLimpar.addEventListener('click', function () {
  form.reset();
  limparMensagem();
  editandoIndex = null;
  form.querySelector('button[type="submit"]').textContent = 'Cadastrar aluno';
  document.getElementById('nome').focus();
});

const observer = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible');
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

renderizarAlunos();
