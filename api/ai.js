export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text, apiKey, apiBase, model } = req.body;
  if (!text) return res.status(400).json({ error: 'Texto é obrigatório' });
  const key = apiKey;
  if (!key) return res.status(400).json({ error: 'API key é obrigatória. Configure no formulário.' });

  const base = apiBase || 'https://generativelanguage.googleapis.com/v1beta';
  const mdl = model || 'gemini-2.0-flash';

  const systemPrompt = `Você é um parser de relatórios de obra. Dado um texto em linguagem natural sobre o dia de trabalho em uma obra de construção civil, extraia as informações e retorne APENAS um JSON válido (sem markdown, sem explicação) com esta estrutura exata:

{
  "empresa": "nome da empresa (se mencionado, senão vazio)",
  "cnpj": "CNPJ (se mencionado, senão vazio)",
  "reportNum": "número do relatório (se mencionado, senão vazio)",
  "obraNome": "nome da obra (se mencionado, senão vazio)",
  "obraDesc": "descrição da obra (se mencionado, senão vazio)",
  "respTecnico": "nome do responsável técnico (se mencionado, senão vazio)",
  "clima": "condição climática resumida (ex: Sol, nublado)",
  "climaDesc": "descrição detalhada do clima",
  "equipe": [{"qtd": 2, "funcao": "Pedreiros"}, {"qtd": 4, "funcao": "Ajudantes"}],
  "servicos": ["descrição do serviço 1", "descrição do serviço 2"],
  "pendentes": ["pendência 1", "pendência 2"],
  "avanco": 65,
  "situacao": "resumo geral da situação da obra",
  "turnoInicio": "07h00",
  "turnoFim": "17h00",
  "materiaisRecebidos": "materiais recebidos hoje (se mencionado, senão vazio)",
  "materiaisFalta": "materiais em falta (se mencionado, senão vazio)",
  "problemas": "problemas com máquinas ou ferramentas (se mencionado, senão vazio)"
}

Regras:
- Se uma informação não estiver no texto, use string vazia ou array vazio
- avanco deve ser número de 0 a 100 (estime com base no progresso descrito)
- equipe: extraia TODAS as funções e quantidades mencionadas
- servicos: extraia cada atividade como item separado
- pendentes: extraia serviços que ficaram para o próximo dia
- Mantenha os termos técnicos de construção como no texto original
- Retorne APENAS o JSON, nada mais`;

  try {
    const resp = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        model: mdl,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return res.status(resp.status).json({ error: `API error: ${err}` });
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content || '';
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\\s*([\\s\\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];

    const parsed = JSON.parse(jsonStr.trim());
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: `Erro: ${err.message}` });
  }
}
