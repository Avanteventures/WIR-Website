import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useReveal } from './shared.jsx';
import { LANG, MANIFESTO_HREF } from './i18n.js';
import { Opening, Proof } from './home-opening.jsx';
import { Shift, ProductTabs } from './home-shift.jsx';
import { ArchFlow, Closing } from './home-how.jsx';

/* ───────── Home · assembler ───────── */

const T = {
  pt: {
    eyebrow: "· Fundadores, Sócios & Conselheiros Estratégicos",
    title: <>Décadas no setor. <em>Solidez Financeira.</em><br/><em>World Class</em> em IA.</>,
    note: "A experiência de décadas como sócios e C-Level de seguradoras e corretoras nacionais e internacionais, somada ao expertise de sócios de fundos de Private Equity e Venture Builder internacional, proporciona aos nossos clientes um conhecimento profundo do mercado segurador, solidez financeira de longo prazo e nível World Class em tecnologia e Inteligência Artificial.",
    expKicker: "· Onde nossos sócios passaram",
    teamCta: "Conheça os fundadores e o histórico →",
    mKicker: "· Manifesto · A camada de IA do seguro",
    mText: <>Não troque o sistema de registro.<span className="manifesto__accent">Coloque um sistema de inteligência por cima dele.</span></>,
    mLink: "Ler o manifesto completo",
    mLink2: "Conversar sobre isso →",
    midCtaText: "Quer ver isso na sua operação?",
    midCtaBtn: "Falar com nossos sócios",
  },
  en: {
    eyebrow: "· Founders, Partners & Strategic Advisors",
    title: <>Decades in the industry. <em>Financial strength.</em><br/><em>World Class</em> in AI.</>,
    note: "Decades of experience as partners and C-levels of national and international insurers and brokerages, combined with the expertise of partners from Private Equity funds and a global venture builder, gives our clients deep insurance-market knowledge, long-term financial strength and world-class technology and Artificial Intelligence.",
    expKicker: "· Where our partners came from",
    teamCta: "Meet the founders and the track record →",
    mKicker: "· Manifesto · The AI layer of insurance",
    mText: <>Don't replace the system of record.<span className="manifesto__accent">Put a system of intelligence on top of it.</span></>,
    mLink: "Read the full manifesto",
    mLink2: "Talk to us about it →",
    midCtaText: "Want to see this in your operation?",
    midCtaBtn: "Talk to our partners",
  },
  es: {
    eyebrow: "· Fundadores, Socios & Consejeros Estratégicos",
    title: <>Décadas en el sector. <em>Solidez financiera.</em><br/><em>World Class</em> en IA.</>,
    note: "La experiencia de décadas como socios y C-Levels de aseguradoras y corredoras nacionales e internacionales, sumada al expertise de socios de fondos de Private Equity y un Venture Builder internacional, brinda a nuestros clientes un conocimiento profundo del mercado asegurador, solidez financiera de largo plazo y nivel World Class en tecnología e Inteligencia Artificial.",
    expKicker: "· Por dónde pasaron nuestros socios",
    teamCta: "Conoce a los fundadores y el track record →",
    mKicker: "· Manifiesto · La capa de IA del seguro",
    mText: <>No cambies el sistema de registro.<span className="manifesto__accent">Pon un sistema de inteligencia encima.</span></>,
    mLink: "Leer el manifiesto completo",
    mLink2: "Conversar sobre esto →",
    midCtaText: "¿Quieres ver esto en tu operación?",
    midCtaBtn: "Hablar con nuestros socios",
  },
}[LANG];

// Sócios & Conselheiros + Experiência no setor
export function TrustBar({ go }) {
  // 5×2 grid with composite top-cells in cols 1 & 2:
  //   Col 1 top: Bain Capital + Notredame Intermédica (both in same cell)
  //   Col 2 top: Pátria + Athena Saúde (both in same cell)
  //   Col 5 top: Hapvida · NotreDame combined logo
  // Bottom row: Aon, Gallagher, JLT, Lockton, VIS — all single logos.
  const cells = [
    // Row 1
    { composite: [
        { src: "/assets/logos/bain-capital.webp",          alt: "Bain Capital" },
        { src: "/assets/logos/notredame-intermedica.webp", alt: "Notredame Intermédica" },
      ] },
    { composite: [
        { src: "/assets/logos/patria.webp",       alt: "Pátria Investimentos" },
        { src: "/assets/logos/athena-saude.svg", alt: "Athena Saúde" },
      ] },
    { src: "/assets/logos/ezze.webp",      alt: "EZZE" },
    { src: "/assets/logos/santander.webp", alt: "Santander Seguros", sub: "seguros" },
    { src: "/assets/logos/hapvida-notredame.webp", alt: "Hapvida · NotreDame Intermédica" },
    // Row 2
    { src: "/assets/logos/aon.webp",       alt: "Aon" },
    { src: "/assets/logos/gallagher.webp", alt: "Gallagher" },
    { src: "/assets/logos/jlt.webp",       alt: "JLT" },
    { src: "/assets/logos/lockton.webp",   alt: "Lockton" },
    { src: "/assets/logos/vis.webp",       alt: "VIS" },
  ];

  const renderItem = (it, key) => (
    <span key={key} className="trustbar__logo-img">
      <img src={it.src} alt={it.alt} title={it.alt} width="200" height="90" loading="lazy" decoding="async"/>
      {it.sub && <span className="trustbar__logo-sub">{it.sub}</span>}
    </span>
  );
  return (
    <section className="trustbar bg-editorial bg-editorial--bl" data-reveal>
      <div className="wrap">
        <div className="trustbar__head">
          <div>
            <div className="eyebrow">{T.eyebrow}</div>
            <h2 className="trustbar__title display">
              {T.title}
            </h2>
          </div>
          <p className="trustbar__note">
            {T.note}
          </p>
        </div>

        <div className="trustbar__experience">
          <div className="eyebrow trustbar__experience-kicker">{T.expKicker}</div>
          {/* Marquee restored (Sesión 4 per Cristian) — eyebrow makes provenance explicit so logos don't read as clients */}
          <div className="trustbar__grid">
            <div className="trustbar__track">
              {[...cells, ...cells].map((c, i) => (
                <div key={i} className={"trustbar__cell" + (c.composite ? " trustbar__cell--composite" : "")}
                  aria-hidden={i >= cells.length ? "true" : undefined}>
                  {c.composite
                    ? c.composite.map((it, j) => renderItem(it, j))
                    : renderItem(c, 0)}
                </div>
              ))}
            </div>
          </div>
          {go && (
            <a href="#about" className="trustbar__cta"
              onClick={(e)=>{e.preventDefault(); go("about")}}>
              {T.teamCta}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// Mid-funnel CTA ribbon — restores the missing "now what?" beat between Proof and Manifesto
export function MidCta({ go }) {
  return (
    <section className="midcta bg-editorial bg-editorial--c" data-reveal>
      <div className="wrap midcta__inner">
        <div className="midcta__text">{T.midCtaText}</div>
        <button className="btn btn--solid" onClick={()=>go("contact")}>
          {T.midCtaBtn} <span className="btn__arrow">→</span>
        </button>
      </div>
    </section>
  );
}

// Manifesto — category-defining statement. Links to the full cornerstone in /insights.
export function Manifesto({ go }) {
  return (
    <section className="manifesto bg-editorial bg-editorial--br" data-reveal>
      <div className="wrap">
        <div className="manifesto__ornament" aria-hidden>* * *</div>
        <div className="manifesto__kicker">{T.mKicker}</div>
        <p className="manifesto__text">{T.mText}</p>
        <div className="manifesto__actions">
          <a className="manifesto__cta" href={MANIFESTO_HREF}>
            {T.mLink} <span aria-hidden="true">→</span>
          </a>
          {go && (
            <a className="manifesto__cta manifesto__cta--alt" href="#contact"
              onClick={(e)=>{e.preventDefault(); go("contact")}}>
              {T.mLink2}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// Na mídia — earned-media credibility band. Borrows third-party press authority
// onto our own domain. PRESS_ITEMS is an array so new coverage drops straight in.
const PRESS = {
  pt: { eyebrow: "· Na mídia", title: <>O mercado <em>já está falando</em> sobre a WIR.</>, read: "Ler a matéria" },
  en: { eyebrow: "· In the press", title: <>The market <em>is already talking</em> about WIR.</>, read: "Read the article" },
  es: { eyebrow: "· En los medios", title: <>El mercado <em>ya está hablando</em> de WIR.</>, read: "Leer la nota" },
}[LANG];

const PRESS_ITEMS = [
  {
    outlet: "Sonho Seguro",
    author: "Denise Bueno",
    date: "Jul 2026",
    headline: "WIR Innovation quer acelerar uso de IA no mercado de seguros",
    href: "https://www.sonhoseguro.com.br/2026/07/wir-innovation-quer-acelerar-uso-de-ia-no-mercado-de-seguros/",
  },
];

export function Press() {
  return (
    <section className="press bg-editorial bg-editorial--c" data-reveal>
      <div className="wrap">
        <div className="press__head">
          <div className="eyebrow">{PRESS.eyebrow}</div>
          <h2 className="press__title display">{PRESS.title}</h2>
        </div>
        <ul className="press__list">
          {PRESS_ITEMS.map((it, i) => (
            <li key={i} className="press__item">
              <a className="press__link-wrap" href={it.href} target="_blank" rel="noopener">
                <div className="press__meta">
                  <span className="press__outlet">{it.outlet}</span>
                  <span className="press__dot" aria-hidden="true">·</span>
                  <span className="press__by">{it.author}</span>
                  <span className="press__dot" aria-hidden="true">·</span>
                  <span className="press__date">{it.date}</span>
                </div>
                <p className="press__quote">“{it.headline}”</p>
                <span className="press__cta">{PRESS.read} <span aria-hidden="true">↗</span></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// Vozes dos fundadores — the two podcast interviews, in their own words.
// Sits after the Manifesto so the last thing before the closing CTA is a human face.
// ES has no translated articles yet, so it points at the PT pair (same rule as INSIGHTS_HREF).
const VOICES = {
  pt: {
    eyebrow: "· Os fundadores, em primeira pessoa",
    title: <>Quem está construindo isso <em>já viveu o problema</em>.</>,
    read: "Ler a entrevista",
  },
  en: {
    eyebrow: "· The founders, in their own words",
    title: <>The people building this <em>lived the problem first</em>.</>,
    read: "Read the interview",
  },
  es: {
    eyebrow: "· Los fundadores, en primera persona",
    title: <>Quienes construyen esto <em>ya vivieron el problema</em>.</>,
    read: "Leer la entrevista",
  },
}[LANG];

const VOICES_ITEMS = [
  {
    name: "Nicholas Weiser",
    role: "CEO · Co-Founder",
    photo: "/assets/team/nicholas.jpg",
    line: { pt: "27 anos em corretoras e seguradoras", en: "27 years across brokers and insurers", es: "27 años en corredoras y aseguradoras" },
    quote: {
      pt: "Eu enxerguei um oceano azul dentro de um oceano vermelho.",
      en: "I saw a blue ocean inside a red one.",
      es: "Vi un océano azul dentro de un océano rojo.",
    },
    href: { pt: "/insights/nicholas-weiser-entrevista/", en: "/insights/nicholas-weiser-entrevista-en/", es: "/insights/nicholas-weiser-entrevista/" },
  },
  {
    name: "José Carlos de Paula",
    role: "CSO · Co-Founder",
    photo: "/assets/team/jose-carlos.jpg",
    line: { pt: "Quatro décadas entre banco, seguro e saúde", en: "Four decades across banking, insurance and healthcare", es: "Cuatro décadas entre banca, seguros y salud" },
    quote: {
      pt: "Ou você surfa a onda inteira, ou você não surfa.",
      en: "Either you ride the whole wave, or you do not ride it.",
      es: "O surfeas la ola entera, o no la surfeas.",
    },
    href: { pt: "/insights/jose-carlos-de-paula-entrevista/", en: "/insights/jose-carlos-de-paula-entrevista-en/", es: "/insights/jose-carlos-de-paula-entrevista/" },
  },
];

export function Voices() {
  return (
    <section className="voices bg-editorial bg-editorial--bl" data-reveal>
      <div className="wrap">
        <div className="voices__head">
          <div className="eyebrow">{VOICES.eyebrow}</div>
          <h2 className="voices__title display">{VOICES.title}</h2>
        </div>
        <ul className="voices__list">
          {VOICES_ITEMS.map((it) => (
            <li key={it.name} className="voices__item">
              <a className="voices__link-wrap" href={it.href[LANG]}>
                <div className="voices__person">
                  <img className="voices__photo" src={it.photo} alt={it.name}
                    width="64" height="64" loading="lazy" decoding="async"/>
                  <div>
                    <div className="voices__name">{it.name}</div>
                    <div className="voices__role">{it.role}</div>
                  </div>
                </div>
                <p className="voices__quote">“{it.quote[LANG]}”</p>
                <div className="voices__line">{it.line[LANG]}</div>
                <span className="voices__cta">{VOICES.read} <span aria-hidden="true">→</span></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HomePage({ go }) {
  useReveal();
  return (
    <>
      <Opening go={go}/>
      <TrustBar go={go}/>
      <Shift/>
      <ProductTabs go={go}/>
      <ArchFlow/>
      <Proof go={go}/>
      <Press/>
      <MidCta go={go}/>
      <Manifesto go={go}/>
      <Voices/>
      <Closing go={go}/>
    </>
  );
}

