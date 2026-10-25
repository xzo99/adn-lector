"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  PanInfo,
} from "framer-motion";
import {
  Check,
  X,
  Skull,
  EyeOff,
  ShieldAlert,
  BookOpen,
  RotateCcw,
  Sparkles,
  Pill,
  ArrowRight,
  Share2,
  Bookmark,
  Zap,
  Moon,
  Scissors,
  ArrowLeftRight,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
} from "lucide-react";

// ============================================================================
// 1. CATÁLOGO CALIBRADO EN 7 EJES [Tempo, Densidad, Crudeza, Morbo, Complejidad, Nihilismo, Psique]
// ============================================================================
interface BookData {
  id: string;
  title: string;
  author: string;
  pages: number;
  metrics: number[];
  pov: string;
  quote: string;
  sample: string;
  triggers: string[];
}

const MASTER_CATALOG: BookData[] = [
  {
    id: "bk_1",
    title: "El imperio del vampiro",
    author: "Jay Kristoff",
    pages: 752,
    metrics: [68, 78, 86, 72, 62, 84, 70],
    pov: "1ª Persona Crónica",
    quote: "«La luz ya no nos pertenece; la noche tiene garras y viste de seda.»",
    sample:
      "Tres años después de que el sol muriera, me trajeron encadenado ante el cronista de sangre. Mis manos aún temblaban por la abstinencia del polvo estelar, pero la hoja de plata fría seguía pidiendo nombres en la oscuridad de la celda...",
    triggers: ["consumo_drogas"],
  },
  {
    id: "bk_2",
    title: "La voz de las espadas",
    author: "Joe Abercrombie",
    pages: 680,
    metrics: [62, 60, 88, 42, 72, 92, 82],
    pov: "Coral Múltiple",
    quote: "«Uno sigue vivo, y eso ya es bastante más de lo que merecen los héroes.»",
    sample:
      "El inquisidor Glokta subió otro escalón de piedra húmeda y sintió el latigazo eléctrico en la pierna mutilada. Cinco peldaños más de agonía y sabría quién iba a confesar hoy bajo las tenazas...",
    triggers: [],
  },
  {
    id: "bk_3",
    title: "Hija de ningún mundo",
    author: "Carissa Broadbent",
    pages: 540,
    metrics: [64, 70, 74, 76, 55, 68, 84],
    pov: "1ª Persona Dual",
    quote: "«No me enseñaron a rezar; me enseñaron a sobrevivir al fuego.»",
    sample:
      "El jardín de rosas de Maxantarius olía a tierra húmeda y a magia podrida. Cuando me exigió que derribara los muros de mi propia mente para entrenar, supe que ninguno de los dos saldría intacto de aquella guerra...",
    triggers: [],
  },
  {
    id: "bk_4",
    title: "La fábrica de avispas",
    author: "Iain Banks",
    pages: 240,
    metrics: [76, 48, 92, 82, 68, 96, 92],
    pov: "1ª Persona Íntima",
    quote: "«Mis postes de sacrificio vigilaban la isla antes de que él escapara del psiquiátrico.»",
    sample:
      "Acababa de revisar las cabezas en los límites de las dunas cuando sonó el teléfono de casa. Era Eric. Su voz tenía ese crujido metálico de quien lleva días caminando hacia casa viendo arder perros en la cuneta...",
    triggers: ["violencia_animal"],
  },
  {
    id: "bk_5",
    title: "Eisenhorn: Xenos",
    author: "Dan Abnett",
    pages: 350,
    metrics: [84, 64, 78, 30, 74, 85, 66],
    pov: "1ª Persona Táctica",
    quote: "«Mi paciencia tiene límites; mi autoridad como Inquisidor, ninguno.»",
    sample:
      "Las cámaras de criogenia de Hubris goteaban escarcha negra sobre el metal oxidado. Eyclone ya había profanado los ataúdes durmientes antes de que mi arma hablara en la penumbra...",
    triggers: [],
  },
  {
    id: "bk_6",
    title: "Los renglones torcidos de Dios",
    author: "Torcuato Luca de Tena",
    pages: 448,
    metrics: [70, 68, 42, 52, 88, 72, 96],
    pov: "3ª Psicológica",
    quote: "«La frontera entre el genio y el delirio es una puerta cerrada por fuera.»",
    sample:
      "Alice Gould cruzó el rastrillo del pabellón psiquiátrico convencida de que su expediente como investigadora privada la sacaría de allí en una semana. Nadie le advirtió que el director tenía otra versión de su cordura...",
    triggers: ["final_abierto"],
  },
  {
    id: "bk_7",
    title: "El club de la lucha",
    author: "Chuck Palahniuk",
    pages: 224,
    metrics: [92, 24, 80, 84, 78, 95, 86],
    pov: "1ª Persona Esquizoide",
    quote: "«Con una pistola entre los dientes, solo hablas con vocales.»",
    sample:
      "Tyler me consigue un trabajo de camarero, después Tyler me mete el cañón frío en la boca y dice que el primer paso hacia la vida eterna es que tienes que morir esta misma noche...",
    triggers: ["consumo_drogas"],
  },
  {
    id: "bk_8",
    title: "Meridiano de sangre",
    author: "Cormac McCarthy",
    pages: 384,
    metrics: [42, 96, 99, 25, 58, 99, 76],
    pov: "3ª Cámara Fría",
    quote: "«Todo lo que existe en la creación sin mi conocimiento, existe sin mi permiso.»",
    sample:
      "Cabalgaron por el desierto rojo como fantasmas cubiertos de ceniza mineral, con los collares de orejas secas tintineando al paso de los caballos famélicos bajo un sol de cobre fundido...",
    triggers: ["violencia_animal"],
  },
  {
    id: "bk_9",
    title: "Nuestra parte de noche",
    author: "Mariana Enríquez",
    pages: 672,
    metrics: [48, 86, 85, 82, 76, 88, 90],
    pov: "Coral Generacional",
    quote: "«La Oscuridad no pide fe: pide carne joven y puertas abiertas.»",
    sample:
      "Juan sabía que su hijo había heredado la garra del médium desde el instante en que las uñas negras asomaron tras la fiebre. La Orden ya estaba esperando en la carretera hacia el norte...",
    triggers: ["consumo_drogas"],
  },
  {
    id: "bk_10",
    title: "Neuromante",
    author: "William Gibson",
    pages: 320,
    metrics: [78, 82, 55, 50, 84, 86, 62],
    pov: "3ª Noir Cibernética",
    quote: "«El cielo sobre el puerto tenía el color de un televisor sintonizado en un canal muerto.»",
    sample:
      "Case tenía veinticuatro años y habían quemado su sistema nervioso con micotoxinas rusas en un hotel barato de Chiba. Ya no podía conectarse a la matriz, pero Molly tenía un trabajo nuevo...",
    triggers: ["consumo_drogas"],
  },
  {
    id: "bk_11",
    title: "Battle Royale",
    author: "Koushun Takami",
    pages: 616,
    metrics: [95, 32, 94, 48, 30, 88, 65],
    pov: "Coral Supervivencia",
    quote: "«Cuarenta y dos alumnos. Tres días. Solo puede quedar uno respirando.»",
    sample:
      "El collar metálico alrededor de la garganta de Shuya emitió un pitido sordo cuando el profesor abrió la maleta militar. Nadie creyó que las balas fueran reales hasta que cayó la primera compañera...",
    triggers: [],
  },
  {
    id: "bk_12",
    title: "El secreto",
    author: "Donna Tartt",
    pages: 650,
    metrics: [32, 90, 40, 68, 65, 78, 95],
    pov: "1ª Persona Confesional",
    quote: "«La belleza es terror. Todo lo que llamamos hermoso nos hace temblar.»",
    sample:
      "La nieve cubrió el barranco de Vermont dos días después de que dejáramos el cuerpo entre los helechos. Ninguno de los cinco mencionó la sangre en el abrigo de Henry durante el desayuno...",
    triggers: ["consumo_drogas"],
  },
];

const AXIS_LABELS = [
  "TEMPO",
  "DENSIDAD",
  "CRUDEZA",
  "MORBO",
  "COMPLEJIDAD",
  "NIHILISMO",
  "PSIQUE",
];

// Cartas de la Pantalla 5 (Swipe Tinder)
const NARRATOR_CARDS = [
  {
    id: "POV_1",
    tag: "PACTO 01 // 1ª PERSONA ÍNTIMA",
    title: "El Protagonista Quebrado",
    quote:
      "«Toma decisiones estúpidas y moralmente reprochables, pero estás encerrado dentro de su cabeza escuchando cada justificación.»",
    delta: [0, 0, 0, +10, 0, +20, +25],
  },
  {
    id: "POV_2",
    tag: "PACTO 02 // CÁMARA QUIRÚRGICA",
    title: "El Testigo Implacable",
    quote:
      "«Un narrador distante que no juzga a nadie, no siente piedad y deja que los cadáveres y los actos hablen por sí solos.»",
    delta: [+10, -10, +15, 0, 0, +15, -20],
  },
  {
    id: "POV_3",
    tag: "PACTO 03 // MOSAICO CORAL",
    title: "La Ruleta Rusa",
    quote:
      "«Seis puntos de vista en bandos opuestos. Vas a empatizar con el verdugo y vas a encariñarte con alguien que morirá en tres capítulos.»",
    delta: [0, +10, +20, 0, +25, +15, +10],
  },
];

const LOADING_PHRASES = [
  "Midiendo tu tolerancia al daño físico y moral...",
  "Descartando literatura complaciente...",
  "Calculando distancia euclidiana en 7 dimensiones...",
  "Cruzando tu vector con el catálogo calibrado...",
  "Generando tu Top 10 de afinidad...",
];

// ============================================================================
// 2. COMPONENTE PRINCIPAL DE LA APLICACIÓN (LAS 12 PANTALLAS + RESULTADOS)
// ============================================================================
export default function ADNLectorCompleteApp() {
  // Paso actual: 1 a 12, 50 (Calculando 4s), 99 (Resultados)
  const [step, setStep] = useState<number>(1);

  // Vector de 7 ejes [Tempo, Densidad, Crudeza, Morbo, Complejidad, Nihilismo, Psique]
  const [vec, setVec] = useState<number[]>([50, 50, 50, 50, 50, 50, 50]);
  const [weights, setWeights] = useState<number[]>([
    0.18, 0.14, 0.2, 0.16, 0.1, 0.12, 0.1,
  ]);

  // Estados específicos de pantallas
  const [cardIdx, setCardIdx] = useState<number>(0); // P5 Tinder
  const [goreVal, setGoreVal] = useState<number>(60); // P7 Dial
  const [substancesOn, setSubstancesOn] = useState<boolean>(false); // P9
  const [nihilismOn, setNihilismOn] = useState<boolean>(true); // P9
  const [brainState, setBrainState] = useState<"fundido" | "despejado">("despejado"); // P11
  const [maxPages, setMaxPages] = useState<number>(950); // P11
  const [excluded, setExcluded] = useState<string[]>([]); // P12

  // Estados del Dashboard Final
  const [loadingIdx, setLoadingIdx] = useState<number>(0);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [sampleModal, setSampleModal] = useState<boolean>(false);
  const [synapseMode, setSynapseMode] = useState<boolean>(false);
  const [partnerPreset, setPartnerPreset] = useState<number[]>([85, 30, 35, 80, 45, 50, 75]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const clamp = (n: number) => Math.min(99, Math.max(5, Math.round(n)));

  const triggerHaptic = (pattern: number | number[] = 18) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // --- TEMPORIZADOR DE 5 SEGUNDOS EN PANTALLA 1 ---
  useEffect(() => {
    if (step !== 1) return;
    const timer = setTimeout(() => {
      advanceWithDelta([0, 0, 0, 0, 0, 0, 0], 2);
    }, 5000);
    return () => clearTimeout(timer);
  }, [step]);

  // --- TRANSICIÓN DE 4 SEGUNDOS DE CÁLCULO (PASO 50 -> 99) ---
  useEffect(() => {
    if (step !== 50) return;
    const interval = setInterval(() => {
      setLoadingIdx((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 750);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setStep(99);
    }, 3400);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [step]);

  const advanceWithDelta = (deltas: number[], nextStep: number) => {
    triggerHaptic(20);
    setVec((prev) => prev.map((v, i) => clamp(v + (deltas[i] || 0))));
    setStep(nextStep);
  };

  // --- CÁLCULO MATEMÁTICO DEL TOP 10 (INDIVIDUAL O MODO SINAPSIS) ---
  const computeRanking = () => {
    // Si Modo Sinapsis está activo, aplicamos la Regla del Umbral Protector en Crudeza [2] y Morbo [3]
    const targetVec = synapseMode
      ? [
          (vec[0] + partnerPreset[0]) / 2,
          (vec[1] + partnerPreset[1]) / 2,
          Math.min(vec[2], partnerPreset[2]) + 0.2 * Math.abs(vec[2] - partnerPreset[2]),
          Math.min(vec[3], partnerPreset[3]) + 0.2 * Math.abs(vec[3] - partnerPreset[3]),
          (vec[4] + partnerPreset[4]) / 2,
          (vec[5] + partnerPreset[5]) / 2,
          (vec[6] + partnerPreset[6]) / 2,
        ]
      : vec;

    // Filtrar por Líneas Rojas (Triggers) y Páginas (con fallback si quedan pocos)
    let pool = MASTER_CATALOG.filter(
      (b) =>
        b.pages <= maxPages && !b.triggers.some((t) => excluded.includes(t))
    );
    if (pool.length < 4) {
      pool = MASTER_CATALOG.filter(
        (b) => !b.triggers.some((t) => excluded.includes(t))
      );
    }

    return pool
      .map((book) => {
        const dist = Math.sqrt(
          weights.reduce(
            (acc, w, i) =>
              acc + w * Math.pow((targetVec[i] - book.metrics[i]) / 100, 2),
            0
          )
        );
        const match = Math.min(
          98.9,
          Math.max(73.0, Number((72 + 27 * Math.pow(1 - dist, 1.45)).toFixed(1)))
        );

        // Explicación dinámica según el eje más cercano
        let why =
          "Alineación directa con tu perfil psicológico: personajes moralmente grises atrapados en decisiones sin salida limpia.";
        if (book.metrics[2] >= 80 && targetVec[2] >= 70) {
          why =
            "Tu umbral de fricción es alto: esta obra no desvía la cámara del impacto físico ni maquilla las consecuencias viscerales.";
        } else if (book.metrics[0] >= 75 && targetVec[0] >= 70) {
          why =
            "Clavado para tu necesidad de tracción: capítulos de corte afilado y aceleración constante desde la primera página.";
        } else if (book.metrics[1] >= 75 && targetVec[1] >= 65) {
          why =
            "Encaja con tu apetito sensorial: prosa con textura barroca, atmósfera densa y construcción de mundo inmersiva.";
        }

        return { ...book, match, why };
      })
      .sort((a, b) => b.match - a.match)
      .slice(0, 10);
  };

  const rankedBooks = step === 99 ? computeRanking() : [];
  const activeBook = selectedBook || rankedBooks[0];

  const getArchetype = () => {
    if (vec[0] >= 68 && vec[1] <= 45)
      return {
        name: "El Cirujano Frío",
        tagline:
          "Buscas prosa afilada como un bisturí, tracción inmediata y cero anestesia moral.",
        quote: "«Corta el adorno. Enséñame la herida.»",
      };
    if (vec[1] >= 62 && vec[5] >= 68)
      return {
        name: "El Arquitecto de Sombras",
        tagline:
          "Habitas mundos densos, catedrales en ruinas y tramas donde ningún inocente sale ileso.",
        quote: "«La luz es solo una excusa para proyectar sombras más largas.»",
      };
    if (vec[3] >= 68)
      return {
        name: "El Hereje Sensorial",
        tagline:
          "Te atraen las dinámicas de poder corrosivas, el deseo con filo y la mente al límite.",
        quote: "«Lo que no quema, no merece ser leído.»",
      };
    return {
      name: "El Estratega Lúcido",
      tagline:
        "Valoras la tensión medida, los mecanismos de relojería narrativa y los giros con peso real.",
      quote: "«Cada pieza en el tablero tiene un precio.»",
    };
  };

  // --- GENERADOR DE TARJETA PNG 9:16 EN CANVAS NATIVO PARA STORIES ---
  const handleDownloadStoryCard = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const arch = getArchetype();

    // Fondo negro carbón + Marco brutalista
    ctx.fillStyle = "#0B0B0C";
    ctx.fillRect(0, 0, 1080, 1920);
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 3;
    ctx.strokeRect(48, 48, 984, 1824);

    // Cabecera
    ctx.fillStyle = "#E5383B";
    ctx.font = "28px monospace";
    ctx.fillText("EXPEDIENTE // ADN LECTOR 2026", 100, 140);

    ctx.fillStyle = "#F4F1EA";
    ctx.font = "bold 76px serif";
    ctx.fillText(arch.name, 100, 250);

    ctx.fillStyle = "#A3A3A3";
    ctx.font = "italic 34px serif";
    ctx.fillText(arch.quote, 100, 320);

    // Vector numérico
    ctx.fillStyle = "#E5383B";
    ctx.font = "26px monospace";
    ctx.fillText(
      `VECTOR: [${vec.join(" · ")}]`,
      100,
      410
    );

    // Top 3 Libros
    ctx.fillStyle = "#F4F1EA";
    ctx.font = "28px monospace";
    ctx.fillText("TOP 03 // COMPATIBILIDAD ALGORÍTMICA:", 100, 540);

    rankedBooks.slice(0, 3).forEach((b, i) => {
      const y = 600 + i * 240;
      ctx.fillStyle = i === 0 ? "#1C0D0E" : "#141417";
      ctx.fillRect(100, y, 880, 200);
      ctx.strokeStyle = i === 0 ? "#E5383B" : "rgba(255,255,255,0.15)";
      ctx.strokeRect(100, y, 880, 200);

      ctx.fillStyle = "#E5383B";
      ctx.font = "32px monospace";
      ctx.fillText(`#0${i + 1} · ${b.match}% AFINIDAD`, 140, y + 65);

      ctx.fillStyle = "#F4F1EA";
      ctx.font = "bold 46px serif";
      ctx.fillText(b.title, 140, y + 125);

      ctx.fillStyle = "#9E9E9E";
      ctx.font = "26px monospace";
      ctx.fillText(`${b.author} (${b.pages} págs)`, 140, y + 170);
    });

    ctx.fillStyle = "#666666";
    ctx.font = "24px monospace";
    ctx.fillText("DESCUBRE TU VECTOR EN 3 MINUTOS // ADNLECTOR.APP", 100, 1800);

    const link = document.createElement("a");
    link.download = `adn-lector-${arch.name.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    setToast("Tarjeta 9:16 descargada lista para Instagram Stories");
    setTimeout(() => setToast(null), 3500);
  };

  // Color de fondo reactivo en la Pantalla 7 (Dial de Gore)
  const bgDynamic =
    step === 7
      ? goreVal < 35
        ? "#0B0B0C"
        : goreVal < 72
        ? "#170C0D"
        : "#260709"
      : "#0B0B0C";

  return (
    <motion.div
      animate={{ backgroundColor: bgDynamic }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen text-[#EAE6DF] flex flex-col justify-between overflow-x-hidden select-none"
    >
      {/* TEXTURA DE GRANO ANALÓGICO DE CINE (SVG NOISE EN TODA LA APP) */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* NOTIFICACIÓN TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1C0D0E] border border-[#E5383B] px-4 py-2.5 font-mono-tech text-xs text-white shadow-2xl"
          >
            ✓ {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CABECERA SUPERIOR */}
      <header className="relative z-30 px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E5383B] animate-pulse" />
          <span className="font-mono-tech text-[11px] tracking-[0.2em] uppercase text-neutral-400">
            {step <= 3 && "FASE 01 // ATMÓSFERA"}
            {step >= 4 && step <= 6 && "FASE 02 // CADENCIA Y VOZ"}
            {step >= 7 && step <= 9 && "FASE 03 // UMBRAL DE FRICCIÓN"}
            {step === 10 && "FASE 04 // PROTOCOLO ANTI-RUIDO"}
            {(step === 11 || step === 12) && "FASE 05 // CALIBRACIÓN REAL"}
            {step >= 50 && "EXPEDIENTE // ADN LECTOR"}
          </span>
        </div>
        {step <= 12 && (
          <span className="font-mono-tech text-xs text-neutral-500">
            {step < 10 ? `0${step}` : step} / 12
          </span>
        )}
      </header>

      {/* BARRA DE PRESIÓN DE 5 SEGUNDOS (EXCLUSIVA DE PANTALLA 1) */}
      {step === 1 && (
        <div className="w-full h-1 bg-neutral-900 overflow-hidden">
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 5, ease: "linear" }}
            className="w-full h-full bg-[#E5383B] origin-left"
          />
        </div>
      )}

      {/* ====================================================================
          CUERPO CENTRAL: LAS 12 PANTALLAS INTERACTIVAS
         ==================================================================== */}
      <main className="relative z-20 flex-1 w-full max-w-xl mx-auto p-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* ---------------- PANTALLA 1: SPLIT A/B (5 SEG) ---------------- */}
          {step === 1 && (
            <motion.div
              key="p1"
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="space-y-4"
            >
              <div className="text-center mb-2">
                <span className="font-mono-tech text-[10px] tracking-[0.25em] text-[#E5383B] uppercase">
                  IMPULSO VISUAL · TIENES 5 SEGUNDOS
                </span>
                <h1 className="font-editorial text-3xl sm:text-4xl italic text-[#F4F1EA]">
                  «Sin pensarlo. ¿Dónde te quedas?»
                </h1>
              </div>

              <button
                onClick={() => advanceWithDelta([-15, +32, +8, 0, +8, +10, +10], 2)}
                className="w-full h-48 relative overflow-hidden border border-white/15 hover:border-[#E5383B] p-5 flex flex-col justify-end text-left group"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center saturate-75 group-hover:saturate-100 group-hover:scale-105 transition-all duration-700"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&q=80)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="relative z-10">
                  <span className="font-mono-tech text-[10px] text-[#E5383B] tracking-widest">
                    OPCIÓN A // TERCIOPELO Y CENIZA
                  </span>
                  <p className="font-editorial text-2xl italic text-white">
                    Claroscuro barroco, textura densa y mundo minucioso
                  </p>
                </div>
              </button>

              <button
                onClick={() => advanceWithDelta([+28, -28, +5, 0, -10, +8, -5], 2)}
                className="w-full h-48 relative overflow-hidden border border-white/15 hover:border-[#E5383B] p-5 flex flex-col justify-end text-left group"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center saturate-50 group-hover:saturate-100 group-hover:scale-105 transition-all duration-700"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&q=80)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="relative z-10">
                  <span className="font-mono-tech text-[10px] text-[#E5383B] tracking-widest">
                    OPCIÓN B // ASFALTO Y NIEBLA
                  </span>
                  <p className="font-editorial text-2xl italic text-white">
                    Línea de fuga limpia, minimalismo frío y corte directo
                  </p>
                </div>
              </button>
            </motion.div>
          )}

          {/* ---------------- PANTALLA 2: GRID 2x2 ECOSISTEMA ---------------- */}
          {step === 2 && (
            <motion.div
              key="p2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div>
                <span className="font-mono-tech text-[10px] tracking-[0.22em] text-neutral-400">
                  RESONANCIA DE ENTORNO
                </span>
                <h1 className="font-editorial text-3xl sm:text-4xl text-[#F4F1EA]">
                  «Elige el aire que vas a respirar las próximas horas:»
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-3 h-[360px]">
                {[
                  {
                    c: "01 // ESCARCHA",
                    n: "Monolito Helado",
                    img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
                    d: [-5, +15, +10, 0, +10, +15, 0],
                  },
                  {
                    c: "02 // METAL Y NEÓN",
                    n: "Callejón de Cables",
                    img: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80",
                    d: [+20, +5, +10, +10, +15, +20, 0],
                  },
                  {
                    c: "03 // RUINA SACRA",
                    n: "Catedral en Brasas",
                    img: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80",
                    d: [0, +20, +18, +15, +5, +20, +10],
                  },
                  {
                    c: "04 // CLAUSTRO",
                    n: "Motel 03:00 AM",
                    img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
                    d: [+10, -5, +5, +15, +15, +15, +25],
                  },
                ].map((q) => (
                  <button
                    key={q.c}
                    onClick={() => advanceWithDelta(q.d, 3)}
                    className="relative overflow-hidden border border-white/15 hover:border-[#E5383B] p-4 flex flex-col justify-end text-left group"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${q.img})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <span className="absolute top-3 left-3 font-mono-tech text-[9px] text-neutral-300 bg-black/80 px-2 py-0.5 border border-white/10">
                      {q.c}
                    </span>
                    <p className="relative z-10 font-editorial text-xl italic text-white">
                      {q.n}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ---------------- PANTALLA 3: PÍLDORAS FLOTANTES ---------------- */}
          {step === 3 && (
            <motion.div
              key="p3"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div>
                <span className="font-mono-tech text-[10px] tracking-[0.22em] text-[#E5383B]">
                  ASOCIACIÓN VISCERAL
                </span>
                <h1 className="font-editorial text-3xl sm:text-4xl text-[#F4F1EA]">
                  «Toca la primera palabra que te queme los ojos:»
                </h1>
              </div>

              <div className="space-y-3 py-2">
                {[
                  {
                    w: "HERRUMBRE",
                    s: "Textura · Decadencia · Slow-burn",
                    d: [-18, +20, +5, 0, +5, +15, +10],
                    y: [-3, 4, -3],
                  },
                  {
                    w: "IMPACTO",
                    s: "Frenesí · Acción directa · Sangre",
                    d: [+25, -15, +20, 0, -10, +10, -10],
                    y: [4, -4, 4],
                  },
                  {
                    w: "SECRETO",
                    s: "Subtexto · Sospecha · Puzle mental",
                    d: [0, +10, -10, +10, +25, +5, +20],
                    y: [-4, 3, -4],
                  },
                  {
                    w: "DELIRIO",
                    s: "Mente rota · Transgresión · Fiebre",
                    d: [+10, +5, +15, +25, +15, +25, +25],
                    y: [3, -5, 3],
                  },
                ].map((p, i) => (
                  <motion.button
                    key={p.w}
                    animate={{ y: p.y }}
                    transition={{
                      repeat: Infinity,
                      duration: 3.2 + i * 0.3,
                      ease: "easeInOut",
                    }}
                    onClick={() => advanceWithDelta(p.d, 4)}
                    className="w-full p-5 border border-white/15 bg-[#121214] hover:border-[#E5383B] flex justify-between items-center text-left"
                  >
                    <div>
                      <span className="font-editorial text-3xl text-white block">
                        {p.w}
                      </span>
                      <span className="font-mono-tech text-[10px] text-neutral-400 uppercase">
                        {p.s}
                      </span>
                    </div>
                    <span className="font-mono-tech text-xs text-[#E5383B]">
                      0{i + 1} →
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ---------------- PANTALLA 4: GATILLO NARRATIVO ---------------- */}
          {step === 4 && (
            <motion.div
              key="p4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div>
                <span className="font-mono-tech text-[10px] tracking-[0.22em] text-neutral-400">
                  TENSIÓN DE ESCENA
                </span>
                <h1 className="font-editorial text-3xl sm:text-4xl text-[#F4F1EA]">
                  «Alguien entra armado en la sala. ¿Qué exiges al autor?»
                </h1>
              </div>

              <div className="space-y-3">
                {[
                  {
                    c: "REACCIÓN 01 // CORTE EN SECO",
                    t: "«Que corte al segundo exacto en que suena el disparo y la sangre salpica la pared.»",
                    d: [+30, -20, +15, 0, -10, +10, -10],
                  },
                  {
                    c: "REACCIÓN 02 // CÁMARA LENTA SENSORIAL",
                    t: "«Que me baje las pulsaciones para explicarme el temblor en las manos del atacante y el olor a pólvora.»",
                    d: [-15, +25, +5, +10, +5, +10, +25],
                  },
                  {
                    c: "REACCIÓN 03 // RUPTURA DE EJE",
                    t: "«Que me revele que quien sostiene el arma no es quien creíamos, cambiando todo lo leído hasta aquí.»",
                    d: [+10, 0, 0, 0, +30, +5, +15],
                  },
                ].map((o) => (
                  <button
                    key={o.c}
                    onClick={() => advanceWithDelta(o.d, 5)}
                    className="w-full p-5 border border-white/15 bg-[#121214] hover:border-[#E5383B] text-left"
                  >
                    <span className="font-mono-tech text-[10px] text-[#E5383B] block mb-1">
                      {o.c}
                    </span>
                    <p className="font-editorial text-xl italic text-white">
                      {o.t}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ---------------- PANTALLA 5: SWIPE TINDER CARDS ---------------- */}
          {step === 5 && (
            <motion.div
              key="p5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <div>
                <span className="font-mono-tech text-[10px] tracking-[0.2em] text-[#E5383B]">
                  ARRASTRA LA CARTA O PULSA LOS BOTONES ({cardIdx + 1} / 3)
                </span>
                <h1 className="font-editorial text-3xl text-[#F4F1EA]">
                  «¿Firmas este pacto con quien te cuenta la historia?»
                </h1>
              </div>

              <div className="relative h-[300px] flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                  <DraggableTinderCard
                    key={NARRATOR_CARDS[cardIdx].id}
                    card={NARRATOR_CARDS[cardIdx]}
                    onDecision={(accepted) => {
                      triggerHaptic(accepted ? [15, 30] : 12);
                      if (accepted) {
                        const d = NARRATOR_CARDS[cardIdx].delta;
                        setVec((prev) => prev.map((v, i) => clamp(v + d[i])));
                      }
                      if (cardIdx < NARRATOR_CARDS.length - 1) {
                        setCardIdx((prev) => prev + 1);
                      } else {
                        setStep(6);
                      }
                    }}
                  />
                </AnimatePresence>
              </div>

              <div className="flex justify-center items-center gap-8">
                <button
                  onClick={() => {
                    if (cardIdx < 2) setCardIdx(cardIdx + 1);
                    else setStep(6);
                  }}
                  className="w-14 h-14 rounded-full border border-white/15 bg-[#121214] flex items-center justify-center text-neutral-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
                <span className="font-mono-tech text-[10px] text-neutral-500">
                  PASO / FIRMO
                </span>
                <button
                  onClick={() => {
                    const d = NARRATOR_CARDS[cardIdx].delta;
                    setVec((prev) => prev.map((v, i) => clamp(v + d[i])));
                    if (cardIdx < 2) setCardIdx(cardIdx + 1);
                    else setStep(6);
                  }}
                  className="w-14 h-14 rounded-full border border-[#E5383B] bg-[#9E2A2B]/20 flex items-center justify-center text-[#E5383B]"
                >
                  <Check className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ---------------- PANTALLA 6: ARQUITECTURA DEL TIEMPO (SVG) ---------------- */}
          {step === 6 && (
            <motion.div
              key="p6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div>
                <span className="font-mono-tech text-[10px] tracking-[0.22em] text-neutral-400">
                  ESTRUCTURA TEMPORAL
                </span>
                <h1 className="font-editorial text-3xl sm:text-4xl text-[#F4F1EA]">
                  «¿Cómo prefieres que avance el reloj de la novela?»
                </h1>
              </div>

              <div className="space-y-3">
                {[
                  {
                    c: "01 // FLECHA IMPLACABLE",
                    t: "De principio a fin",
                    s: "Cronología lineal directa sin desvíos.",
                    d: [+12, 0, 0, 0, -25, 0, 0],
                    idx: 0,
                  },
                  {
                    c: "02 // NUDO EN ESPIRAL",
                    t: "Laberinto fragmentado",
                    s: "Saltos temporales, crónicas y recuerdos que desmienten el presente.",
                    d: [-5, +10, 0, 0, +35, +10, +15],
                    idx: 1,
                  },
                  {
                    c: "03 // DOBLE VÍA EN COLISIÓN",
                    t: "Dos épocas condenadas",
                    s: "Dos líneas paralelas destinadas a chocar en el clímax.",
                    d: [+5, +5, 0, 0, +18, +5, +5],
                    idx: 2,
                  },
                ].map((item) => (
                  <button
                    key={item.c}
                    onClick={() => advanceWithDelta(item.d, 7)}
                    className="w-full p-5 border border-white/15 bg-[#121214] hover:border-[#E5383B] flex items-center justify-between gap-4 text-left"
                  >
                    <div>
                      <span className="font-mono-tech text-[9px] text-[#E5383B] block mb-1">
                        {item.c}
                      </span>
                      <h3 className="font-editorial text-2xl text-white">
                        {item.t}
                      </h3>
                      <p className="text-xs text-neutral-400">{item.s}</p>
                    </div>
                    <div className="w-16 h-12 border border-white/10 bg-black/50 flex items-center justify-center shrink-0">
                      {item.idx === 0 && (
                        <svg width="44" height="20" viewBox="0 0 44 20">
                          <line x1="2" y1="10" x2="38" y2="10" stroke="#E5383B" strokeWidth="2" />
                          <polyline points="32,4 39,10 32,16" fill="none" stroke="#E5383B" strokeWidth="2" />
                        </svg>
                      )}
                      {item.idx === 1 && (
                        <svg width="44" height="28" viewBox="0 0 44 28">
                          <path d="M4,22 C14,2 20,26 26,8 C32,-4 36,24 40,12" fill="none" stroke="#E5383B" strokeWidth="2" />
                        </svg>
                      )}
                      {item.idx === 2 && (
                        <svg width="44" height="24" viewBox="0 0 44 24">
                          <line x1="2" y1="4" x2="40" y2="12" stroke="#E5383B" strokeWidth="2" />
                          <line x1="2" y1="20" x2="40" y2="12" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 2" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ---------------- PANTALLA 7: DIAL DE CRUDEZA Y GORE ---------------- */}
          {step === 7 && (
            <motion.div
              key="p7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono-tech text-[10px] tracking-[0.22em] text-[#E5383B]">
                  CALIBRACIÓN DE DAÑO BIOLÓGICO
                </span>
                <h1 className="font-editorial text-3xl sm:text-4xl text-[#F4F1EA]">
                  «En una escena de ejecución o combate, ¿dónde se queda la cámara?»
                </h1>
              </div>

              <div className="border border-white/20 bg-black/50 p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono-tech text-xs text-[#E5383B]">
                    {goreVal < 35
                      ? "NIVEL 01 // ELIPSIS ELEGANTE"
                      : goreVal < 72
                      ? "NIVEL 02 // REALISMO FUNCIONAL"
                      : "NIVEL 03 // SIN ANESTESIA"}
                  </span>
                  {goreVal < 35 ? (
                    <EyeOff className="w-5 h-5 text-neutral-400" />
                  ) : goreVal < 72 ? (
                    <ShieldAlert className="w-5 h-5 text-[#E5383B]" />
                  ) : (
                    <Skull className="w-5 h-5 text-[#E5383B]" />
                  )}
                </div>

                <h2 className="font-editorial text-3xl italic text-white">
                  {goreVal < 35
                    ? "Puerta Cerrada"
                    : goreVal < 72
                    ? "Peso y Consecuencia"
                    : "Visceralidad Absoluta"}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                  {goreVal < 35
                    ? "Sabes que ha ocurrido una tragedia por el silencio posterior. La cámara corta antes del impacto físico."
                    : goreVal < 72
                    ? "Las heridas duelen, se infectan y dejan secuelas reales, pero el autor no se recrea en la carnicería gratuita."
                    : "Hueso fracturado, olor a hierro y bilis. Si hay violencia o barbarie, se describe en primer plano sin apartar la mirada."}
                </p>

                <div className="pt-4">
                  <input
                    type="range"
                    min={5}
                    max={99}
                    value={goreVal}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setGoreVal(v);
                      if (v % 10 === 0) triggerHaptic(15);
                    }}
                    className="w-full accent-[#E5383B] cursor-pointer"
                  />
                  <div className="flex justify-between font-mono-tech text-[10px] text-neutral-400 mt-1">
                    <span>0% ELIPSIS</span>
                    <span className="text-[#E5383B] text-sm font-bold">{goreVal}%</span>
                    <span>100% CARNICERÍA</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic([25, 40]);
                  setVec((prev) => [
                    prev[0],
                    prev[1],
                    goreVal,
                    prev[3],
                    prev[4],
                    prev[5],
                    prev[6],
                  ]);
                  setStep(8);
                }}
                className="w-full py-4 border border-white/25 bg-white/10 hover:bg-white/15 font-mono-tech text-xs tracking-[0.25em] uppercase text-white"
              >
                FIJAR UMBRAL DE CRUDEZA ({goreVal}%) →
              </button>
            </motion.div>
          )}

          {/* ---------------- PANTALLA 8: INTIMIDAD Y MORBO ---------------- */}
          {step === 8 && (
            <motion.div
              key="p8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div>
                <span className="font-mono-tech text-[10px] tracking-[0.22em] text-[#E5383B]">
                  DISTANCIAS CORTAS Y PULSIÓN
                </span>
                <h1 className="font-editorial text-3xl sm:text-4xl text-[#F4F1EA]">
                  «En los vínculos entre personajes, ¿qué buscas presenciar?»
                </h1>
              </div>

              <div className="space-y-3">
                {[
                  {
                    c: "DINÁMICA 01 // CERO DISTRACCIONES",
                    t: "Alianzas tácticas o soledad",
                    s: "Que la trama no se frene por romances. Prefiero foco frío.",
                    d: [+10, 0, 0, -35, 0, +5, -10],
                  },
                  {
                    c: "DINÁMICA 02 // SLOW-BURN CON FILO",
                    t: "Tensión armada entre enemigos",
                    s: "Dos personas que se destruirían o se besarían con la misma violencia contenida.",
                    d: [0, +10, 0, +20, +5, +5, +15],
                  },
                  {
                    c: "DINÁMICA 03 // TRANSGRESIÓN PURA",
                    t: "Obsesión, poder y tabú sin censura",
                    s: "Vínculos tóxicos, juegos psicológicos asfixiantes y sexo explícito.",
                    d: [0, +5, +10, +42, +10, +20, +20],
                  },
                ].map((o) => (
                  <button
                    key={o.c}
                    onClick={() => advanceWithDelta(o.d, 9)}
                    className="w-full p-5 border border-white/15 bg-[#121214] hover:border-[#E5383B] text-left"
                  >
                    <span className="font-mono-tech text-[10px] text-[#E5383B] block mb-1">
                      {o.c}
                    </span>
                    <h3 className="font-editorial text-2xl italic text-white">
                      {o.t}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">{o.s}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ---------------- PANTALLA 9: INTERRUPTORES DE PSICOSIS Y NIHILISMO ---------------- */}
          {step === 9 && (
            <motion.div
              key="p9"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <div>
                <span className="font-mono-tech text-[10px] tracking-[0.22em] text-neutral-400">
                  LÍMITES DE SUSTANCIA Y SOMBRA MORAL
                </span>
                <h1 className="font-editorial text-3xl sm:text-4xl text-[#F4F1EA]">
                  «Activa o bloquea estos ingredientes en la trama:»
                </h1>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setSubstancesOn(!substancesOn)}
                  className={`w-full p-5 border flex items-center justify-between text-left ${
                    substancesOn
                      ? "border-[#E5383B] bg-[#9E2A2B]/15"
                      : "border-white/15 bg-[#121214]"
                  }`}
                >
                  <div className="pr-4">
                    <span className="font-mono-tech text-[10px] text-[#E5383B] flex items-center gap-1.5 mb-1">
                      <Pill className="w-3.5 h-3.5" /> INTERRUPTOR 01 // DELIRIO QUÍMICO
                    </span>
                    <h3 className="font-editorial text-2xl text-white">
                      Adicciones, drogas ficcionales y psicosis
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 font-mono-tech text-xs border ${
                      substancesOn
                        ? "bg-[#E5383B] text-black font-bold border-[#E5383B]"
                        : "border-white/20 text-neutral-500"
                    }`}
                  >
                    {substancesOn ? "SÍ" : "NO"}
                  </span>
                </button>

                <button
                  onClick={() => setNihilismOn(!nihilismOn)}
                  className={`w-full p-5 border flex items-center justify-between text-left ${
                    nihilismOn
                      ? "border-[#E5383B] bg-[#9E2A2B]/15"
                      : "border-white/15 bg-[#121214]"
                  }`}
                >
                  <div className="pr-4">
                    <span className="font-mono-tech text-[10px] text-[#E5383B] flex items-center gap-1.5 mb-1">
                      <Skull className="w-3.5 h-3.5" /> INTERRUPTOR 02 // GRAVEDAD MORAL
                    </span>
                    <h3 className="font-editorial text-2xl text-white">
                      Finales trágicos o nihilistas (nadie se salva)
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 font-mono-tech text-xs border ${
                      nihilismOn
                        ? "bg-[#E5383B] text-black font-bold border-[#E5383B]"
                        : "border-white/20 text-neutral-500"
                    }`}
                  >
                    {nihilismOn ? "SÍ" : "NO"}
                  </span>
                </button>
              </div>

              <button
                onClick={() => {
                  advanceWithDelta(
                    [
                      0,
                      0,
                      0,
                      substancesOn ? +15 : 0,
                      0,
                      nihilismOn ? +25 : -25,
                      substancesOn ? +10 : 0,
                    ],
                    10
                  );
                }}
                className="w-full py-4 bg-[#9E2A2B] hover:bg-[#B23233] text-white font-mono-tech text-xs tracking-[0.22em] uppercase flex items-center justify-center gap-2"
              >
                SELLAR PARÁMETROS MORALES <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ---------------- PANTALLA 10: LA MICRO-PARADOJA DE SOLIDEZ ---------------- */}
          {step === 10 && (
            <motion.div
              key="p10"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <div>
                <span className="font-mono-tech text-[10px] tracking-[0.25em] text-[#E5383B] uppercase">
                  VERIFICACIÓN DE SOLIDEZ DE RESPUESTA
                </span>
                <h1 className="font-editorial text-3xl sm:text-4xl text-[#F4F1EA]">
                  «Para cruzar el puente tienes que elegir tu arma literaria definitiva:»
                </h1>
              </div>

              <div className="space-y-3.5">
                <button
                  onClick={() => {
                    setWeights([0.24, 0.08, 0.2, 0.16, 0.1, 0.12, 0.1]);
                    advanceWithDelta([+20, -25, 0, 0, 0, 0, 0], 11);
                  }}
                  className="w-full p-6 border border-white/15 bg-[#121214] hover:border-[#E5383B] text-left"
                >
                  <span className="font-mono-tech text-xs text-[#E5383B] block mb-1">
                    01 // EL BISTURÍ QUIRÚRGICO
                  </span>
                  <h3 className="font-editorial text-2xl italic text-white">
                    Sacrifico la belleza de las frases con tal de que la trama no pare.
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Prioridad absoluta al ritmo y la tracción sobre el adorno poético.
                  </p>
                </button>

                <button
                  onClick={() => {
                    setWeights([0.1, 0.22, 0.2, 0.16, 0.1, 0.12, 0.1]);
                    advanceWithDelta([-20, +25, 0, 0, 0, 0, +10], 11);
                  }}
                  className="w-full p-6 border border-white/15 bg-[#121214] hover:border-[#E5383B] text-left"
                >
                  <span className="font-mono-tech text-xs text-[#E5383B] block mb-1">
                    02 // EL TAPIZ BORDADO EN SOMBRA
                  </span>
                  <h3 className="font-editorial text-2xl italic text-white">
                    Acepto que el libro avance lento si cada párrafo es una obra de arte.
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Prioridad absoluta a la atmósfera, el peso del mundo y la prosa.
                  </p>
                </button>
              </div>
            </motion.div>
          )}

          {/* ---------------- PANTALLA 11: ANCHO DE BANDA Y VOLUMEN ---------------- */}
          {step === 11 && (
            <motion.div
              key="p11"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono-tech text-[10px] tracking-[0.22em] text-[#E5383B]">
                  CALIBRACIÓN PRAGMÁTICA (11 / 12)
                </span>
                <h1 className="font-editorial text-3xl sm:text-4xl text-[#F4F1EA]">
                  «Ajuste de cuentas con tu energía mental de esta semana:»
                </h1>
              </div>

              <div>
                <span className="font-mono-tech text-[10px] text-neutral-400 block mb-2">
                  01 // ¿CÓMO ESTÁ TU CEREBRO HOY?
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setBrainState("fundido")}
                    className={`p-4 border text-left ${
                      brainState === "fundido"
                        ? "border-[#E5383B] bg-[#9E2A2B]/20"
                        : "border-white/15 bg-[#121214]"
                    }`}
                  >
                    <span className="font-mono-tech text-xs text-white block">
                      FUNDIDO
                    </span>
                    <span className="text-xs text-neutral-400">
                      Quiero enganche dopamínico inmediato.
                    </span>
                  </button>
                  <button
                    onClick={() => setBrainState("despejado")}
                    className={`p-4 border text-left ${
                      brainState === "despejado"
                        ? "border-[#E5383B] bg-[#9E2A2B]/20"
                        : "border-white/15 bg-[#121214]"
                    }`}
                  >
                    <span className="font-mono-tech text-xs text-white block">
                      DESPEJADO
                    </span>
                    <span className="text-xs text-neutral-400">
                      Tengo paciencia para tramas complejas.
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <span className="font-mono-tech text-[10px] text-neutral-400 block mb-2">
                  02 // COMPROMISO DE PÁGINAS:
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { l: "Cuchillada", s: "< 350 págs", p: 360 },
                    { l: "Estándar", s: "350 - 550 págs", p: 560 },
                    { l: "Monolito / Saga", s: "+ 600 págs", p: 1200 },
                  ].map((v) => (
                    <button
                      key={v.l}
                      onClick={() => setMaxPages(v.p)}
                      className={`p-3.5 border text-left ${
                        maxPages === v.p
                          ? "border-[#E5383B] bg-[#9E2A2B]/20"
                          : "border-white/15 bg-[#121214]"
                      }`}
                    >
                      <span className="font-editorial text-xl text-white block">
                        {v.l}
                      </span>
                      <span className="font-mono-tech text-[10px] text-neutral-400">
                        {v.s}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() =>
                  advanceWithDelta(
                    brainState === "fundido" ? [+15, -15, 0, 0, -10, 0, 0] : [0, +10, 0, 0, +10, 0, 0],
                    12
                  )
                }
                className="w-full py-4 bg-[#9E2A2B] hover:bg-[#B23233] text-white font-mono-tech text-xs tracking-[0.22em] uppercase"
              >
                CONTINUAR AL ÚLTIMO PASO →
              </button>
            </motion.div>
          )}

          {/* ---------------- PANTALLA 12: LÍNEAS ROJAS (FILTROS DE EXCLUSIÓN) ---------------- */}
          {step === 12 && (
            <motion.div
              key="p12"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono-tech text-[10px] tracking-[0.22em] text-[#E5383B]">
                  LÍNEAS ROJAS INNEGOCIABLES (12 / 12)
                </span>
                <h1 className="font-editorial text-3xl sm:text-4xl text-[#F4F1EA]">
                  «Marca lo que te saca inmediatamente de un libro (o déjalo en blanco):»
                </h1>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {[
                  { id: "violencia_animal", label: "Crueldad hacia animales" },
                  { id: "consumo_drogas", label: "Adicciones / Drogas explícitas" },
                  { id: "final_abierto", label: "Finales abiertos sin resolver" },
                  { id: "triangulo_amoroso", label: "Triángulos amorosos juveniles" },
                ].map((tr) => {
                  const active = excluded.includes(tr.id);
                  return (
                    <button
                      key={tr.id}
                      onClick={() =>
                        setExcluded((prev) =>
                          active ? prev.filter((x) => x !== tr.id) : [...prev, tr.id]
                        )
                      }
                      className={`px-4 py-3 border font-mono-tech text-xs transition-all ${
                        active
                          ? "border-[#E5383B] bg-[#9E2A2B]/30 text-white"
                          : "border-white/15 bg-[#121214] text-neutral-400"
                      }`}
                    >
                      {active ? "✕ VETADO: " : "+ "} {tr.label}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(50)}
                className="w-full py-4 bg-[#E5383B] hover:bg-[#9E2A2B] text-white font-mono-tech text-xs tracking-[0.25em] uppercase font-bold shadow-lg"
              >
                EJECUTAR MATRIZ Y REVELAR MI TOP 10 →
              </button>
            </motion.div>
          )}

          {/* ---------------- PASO 50: TRANSICIÓN DE CÁLCULO (4 SEGUNDOS) ---------------- */}
          {step === 50 && (
            <motion.div
              key="calc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="w-16 h-16 border border-white/15 flex items-center justify-center">
                <div className="w-10 h-10 border-t-2 border-[#E5383B] rounded-full animate-spin" />
              </div>
              <p className="font-editorial text-2xl sm:text-3xl italic text-[#F4F1EA]">
                {LOADING_PHRASES[loadingIdx]}
              </p>
              <span className="font-mono-tech text-[10px] tracking-[0.25em] text-neutral-500">
                VECTOR: [{vec.join(" · ")}]
              </span>
            </motion.div>
          )}

          {/* ====================================================================
              PASO 99: DASHBOARD FINAL (RADAR SVG + TOP 10 + SINAPSIS + MOOD SWITCH)
             ==================================================================== */}
          {step === 99 && activeBook && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-7 pb-16"
            >
              {/* 1. CABECERA DEL ARQUETIPO Y BOTÓN STORY */}
              <div className="border-b border-white/15 pb-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono-tech text-[10px] tracking-[0.2em] text-[#E5383B] px-2.5 py-1 border border-[#9E2A2B] bg-[#9E2A2B]/15">
                    DIAGNÓSTICO DE ADN LECTOR
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadStoryCard}
                      className="px-3 py-1.5 border border-white/20 bg-white/5 hover:bg-white/15 font-mono-tech text-[10px] text-white flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#E5383B]" /> EXPORTAR STORY 9:16
                    </button>
                    <button
                      onClick={() => {
                        setVec([50, 50, 50, 50, 50, 50, 50]);
                        setCardIdx(0);
                        setSelectedBook(null);
                        setStep(1);
                      }}
                      className="p-1.5 border border-white/15 text-neutral-400 hover:text-white"
                      title="Reiniciar test"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h1 className="font-editorial text-4xl sm:text-5xl text-[#F4F1EA]">
                  {getArchetype().name}
                </h1>
                <p className="text-sm text-neutral-300 font-light mt-1">
                  {getArchetype().tagline}
                </p>
              </div>

              {/* 2. CONMUTADOR DE MODO SINAPSIS (CRUCE DE PAREJA / AMIGOS) */}
              <div className="border border-white/15 bg-[#121214] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-mono-tech text-[10px] text-[#38BDF8] tracking-widest uppercase flex items-center gap-1.5">
                    <ArrowLeftRight className="w-3.5 h-3.5" /> MODO SINAPSIS // INTERSECCIÓN DUAL
                  </span>
                  <p className="text-xs text-neutral-400">
                    Cruza tu vector con otro perfil aplicando protección de umbral de crudeza.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSynapseMode(!synapseMode);
                    setSelectedBook(null);
                  }}
                  className={`px-4 py-2 font-mono-tech text-[10px] tracking-wider uppercase border shrink-0 ${
                    synapseMode
                      ? "border-[#38BDF8] bg-[#38BDF8]/20 text-white"
                      : "border-white/20 text-neutral-300 hover:border-white"
                  }`}
                >
                  {synapseMode ? "✓ SINAPSIS ACTIVA" : "ACTIVAR CRUCE DUAL"}
                </button>
              </div>

              {/* 3. GRÁFICO RADAR DE 7 PUNTAS (SOPORTA TRIPLE CAPA EN MODO SINAPSIS) */}
              <div className="bg-[#121214] border border-white/10 p-5 flex flex-col items-center">
                <div className="w-full flex flex-wrap justify-between font-mono-tech text-[10px] text-neutral-400 mb-2 gap-2">
                  <span className="text-[#E5383B]">■ TU ADN</span>
                  {synapseMode && <span className="text-[#38BDF8]">■ LECTOR 02 (PAREJA)</span>}
                  <span className="text-white">
                    □ #{activeBook.id.replace("bk_", "")} {activeBook.title.slice(0, 18)}
                  </span>
                </div>
                <SevenPointRadarSVG
                  userVec={vec}
                  partnerVec={synapseMode ? partnerPreset : null}
                  bookVec={activeBook.metrics}
                />
              </div>

              {/* 4. MOOD SWITCH (RECALIBRACIÓN EN 5 SEGUNDOS) */}
              <div>
                <span className="font-mono-tech text-[10px] tracking-widest text-neutral-400 uppercase block mb-2">
                  MOOD SWITCH // REORDENAR EN 1 TOQUE SEGÚN TU DÍA:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setVec([92, 25, vec[2], vec[3], 40, vec[5], vec[6]]);
                      setSelectedBook(null);
                      setToast("Mood Switch: Priorizando adrenalina y capítulos cortos");
                      setTimeout(() => setToast(null), 2500);
                    }}
                    className="p-3 border border-white/15 bg-[#121214] hover:border-[#E5383B] text-left"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#E5383B] mb-1" />
                    <span className="font-editorial text-lg text-white block">
                      Cerebro Quemado
                    </span>
                    <span className="font-mono-tech text-[9px] text-neutral-400">
                      +Tempo · -Densidad
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setVec([40, 88, vec[2], vec[3], 75, 90, 85]);
                      setSelectedBook(null);
                      setToast("Mood Switch: Priorizando atmósfera densa y peso moral");
                      setTimeout(() => setToast(null), 2500);
                    }}
                    className="p-3 border border-white/15 bg-[#121214] hover:border-[#E5383B] text-left"
                  >
                    <Moon className="w-3.5 h-3.5 text-[#E5383B] mb-1" />
                    <span className="font-editorial text-lg text-white block">
                      Noche Densa
                    </span>
                    <span className="font-mono-tech text-[9px] text-neutral-400">
                      +Prosa · +Sombra
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setMaxPages(350);
                      setSelectedBook(null);
                      setToast("Mood Switch: Filtrando novelas de menos de 350 págs");
                      setTimeout(() => setToast(null), 2500);
                    }}
                    className="p-3 border border-white/15 bg-[#121214] hover:border-[#E5383B] text-left"
                  >
                    <Scissors className="w-3.5 h-3.5 text-[#E5383B] mb-1" />
                    <span className="font-editorial text-lg text-white block">
                      Cuchillada Corta
                    </span>
                    <span className="font-mono-tech text-[9px] text-neutral-400">
                      Máx 350 págs
                    </span>
                  </button>
                </div>
              </div>

              {/* 5. FICHA DEL LIBRO PROTAGONISTA */}
              <div className="border border-[#9E2A2B] bg-gradient-to-b from-[#1A0D0E] to-[#0E0E11] p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono-tech text-[10px] text-[#E5383B] tracking-widest uppercase">
                      {synapseMode ? "MATCH DE CONSENSO SINÁPTICO" : "MATCH ALGORÍTMICO"}
                    </span>
                    <h2 className="font-editorial text-3xl sm:text-4xl text-white mt-0.5">
                      {activeBook.title}
                    </h2>
                    <p className="font-mono-tech text-xs text-neutral-400">
                      {activeBook.author} · {activeBook.pages} PÁGS · {activeBook.pov}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono-tech text-3xl font-bold text-[#E5383B] block">
                      {activeBook.match}%
                    </span>
                    <span className="font-mono-tech text-[9px] text-neutral-500">
                      AFINIDAD
                    </span>
                  </div>
                </div>

                <blockquote className="border-l-2 border-[#E5383B] pl-3.5 font-editorial text-xl italic text-neutral-200">
                  {activeBook.quote}
                </blockquote>

                <div className="bg-black/50 border border-white/10 p-3.5">
                  <span className="font-mono-tech text-[10px] text-[#E5383B] flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3 h-3" /> POR QUÉ ENCAJA CONTIGO:
                  </span>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    {activeBook.why}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => setSampleModal(true)}
                    className="py-3 px-3 border border-white/25 bg-white/5 hover:bg-white/15 font-mono-tech text-[10px] tracking-wider uppercase flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#E5383B]" /> CATAR 1ª PÁGINA
                  </button>
                  <button
                    onClick={() => {
                      if (!savedIds.includes(activeBook.id)) {
                        setSavedIds([...savedIds, activeBook.id]);
                        setToast(`"${activeBook.title}" guardado en tu lista`);
                        setTimeout(() => setToast(null), 2500);
                      }
                    }}
                    className="py-3 px-3 bg-[#9E2A2B] hover:bg-[#B23233] text-white font-mono-tech text-[10px] tracking-wider uppercase flex items-center justify-center gap-1.5"
                  >
                    <Bookmark className="w-3.5 h-3.5" />{" "}
                    {savedIds.includes(activeBook.id) ? "✓ GUARDADO" : "GUARDAR EN LISTA"}
                  </button>
                </div>

                {/* BUCLE DE AUTO-APRENDIZAJE (+ADN / -ADN) */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono-tech text-[10px] text-neutral-500">
                    ¿YA LO LEÍSTE? ENTRENA TU VECTOR:
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setVec((prev) =>
                          prev.map((v, i) =>
                            clamp(v + 0.1 * (activeBook.metrics[i] - v))
                          )
                        );
                        setToast("ADN Recalibrado: Acercando tu perfil a esta obra");
                        setTimeout(() => setToast(null), 2500);
                      }}
                      className="px-2.5 py-1 border border-white/15 text-[10px] font-mono-tech text-neutral-300 hover:border-[#E5383B] flex items-center gap-1"
                    >
                      <ThumbsUp className="w-3 h-3 text-[#E5383B]" /> ME FLIPÓ
                    </button>
                    <button
                      onClick={() => {
                        setVec((prev) =>
                          prev.map((v, i) =>
                            clamp(v - 0.1 * (activeBook.metrics[i] - v))
                          )
                        );
                        setToast("ADN Recalibrado: Alejando tu perfil de este estilo");
                        setTimeout(() => setToast(null), 2500);
                      }}
                      className="px-2.5 py-1 border border-white/15 text-[10px] font-mono-tech text-neutral-300 hover:border-white flex items-center gap-1"
                    >
                      <ThumbsDown className="w-3 h-3" /> NO ES PARA MÍ
                    </button>
                  </div>
                </div>
              </div>

              {/* 6. LISTA COMPLETA DEL TOP CALIBRADO */}
              <div className="space-y-2">
                <span className="font-mono-tech text-[10px] text-neutral-400 tracking-widest uppercase block">
                  RANKING DE AFINIDAD (TOCA PARA COMPARAR EN EL RADAR):
                </span>
                {rankedBooks.map((b, idx) => {
                  const isCurrent = activeBook.id === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBook(b)}
                      className={`w-full p-4 border flex justify-between items-center text-left transition-all ${
                        isCurrent
                          ? "border-[#E5383B] bg-white/[0.07]"
                          : "border-white/10 bg-[#121214] hover:bg-white/[0.03]"
                      }`}
                    >
                      <div>
                        <span className="font-mono-tech text-xs text-neutral-500 mr-3">
                          #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                        <span className="font-editorial text-xl text-white">
                          {b.title}
                        </span>
                        <span className="font-mono-tech text-[10px] text-neutral-400 ml-2">
                          — {b.author} ({b.pages}p)
                        </span>
                      </div>
                      <span className="font-mono-tech text-xs px-2.5 py-1 border border-[#E5383B]/50 text-[#E5383B] bg-[#9E2A2B]/15">
                        {b.match}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ====================================================================
          MODAL DEL LECTOR NATIVO (PRIMERAS LÍNEAS SIN FILTRO)
         ==================================================================== */}
      <AnimatePresence>
        {sampleModal && activeBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 20, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.96 }}
              className="max-w-lg w-full bg-[#111113] border border-white/20 p-6 space-y-5"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div>
                  <span className="font-mono-tech text-[10px] text-[#E5383B] tracking-widest uppercase">
                    CATA DE PROSA // {activeBook.pov}
                  </span>
                  <h3 className="font-editorial text-2xl text-white">
                    {activeBook.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSampleModal(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="font-editorial text-2xl leading-relaxed text-[#EAE6DF] italic">
                «{activeBook.sample}»
              </p>

              <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="font-mono-tech text-[10px] text-neutral-500">
                  ¿TE ATRAPÓ LA CADENCIA?
                </span>
                <a
                  href={`https://www.amazon.es/s?k=${encodeURIComponent(
                    activeBook.title + " " + activeBook.author
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-[#E5383B] text-white font-mono-tech text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  CONSEGUIR EJEMPLAR <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// SUB-COMPONENTE 1: CARTA ARRASTRABLE ESTILO TINDER (PANTALLA 5)
// ============================================================================
function DraggableTinderCard({
  card,
  onDecision,
}: {
  card: any;
  onDecision: (accepted: boolean) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-180, 180], [-10, 10]);
  const acceptOpacity = useTransform(x, [25, 100], [0, 1]);
  const rejectOpacity = useTransform(x, [-25, -100], [0, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 85 || info.velocity.x > 400) onDecision(true);
    else if (info.offset.x < -85 || info.velocity.x < -400) onDecision(false);
  };

  return (
    <motion.div
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.88, opacity: 0 }}
      whileTap={{ cursor: "grabbing" }}
      className="relative w-full h-[280px] bg-[#121214] border border-white/20 p-6 flex flex-col justify-between cursor-grab shadow-2xl"
    >
      <motion.span
        style={{ opacity: acceptOpacity }}
        className="absolute top-4 right-4 border border-[#E5383B] bg-[#9E2A2B]/30 px-2.5 py-0.5 font-mono-tech text-[10px] text-[#E5383B]"
      >
        FIRMO EL PACTO
      </motion.span>
      <motion.span
        style={{ opacity: rejectOpacity }}
        className="absolute top-4 left-4 border border-neutral-400 bg-neutral-800 px-2.5 py-0.5 font-mono-tech text-[10px] text-neutral-300"
      >
        RECHAZAR VOZ
      </motion.span>

      <div>
        <span className="font-mono-tech text-[10px] text-[#E5383B] block mb-1">
          {card.tag}
        </span>
        <h3 className="font-editorial text-2xl text-white">{card.title}</h3>
      </div>

      <p className="font-editorial text-xl italic text-neutral-200 leading-relaxed">
        {card.quote}
      </p>

      <div className="font-mono-tech text-[9px] text-neutral-500 flex justify-between border-t border-white/10 pt-2">
        <span>← DESLIZA PARA PASAR</span>
        <span>DESLIZA PARA ACEPTAR →</span>
      </div>
    </motion.div>
  );
}

// ============================================================================
// SUB-COMPONENTE 2: RADAR POLIGONAL DE 7 EJES EN SVG PURO
// ============================================================================
function SevenPointRadarSVG({
  userVec,
  partnerVec,
  bookVec,
}: {
  userVec: number[];
  partnerVec: number[] | null;
  bookVec: number[];
}) {
  const size = 240;
  const c = size / 2;
  const r = 86;

  const pt = (val: number, i: number, rad = r) => {
    const a = (Math.PI * 2 * i) / 7 - Math.PI / 2;
    const d = (val / 100) * rad;
    return `${c + d * Math.cos(a)},${c + d * Math.sin(a)}`;
  };

  return (
    <svg width={size} height={size} className="overflow-visible my-2">
      {[33, 66, 100].map((lvl) => (
        <polygon
          key={lvl}
          points={[0, 1, 2, 3, 4, 5, 6].map((i) => pt(lvl, i)).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
        />
      ))}
      {AXIS_LABELS.map((lbl, i) => {
        const [lx, ly] = pt(118, i).split(",");
        return (
          <text
            key={lbl}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-neutral-400 font-mono-tech text-[8px]"
          >
            {lbl}
          </text>
        );
      })}
      {/* Polígono del Libro */}
      <polygon
        points={bookVec.map((v, i) => pt(v, i)).join(" ")}
        fill="rgba(255,255,255,0.06)"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
      {/* Polígono Pareja (Si Modo Sinapsis está activo) */}
      {partnerVec && (
        <polygon
          points={partnerVec.map((v, i) => pt(v, i)).join(" ")}
          fill="rgba(56,189,248,0.20)"
          stroke="#38BDF8"
          strokeWidth="2"
        />
      )}
      {/* Polígono del Usuario */}
      <polygon
        points={userVec.map((v, i) => pt(v, i)).join(" ")}
        fill="rgba(229,56,59,0.28)"
        stroke="#E5383B"
        strokeWidth="2"
      />
    </svg>
  );
}
