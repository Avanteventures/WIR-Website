import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useReveal } from './shared.jsx';
import { LANG, INSIGHTS_HREF } from './i18n.js';
import { BlogArticle, ARTICLES } from './articles.jsx';

// Match the static archives: PT tree lists PT articles, EN tree the English ones (ES → PT set).
// Same language rule as scripts/build-articles.cjs: an explicit `lang: "en"` wins, and the
// `-en` suffix is the fallback for articles that are translations of a PT original.
const isEnArticle = (a) => a.lang === "en" || a.slug.endsWith("-en");
const BLOG_ARTICLES = ARTICLES.filter(a => (LANG === "en") === isEnArticle(a));

// The destaque/hero slot at the top of the listing. An explicit `featured` entry
// (e.g. the WIR Index report) wins; otherwise we fall back to the legacy `hero`
// editorial. Whichever is chosen is pulled out of the grid + filter counts below.
const HERO_POST = BLOG_ARTICLES.find(p => p.featured) || BLOG_ARTICLES.find(p => p.hero);

// One brand color per category — reviewer feedback: "assign a specific brand color shade per content category"
// Both PT/EN variants map to the same color, so the visual identity holds across language trees.
const CAT_GRAD = {
  // Foundational / framing pieces
  "Manifesto":   "linear-gradient(135deg,#0A0A2E,#7540AC)",
  "Ensaio":      "linear-gradient(135deg,#7540AC,#FE8B77)",
  "Essay":       "linear-gradient(135deg,#7540AC,#FE8B77)",
  // Technical depth
  "Técnico":     "linear-gradient(135deg,#3222E9,#AE46C0)",
  "Technical":   "linear-gradient(135deg,#3222E9,#AE46C0)",
  "Artigo":      "linear-gradient(135deg,#3222E9,#7540AC)",
  "Article":     "linear-gradient(135deg,#3222E9,#7540AC)",
  // Case studies
  "Caso":        "linear-gradient(135deg,#F8AD39,#FE8B77)",
  "Case":        "linear-gradient(135deg,#F8AD39,#FE8B77)",
  // Market analysis
  "Mercado":     "linear-gradient(135deg,#FE8B77,#AE46C0)",
  "Market":      "linear-gradient(135deg,#FE8B77,#AE46C0)",
  // Automation / underwriting
  "Automação":   "linear-gradient(135deg,#AE46C0,#F024ED)",
  "Automation":  "linear-gradient(135deg,#AE46C0,#F024ED)",
  "Subscrição":  "linear-gradient(135deg,#3222E9,#AE46C0)",
  "Underwriting":"linear-gradient(135deg,#3222E9,#AE46C0)",
};
const gradFor = (cat) => CAT_GRAD[cat] || "linear-gradient(135deg,#3222E9,#7540AC)";

/* ───────── Insights & News · publicação digital ───────── */

const POSTS = [
  { id:1, cat:"Ensaio", hero:true, title:"O underwriter não morre. O modelo operacional dele, sim.", sub:"Por que a próxima década do seguro vai ser definida pela divisão entre quem tem infra de decisão e quem ainda mora em planilha.",
    author:"Nicholas Weiser", role:"CEO · WIR", time:"12 min", date:"18 · Abr · 2026",
grad:"linear-gradient(135deg,#3222E9,#7540AC)" },
  { id:2, cat:"Técnico", title:"Explicabilidade que vai além do SHAP: como a WIR audita decisões em produção", sub:"Um deep-dive nas camadas de logging, versionamento e retrieval que tornam uma decisão auditável em Q&A.",
    author:"Head of AI", role:"ML · WIR", time:"8 min", date:"12 · Abr · 2026",
grad:"linear-gradient(135deg,#7540AC,#FE8B77)" },
  { id:3, cat:"Caso", title:"Como a Mahway reduziu seu ciclo de cotação em ordens de grandeza", sub:"Estudo de caso detalhado com o processo de implementação, KPIs e aprendizados.",
    author:"Head of Delivery", role:"Delivery · WIR", time:"6 min", date:"05 · Abr · 2026",
grad:"linear-gradient(135deg,#FE8B77,#F8AD39)" },
  { id:4, cat:"Mercado", title:"Por que MGAs são a ponta da lança da IA em seguro", sub:"Estrutura enxuta, apetite próprio e necessidade de capacidade — a combinação ideal para adoção rápida.",
    author:"José Carlos de Paula", role:"CSO · WIR", time:"5 min", date:"28 · Mar · 2026",
grad:"linear-gradient(135deg,#F8AD39,#3222E9)" },
  { id:5, cat:"Técnico", title:"LLMs não substituem motores de regras — eles os complementam", sub:"A arquitetura híbrida que a WIR usa para decisões críticas: quando deixar o modelo decidir e quando aplicar regra hard-coded.",
    author:"Head of AI", role:"ML · WIR", time:"9 min", date:"22 · Mar · 2026",
grad:"linear-gradient(135deg,#3222E9,#7540AC)" },
  { id:6, cat:"Ensaio", title:"A falsa dicotomia entre velocidade e compliance", sub:"Como o debate do setor precisa mudar: não é velocidade OU compliance — é arquitetura certa.",
    author:"Nicholas Weiser", role:"CEO · WIR", time:"7 min", date:"15 · Mar · 2026",
grad:"linear-gradient(135deg,#AE46C0,#F8AD39)" },
  { id:7, cat:"Mercado", title:"O custo invisível do straight-through processing mal feito", sub:"STP sem auditabilidade cria risco reputacional, regulatório e de carteira. Checklist do que medir antes de escalar.",
    author:"José Carlos de Paula", role:"CSO · WIR", time:"6 min", date:"08 · Mar · 2026",
    grad:"linear-gradient(135deg,#7540AC,#3222E9)" },
  { id:8, cat:"Caso", title:"Três formatos de PDF que quebravam submissões — e como resolvemos", sub:"Do OCR comum ao parsing semântico: o caminho técnico para elevar extração significativamente.",
    author:"Head of AI", role:"ML · WIR", time:"7 min", date:"01 · Mar · 2026",
    grad:"linear-gradient(135deg,#F8AD39,#FE8B77)" },
  { id:9, cat:"Técnico", title:"Observabilidade de agentes: o que monitorar em produção", sub:"Latência, precisão, drift, custo por decisão — o dashboard mínimo que toda seguradora deveria exigir.",
    author:"Head of AI", role:"ML · WIR", time:"8 min", date:"22 · Fev · 2026",
    grad:"linear-gradient(135deg,#3222E9,#FE8B77)" },
];

// Translated newsletter copy + inline state (replaces native alert())
const N = {
  pt: {
    placeholder: "seu@email.com", submit: "Assinar",
    sending: "Enviando…", done: "Inscrição recebida — chegará no e-mail informado.",
    error: "Não foi possível enviar agora. Tente novamente em alguns minutos.",
  },
  en: {
    placeholder: "you@email.com", submit: "Subscribe",
    sending: "Sending…", done: "Subscription received — confirmation will arrive in your inbox.",
    error: "Couldn't send right now. Please try again in a moment.",
  },
  es: {
    placeholder: "tu@email.com", submit: "Suscribirme",
    sending: "Enviando…", done: "Suscripción recibida — la confirmación llegará al correo indicado.",
    error: "No pudimos enviar ahora. Intenta de nuevo en unos minutos.",
  },
}[LANG];

function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState("idle"); // idle | sending | done | error
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    const payload = { email: email.trim(), source: "newsletter", page: "/blog" };
    const cfg = window.WIR_CONFIG || {};
    let ok = false;
    if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
      try {
        const res = await fetch(`${cfg.supabaseUrl}/rest/v1/${cfg.newsletterTable || "newsletter_signups"}`, {
          method: "POST",
          headers: {
            "Content-Type":  "application/json",
            "apikey":        cfg.supabaseAnonKey,
            "Authorization": `Bearer ${cfg.supabaseAnonKey}`,
            "Prefer":        "return=minimal",
          },
          body: JSON.stringify(payload),
        });
        ok = res.ok;
      } catch (err) { console.warn("newsletter insert failed", err); }
    }
    if (cfg.notifyWebhook) {
      fetch(cfg.notifyWebhook, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ ...payload, type: "newsletter_signup" }), mode: "no-cors" }).catch(()=>{});
    }
    if (ok) { setState("done"); setEmail(""); }
    else    { setState("error"); }
  };
  if (state === "done") {
    return <div className="blside__news-done" role="status">{N.done}</div>;
  }
  return (
    <form className="blside__news-form" onSubmit={onSubmit}>
      <input type="email" required
        autoComplete="email" inputMode="email"
        placeholder={N.placeholder}
        value={email} onChange={(e)=>setEmail(e.target.value)}
        aria-label="Email"/>
      <button type="submit" disabled={state === "sending"}>
        {state === "sending" ? N.sending : N.submit} <span aria-hidden>→</span>
      </button>
      {state === "error" && <div role="alert" className="blside__news-err">{N.error}</div>}
    </form>
  );
}

function BlogHero({ go }) {
  const hero = HERO_POST;
  if (!hero) return null;
  return (
    <section className="blhero">
      <div className="wrap">
        <div className="blhero__meta">
          <span>· Insights & News · Edição 14</span>
          <span>· Publicado quinzenalmente</span>
          <span>· Atualizado Abr · 2026</span>
        </div>
        <div className="blhero__top">
          <div className="eyebrow">· Insights & News</div>
          <h1 className="display blhero__mast">
            Insights sobre<br/>
            <em>IA, seguro</em><br/>
            e decisão.
          </h1>
          <p className="blhero__sub">Ensaios, casos de uso e notas técnicas do time da WIR sobre como Inteligência Artificial está redesenhando a operação do mercado segurador.</p>
        </div>
        <a className="blhero__feature is-clickable" href={`/insights/${hero.slug}/`}>
          <div className="blhero__feature-img"
            style={hero.image
              ? { backgroundImage: `linear-gradient(180deg, rgba(11,10,8,0.15), rgba(11,10,8,0.65)), url(${hero.image})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: gradFor(hero.cat) }}>
            <span className="blhero__feature-label">· {hero.cat.toLowerCase()} · editorial</span>
          </div>
          <div className="blhero__feature-body">
            <div className="blhero__feature-meta">
              <span className="blhero__cat">· {hero.cat}</span>
              <span>· {hero.time} de leitura</span>
              <span>· {hero.date}</span>
            </div>
            <h2 className="display blhero__feature-title">{hero.title}</h2>
            <p className="blhero__feature-sub">{hero.sub}</p>
            <div className="blhero__feature-by">
              <div className="blhero__avatar">{hero.author.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
              <div>
                <b>{hero.author}</b>
                <span>{hero.role}</span>
              </div>
              <span className="blhero__feature-cta">Ler artigo <span aria-hidden>→</span></span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

function BlogFilter({ active, setActive, counts, query, setQuery }) {
  // Pills derived from the data so every category present gets one
  const cats = ["Todos", ...Object.keys(counts).filter(c => c !== "Todos").sort((a, b) => a.localeCompare(b, "pt"))];
  return (
    <div className="blfilter">
      <div className="wrap blfilter__inner">
        <div className="blfilter__left">
          <span className="eyebrow">· Filtros</span>
          {cats.map(c => (
            <button key={c}
              className={"blfilter__pill" + (active === c ? " is-active" : "")}
              onClick={()=>setActive(c)}>
              {c}
              <span className="blfilter__count">{counts[c] || 0}</span>
            </button>
          ))}
        </div>
        <div className="blfilter__right">
          <input type="text" placeholder="Buscar por título ou autor…" className="blfilter__search"
            value={query} onChange={(e)=>setQuery(e.target.value)} aria-label="Buscar por título ou autor"/>
        </div>
      </div>
    </div>
  );
}

function BlogGrid({ posts, go }) {
  return (
    <section className="blgrid" data-reveal>
      <div className="wrap">
        <div className="blgrid__layout">
          <div className="blgrid__main">
            <div className="eyebrow" style={{marginBottom: 24}}>· {posts.length} artigos</div>
            <div className="blgrid__list">
              {posts.map((p,i) => (
                <a key={p.slug} href={`/insights/${p.slug}/`}
                  className={"blpost is-clickable" + (i === 0 ? " blpost--big" : "")}>
                  <div className="blpost__img"
                    style={p.image
                      ? { backgroundImage: `linear-gradient(180deg, rgba(11,10,8,0.2), rgba(11,10,8,0.7)), url(${p.image})`, backgroundSize: "cover", backgroundPosition: "center" }
                      : { background: gradFor(p.cat) }}>
                    <span className="blpost__img-label">{p.cat}</span>
                    <span className="blpost__img-meta">· {p.time}</span>
                  </div>
                  <div className="blpost__body">
                    <div className="blpost__meta">
                      <span className="blpost__cat">· {p.cat}</span>
                      <span>· {p.time}</span>
                      <span>· {p.date}</span>
                    </div>
                    <h3 className="display blpost__title">{p.title}</h3>
                    <p className="blpost__sub">{p.sub}</p>
                    <div className="blpost__by">
                      <div className="blpost__avatar">{p.author.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
                      <div className="blpost__by-who">
                        <b>{p.author}</b>
                        <span>{p.role}</span>
                      </div>
                      <span className="blpost__cta">Ler artigo →</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <aside className="blgrid__side">
            <div className="blside__card">
              <div className="eyebrow" style={{marginBottom: 16}}>· Em destaque</div>
              <ul className="blside__list">
                {BLOG_ARTICLES.slice(0,4).map((p,i) => (
                  <li key={p.slug}>
                    <a href={`/insights/${p.slug}/`} className="blside__link">
                      <div className="blside__num">/0{i+1}</div>
                      <div>
                        <div className="blside__title">{p.title}</div>
                        <div className="blside__meta">· {p.cat} · {p.time}</div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="blside__news">
              <div className="eyebrow eyebrow--onDark" style={{marginBottom: 20}}>· Newsletter</div>
              <h3 className="display blside__news-title">Insights & News,<br/><em>quinzenalmente.</em></h3>
              <p className="blside__news-sub">Ensaios curtos, 1 caso prático e leituras recomendadas. Sem marketing.</p>
              <NewsletterForm/>
              <div className="blside__news-meta">· Comunidade de operadores do setor · sem spam</div>
            </div>
            <div className="blside__tags">
              <div className="eyebrow" style={{marginBottom: 16}}>· Tópicos</div>
              <div className="blside__tags-row">
                {["IA aplicada","underwriting","auditabilidade","LGPD","compliance","subscrição","integrações","observability"].map((t,i) => (
                  <span key={i} className="blside__tag">#{t}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function BlogClose() {
  return (
    <section className="blclose" data-reveal>
      <div className="wrap">
        <div className="blclose__inner">
          <div className="eyebrow">· Arquivo</div>
          <h2 className="display blclose__title">
            Quer <em>colaborar?</em>
          </h2>
          <p className="blclose__lede">
            Recebemos guest essays de operadores, reguladores e engenheiros do setor. Se você tem uma tese para defender, escreva para <b>ideias@wir.innovation</b>.
          </p>
        </div>
      </div>
    </section>
  );
}

export function BlogPage({ go }) {
  useReveal();
  const [active, setActive] = React.useState("Todos");
  const [slug, setSlug] = React.useState(() => {
    const h = location.hash.replace(/^#/, "");
    const parts = h.split("/");
    return parts[0] === "blog" && parts[1] ? parts[1] : null;
  });

  React.useEffect(() => {
    const onHash = () => {
      const h = location.hash.replace(/^#/, "");
      const parts = h.split("/");
      setSlug(parts[0] === "blog" && parts[1] ? parts[1] : null);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Hooks must be called unconditionally — keep memos before any return
  const articles = BLOG_ARTICLES;
  const [query, setQuery] = React.useState("");
  const posts = React.useMemo(() => {
    let list = articles.filter(p => p !== HERO_POST);
    if (active !== "Todos") list = list.filter(p => p.cat === active);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter(p => `${p.title} ${p.sub || ""} ${p.author || ""}`.toLowerCase().includes(q));
    return list;
  }, [active, query, articles.length]);
  const counts = React.useMemo(() => {
    const c = { Todos: Math.max(0, articles.length - (HERO_POST ? 1 : 0)) };
    articles.filter(p => p !== HERO_POST).forEach(p => { c[p.cat] = (c[p.cat] || 0) + 1; });
    return c;
  }, [articles.length]);

  // Old #blog/<slug> URLs redirect to real /insights/<slug>/ pages
  React.useEffect(() => {
    if (slug) window.location.replace(`/insights/${slug}/`);
  }, [slug]);
  // The legacy #blog UI is PT-only — EN/ES trees go to their static archive
  React.useEffect(() => {
    if (LANG !== "pt" && !slug) window.location.replace(INSIGHTS_HREF);
  }, [slug]);
  if (slug) return null; // Brief blank while redirecting
  if (LANG !== "pt") return null;

  return (
    <>
      <BlogHero go={go}/>
      <BlogFilter active={active} setActive={setActive} counts={counts} query={query} setQuery={setQuery}/>
      <BlogGrid posts={posts} go={go}/>
      <BlogClose/>
    </>
  );
}

