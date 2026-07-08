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

  const systemPrompt = `Você é um extrator de dados para Relatório Diário de Obra (RDO) de construção civil.

RECEBA um texto livre descrevendo o dia de trabalho em uma obra e RETORNE um JSON válido com os dados extraídos.

CAMPOS DO JSON:
- empresa: nome da empresa construtora (string)
- cnpj: CNPJ da empresa (string)
- reportNum: número do relatório (string)
- obraNome: nome da obra/projeto (string)
- obraDesc: descrição/tipo da obra (string)
- respTecnico: nome do responsável técnico (string)
- clima: resumo curto do clima, ex: "Sol", "Nublado", "Chuva", "Sol com nuvens" (string)
- climaDesc: descrição detalhada do clima com frase completa (string)
- equipe: array de objetos {qtd: number, funcao: string} com TODAS as funções e quantidades mencionadas
- servicos: array de strings com cada serviço/atividade executada no dia
- pendentes: array de strings com serviços que ficaram para o próximo dia ou estão pendentes
- avanco: porcentagem de avanço da obra (number 0-100). Se não mencionado, estime pelo progresso descrito
- situacao: parágrafo resumindo a situação geral da obra no dia
- turnoInicio: horário de início (string, ex: "07h00")
- turnoFim: horário de fim (string, ex: "17h00")
- materiaisRecebidos: materiais que foram entregues/recebidos na obra (string)
- materiaisFalta: materiais que estão em falta (string)
- problemas: problemas com máquinas, ferramentas ou ocorrências (string)
- ausencias: lista de profissionais que faltaram (string). Se não mencionado, use "Sem registros."
- terceirizados: serviços ou profissionais terceirizados na obra (string). Se não mencionado, use "Sem registros."

REGRAS IMPORTANTES:
1. Extraia TODAS as funções mencionadas para equipe (pedreiro, ajudante, servente, pintor, eletricista, encanador, carpinteiro, ferreiro, mestre de obras, serralheiro, etc.)
2. Cada atividade diferente deve ser um item separado no array de servicos
3. Se o texto disser "amanhã vamos fazer X" ou "falta fazer Y" ou "precisamos continuar Z", coloque em pendentes
4. MATERIAIS: preencha materiaisRecebidos se o texto mencionar entrega, chegada, recebimento de qualquer material (tijolos, cimento, areia, ferro, vergas, tubos, etc.). Preencha materiaisFalta se mencionar falta, acabou, precisa comprar.
5. PROBLEMAS: preencha problemas se mencionar qualquer problema: quebrou, defeito, conserto, reparo, falta de energia, atraso, acidente, ferramenta estragada, máquina parada.
6. Se não houver informação sobre materiais, problemas ou pendências, use string vazia ""
7. Se não houver equipe mencionada, use array vazio []
8. Para avanço: se disser "metade" = 50, "quase acabando" = 85, "começando" = 20, "terminamos" = 100
9. Mantenha nomes próprios e termos técnicos exatamente como no texto
10. Para clima, seja conciso no resumo (1-3 palavras) e detalhado na descrição
11. SEMPRE preencha a situação com um parágrafo resumindo o dia, incluindo o que foi feito e o que está pendente

EXEMPLO DE ENTRADA:
"Hoje na obra do João tivemos 3 pedreiros e 5 ajudantes. Fizemos alvenaria do segundo andar e chapisco nas paredes externas. Amanhã precisamos acabar o chapisco e começar as vergas. Recebemos 500 tijolos e 20 sacos de cimento. A betoneira quebrou. Tempo nublado com sol, sem chuva. Avanço uns 60%."

EXEMPLO DE SAÍDA:
{
  "empresa": "",
  "cnpj": "",
  "reportNum": "",
  "obraNome": "Obra do João",
  "obraDesc": "",
  "respTecnico": "",
  "clima": "Nublado com sol",
  "climaDesc": "Tempo nublado com sol, sem chuva durante todo o turno.",
  "equipe": [
    {"qtd": 3, "funcao": "Pedreiros"},
    {"qtd": 5, "funcao": "Ajudantes"}
  ],
  "servicos": [
    "Alvenaria do segundo andar",
    "Chapisco nas paredes externas"
  ],
  "pendentes": [
    "Acabar o chapisco",
    "Começar as vergas"
  ],
  "avanco": 60,
  "situacao": "Obra em andamento com alvenaria do segundo andar e chapisco em execução. Betoneira com defeito.",
  "turnoInicio": "07h00",
  "turnoFim": "17h00",
  "materiaisRecebidos": "500 tijolos e 20 sacos de cimento",
  "materiaisFalta": "",
  "problemas": "Betoneira quebrou"
}

RETORNE APENAS O JSON. Sem texto antes ou depois. Sem markdown. Sem explicação.`;

  try {
    const resp = await fetch(`${base}/models/${mdl}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: `Extraia os dados deste texto:\n\n${text}` }] }],
        generationConfig: { temperature: 0.0, maxOutputTokens: 2000 }
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return res.status(resp.status).json({ error: `API ${resp.status}: ${err.substring(0, 200)}` });
    }

    const data = await resp.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    let jsonStr = content.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];
    // Remove leading/trailing garbage
    const firstBrace = jsonStr.indexOf('{');
    const lastBrace = jsonStr.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
    }

    return res.status(200).json(JSON.parse(jsonStr));
  } catch (err) {
    return res.status(500).json({ error: `Erro: ${err.message}` });
  }
};
