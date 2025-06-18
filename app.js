const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/certidao', async (req, res) => {
  const doc = req.query.doc;
  if (!doc) return res.status(400).send('Faltando o parâmetro ?doc=');

  const url = 'https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Solicitacao.asp'; // Exemplo Receita Federal

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url);

    // Aqui você pode adaptar os comandos de preenchimento, clique e espera.
    await page.type('input[name="cnpj"]', doc);

    // Simula clique no botão, se necessário
    // await page.click('#btnConsultar');
    // await page.waitForNavigation();

    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    res.setHeader('Content-Disposition', `attachment; filename=certidao-${doc}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao gerar certidão');
  }
});

app.get('/', (req, res) => {
  res.send('API para gerar certidão com Puppeteer: use /certidao?doc=00000000000000');
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
