import { useState } from "react";

//npm install lucide-react para os ícones           
import {
  Home,
  Trophy,
  CircleDot,
  Circle,
  Gamepad2,
  Radio,
  Ticket,
  Heart,
  Gift,
  Settings,
  Search,
  Bell,
  Wallet,
  ChevronRight,
  X,
  Zap,
  Clock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Tokens                                                              */
/* ------------------------------------------------------------------ */
const C = {
  bg: "#0A0A0A",
  card: "#121212",
  cardAlt: "#161616",
  border: "#232323",
  neon: "#7CFF00",
  neonSoft: "rgba(124,255,0,0.12)",
  muted: "#8C8C8C",
  red: "#FF4444",
  amber: "#FFB020",
};

const formatBRL = (n) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number.isFinite(n) ? n : 0
  );

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
  { label: "Início", icon: Home },
  { label: "Futebol", icon: Trophy },
  { label: "Basquete", icon: CircleDot },
  { label: "Tênis", icon: Circle },
  { label: "E-Sports", icon: Gamepad2 },
  { label: "Ao Vivo", icon: Radio, live: true },
  { label: "Minhas Apostas", icon: Ticket },
  { label: "Favoritos", icon: Heart },
  { label: "Promoções", icon: Gift },
  { label: "Configurações", icon: Settings },
];

const LIVE_GAMES = [
  { id: "l1", home: "CRB", away: "ASA", minute: "65'", score: "1 - 0", odds: [1.8, 3.2, 4.5] },
  { id: "l2", home: "Flamengo", away: "Palmeiras", minute: "78'", score: "2 - 1", odds: [1.95, 3.1, 3.8] },
  { id: "l3", home: "Corinthians", away: "Santos", minute: "35'", score: "0 - 0", odds: [2.3, 3.0, 3.1] },
];

const UPCOMING_GAMES = [
  { id: "u1", league: "Brasileirão Série A", home: "Corinthians", away: "Santos", when: "Hoje · 20:00", odds: [2.1, 3.3, 3.4] },
  { id: "u2", league: "Copa do Brasil", home: "CRB", away: "ASA", when: "Hoje · 21:30", odds: [1.9, 3.1, 4.0] },
  { id: "u3", league: "Libertadores", home: "Flamengo", away: "River Plate", when: "Hoje · 19:00", odds: [1.75, 3.4, 4.6] },
  { id: "u4", league: "Champions League", home: "Real Madrid", away: "Man. City", when: "Hoje · 16:00", odds: [2.05, 3.25, 3.5] },
  { id: "u5", league: "Premier League", home: "Arsenal", away: "Liverpool", when: "Amanhã · 12:30", odds: [2.4, 3.1, 2.9] },
  { id: "u6", league: "La Liga", home: "Barcelona", away: "Atlético Madrid", when: "Amanhã · 17:00", odds: [1.85, 3.3, 4.2] },
];

const CHAMPIONSHIPS = [
  "Brasileirão",
  "Copa do Brasil",
  "Libertadores",
  "Champions League",
  "Premier League",
  "La Liga",
  "Série B",
];

const MY_BETS = {
  andamento: [
    { id: "a1", game: "CRB x ASA", valor: 20, retorno: 36, status: "Em andamento" },
    { id: "a2", game: "Flamengo x Palmeiras", valor: 50, retorno: 97.5, status: "Em andamento" },
  ],
  ganhas: [
    { id: "g1", game: "Corinthians x São Paulo", valor: 30, retorno: 64.5, status: "Ganha" },
    { id: "g2", game: "Bahia x Vitória", valor: 15, retorno: 28.2, status: "Ganha" },
  ],
  perdidas: [{ id: "p1", game: "Sport x Náutico", valor: 25, retorno: 0, status: "Perdida" }],
};

const MARKET_LABELS = ["Casa", "Empate", "Visitante"];
const QUICK_VALUES = [10, 20, 50, 100];

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */
function OddButton({ label, value, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="ab-odd-btn flex-1 rounded-xl px-2 py-2 text-center transition-colors"
      style={
        active
          ? { background: C.neon, borderColor: C.neon, color: "#0A0A0A" }
          : { background: C.cardAlt, borderColor: C.border, color: "#fff" }
      }
    >
      <div className="text-[10px] uppercase tracking-wide opacity-70">{label}</div>
      <div className="text-sm font-semibold" style={{ fontFamily: "Rajdhani, sans-serif" }}>
        {value.toFixed(2)}
      </div>
    </button>
  );
}

function NavItem({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className="relative flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
      style={
        active
          ? { background: C.neonSoft, color: C.neon }
          : { background: "transparent", color: "#D8D8D8" }
      }
    >
      {active && (
        <span
          className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full"
          style={{ background: C.neon }}
        />
      )}
      <Icon size={18} />
      <span className="truncate">{item.label}</span>
      {item.live && (
        <span className="ab-pulse-dot ml-auto h-2 w-2 rounded-full" style={{ background: C.red }} />
      )}
    </button>
  );
}

function ChampionshipChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
      style={
        active
          ? { background: C.neon, borderColor: C.neon, color: "#0A0A0A" }
          : { background: C.card, borderColor: C.border, color: "#D8D8D8" }
      }
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }) {
  const map = {
    "Em andamento": { color: C.amber, bg: "rgba(255,176,32,0.12)" },
    Ganha: { color: C.neon, bg: C.neonSoft },
    Perdida: { color: C.red, bg: "rgba(255,68,68,0.12)" },
  };
  const s = map[status] || map["Em andamento"];
  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-semibold"
      style={{ color: s.color, background: s.bg }}
    >
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */
export default function AraBetHome() {
  const [activeNav, setActiveNav] = useState("Início");
  const [activeChip, setActiveChip] = useState("Brasileirão");
  const [activeTab, setActiveTab] = useState("andamento");
  const [selections, setSelections] = useState([]);
  const [valorAposta, setValorAposta] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");

  const toggleOdd = (matchLabel, marketIndex, odd) => {
    const id = `${matchLabel}__${marketIndex}`;
    setSelections((prev) => {
      const exists = prev.find((s) => s.id === id);
      if (exists) return prev.filter((s) => s.id !== id);
      return [...prev, { id, match: matchLabel, market: MARKET_LABELS[marketIndex], odd }];
    });
  };

  const totalOdd = selections.reduce((acc, s) => acc * s.odd, 1);
  const valorNum = parseFloat(String(valorAposta).replace(",", ".")) || 0;
  const retornoPotencial = selections.length ? valorNum * totalOdd : 0;

  const handleConfirm = () => {
    if (!selections.length || valorNum <= 0) return;
    setConfirmMsg("Aposta confirmada! Boa sorte 🍀");
    setSelections([]);
    setValorAposta("");
    setTimeout(() => setConfirmMsg(""), 3000);
  };

  return (
    <div
      className="ab-root min-h-screen w-full"
      style={{ background: C.bg, color: "#fff", fontFamily: "Inter, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .ab-root { font-feature-settings: "tnum"; }
        .ab-odd-btn { border: 1px solid ${C.border}; }
        .ab-odd-btn:hover { border-color: ${C.neon}; }
        .ab-card-hover { transition: border-color .15s ease; }
        .ab-card-hover:hover { border-color: ${C.neon}; }
        .ab-input:focus { outline: none; border-color: ${C.neon}; box-shadow: 0 0 0 2px rgba(124,255,0,0.2); }
        .ab-scroll::-webkit-scrollbar { width: 6px; }
        .ab-scroll::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 8px; }
        .ab-pulse-dot { animation: abpulse 1.3s ease-in-out infinite; }
        @keyframes abpulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
        .ab-glow { box-shadow: 0 0 26px rgba(124,255,0,0.35); }
        .ab-stadium {
          background:
            radial-gradient(ellipse 60% 80% at 15% 20%, rgba(124,255,0,0.20), transparent 60%),
            radial-gradient(ellipse 50% 70% at 85% 10%, rgba(124,255,0,0.14), transparent 55%),
            linear-gradient(180deg, #0d160a 0%, #0A0A0A 75%);
        }
        .ab-stadium-lines {
          background-image: repeating-linear-gradient(100deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 64px);
        }
      `}</style>

      {/* ---------------- HEADER ---------------- */}
      <header
        className="fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-6 border-b px-6"
        style={{ background: "rgba(10,10,10,0.92)", borderColor: C.border, backdropFilter: "blur(6px)" }}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: C.neonSoft }}>
            <Zap size={18} style={{ color: C.neon }} />
          </span>
          <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }} className="text-xl tracking-wide">
            Ara<span style={{ color: C.neon }}>Bet</span>
          </span>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <div
            className="ab-input flex w-full max-w-md items-center gap-2 rounded-full border px-4 py-2"
            style={{ background: C.cardAlt, borderColor: C.border }}
          >
            <Search size={16} style={{ color: C.muted }} />
            <input
              placeholder="Buscar times, campeonatos ou jogos"
              className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <button className="relative rounded-full p-2" style={{ background: C.cardAlt }}>
            <Bell size={18} />
            <span
              className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2"
              style={{ background: C.red, borderColor: C.bg }}
            />
          </button>
          <div
            className="flex items-center gap-2 rounded-full border px-3 py-1.5"
            style={{ borderColor: C.border, background: C.cardAlt }}
          >
            <Wallet size={16} style={{ color: C.neon }} />
            <span className="text-sm font-semibold">R$ 150,00</span>
          </div>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold"
            style={{ background: "linear-gradient(135deg, #7CFF00, #2c5e00)", color: "#0A0A0A" }}
          >
            JS
          </div>
        </div>
      </header>

      {/* ---------------- BODY ---------------- */}
      <div className="flex pt-16">
        {/* LEFT NAV */}
        <aside
          className="ab-scroll sticky top-16 hidden h-[calc(100vh-64px)] w-60 flex-col justify-between overflow-y-auto border-r px-3 py-5 lg:flex"
          style={{ borderColor: C.border }}
        >
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                active={activeNav === item.label}
                onClick={() => setActiveNav(item.label)}
              />
            ))}
          </nav>

          <div className="rounded-2xl border p-4" style={{ borderColor: C.border, background: C.card }}>
            <p className="text-sm font-semibold">Bônus de boas-vindas</p>
            <p className="mt-1 text-xs" style={{ color: C.muted }}>
              Deposite e ganhe até R$ 200 em apostas
            </p>
            <button
              className="mt-3 w-full rounded-lg py-2 text-sm font-semibold"
              style={{ border: `1px solid ${C.neon}`, color: C.neon }}
            >
              Resgatar
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="ab-scroll min-w-0 flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          {/* HERO */}
          <section className="ab-stadium ab-stadium-lines relative overflow-hidden rounded-2xl p-8 md:p-12" style={{ minHeight: 300 }}>
            <div className="mb-4 flex gap-2">
              <span className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "rgba(255,68,68,0.15)", color: C.red }}>
                <span className="ab-pulse-dot h-1.5 w-1.5 rounded-full" style={{ background: C.red }} /> AO VIVO AGORA
              </span>
              <span className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: C.neonSoft, color: C.neon }}>
                <Zap size={12} /> ODDS ESPECIAIS
              </span>
            </div>
            <h1
              style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}
              className="max-w-lg text-3xl leading-tight md:text-5xl"
            >
              Aposte nos maiores eventos esportivos
            </h1>
            <p className="mt-3 max-w-md text-sm md:text-base" style={{ color: "#C9C9C9" }}>
              Odds especiais para você ganhar mais
            </p>
            <button
              className="ab-glow mt-6 flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              style={{ background: C.neon, color: "#0A0A0A" }}
            >
              Apostar Agora <ChevronRight size={16} />
            </button>
          </section>

          {/* LIVE GAMES */}
          <section className="mt-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              <span className="ab-pulse-dot h-2.5 w-2.5 rounded-full" style={{ background: C.red }} />
              Jogos Ao Vivo
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {LIVE_GAMES.map((g) => {
                const matchLabel = `${g.home} x ${g.away}`;
                return (
                  <div key={g.id} className="ab-card-hover rounded-2xl border p-4" style={{ borderColor: C.border, background: C.card }}>
                    <div className="mb-3 flex items-center justify-between text-xs">
                      <span className="rounded-full px-2 py-0.5 font-semibold" style={{ background: "rgba(255,68,68,0.15)", color: C.red }}>
                        ● AO VIVO
                      </span>
                      <span className="flex items-center gap-1" style={{ color: C.muted }}>
                        <Clock size={12} /> {g.minute}
                      </span>
                    </div>
                    <div className="flex items-center justify-between" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                      <span className="text-sm font-semibold">{g.home}</span>
                      <span className="text-xl font-bold" style={{ color: C.neon }}>{g.score}</span>
                      <span className="text-sm font-semibold">{g.away}</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      {g.odds.map((odd, i) => (
                        <OddButton
                          key={i}
                          label={MARKET_LABELS[i]}
                          value={odd}
                          active={selections.some((s) => s.id === `${matchLabel}__${i}`)}
                          onClick={() => toggleOdd(matchLabel, i, odd)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* UPCOMING GAMES */}
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              Próximos Jogos
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {UPCOMING_GAMES.map((g) => {
                const matchLabel = `${g.home} x ${g.away}`;
                return (
                  <div key={g.id} className="ab-card-hover rounded-2xl border p-4" style={{ borderColor: C.border, background: C.card }}>
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.neon }}>
                      {g.league}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{g.home} x {g.away}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: C.muted }}>
                      <Clock size={12} /> {g.when}
                    </p>
                    <div className="mt-4 flex gap-2">
                      {g.odds.map((odd, i) => (
                        <OddButton
                          key={i}
                          label={MARKET_LABELS[i]}
                          value={odd}
                          active={selections.some((s) => s.id === `${matchLabel}__${i}`)}
                          onClick={() => toggleOdd(matchLabel, i, odd)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CHAMPIONSHIPS */}
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              Campeonatos Populares
            </h2>
            <div className="flex flex-wrap gap-3">
              {CHAMPIONSHIPS.map((c) => (
                <ChampionshipChip key={c} label={c} active={activeChip === c} onClick={() => setActiveChip(c)} />
              ))}
            </div>
          </section>

          {/* MY BETS */}
          <section className="mb-4 mt-10">
            <h2 className="mb-4 text-lg font-semibold" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              Minhas Apostas
            </h2>
            <div className="mb-4 flex gap-2">
              {[
                { key: "andamento", label: "Em andamento" },
                { key: "ganhas", label: "Ganhas" },
                { key: "perdidas", label: "Perdidas" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className="rounded-full px-4 py-2 text-sm font-medium"
                  style={
                    activeTab === t.key
                      ? { background: C.neonSoft, color: C.neon }
                      : { background: C.card, color: C.muted }
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {MY_BETS[activeTab].map((b) => (
                <div key={b.id} className="rounded-2xl border p-4" style={{ borderColor: C.border, background: C.card }}>
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-semibold">{b.game}</p>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span style={{ color: C.muted }}>Valor apostado</span>
                    <span>{formatBRL(b.valor)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span style={{ color: C.muted }}>Retorno</span>
                    <span style={{ color: b.status === "Perdida" ? C.red : C.neon }}>{formatBRL(b.retorno)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* BET SLIP */}
        <aside
          className="ab-scroll sticky top-16 hidden h-[calc(100vh-64px)] w-80 flex-col overflow-y-auto border-l p-5 xl:flex"
          style={{ borderColor: C.border, background: C.card }}
        >
          <h2 className="flex items-center gap-2 text-base font-semibold" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            <Ticket size={18} style={{ color: C.neon }} /> Cupom de Apostas
          </h2>

          {selections.length === 0 ? (
            <p className="mt-6 text-sm" style={{ color: C.muted }}>
              Clique em uma odd para montar sua aposta.
            </p>
          ) : (
            <div className="mt-4 flex flex-col gap-2">
              {selections.map((s) => (
                <div key={s.id} className="flex items-start justify-between rounded-xl p-3" style={{ background: C.cardAlt }}>
                  <div>
                    <p className="text-sm font-medium">{s.match}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{s.market} · Odd {s.odd.toFixed(2)}</p>
                  </div>
                  <button onClick={() => setSelections((prev) => prev.filter((x) => x.id !== s.id))}>
                    <X size={14} style={{ color: C.muted }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {selections.length > 0 && (
            <>
              <div className="my-4 h-px" style={{ background: C.border }} />
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: C.muted }}>Odd Total</span>
                <span className="text-lg font-bold" style={{ color: C.neon, fontFamily: "Rajdhani, sans-serif" }}>
                  {totalOdd.toFixed(2)}
                </span>
              </div>

              <label className="mt-4 block text-xs" style={{ color: C.muted }}>
                Valor da aposta
              </label>
              <div className="ab-input mt-1 flex items-center gap-1 rounded-xl border px-3 py-2" style={{ borderColor: C.border, background: C.cardAlt }}>
                <span className="text-sm" style={{ color: C.muted }}>R$</span>
                <input
                  value={valorAposta}
                  onChange={(e) => setValorAposta(e.target.value.replace(/[^0-9.,]/g, ""))}
                  placeholder="0,00"
                  className="w-full bg-transparent text-sm text-white focus:outline-none"
                />
              </div>
              <div className="mt-2 flex gap-2">
                {QUICK_VALUES.map((v) => (
                  <button
                    key={v}
                    onClick={() => setValorAposta(String(v))}
                    className="flex-1 rounded-lg py-1.5 text-xs font-medium"
                    style={{ background: C.cardAlt, color: "#D8D8D8" }}
                  >
                    R${v}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span style={{ color: C.muted }}>Retorno potencial</span>
                <span className="font-semibold" style={{ color: C.neon }}>{formatBRL(retornoPotencial)}</span>
              </div>

              {confirmMsg && (
                <p className="mt-3 rounded-lg p-2 text-center text-xs font-medium" style={{ background: C.neonSoft, color: C.neon }}>
                  {confirmMsg}
                </p>
              )}

              <button
                onClick={handleConfirm}
                disabled={valorNum <= 0}
                className="ab-glow mt-4 w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-40"
                style={{ background: C.neon, color: "#0A0A0A" }}
              >
                Confirmar Aposta
              </button>
              <button
                onClick={() => setSelections([])}
                className="mt-2 w-full rounded-xl py-2 text-xs font-medium"
                style={{ color: C.muted }}
              >
                Limpar tudo
              </button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
