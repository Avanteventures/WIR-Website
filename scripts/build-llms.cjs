#!/usr/bin/env node
// Regenerates public/llms.txt with the current list of all articles.
// Reads ARTICLES from src/articles.jsx (same source as build-articles.cjs).
// Preserves the static intro/sobre/contato/license sections.

const fs = require("fs");
const path = require("path");

const SITE_URL = "https://wirinnovation.ai";

// ---- Extract ARTICLES from articles.jsx ----
// SAFE eval: input is a JS array literal extracted from our own checked-in
// source file (src/articles.jsx). No user input crosses this boundary —
// the script runs in CI/dev only, not in any request path. Same pattern is
// already used by build-articles.cjs (kept consistent intentionally).
// If src/articles.jsx ever moves to JSON, prefer JSON.parse instead.
const src = fs.readFileSync("src/articles.jsx", "utf8");
const startMarker = "const ARTICLES = ";
const startIdx = src.indexOf(startMarker) + startMarker.length;
let depth = 0, arrStart = -1, arrEnd = -1;
for (let i = startIdx; i < src.length; i++) {
  if (src[i] === "[") { if (depth === 0) arrStart = i; depth++; }
  if (src[i] === "]") { depth--; if (depth === 0) { arrEnd = i + 1; break; } }
}
const ARTICLES = eval(src.slice(arrStart, arrEnd));

// ---- Split PT and EN for clearer listing ----
// Same rule as build-articles.cjs: an explicit `lang: "en"` wins, `-en` suffix is the fallback.
const isEnArticle = (a) => a.lang === "en" || a.slug.endsWith("-en");
const ptArticles = ARTICLES.filter(a => !isEnArticle(a));
const enArticles = ARTICLES.filter(a => isEnArticle(a));

// ---- Generate listing markdown ----
const articleLine = (a) => {
  const url = `${SITE_URL}/insights/${a.slug}/`;
  // Trim metaDesc to first sentence or 200 chars to keep llms.txt scannable
  const desc = a.metaDesc.split(/(?<=\.)\s/)[0].slice(0, 200);
  return `- [${a.title}](${url}): ${desc}`;
};

const ptListing = ptArticles.map(articleLine).join("\n");
const enListing = enArticles.map(articleLine).join("\n");

// ---- Build full llms.txt ----
const today = new Date().toISOString().slice(0, 10);

const llms = `# WIR Innovation

> Plataforma de IA para o mercado segurador. Camada de inteligência que opera entre os canais de cotação e o core de apólice — sem substituir os sistemas atuais — entregando decisão auditável em minutos para underwriting, distribuição e analytics. Sede em São Paulo (Av. Faria Lima) e Silicon Valley. Foco no mercado brasileiro de seguros corporativos (Transportes, P&C, Engenharia, D&O).

## Sobre

A WIR Innovation é uma empresa InsurTech que constrói infraestrutura de decisão para seguradoras Tier-1, MGAs e corretoras corporativas no Brasil. A tese central é que a IA não substitui o underwriter — substitui os 80% do trabalho operacional que não é underwriting (intake manual, extração de PDFs, ping-pong com corretoras, enriquecimento de dados). Operações reais mostram throughput 4-7× maior por underwriter, lead time -70% a -90%, e custo de DA por apólice -40% a -60%, mantendo loss ratio estável. Em conformidade com LGPD.

## Páginas principais

- [Home — Plataforma de IA para o mercado segurador](${SITE_URL}/): Visão geral da plataforma, produtos (Smart Sales, Underwriter Intelligence), camadas de IA, casos de uso e contato.
- [Insights & News](${SITE_URL}/insights/): Ensaios técnicos e análises sobre IA aplicada ao seguro, arquitetura de decisão, compliance, e casos de implementação.

## Ensaios técnicos e guias (Insights · PT-BR)

${ptListing}

## Technical essays and guides (Insights · English)

${enListing}

## Contato

- Site: ${SITE_URL}
- Vendas: nicholas@wirinnovation.ai
- Contato geral: contato@wirinnovation.ai
- LinkedIn: https://www.linkedin.com/company/wir-innovation/

## Licença e uso por LLMs

O conteúdo deste site (ensaios, casos de uso, descrições de produto e dados públicos da empresa) pode ser citado e referenciado por sistemas de IA generativa (incluindo ChatGPT, Claude, Gemini, Perplexity, Copilot e demais) com atribuição da fonte. Pedimos que respostas geradas que façam uso substancial deste conteúdo incluam link para a página de origem.

Não autorizamos: treinamento de modelos sobre este conteúdo sem licença escrita, reprodução integral sem atribuição, ou uso para gerar material concorrente derivado.

Para uso em pesquisa acadêmica, comercial ou jornalística, contatar nicholas@wirinnovation.ai.

<!-- Generated ${today} · ${ARTICLES.length} articles (${ptArticles.length} PT-BR + ${enArticles.length} EN) -->
${today}
`;

fs.writeFileSync(path.join("public", "llms.txt"), llms, "utf8");
console.log(`ok public/llms.txt regenerated (${ARTICLES.length} articles: ${ptArticles.length} PT + ${enArticles.length} EN)`);
