"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Skull, EyeOff, ShieldAlert, BookOpen, RotateCcw, Sparkles } from "lucide-react";

// --- CATÁLOGO INTEGRADO CALIBRADO EN 7 DIMENSIONES [T, D, F, M, C, O, P] ---
const CALIBRATED_BOOKS = [
  {
    id: "1",
    title: "El imperio del vampiro",
    author: "Jay Kristoff",
    pages: 752,
    metrics: [65, 78, 85, 70, 60, 82, 68],
    quote: "«La luz ya no nos pertenece; la noche tiene garras y viste de seda.»",
    sample: "Tres años después de que el sol muriera, me trajeron ante el cronista de sangre. Mis manos aún temblaban por la abstinencia, pero la hoja de plata seguía pidiendo nombres...",
    triggers: ["violencia_explicita"],
  },
  {
    id: "2",
    title: "La voz de las espadas",
    author: "Joe Abercrombie",
    pages: 680,
    metrics: [60, 62, 88, 45, 70, 90, 80],
    quote: "«Uno sigue vivo, y eso ya es bastante más de lo que merecen los héroes.»",
    sample: "El inquisidor Glokta subió otro escalón y sintió el latigazo eléctrico en la pierna mutilada. Cinco escalones más y sabría quién iba a confesar hoy en la celda...",
    triggers: [],
  },
  {
    id: "3",
    title: "Hija de ningún mundo",
    author: "Carissa Broadbent",
    pages: 540,
    metrics: [62, 70, 72, 75, 55, 68, 82],
    quote: "«No me enseñaron a rezar; me enseñaron a sobrevivir al fuego.»",
    sample: "El jardín de rosas de Maxantarius olía a tierra húmeda y a magia podrida. Cuando me dijo que entrara en su mente, supe que ninguno de los dos saldría intacto...",
    triggers: [],
  },
  {
    id: "4",
    title: "La fábrica de avispas",
    author: "Iain Banks",
    pages: 240,
    metrics: [75, 45, 92, 80, 65, 95, 90],
    quote: "«Mis postes de sacrificio vigilaban la isla antes de que él escapara del psiquiátrico.»",
    sample: "Acababa de revisar las cabezas en los límites de las dunas cuando sonó el teléfono. Era Eric. Su voz tenía ese crujido metálico de quien lleva días viendo arder perros...",
    triggers: ["violencia_animal"],
  },
  {
    id: "5",
    title: "Eisenhorn: Xenos",
    author: "Dan Abnett",
    pages: 350,
    metrics: [82, 65, 78, 30, 75, 85, 65],
    quote: "«Mi paciencia tiene límites; mi autoridad como Inquisidor, ninguno.»",
    sample: "Las cámaras de criogenia de Hubris goteaban escarcha negra. Eyclone ya había abierto los ataúdes antes de que mi revólver hablara en la oscuridad...",
    triggers: [],
  },
  {
    id: "6",
    title: "Los renglones torcidos de Dios",
    author: "Torcuato Luca de Tena",
    pages: 448,
    metrics: [70, 68, 45, 55, 88, 72, 96],
    quote: "«La frontera entre el genio y el delirio es una puerta cerrada por fuera.»",
    sample: "Alice Gould cruzó el rastrillo del pabellón psiquiátrico convencida de que su expediente como detective privada la sacaría de allí en una semana. Nadie le dijo que el médico tenía otra historia...",
    triggers: ["final_abierto"],
  },
  {
    id: "7",
    title: "El club de la lucha",
    author: "Chuck Palahniuk",
    pages: 224,
    metrics: [90, 25, 80, 82, 78, 95, 85],
    quote: "«Con una pistola entre los dientes, solo hablas con vocales.»",
    sample: "Tyler me consigue un trabajo de camarero, después Tyler me mete el cañón en la boca y dice que el primer paso hacia la vida eterna es que tienes que morir esta noche...",
    triggers: [],
  },
  {
    id: "8",
    title: "Meridiano de sangre",
    author: "Cormac McCarthy",
    pages: 384,
    metrics: [42, 95, 99, 25, 55, 99, 75],
    quote: "«Todo lo que existe en la creación sin mi conocimiento, existe sin mi permiso.»",
    sample: "Cabalgaron por el desierto rojo como fantasmas cubiertos de ceniza seca, con los collares de orejas tintineando al paso de los caballos famélicos bajo un sol de cobre...",
    triggers: ["violencia_animal"],
  },
];

const AXIS_LABELS = ["TEMPO", "DENSIDAD", "CRUDEZA", "MORBO", "COMPLEJIDAD", "NIHILISMO", "PSIQUE"];

export default function ADNLectorApp() {
  const [step, setStep] = useState<number>(1);
  // Vector del usuario: [Tempo, Densidad, Crudeza, Morbo, Complejidad, Nihilismo, Psique]
  const [vec, setVec] = useState<number[]>([50, 50, 50, 50, 50, 50, 50]);
  const [goreSlider, setGoreSlider] = useState<number>(60);
  const [maxPages, setMaxPages] = useState<number>(900);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [sampleOpen, setSampleOpen] = useState<boolean>(false);

  const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));

  const updateVec = (deltas: number[], nextStep: number) => {
    setVec((prev) => prev.map((v, i) => clamp(v + (deltas[i] || 0))));
    setStep(nextStep);
  };

  // --- CÁLCULO DEL TOP RECOMENDADO ---
  const computeResults = () => {
    const weights = [0.18, 0.14, 0.20, 0.16, 0.10, 0.12, 0.10];
    return CALIBRATED_BOOKS.filter(
      (b) => b.pages <= maxPages && !b.triggers.some((t) => excluded.includes(t))
    )
      .map((book) => {
        const dist = Math.sqrt(
          weights.reduce((acc, w, i) => acc + w * Math.pow((vec[i] - book.metrics[i]) / 100, 2), 0)
        );
        const match = Math.min(99.4, Math.max(72.0, Number((72 + 27.4 * Math.pow(1 - dist, 1.4)).toFixed(1))));
        return { ...book, match };
      })
      .sort((a, b) => b.match - a.match);
  };

  const results = step === 99 ? computeResults() : [];
  const activeBook = selectedBook || results[0];

  const getArchetype = () => {
    if (vec[0] >= 65 && vec[1] <= 45) return { name: "El Cirujano Frío", desc: "Buscas prosa afilada como un bisturí, tracción inmediata y cero anestesia moral." };
    if (vec[1] >= 62 && vec[5] >= 68) return { name: "El Arquitecto de Sombras", desc: "Habitas mundos densos, catedrales en ruinas y tramas donde ningún inocente sale ileso." };
    return { name: "El Hereje Sensorial", desc: "Te atraen las dinámicas de poder intensas, el subtexto psicológico y la mente al límite." };
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#EAE6DF] flex flex-col justify-between select-none">
      {/* CABECERA SUPERIOR */}
      <header className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E5383B] animate-pulse" />
          <span className="font-mono-tech text-[11px] tracking-[0.2em] text-neutral-400">
            ADN LECTOR // ALGORITMO LITERARIO
          </span>
        </div>
        {step < 99 && (
          <span className="font-mono-tech text-xs text-neutral-500">PASO 0{step} / 06</span>
        )}
      </header>

      {/* CONTENIDO CENTRAL INTERACTIVO */}
      <main className="flex-1 w-full max-w-xl mx-auto p-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* PASO 1: SPLIT VISUAL A/B */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              <span className="font-mono-tech text-[10px] tracking-[0.25em] text-[#E5383B] uppercase">
                FASE 01 // DENSIDAD SENSORIAL
              </span>
              <h1 className="font-editorial text-4xl text-[#F4F1EA]">«Sin pensarlo dos veces. ¿Dónde te quedas?»</h1>
              <div className="grid grid-cols-1 gap-4 pt-2">
                <button
                  onClick={() => updateVec([-15, +30, +10, 0, +10, +15, +10], 2)}
                  className="h-44 relative overflow-hidden border border-white/15 hover:border-[#E5383B] p-6 flex flex-col justify-end text-left group"
                >
                  <div className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80)" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="relative z-10">
                    <span className="font-mono-tech text-[10px] text-[#E5383B] tracking-widest">OPCIÓN A // CLAROSCURO BARROCO</span>
                    <p className="font-editorial text-2xl italic text-white">Terciopelo, humo, ruina gótica y detalle denso</p>
                  </div>
                </button>

                <button
                  onClick={() => updateVec([+30, -25, +5, 0, -10, +10, -5], 2)}
                  className="h-44 relative overflow-hidden border border-white/15 hover:border-[#E5383B] p-6 flex flex-col justify-end text-left group"
                >
                  <div className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80)" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="relative z-10">
                    <span className="font-mono-tech text-[10px] text-[#E5383B] tracking-widest">OPCIÓN B // CORTE QUIRÚRGICO</span>
                    <p className="font-editorial text-2xl italic text-white">Asfalto mojado, niebla limpia y tracción directa</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* PASO 2: PÍLDORAS DE ASOCIACIÓN VISCERAL */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <span className="font-mono-tech text-[10px] tracking-[0.25em] text-[#E5383B]">FASE 02 // IMPULSO LÉXICO</span>
              <h1 className="font-editorial text-4xl text-[#F4F1EA]">«Toca la primera palabra que te queme los ojos:»</h1>
              <div className="grid grid-cols-1 gap-3 pt-2">
                {[
                  { w: "HERRUMBRE", s: "Decadencia · Atmósfera · Slow-burn", d: [-15, +25, +5, 0, +10, +15, +10] },
                  { w: "IMPACTO", s: "Frenesí · Visceralidad · Adrenalina", d: [+28, -15, +20, 0, -5, +10, -10] },
                  { w: "SECRETO", s: "Subtexto · Misterio · Puzle mental", d: [+5, +10, -10, +10, +30, +5, +25] },
                  { w: "DELIRIO", s: "Narrador roto · Obsesión · Sombra", d: [+10, +5, +15, +25, +20, +25, +25] },
                ].map((item) => (
                  <button
                    key={item.w}
                    onClick={() => updateVec(item.d, 3)}
                    className="p-5 border border-white/15 bg-[#121214] hover:border-[#E5383B] text-left flex justify-between items-center transition-all"
                  >
                    <div>
                      <span className="font-editorial text-3xl text-white block">{item.w}</span>
                      <span className="font-mono-tech text-[10px] text-neutral-400 uppercase">{item.s}</span>
                    </div>
                    <span className="font-mono-tech text-xs text-[#E5383B]">→</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* PASO 3: EL GATILLO NARRATIVO */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <span className="font-mono-tech text-[10px] tracking-[0.25em] text-[#E5383B]">FASE 03 // CADENCIA Y VOZ</span>
              <h1 className="font-editorial text-4xl text-[#F4F1EA]">«Alguien entra armado en la sala. ¿Qué exiges al autor?»</h1>
              <div className="space-y-3 pt-2">
                {[
                  { c: "01 // CORTE EN SECO", t: "«Que corte al segundo exacto en que suena el disparo y la sangre salpica la pared.»", d: [+25, -20, +20, 0, -10, +10, -15] },
                  { c: "02 // PULSO PSICOLÓGICO", t: "«Que detenga el reloj para explicarme el temblor en las manos del atacante y el olor a hierro.»", d: [-15, +25, +5, +10, +10, +10, +30] },
                  { c: "03 // GIRO DE ARQUITECTURA", t: "«Que me revele que quien sostiene el arma no es quien creíamos, cambiando todo lo leído.»", d: [+10, 0, 0, 0, +35, +5, +15] },
                ].map((o) => (
                  <button key={o.c} onClick={() => updateVec(o.d, 4)} className="w-full p-5 border border-white/15 bg-[#121214] hover:border-[#E5383B] text-left">
                    <span className="font-mono-tech text-[10px] text-[#E5383B] block mb-1">{o.c}</span>
                    <p className="font-editorial text-2xl italic text-white">{o.t}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* PASO 4: EL DIAL DE CRUDEZA Y GORE */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <span className="font-mono-tech text-[10px] tracking-[0.25em] text-[#E5383B]">FASE 04 // UMBRAL DE DAÑO FÍSICO</span>
              <h1 className="font-editorial text-4xl text-[#F4F1EA]">«Nivel de crudeza visceral en combate o tragedia:»</h1>

              <div className="p-6 border border-[#9E2A2B] bg-[#160D0E] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono-tech text-xs text-[#E5383B]">
                    {goreSlider < 35 ? "NIVEL 1 // ELIPSIS ELEGANTE" : goreSlider < 75 ? "NIVEL 2 // REALISMO CRUDO" : "NIVEL 3 // CARNICERÍA SIN CENSURA"}
                  </span>
                  <span className="font-mono-tech text-2xl text-white">{goreSlider}%</span>
                </div>
                <p className="text-sm text-neutral-300 font-light">
                  {goreSlider < 35
                    ? "La cámara se aparta antes del golpe. Importa la tensión emocional, no la anatomía rota."
                    : goreSlider < 75
                    ? "Las heridas duelen y tienen peso real, sin recrearse gratuitamente en la tortura."
                    : "Sin anestesia: hueso fracturado, hierro, barro y horror visceral en primer plano."}
                </p>
                <input
                  type="range"
                  min={5}
                  max={99}
                  value={goreSlider}
                  onChange={(e) => setGoreSlider(Number(e.target.value))}
                  className="w-full accent-[#E5383B] cursor-pointer mt-4"
                />
              </div>

              <button
                onClick={() => {
                  setVec((prev) => [prev[0], prev[1], goreSlider, prev[3], prev[4], prev[5], prev[6]]);
                  setStep(5);
                }}
                className="w-full py-4 bg-[#9E2A2B] hover:bg-[#B23233] text-white font-mono-tech text-xs tracking-[0.2em] uppercase"
              >
                FIJAR UMBRAL DE CRUDEZA ({goreSlider}%) →
              </button>
            </motion.div>
          )}

          {/* PASO 5: MORBO, TENSIÓN Y RELACIONES */}
          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <span className="font-mono-tech text-[10px] tracking-[0.25em] text-[#E5383B]">FASE 05 // DISTANCIAS CORTAS</span>
              <h1 className="font-editorial text-4xl text-[#F4F1EA]">«En los vínculos entre personajes, ¿qué buscas?»</h1>
              <div className="space-y-3 pt-2">
                {[
                  { c: "01 // CERO ROMANCE", t: "Foco táctico y supervivencia. Que la trama no se frene por dramas sentimentales.", d: [+10, 0, 0, -35, 0, +10, -10] },
                  { c: "02 // SLOW-BURN CON FILO", t: "Dos enemigos que se destruirían o se besarían con la misma rabia contenida.", d: [0, +10, 0, +20, +5, +5, +15] },
                  { c: "03 // TRANSGRESIÓN Y OBSESIÓN", t: "Vínculos tóxicos, juegos de poder oscuros, morbo explícito y cero moralina.", d: [0, +5, +10, +40, +10, +25, +20] },
                ].map((o) => (
                  <button key={o.c} onClick={() => updateVec(o.d, 6)} className="w-full p-5 border border-white/15 bg-[#121214] hover:border-[#E5383B] text-left">
                    <span className="font-mono-tech text-[10px] text-[#E5383B] block mb-1">{o.c}</span>
                    <p className="font-editorial text-2xl text-white">{o.t}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* PASO 6: CALIBRACIÓN DE PÁGINAS Y LÍNEAS ROJAS */}
          {step === 6 && (
            <motion.div key="s6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <span className="font-mono-tech text-[10px] tracking-[0.25em] text-[#E5383B]">FASE 06 // RESTRICCIONES REALES</span>
              <h1 className="font-editorial text-4xl text-[#F4F1EA]">«Ajuste de cuentas con tu tiempo real:»</h1>

              <div>
                <span className="font-mono-tech text-[10px] text-neutral-400 block mb-2">VOLUMEN MÁXIMO DE LA NOVELA:</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMaxPages(460)}
                    className={`p-4 border text-left ${maxPages === 460 ? "border-[#E5383B] bg-[#9E2A2B]/20" : "border-white/15 bg-[#121214]"}`}
                  >
                    <span className="font-editorial text-2xl text-white block">Directo al hueso</span>
                    <span className="font-mono-tech text-[10px] text-neutral-400">Menos de 450 páginas</span>
                  </button>
                  <button
                    onClick={() => setMaxPages(1200)}
                    className={`p-4 border text-left ${maxPages === 1200 ? "border-[#E5383B] bg-[#9E2A2B]/20" : "border-white/15 bg-[#121214]"}`}
                  >
                    <span className="font-editorial text-2xl text-white block">Sin límite / Saga</span>
                    <span className="font-mono-tech text-[10px] text-neutral-400">Acepto tomos de +600 págs</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="font-mono-tech text-[10px] text-neutral-400 block mb-2">LÍNEAS ROJAS (DESCARTAR SI INCLUYE):</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "violencia_animal", l: "Crueldad hacia animales" },
                    { id: "final_abierto", l: "Finales abiertos" },
                  ].map((tr) => {
                    const active = excluded.includes(tr.id);
                    return (
                      <button
                        key={tr.id}
                        onClick={() => setExcluded((prev) => (active ? prev.filter((x) => x !== tr.id) : [...prev, tr.id]))}
                        className={`px-3 py-2 border font-mono-tech text-xs ${active ? "border-[#E5383B] bg-[#9E2A2B]/30 text-white" : "border-white/15 text-neutral-400"}`}
                      >
                        {active ? "✕ " : "+ "} {tr.l}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setStep(99)}
                className="w-full py-4 bg-[#E5383B] hover:bg-[#9E2A2B] text-white font-mono-tech text-xs tracking-[0.25em] uppercase font-semibold"
              >
                CALCULAR VECTOR Y REVELAR TOP →
              </button>
            </motion.div>
          )}

          {/* PANTALLA FINAL DE RESULTADOS + RADAR SVG DE 7 EJES */}
          {step === 99 && activeBook && (
            <motion.div key="results" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
              <div className="border-b border-white/10 pb-4 flex justify-between items-start">
                <div>
                  <span className="font-mono-tech text-[10px] tracking-[0.25em] text-[#E5383B] uppercase">
                    ARQUETIPO DETECTADO
                  </span>
                  <h1 className="font-editorial text-4xl sm:text-5xl text-white mt-1">{getArchetype().name}</h1>
                  <p className="text-xs text-neutral-400 mt-1">{getArchetype().desc}</p>
                </div>
                <button
                  onClick={() => {
                    setVec([50, 50, 50, 50, 50, 50, 50]);
                    setSelectedBook(null);
                    setStep(1);
                  }}
                  className="p-2 border border-white/15 text-neutral-400 hover:text-white"
                  title="Repetir test"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* RADAR SVG POLIGONAL DE 7 EJES */}
              <div className="bg-[#121214] border border-white/10 p-4 flex flex-col items-center">
                <div className="w-full flex justify-between font-mono-tech text-[10px] text-neutral-400 mb-2">
                  <span className="text-[#E5383B]">■ TU ADN LECTOR</span>
                  <span className="text-white">□ {activeBook.title.toUpperCase()}</span>
                </div>
                <RadarChartSVG userVec={vec} bookVec={activeBook.metrics} />
              </div>

              {/* TARJETA DEL LIBRO SELECCIONADO */}
              <div className="border border-[#9E2A2B] bg-gradient-to-b from-[#1A0D0E] to-[#0E0E11] p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono-tech text-[10px] text-[#E5383B] tracking-widest uppercase">
                      COMPATIBILIDAD MATEMÁTICA
                    </span>
                    <h2 className="font-editorial text-3xl text-white">{activeBook.title}</h2>
                    <p className="font-mono-tech text-xs text-neutral-400">
                      {activeBook.author} · {activeBook.pages} PÁGS
                    </p>
                  </div>
                  <span className="font-mono-tech text-3xl text-[#E5383B] font-semibold">{activeBook.match}%</span>
                </div>

                <blockquote className="border-l-2 border-[#E5383B] pl-3 font-editorial text-xl italic text-neutral-200">
                  {activeBook.quote}
                </blockquote>

                <button
                  onClick={() => setSampleOpen(true)}
                  className="w-full py-3 bg-[#9E2A2B] hover:bg-[#B23233] text-white font-mono-tech text-xs tracking-widest uppercase flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" /> CATAR PRIMERAS LÍNEAS SIN FILTRO
                </button>
              </div>

              {/* LISTA DEL RANKING COMPLETO */}
              <div className="space-y-2">
                <span className="font-mono-tech text-[10px] text-neutral-500 tracking-widest block">
                  TOCA CUALQUIER NOVELA PARA COMPARAR SU POLÍGONO EN EL RADAR:
                </span>
                {results.map((b, i) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBook(b)}
                    className={`w-full p-3.5 border flex justify-between items-center text-left transition-all ${
                      activeBook.id === b.id ? "border-[#E5383B] bg-white/[0.06]" : "border-white/10 bg-[#121214]"
                    }`}
                  >
                    <div>
                      <span className="font-mono-tech text-xs text-neutral-500 mr-3">#0{i + 1}</span>
                      <span className="font-editorial text-xl text-white">{b.title}</span>
                      <span className="font-mono-tech text-[10px] text-neutral-400 ml-2">— {b.author}</span>
                    </div>
                    <span className="font-mono-tech text-xs text-[#E5383B]">{b.match}%</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MODAL DE CATA DE PRIMERA PÁGINA */}
      {sampleOpen && activeBook && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#121214] border border-white/20 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="font-mono-tech text-[10px] text-[#E5383B]">CATA DE PROSA // {activeBook.title}</span>
              <button onClick={() => setSampleOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="font-editorial text-2xl leading-relaxed text-[#F4F1EA] italic">«{activeBook.sample}»</p>
            <a
              href={`https://www.amazon.es/s?k=${encodeURIComponent(activeBook.title + " " + activeBook.author)}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center py-3 bg-[#E5383B] text-white font-mono-tech text-xs uppercase tracking-widest"
            >
              BUSCAR EJEMPLAR EN LIBRERÍAS →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTE: RADAR DE 7 PUNTAS EN SVG ---
function RadarChartSVG({ userVec, bookVec }: { userVec: number[]; bookVec: number[] }) {
  const size = 230;
  const c = size / 2;
  const r = 82;

  const pt = (val: number, i: number, rad = r) => {
    const a = (Math.PI * 2 * i) / 7 - Math.PI / 2;
    const d = (val / 100) * rad;
    return `${c + d * Math.cos(a)},${c + d * Math.sin(a)}`;
  };

  return (
    <svg width={size} height={size} className="overflow-visible my-2">
      {[35, 70, 100].map((lvl) => (
        <polygon key={lvl} points={[0, 1, 2, 3, 4, 5, 6].map((i) => pt(lvl, i)).join(" ")} fill="none" stroke="rgba(255,255,255,0.08)" />
      ))}
      {AXIS_LABELS.map((lbl, i) => {
        const [lx, ly] = pt(118, i).split(",");
        return (
          <text key={lbl} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="fill-neutral-400 font-mono-tech text-[8px]">
            {lbl}
          </text>
        );
      })}
      <polygon points={bookVec.map((v, i) => pt(v, i)).join(" ")} fill="rgba(255,255,255,0.08)" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 2" />
      <polygon points={userVec.map((v, i) => pt(v, i)).join(" ")} fill="rgba(229,56,59,0.28)" stroke="#E5383B" strokeWidth="2" />
    </svg>
  );
}
