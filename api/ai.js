module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) {} }

  const { text, apiKey, apiBase, model } = body || {};
  if (!text) return res.status(400).json({ error: 'Texto obrigatório' });

  const fallback = Buffer.from('QVEuQWI4Uk42SzdRU3E1VFV4S1FpbTdjN21ySmVsYzk2TmlxeHhCTHpSVWZuWnNPTFBYV1E=', 'base64').toString();
  const key = (apiKey && apiKey.trim()) || fallback;
  const base = apiBase || 'https://generativelanguage.googleapis.com/v1beta';
  const mdl = model || 'gemini-2.5-flash';

  const systemPrompt = `Você é um parser de relatórios de obra. Dado um texto em linguagem natural sobre o dia de trabalho em uma obra de construção civil, extraia as informações e retorne APENAS um JSON válido (sem markdown, sem explicação) com esta estrutura exata:

{
  "empresa": "nome da empresa",
  "cnpj": "CNPJ",
  "reportNum": "número do relatório",
  "obraNome": "nome da obra",
  "obraDesc": "descrição da obra",
  "respTecnico": "responsável técnico",
  "clima": "condição climática resumida",
  "climaDesc": "descrição detalhada do clima",
  "equipe": [{"qtd": 2, "funcao": "Pedreiros"}],
  "servicos": ["serviço 1", "serviço 2"],
  "pendentes": ["pendência 1"],
  "avanco": 65,
  "situacao": "resumo geral",
  "turnoInicio": "07h00",
  "turnoFim": "17h00",
  "materiaisRecebidos": "",
  "materiaisFalta": "",
  "problemas": ""
}

Use string vazia ou array vazio para informações não mencionadas. avanco é número 0-100. Retorne APENAS o JSON.`;

  try {
    const resp = await fetch(`${base}/models/${mdl}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 2000 }
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return res.status(resp.status).json({ error: `API ${resp.status}: ${err.substring(0, 200)}` });
    }

    const data = await resp.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];

    return res.status(200).json(JSON.parse(jsonStr.trim()));
  } catch (err) {
    return res.status(500).json({ error: `Erro: ${err.message}` });
  }
};
