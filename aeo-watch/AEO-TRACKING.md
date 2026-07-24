# WIR Innovation — AEO Tracking

> **Why this exists.** WIR is demand-capped in classic SEO (Brazilian insurance-AI has thin search volume). The right lever is **AEO**: when the *few* high-intent buyers (insurers, MGAs, underwriting leaders) ask ChatGPT / Perplexity / Google AI Overviews a real operating question, WIR should be the cited answer. Low volume, perfect intent. This file is how we track and defend that.

> **What actually works to measure it (2026-07):** Automated search-scraping (DuckDuckGo/Bing) is **egress-blocked** in scheduled sessions and there are **no answer-engine API keys**. So we track AEO two ways:
> 1. **GSC proxy (automatable, not blocked):** a page ranking **top-5** for a question-shaped query is *citation-eligible* — AI Overviews and Perplexity pull sources from the top organic results. Track position of the buyer questions below in GSC over time.
> 2. **Manual probe pack (gold standard, ~10 min/week):** run each question in Perplexity + ChatGPT (web mode) + Google (AI Overview) and note whether `wirinnovation.ai` is cited.

---

## The buyer-intent question set (track these, not vanity terms)

PT-BR is primary (WIR's market); EN mirror for global/reinsurer reach. "GSC now" = current position in `sc-domain:wirinnovation.ai` (28d to 2026-07-07). ✅ = already top-5 (citation-eligible today).

| # | Question (buyer would ask an AI engine) | Lang | GSC now | Citation-eligible? | Target page |
|---|---|---|---|---|---|
| 1 | how is open insurance being implemented in brazil | EN | pos 7.2 | close | open-insurance-brasil-seguradoras-en |
| 2 | can I share my insurance history between companies in brazil | EN | pos 5 | ✅ | open-insurance / validacao-cnpj |
| 3 | best AI integration platform for insurance core systems | EN | pos 7.5 | close | integrar-camada-ia-core-seguros |
| 4 | how to use AI in insurance quoting | EN | pos 6 | ✅ | automatizar-cotacao-seguros |
| 5 | como aparecer nas recomendações de IA para seguros | PT | pos 2.4 | ✅ | aparecer-recomendacoes-ia-seguros |
| 6 | como automatizar a cotação de seguros com IA | PT | pos 9.5 | no (p2) | automatizar-cotacao-seguros |
| 7 | como automatizar a subscrição de seguros | PT | pos 24.6 | no (p3) | automatizar-subscricao-seguros |
| 8 | o que é STP em seguros / straight-through processing insurance | PT/EN | — | — | o-que-e-stp-seguros (page live since 15-jun; verbatim-question H3s + inlink from custo-invisivel added 23-jul) |
| 9 | how to automate insurance submission triage | EN | pos 16 | no (p2) | triagem-automatica-submissoes |
| 10 | seguro cibernético no brasil / brazil cyber insurance market | PT/EN | pos 9.8 | close | seguro-cibernetico-brasil |
| 11 | IA para detecção de fraude em seguros | PT | pos 30 | no | fraude-seguros-brasil-ia |
| 12 | regulação de IA em seguros SUSEP | PT | — | — | regulacao-ia-seguros-susep |

**Read:** #2, #4, #5 are already citation-eligible (top-5) — defend them. #1, #3, #10 are one push from top-5 (the real near-term AEO wins). #6, #7, #9 are page-2/3 — content is fine, they need authority/links, not more pages.

## Weekly manual probe pack (~10 min, run by a human)

For each question above, run it verbatim in **Perplexity**, **ChatGPT (web/search mode)**, and **Google (note the AI Overview)**. Record:
- Is `wirinnovation.ai` cited as a source? (Y/N per engine)
- If not, **who is cited instead?** (the competitor to displace)
- Does the AI's answer match WIR's positioning (external AI layer, never replaces core)?

Log results in a dated file `aeo-watch/YYYY-MM-DD.md` (diff vs prior week).

## On-page AEO checklist (so the pages actually get cited)

Answer engines cite pages that answer the question **directly, early, and verifiably**. For each target page:
- [ ] The exact question appears as an H2/H3, answered in the **first 2-3 sentences** (BLUF).
- [ ] `FAQPage` schema with the buyer question verbatim (WIR build emits this when `article.faq` is set).
- [ ] A short, quotable definitional sentence an engine can lift ("Straight-through processing in insurance is …").
- [ ] Real, sourced specifics (SUSEP, LGPD, company-facts numbers) — engines prefer citable facts. No invented traction.
- [ ] Entity clarity: the page states plainly what WIR is (an external AI layer for insurers that never replaces the core).
- [ ] No em/en dashes (brand rule); plain, scannable prose.

## Changelog

- **2026-07-24:** Comparison-page sweep for the prompt-tracker clusters. Published: `melhores-plataformas-ia-subscricao-seguros` (+ `-en`, hreflang-paired), `melhores-plataformas-analytics-seguradoras`, `melhores-ferramentas-ia-triagem-propostas-seguros`, `melhores-plataformas-inteligencia-vendas-seguradoras`. All: vendor comparison table + FAQPage with verbatim tracker prompts. Hero images generated programmatically (PIL, brand-gradient family; generator in session scratchpad, style: flat abstract on WIR palette). Site-wide fixes: markdown-table rendering in build-articles.cjs + blog.css, og:image/twitter:image now absolute URLs. Remaining tracker cluster without a page: none of the majors; watch scores ~2 weeks (check ~07-ago and ~21-ago).

- **2026-07-23:** GSC Dataset issue (`Missing field "license"`) on `/insights/wir-index/` fixed with CC BY 4.0 (attribution-required license also serves the citation strategy). SUSEP EN routing fix: title/meta of `regulacao-ia-seguros-susep-en` re-anchored to "Brazil insurance market 2026: SUSEP AI regulation" + inlink from `escalonamento-humano-subscricao-seguros-en`. STP pages audited against the on-page checklist: verbatim-question H3s added, inlink from `custo-invisivel-stp-mal-feito`. External prompt tracker (screenshot 23-jul) shows ~25 PT-BR comparative buyer prompts all at score 0: next structural gap is comparison/alternatives-format pages ("melhores plataformas", "comparar softwares"), the format answer engines cite for those queries.

## Automation note
Wire a GSC-based tracker into the existing `seo-watch` (GH Actions, GSC OAuth → Slack): pull the 12 questions above weekly, alert when any crosses into / falls out of top-5 (the citation-eligibility line). That is the automatable half. The manual probe pack stays human until an answer-engine API key is added (Perplexity API is the cheapest path).
