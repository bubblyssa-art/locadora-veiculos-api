const express = require('express');
const db = require('../config/db');
const router = express.Router();

function validarId(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validarCarro(dados) {
  if (!dados || typeof dados.placa !== 'string' || !dados.placa.trim()) {
    return 'Informe a placa do carro.';
  }
  if (typeof dados.modelo !== 'string' || !dados.modelo.trim()) {
    return 'Informe o modelo do carro.';
  }
  if (dados.diaria === undefined || dados.diaria === null || dados.diaria === '') {
    return 'Informe o valor da diária.';
  }
  const diaria = Number(dados.diaria);
  if (!Number.isFinite(diaria) || diaria <= 0) {
    return 'A diária deve ser um número maior que zero.';
  }
  return null;
}

function responderErroBanco(res, erro) {
  console.error(erro);
  if (erro && erro.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ erro: 'Já existe um carro cadastrado com essa placa.' });
  }
  return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
}

// GET /carro — lista todos os carros
router.get('/', (req, res) => {
  const sql = 'SELECT id, placa, modelo, diaria FROM carro ORDER BY id ASC';
  db.query(sql, (erro, resultados) => {
    if (erro) return responderErroBanco(res, erro);
    return res.status(200).json(resultados);
  });
});

// GET /carro/:id — consulta um carro pelo ID
router.get('/:id', (req, res) => {
  const id = validarId(req.params.id);
  if (!id) return res.status(400).json({ erro: 'O ID deve ser um número inteiro positivo.' });

  const sql = 'SELECT id, placa, modelo, diaria FROM carro WHERE id = ?';
  db.query(sql, [id], (erro, resultados) => {
    if (erro) return responderErroBanco(res, erro);
    if (resultados.length === 0) {
      return res.status(404).json({ erro: 'Carro não encontrado.' });
    }
    return res.status(200).json(resultados[0]);
  });
});

// POST /carro — cadastra um carro
router.post('/', (req, res) => {
  const erroValidacao = validarCarro(req.body);
  if (erroValidacao) return res.status(400).json({ erro: erroValidacao });

  const carro = {
    placa: req.body.placa.trim().toUpperCase(),
    modelo: req.body.modelo.trim(),
    diaria: Number(req.body.diaria)
  };
  const sql = 'INSERT INTO carro (placa, modelo, diaria) VALUES (?, ?, ?)';
  db.query(sql, [carro.placa, carro.modelo, carro.diaria], (erro, resultado) => {
    if (erro) return responderErroBanco(res, erro);
    return res.status(201).json({ id: resultado.insertId, ...carro });
  });
});

// PUT /carro/:id — atualiza todos os dados de um carro
router.put('/:id', (req, res) => {
  const id = validarId(req.params.id);
  if (!id) return res.status(400).json({ erro: 'O ID deve ser um número inteiro positivo.' });

  const erroValidacao = validarCarro(req.body);
  if (erroValidacao) return res.status(400).json({ erro: erroValidacao });

  const carro = {
    placa: req.body.placa.trim().toUpperCase(),
    modelo: req.body.modelo.trim(),
    diaria: Number(req.body.diaria)
  };

  db.query('SELECT id FROM carro WHERE id = ?', [id], (erroBusca, resultados) => {
    if (erroBusca) return responderErroBanco(res, erroBusca);
    if (resultados.length === 0) {
      return res.status(404).json({ erro: 'Carro não encontrado.' });
    }

    const sql = 'UPDATE carro SET placa = ?, modelo = ?, diaria = ? WHERE id = ?';
    db.query(sql, [carro.placa, carro.modelo, carro.diaria, id], (erroAtualizacao) => {
      if (erroAtualizacao) return responderErroBanco(res, erroAtualizacao);
      return res.status(200).json({ id, ...carro });
    });
  });
});

// DELETE /carro/:id — exclui um carro
router.delete('/:id', (req, res) => {
  const id = validarId(req.params.id);
  if (!id) return res.status(400).json({ erro: 'O ID deve ser um número inteiro positivo.' });

  const sql = 'DELETE FROM carro WHERE id = ?';
  db.query(sql, [id], (erro, resultado) => {
    if (erro) return responderErroBanco(res, erro);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Carro não encontrado.' });
    }
    return res.status(200).json({ mensagem: 'Carro excluído com sucesso.', id });
  });
});

module.exports = router;
