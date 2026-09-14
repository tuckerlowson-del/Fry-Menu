
const { useState, useRef, useEffect } = React;

function makeIcon(path) {
  return function Icon({ size = 24, ...props }) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        {path}
      </svg>
    );
  };
}

const Crown = makeIcon(<><path d="m2 4 3 12h14l3-12"/><path d="M6 16v4"/><path d="M10 16v4"/><path d="M14 16v4"/><path d="M18 16v4"/><path d="M4 8h16"/><path d="M8 4v4"/><path d="M12 4v4"/><path d="M16 4v4"/></>);
const ShieldCheck = makeIcon(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></>);
const Star = makeIcon(<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>);
const Users = makeIcon(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>);
const Sigma = makeIcon(<><path d="M18 7V4H6l6 8-6 8h12v-3"/></>);
const HandCoins = makeIcon(<><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></>);
const Wallet = makeIcon(<><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></>);
const Clock = makeIcon(<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>);
const XCircle = makeIcon(<><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></>);
const LayoutDashboard = makeIcon(<><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></>);
const MessageSquare = makeIcon(<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>);
const UserPlus = makeIcon(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></>);
const Check = makeIcon(<><path d="M20 6 9 17l-5-5"/></>);
const X = makeIcon(<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>);
const Send = makeIcon(<><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>);
const RotateCcw = makeIcon(<><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></>);
const ChevronDown = makeIcon(<><path d="m6 9 6 6 6-6"/></>);
const Sparkles = makeIcon(<><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></>);
const Receipt = makeIcon(<><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></>);
const ListChecks = makeIcon(<><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></>);

const Car = makeIcon(<><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></>);

/* ---------------------------------------------------------------------- */
/*  Fry Menu — a role-run counter. Every role gets its own window into    */
/*  the shop: perks, a power, a screen shaped for what that role needs.   */
/* ---------------------------------------------------------------------- */

const ROLES = {
  owner: {
    label: "Owner", icon: Crown, color: "#3E8EDE",
    tagline: "Runs the whole counter.",
    perks: ["Sees every screen and every ledger", "Opens or closes any chat", "Overrides any role instantly", "Final word on every application"],
    power: "Override — reassign anyone's role on the spot, no vote needed.",
  },
  administration: {
    label: "Administration", icon: ShieldCheck, color: "#7FA0C4",
    tagline: "Keeps the line moving.",
    perks: ["Reviews every application", "Manages the member roster", "Staff-only channel access", "Can't touch the Owner's settings"],
    power: "Sign-off — approve or decline anyone waiting on the board.",
  },
  og: {
    label: "OG", icon: Star, color: "#B98FD1",
    tagline: "Been ordering here since before the menu changed.",
    perks: ["Private OG Lounge chat", "Badge shown next to your name everywhere", "First look at new roles before anyone else", "Can't be demoted by Administration"],
    power: "Vouch — nominate a Member to skip straight to review.",
  },
  member: {
    label: "Member", icon: Users, color: "#7FA87F",
    tagline: "Just here for the fries.",
    perks: ["General chat access", "Can apply for any other role", "Standard counter dashboard"],
    power: "Flag — raise anything in general for a staff look.",
  },
  mathematician: {
    label: "Mathematician", icon: Sigma, color: "#4FB8AE",
    tagline: "Counts every fry so nobody else has to.",
    perks: ["Shop-wide numbers desk", "Built-in calculator", "Math Corner chat", "Sees totals no one else can add up"],
    power: "Audit — recheck and correct any loan balance in the shop.",
  },
  loanshark: {
    label: "Loan Shark", icon: HandCoins, color: "#D1685E",
    tagline: "Fries now, pay later. With interest.",
    perks: ["Personal loan book", "Tracks every borrower's balance", "Loan Shark Network chat", "Logs payments the moment they land"],
    power: "Collect — mark a debt paid or send a reminder that lands instantly.",
  },
  debtowner: {
    label: "Debt Owner", icon: Wallet, color: "#B99C6C",
    tagline: "Owes somebody something.",
    perks: ["A clear view of every balance owed", "Full payment history", "Debtors Support chat", "Pay down a balance in one tap"],
    power: "Settle — apply a payment straight to any balance you carry.",
  },
  pending: {
    label: "Pending", icon: Clock, color: "#8C93A0",
    tagline: "Application's in the fryer.",
    perks: ["A seat in the waiting room"],
    power: "Wait — that's the whole power, for now.",
  },
  declined: {
    label: "Declined", icon: XCircle, color: "#6B6F76",
    tagline: "Didn't make the cut this time.",
    perks: [],
    power: "Reapply — try again whenever you're ready.",
  },
};

const CHANNELS = [
  { id: "general", name: "General", allowed: "all", desc: "Everyone at the counter talks here." },
  { id: "admin", name: "Administration", allowed: ["owner", "administration"], desc: "Staff-only planning." },
  { id: "og-lounge", name: "OG Lounge", allowed: ["owner", "og"], desc: "Seniority has its privileges." },
  { id: "loan-network", name: "Loan Shark Network", allowed: ["owner", "loanshark"], desc: "Talk business." },
  { id: "debt-support", name: "Debtors Support", allowed: ["owner", "debtowner"], desc: "You're not the only one paying it off." },
  { id: "math-corner", name: "Mathematician's Corner", allowed: ["owner", "mathematician"], desc: "Numbers only, please." },
  { id: "owners-office", name: "Owner's Office", allowed: ["owner"], desc: "Just you." },
];

const INITIAL_USERS = [
  { id: "u1", name: "Ford™", role: "owner", status: "active", appliedFor: null },
];

const INITIAL_LOANS = [];

const INITIAL_MESSAGES = {
  general: [],
  admin: [],
  "og-lounge": [],
  "loan-network": [],
  "debt-support": [],
  "math-corner": [],
  "owners-office": [],
};

const todayLabel = () =>
  new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" });

function useGoogleFont() {
  useEffect(() => {
    if (document.getElementById("fry-menu-font")) return;
    const link = document.createElement("link");
    link.id = "fry-menu-font";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500..800&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

/* ------------------------------ Primitives ------------------------------ */

function Panel({ children, accent, className = "", style }) {
  return (
    <div
      className={`relative rounded-lg border border-white/[0.07] bg-[#171C22] p-5 ${className}`}
      style={style}
    >
      {accent && <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-lg" style={{ background: accent }} />}
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return <div className="mb-3 text-[13px] font-semibold text-white/75">{children}</div>;
}

function Header({ eyebrow, title, subtitle, accent = "#3E8EDE" }) {
  return (
    <div className="mb-6">
      {eyebrow && <div className="mb-1 text-xs text-white/35">{eyebrow}</div>}
      <h1 className="fm-display text-[28px] leading-tight" style={{ color: accent }}>{title}</h1>
      {subtitle && <p className="mt-1.5 max-w-md text-sm text-white/50">{subtitle}</p>}
      <div className="mt-4 h-px w-full" style={{ background: "linear-gradient(to right, rgba(255,255,255,0.14), transparent)" }} />
    </div>
  );
}

function MenuRow({ label, value, color }) {
  return (
    <div className="flex items-baseline gap-2 py-1.5">
      <span className="shrink-0 text-sm text-white/55">{label}</span>
      <span className="mx-1 h-0 flex-1 -translate-y-1 border-b border-dotted border-white/15" />
      <span className="fm-display shrink-0 text-lg" style={{ color: color || "#FFFFFF" }}>{value}</span>
    </div>
  );
}

function RoleBadge({ roleKey, variant = "pill" }) {
  const r = ROLES[roleKey];
  const Icon = r.icon;
  if (variant === "dot") {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.color }} />
        <span className="text-xs font-medium" style={{ color: r.color }}>{r.label}</span>
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold"
      style={{ borderColor: r.color + "40", color: r.color, background: r.color + "14" }}
    >
      <Icon size={11} />
      {r.label}
    </span>
  );
}

function PrimaryButton({ children, onClick, type = "button", className = "" }) {
  return (
    <button type={type} onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-[#3E8EDE] px-4 py-2 text-sm font-semibold text-[#0D1116] transition-transform hover:brightness-105 active:scale-[0.98] ${className}`}>
      {children}
    </button>
  );
}
function GhostButton({ children, onClick, color = "#FFFFFF", className = "" }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${className}`}
      style={{ borderColor: color + "45", color }}>
      {children}
    </button>
  );
}

function Calculator() {
  const [a, setA] = useState("12");
  const [b, setB] = useState("4");
  const [op, setOp] = useState("+");
  const result = (() => {
    const x = parseFloat(a), y = parseFloat(b);
    if (isNaN(x) || isNaN(y)) return "—";
    if (op === "+") return x + y;
    if (op === "-") return x - y;
    if (op === "×") return x * y;
    if (op === "÷") return y === 0 ? "—" : (x / y).toFixed(2);
    return "—";
  })();
  return (
    <Panel accent="#4FB8AE">
      <SectionLabel>Quick calculator</SectionLabel>
      <div className="flex flex-wrap items-center gap-2">
        <input value={a} onChange={(e) => setA(e.target.value)}
          className="w-16 rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white outline-none focus:border-[#4FB8AE]" />
        <select value={op} onChange={(e) => setOp(e.target.value)}
          className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white outline-none">
          {["+", "-", "×", "÷"].map((o) => <option key={o}>{o}</option>)}
        </select>
        <input value={b} onChange={(e) => setB(e.target.value)}
          className="w-16 rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white outline-none focus:border-[#4FB8AE]" />
        <span className="text-white/30">=</span>
        <span className="min-w-[3.25rem] rounded-md border border-[#4FB8AE]/40 bg-[#4FB8AE]/10 px-2.5 py-1.5 text-center text-sm font-bold text-[#4FB8AE]">{String(result)}</span>
      </div>
    </Panel>
  );
}

function FordMark() {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 190, height: 78 }}
    >
      <div
        className="absolute inset-0"
        style={{
          borderRadius: "50%",
          border: "3px solid #3E8EDE",
          background: "linear-gradient(160deg, #1B3A54 0%, #0E1D29 100%)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
        }}
      />
      <div className="absolute inset-[4px]" style={{ borderRadius: "50%", border: "1px solid rgba(255,255,255,0.25)" }} />
      <span className="fm-display relative z-10 italic text-white" style={{ fontSize: 30, letterSpacing: "0.01em" }}>
        Ford<span className="align-super" style={{ fontSize: 11 }}>™</span>
      </span>
    </div>
  );
}

function IntroSplash() {
  // 1 sponsor text → 2 logo → 3..8 ranger slides → 9 fade out → 0 gone
  const slides = [
    { title: "Front", sub: "Black Ford Ranger Wildtrak" },
    { title: "Rear", sub: "Tailgate · Wildtrak · dual exhaust" },
    { title: "Side", sub: "Full profile · daytime" },
    { title: "Door open", sub: "Driver side ready" },
    { title: "Interior", sub: "Wildtrak cabin · orange stitch" },
    { title: "Rear · open", sub: "Passenger door open" },
  ];
  const [stage, setStage] = useState(1);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setStage(2), 1600));
    timers.push(setTimeout(() => setStage(3), 3200));
    // cycle slides while stage === 3
    slides.forEach((_, idx) => {
      timers.push(setTimeout(() => setSlide(idx), 3200 + idx * 2200));
    });
    // start fade after last slide
    const fadeAt = 3200 + slides.length * 2200;
    timers.push(setTimeout(() => setStage(9), fadeAt));
    timers.push(setTimeout(() => setStage(0), fadeAt + 1800));
    return () => timers.forEach(clearTimeout);
  }, []);

  if (stage === 0) return null;
  const fading = stage === 9;
  const showSlides = stage === 3 || stage === 9;
  const s = slides[slide] || slides[0];

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0D11] transition-opacity duration-[1600ms] ease-out ${fading ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      {/* sponsor line */}
      <p className={`fm-display absolute px-4 text-center text-lg text-white transition-opacity duration-700 sm:text-xl ${stage === 1 ? "opacity-100" : "opacity-0"}`}>
        Proudly Sponsored By Ford™
      </p>

      {/* logo */}
      <div className={`absolute transition-opacity duration-700 ${stage === 2 ? "opacity-100" : "opacity-0"}`}>
        <FordMark />
      </div>

      {/* ranger slideshow */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 transition-opacity duration-700 ${showSlides && !fading ? "opacity-100" : showSlides ? "opacity-0" : "opacity-0"}`}>
        <div className="mb-3 text-[11px] tracking-widest text-white/35">FORD™ · RANGER WILDTRAK</div>
        <div className="fm-display text-4xl text-white sm:text-5xl" style={{ color: "#3E8EDE" }}>{s.title}</div>
        <p className="mt-2 max-w-sm text-center text-sm text-white/50">{s.sub}</p>
        <div className="mt-8 flex gap-2">
          {slides.map((_, idx) => (
            <span key={idx} className="h-1.5 rounded-full transition-all"
              style={{ width: idx === slide ? 28 : 8, background: idx === slide ? "#3E8EDE" : "rgba(255,255,255,0.2)" }} />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 h-[3px] bg-[#3E8EDE]/80 transition-all" style={{ width: `${((slide + 1) / slides.length) * 100}%` }} />
      </div>
    </div>
  );
}

/* --------------------------------- App ---------------------------------- */

function FryMenu() {
  useGoogleFont();
  const [users, setUsers] = useState(INITIAL_USERS);
  const [loans, setLoans] = useState(INITIAL_LOANS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [notifications, setNotifications] = useState([]);
  const [activity, setActivity] = useState([
    { id: "a0", text: "Fry Menu opened for the day.", time: "7:30 AM" },
  ]);
  const [viewAsId, setViewAsId] = useState("u1");
  const [tab, setTab] = useState("dashboard");
  const [activeChannel, setActiveChannel] = useState("general");
  const [chatInput, setChatInput] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const userById = (id) => users.find((u) => u.id === id);
  const you = userById(viewAsId);
  const roleKey = you.role;
  const roleCfg = ROLES[roleKey];
  const isStaff = roleKey === "owner" || roleKey === "administration";

  function pushNotification(text) {
    const id = Math.random().toString(36).slice(2) + Date.now();
    setNotifications((n) => [...n, { id, text }]);
    const t = setTimeout(() => setNotifications((n) => n.filter((x) => x.id !== id)), 5000);
    timers.current.push(t);
  }
  function pushActivity(text) {
    setActivity((a) => [{ id: Math.random().toString(36).slice(2), text, time: todayLabel() }, ...a].slice(0, 20));
  }

  function updateUser(id, patch) {
    setUsers((us) => us.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }

  function handleInvite(e) {
    e.preventDefault();
    if (!inviteName.trim()) return;
    const id = "u" + Math.random().toString(36).slice(2, 7);
    const newUser = { id, name: inviteName.trim(), role: "pending", status: "pending", appliedFor: inviteRole };
    setUsers((us) => [...us, newUser]);
    pushNotification(`${newUser.name} was invited to apply as ${ROLES[inviteRole].label}`);
    pushActivity(`${you.name} invited ${newUser.name} to apply as ${ROLES[inviteRole].label}`);
    setInviteName("");
  }

  function handleSelfApply(target) {
    updateUser(you.id, { role: "pending", status: "pending", appliedFor: target });
    pushNotification(`You applied to become ${ROLES[target].label}`);
    pushActivity(`${you.name} applied to become ${ROLES[target].label}`);
  }

  function handleAccept(id) {
    const u = userById(id);
    updateUser(id, { role: u.appliedFor, status: "active", appliedFor: null });
    pushNotification(`${u.name} is now ${ROLES[u.appliedFor].label}`);
    pushActivity(`${u.name} was accepted as ${ROLES[u.appliedFor].label}`);
    if (id === viewAsId) setTab("dashboard");
  }
  function handleDecline(id) {
    const u = userById(id);
    updateUser(id, { role: "declined", status: "declined" });
    pushNotification(`${u.name}'s application was declined`);
    pushActivity(`${u.name}'s application for ${ROLES[u.appliedFor].label} was declined`);
  }
  function handleReapply(id) {
    const u = userById(id);
    updateUser(id, { role: "pending", status: "pending" });
    pushNotification(`${u.name} reapplied for ${ROLES[u.appliedFor].label}`);
    pushActivity(`${u.name} reapplied for ${ROLES[u.appliedFor].label}`);
  }
  function handleOwnerChangeRole(id, newRole) {
    const u = userById(id);
    updateUser(id, { role: newRole, status: "active", appliedFor: null });
    pushNotification(`${u.name}'s role was changed to ${ROLES[newRole].label}`);
    pushActivity(`${you.name} changed ${u.name}'s role to ${ROLES[newRole].label}`);
  }

  function handleLogPayment(loanId, amountStr) {
    const amount = parseFloat(amountStr);
    if (!amount || amount <= 0) return;
    setLoans((ls) => ls.map((l) => (l.id === loanId ? { ...l, paid: l.paid + amount, history: [...l.history, { date: todayLabel(), amount }] } : l)));
    const loan = loans.find((l) => l.id === loanId);
    const borrower = userById(loan.borrowerId), lender = userById(loan.lenderId);
    pushNotification(`${borrower.name} paid $${amount} to ${lender.name}`);
    pushActivity(`${borrower.name} paid $${amount} toward the balance with ${lender.name}`);
  }

  function sendMessage() {
    if (!chatInput.trim()) return;
    const msg = { id: Math.random().toString(36).slice(2), userId: you.id, text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) };
    setMessages((m) => ({ ...m, [activeChannel]: [...(m[activeChannel] || []), msg] }));
    setChatInput("");
  }

  const availableChannels = CHANNELS.filter((c) => {
    if (roleKey === "pending" || roleKey === "declined") return false;
    if (c.allowed === "all") return true;
    return c.allowed.includes(roleKey);
  });
  useEffect(() => {
    if (!availableChannels.find((c) => c.id === activeChannel)) {
      setActiveChannel(availableChannels[0]?.id || "general");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleKey]);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    ...(isStaff ? [{ id: "members", label: "Members", icon: Users }, { id: "applications", label: "Applications", icon: ListChecks }] : []),
    ...(roleKey === "loanshark" ? [{ id: "loanbook", label: "Loan Book", icon: HandCoins }] : []),
    ...(roleKey === "debtowner" ? [{ id: "mydebts", label: "My Debts", icon: Wallet }] : []),
    ...(roleKey !== "pending" && roleKey !== "declined" ? [{ id: "chat", label: "Chat", icon: MessageSquare }] : []),
    { id: "ford", label: "Ford", icon: Car },
    { id: "roles", label: "Roles & Perks", icon: Sparkles },
  ];

  const pendingUsers = users.filter((u) => u.status === "pending");
  const activeUsers = users.filter((u) => u.status === "active");
  const totalOutstanding = loans.reduce((s, l) => s + Math.max(l.principal - l.paid, 0), 0);
  const totalCollected = loans.reduce((s, l) => s + l.paid, 0);
  const roleCounts = Object.keys(ROLES).map((k) => ({ key: k, count: users.filter((u) => u.role === k).length }));

  return (
    <div className="min-h-screen w-full text-[#FFFFFF]" style={{
      background: "radial-gradient(ellipse 900px 500px at 12% -10%, #232B35 0%, #12161C 55%, #0A0D11 100%)",
      fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes shrinkBar { from { width: 100%; } to { width: 0%; } }
        .fm-display { font-family: 'Fraunces', Georgia, serif; font-weight: 650; letter-spacing: -0.01em; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #2A323C; border-radius: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      <IntroSplash />

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 flex w-80 max-w-[90vw] flex-col gap-2.5">
        {notifications.map((n) => (
          <div key={n.id}
            className="overflow-hidden rounded-md bg-[#FFFFFF] text-[#171C22] shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            style={{ animation: "slideIn 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
            <div className="flex items-start gap-2.5 px-3.5 py-3"
              style={{ borderBottom: "1px dashed rgba(36,28,21,0.25)" }}>
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#3E8EDE" }} />
              <p className="text-[13px] font-medium leading-snug">{n.text}</p>
            </div>
            <div className="h-[3px] bg-black/10">
              <div className="h-full bg-[#3E8EDE]" style={{ animation: "shrinkBar 5s linear forwards" }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8 md:px-8">
        {/* Sidebar */}
        <aside className="hidden w-52 shrink-0 flex-col gap-7 md:flex">
          <div>
            <div className="fm-display text-[26px] italic leading-none text-[#3E8EDE]">Fry Menu</div>
            <div className="mt-1.5 text-[11px] text-white/35">the counter, run by role</div>
          </div>

          <nav className="flex flex-col">
            {tabs.map((t) => {
              const Icon = t.icon;
              const activeTab = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="flex items-center gap-2.5 border-l-2 py-2 pl-3 pr-2 text-left text-sm transition-colors"
                  style={{
                    borderColor: activeTab ? "#3E8EDE" : "transparent",
                    color: activeTab ? "#3E8EDE" : "rgba(236,239,243,0.55)",
                  }}>
                  <Icon size={15} /> {t.label}
                  {t.id === "applications" && pendingUsers.length > 0 && (
                    <span className="ml-auto rounded-full bg-[#D1685E] px-1.5 text-[10px] font-semibold text-white">{pendingUsers.length}</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto">
            <div className="mb-2 text-[11px] text-white/30">Viewing as</div>
            <div className="relative">
              <select value={viewAsId} onChange={(e) => { setViewAsId(e.target.value); setTab("dashboard"); }}
                className="w-full appearance-none border-b border-white/15 bg-transparent py-1.5 pr-6 text-sm text-white/85 outline-none focus:border-[#3E8EDE]">
                {users.map((u) => <option key={u.id} value={u.id} className="bg-[#171C22]">{u.name} — {ROLES[u.role].label}</option>)}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-white/40" />
            </div>
            <div className="mt-3"><RoleBadge roleKey={roleKey} /></div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-between md:hidden">
            <div className="fm-display text-xl italic text-[#3E8EDE]">Fry Menu</div>
            <RoleBadge roleKey={roleKey} />
          </div>
          <div className="mb-5 flex gap-4 overflow-x-auto border-b border-white/10 pb-0 md:hidden">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="shrink-0 border-b-2 pb-2 text-xs font-medium"
                style={{ borderColor: tab === t.id ? "#3E8EDE" : "transparent", color: tab === t.id ? "#3E8EDE" : "rgba(255,255,255,0.5)" }}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "dashboard" && (
            <DashboardScreen
              you={you} roleKey={roleKey} users={users} loans={loans} activity={activity}
              roleCounts={roleCounts} totalOutstanding={totalOutstanding} totalCollected={totalCollected}
              pendingUsers={pendingUsers} activeUsers={activeUsers}
              inviteName={inviteName} setInviteName={setInviteName} inviteRole={inviteRole} setInviteRole={setInviteRole}
              handleInvite={handleInvite} handleSelfApply={handleSelfApply} handleReapply={handleReapply}
              handleLogPayment={handleLogPayment} handleAccept={handleAccept} handleDecline={handleDecline}
              userById={userById}
            />
          )}

          {tab === "members" && isStaff && (
            <MembersScreen users={activeUsers} roleKey={roleKey} onChangeRole={handleOwnerChangeRole} />
          )}

          {tab === "applications" && isStaff && (
            <ApplicationsScreen users={pendingUsers} onAccept={handleAccept} onDecline={handleDecline} />
          )}

          {tab === "loanbook" && roleKey === "loanshark" && (
            <LoanBookScreen loans={loans.filter((l) => l.lenderId === you.id)} userById={userById} onLogPayment={handleLogPayment} />
          )}

          {tab === "mydebts" && roleKey === "debtowner" && (
            <MyDebtsScreen loans={loans.filter((l) => l.borrowerId === you.id)} userById={userById} onLogPayment={handleLogPayment} />
          )}

          {tab === "chat" && (
            <ChatScreen channels={availableChannels} activeChannel={activeChannel} setActiveChannel={setActiveChannel}
              messages={messages[activeChannel] || []} userById={userById} chatInput={chatInput} setChatInput={setChatInput} onSend={sendMessage} />
          )}

          {tab === "ford" && <FordGalleryScreen />}
          {tab === "roles" && <RolesScreen users={users} />}
        </main>
      </div>
    </div>
  );
}

/* ----------------------------- Dashboards ------------------------------ */

function DashboardScreen(props) {
  const { you, roleKey, users, loans, activity, roleCounts, totalOutstanding, totalCollected,
    pendingUsers, inviteName, setInviteName, inviteRole, setInviteRole, handleInvite,
    handleSelfApply, handleReapply, handleAccept, handleDecline } = props;
  const r = ROLES[roleKey];

  if (roleKey === "owner") {
    return (
      <div className="flex flex-col gap-5">
        <Header eyebrow={`Welcome back, ${you.name}`} title="Today at the counter" subtitle="Every role, every ledger, every line — all in one place." accent={r.color} />
        <Panel accent={r.color}>
          <SectionLabel>The board</SectionLabel>
          <MenuRow label="Active members" value={users.filter((u) => u.status === "active").length} color={r.color} />
          <MenuRow label="Pending applications" value={pendingUsers.length} />
          <MenuRow label="Outstanding debt" value={`$${totalOutstanding}`} color="#D1685E" />
          <MenuRow label="Collected to date" value={`$${totalCollected}`} color="#7FA87F" />
        </Panel>
        <div className="grid gap-5 md:grid-cols-2">
          <Panel>
            <SectionLabel>Roles on the roster</SectionLabel>
            <div className="flex flex-col gap-2.5">
              {roleCounts.filter((rc) => rc.count > 0).map((rc) => {
                const cfg = ROLES[rc.key];
                return (
                  <div key={rc.key} className="flex items-center gap-2.5">
                    <span className="w-28 shrink-0 text-xs text-white/55">{cfg.label}</span>
                    <div className="h-[5px] flex-1 rounded-full bg-black/30">
                      <div className="h-[5px] rounded-full" style={{ width: `${(rc.count / users.length) * 100}%`, background: cfg.color }} />
                    </div>
                    <span className="w-4 text-right text-xs text-white/45">{rc.count}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
          <Panel accent="#3E8EDE">
            <SectionLabel>Invite someone in</SectionLabel>
            <form onSubmit={handleInvite} className="flex flex-col gap-2.5">
              <input value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="Their name"
                className="rounded-md border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none focus:border-[#3E8EDE]" />
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
                className="rounded-md border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none focus:border-[#3E8EDE]">
                {Object.keys(ROLES).filter((k) => k !== "pending" && k !== "declined").map((k) => <option key={k} value={k}>{ROLES[k].label}</option>)}
              </select>
              <PrimaryButton type="submit" className="mt-1 w-full"><UserPlus size={14} /> Send invite</PrimaryButton>
            </form>
          </Panel>
        </div>
        <Panel>
          <SectionLabel>Recent activity</SectionLabel>
          <ul className="flex flex-col gap-2.5">
            {activity.map((a) => (
              <li key={a.id} className="flex items-start gap-2.5 text-sm text-white/55">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#3E8EDE]/70" />
                <span>{a.text} <span className="text-white/25">· {a.time}</span></span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    );
  }

  if (roleKey === "administration") {
    return (
      <div className="flex flex-col gap-5">
        <Header eyebrow={`Front of house, ${you.name}`} title="Applications & roster" subtitle={r.tagline} accent={r.color} />
        <Panel accent={r.color}>
          <MenuRow label="Pending applications" value={pendingUsers.length} color={r.color} />
          <MenuRow label="Active members" value={users.filter((u) => u.status === "active").length} />
          <MenuRow label="Declined this cycle" value={users.filter((u) => u.status === "declined").length} />
        </Panel>
        <Panel>
          <SectionLabel>Waiting on your sign-off</SectionLabel>
          {pendingUsers.length === 0 && <p className="text-sm text-white/35">Nobody's waiting. Board's clear.</p>}
          <ul className="flex flex-col gap-2">
            {pendingUsers.map((u) => (
              <li key={u.id} className="flex items-center justify-between border-b border-white/[0.06] py-2.5 last:border-0">
                <div>
                  <div className="text-sm">{u.name}</div>
                  <div className="text-xs text-white/40">applying for {ROLES[u.appliedFor].label}</div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => handleAccept(u.id)} className="rounded-md bg-[#7FA87F]/15 p-1.5 text-[#7FA87F] hover:bg-[#7FA87F]/25"><Check size={15} /></button>
                  <button onClick={() => handleDecline(u.id)} className="rounded-md bg-[#D1685E]/15 p-1.5 text-[#D1685E] hover:bg-[#D1685E]/25"><X size={15} /></button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    );
  }

  if (roleKey === "mathematician") {
    const avg = loans.length ? (loans.reduce((s, l) => s + l.principal, 0) / loans.length).toFixed(0) : 0;
    const repaymentRate = loans.length ? ((totalCollected / (totalCollected + totalOutstanding || 1)) * 100).toFixed(0) : 0;
    return (
      <div className="flex flex-col gap-5">
        <Header eyebrow="The numbers desk" title="Everything adds up here" subtitle={r.tagline} accent={r.color} />
        <Panel accent={r.color}>
          <MenuRow label="Loans in the system" value={loans.length} color={r.color} />
          <MenuRow label="Average loan size" value={`$${avg}`} />
          <MenuRow label="Repayment rate" value={`${repaymentRate}%`} color="#7FA87F" />
          <MenuRow label="Outstanding total" value={`$${totalOutstanding}`} color="#D1685E" />
        </Panel>
        <Calculator />
        <Panel>
          <SectionLabel>Puzzle of the day</SectionLabel>
          <p className="text-sm text-white/55">A basket has 3 more fries than half of a second basket. Together they hold 51 fries. How many are in the second basket?</p>
        </Panel>
      </div>
    );
  }

  if (roleKey === "loanshark") {
    const mine = loans.filter((l) => l.lenderId === you.id);
    const owed = mine.reduce((s, l) => s + Math.max(l.principal - l.paid, 0), 0);
    return (
      <div className="flex flex-col gap-5">
        <Header eyebrow={`Your book, ${you.name}`} title="Who owes you" subtitle={r.tagline} accent={r.color} />
        <Panel accent={r.color}>
          <MenuRow label="Borrowers" value={mine.length} color={r.color} />
          <MenuRow label="Still owed to you" value={`$${owed}`} color={r.color} />
          <MenuRow label="Collected so far" value={`$${mine.reduce((s, l) => s + l.paid, 0)}`} color="#7FA87F" />
        </Panel>
        <p className="text-sm text-white/35">Full ledger and payment logging live in the Loan Book tab.</p>
      </div>
    );
  }

  if (roleKey === "debtowner") {
    const mine = loans.filter((l) => l.borrowerId === you.id);
    const remaining = mine.reduce((s, l) => s + Math.max(l.principal - l.paid, 0), 0);
    return (
      <div className="flex flex-col gap-5">
        <Header eyebrow={`Hang in there, ${you.name}`} title="What you owe" subtitle={r.tagline} accent={r.color} />
        <Panel accent={r.color}>
          <MenuRow label="Balances open" value={mine.length} color={r.color} />
          <MenuRow label="Total left to pay" value={`$${remaining}`} color="#D1685E" />
        </Panel>
        <p className="text-sm text-white/35">Payment history and a pay-down button live in the My Debts tab.</p>
      </div>
    );
  }

  if (roleKey === "og") {
    const ogs = users.filter((u) => u.role === "og");
    return (
      <div className="flex flex-col gap-5">
        <Header eyebrow="Welcome back to the lounge" title="OG Lounge" subtitle={r.tagline} accent={r.color} />
        <Panel accent={r.color}>
          <SectionLabel>Your perks</SectionLabel>
          <ul className="flex flex-col gap-1.5 text-sm text-white/60">
            {r.perks.map((p) => <li key={p} className="flex gap-2"><span style={{ color: r.color }}>•</span>{p}</li>)}
          </ul>
        </Panel>
        <Panel>
          <SectionLabel>Fellow OGs</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {ogs.map((u) => <span key={u.id} className="rounded-full px-3 py-1 text-xs" style={{ background: r.color + "14", color: r.color }}>{u.name}</span>)}
          </div>
        </Panel>
      </div>
    );
  }

  if (roleKey === "pending") {
    return (
      <div>
        <Header eyebrow="Status" title="In the fryer" accent={r.color} />
        <Panel className="text-center">
          <Clock size={26} className="mx-auto mb-3 text-white/30" />
          <p className="text-sm text-white/55">You applied for <RoleBadge roleKey={you.appliedFor} /> — Administration or the Owner will get to it soon.</p>
        </Panel>
      </div>
    );
  }

  if (roleKey === "declined") {
    return (
      <div>
        <Header eyebrow="Status" title="Not this time" accent={r.color} />
        <Panel className="text-center">
          <XCircle size={26} className="mx-auto mb-3 text-white/30" />
          <p className="text-sm text-white/55">Your application for <RoleBadge roleKey={you.appliedFor} /> was declined.</p>
          <PrimaryButton onClick={() => handleReapply(you.id)} className="mx-auto mt-4"><RotateCcw size={14} /> Reapply</PrimaryButton>
        </Panel>
      </div>
    );
  }

  // member
  const applyable = Object.keys(ROLES).filter((k) => !["pending", "declined", "member", "owner"].includes(k));
  return (
    <div className="flex flex-col gap-5">
      <Header eyebrow={`Hey, ${you.name}`} title="Your counter" subtitle={r.tagline} accent={r.color} />
      <Panel accent={r.color}>
        <SectionLabel>Your perks</SectionLabel>
        <ul className="flex flex-col gap-1.5 text-sm text-white/60">
          {r.perks.map((p) => <li key={p} className="flex gap-2"><span style={{ color: r.color }}>•</span>{p}</li>)}
        </ul>
      </Panel>
      <Panel>
        <SectionLabel>Want a different role?</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {applyable.map((k) => (
            <GhostButton key={k} onClick={() => handleSelfApply(k)} color={ROLES[k].color}>
              Apply for {ROLES[k].label}
            </GhostButton>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ----------------------------- Other screens ---------------------------- */

function MembersScreen({ users, roleKey, onChangeRole }) {
  return (
    <div>
      <Header eyebrow="Everyone at the counter" title="Roster" subtitle={`${users.length} active members`} />
      <Panel>
        <div className="flex flex-col">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-3 last:border-0">
              <div className="text-sm">{u.name}</div>
              <div className="flex items-center gap-2">
                <RoleBadge roleKey={u.role} />
                {roleKey === "owner" && u.role !== "owner" && (
                  <select defaultValue="" onChange={(e) => { if (e.target.value) onChangeRole(u.id, e.target.value); }}
                    className="rounded-md border border-white/10 bg-black/25 px-2 py-1 text-xs text-white/70 outline-none">
                    <option value="">Change role…</option>
                    {Object.keys(ROLES).filter((k) => !["pending", "declined"].includes(k) && k !== u.role).map((k) => (
                      <option key={k} value={k}>{ROLES[k].label}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ApplicationsScreen({ users, onAccept, onDecline }) {
  return (
    <div>
      <Header eyebrow="Review queue" title="Applications" subtitle={users.length ? `${users.length} waiting on a decision` : undefined} />
      <Panel>
        {users.length === 0 && <p className="text-sm text-white/35">Board's clear — nobody's waiting.</p>}
        <div className="flex flex-col">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-3 last:border-0">
              <div>
                <div className="text-sm">{u.name}</div>
                <div className="mt-0.5 text-xs text-white/40">applying for <RoleBadge roleKey={u.appliedFor} /></div>
              </div>
              <div className="flex gap-1.5">
                <GhostButton onClick={() => onAccept(u.id)} color="#7FA87F"><Check size={13} /> Accept</GhostButton>
                <GhostButton onClick={() => onDecline(u.id)} color="#D1685E"><X size={13} /> Decline</GhostButton>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function LoanRow({ loan, otherUser, onLogPayment, otherLabel }) {
  const [amount, setAmount] = useState("");
  const remaining = Math.max(loan.principal - loan.paid, 0);
  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-sm font-semibold">{otherLabel}: {otherUser.name}</div>
          <div className="text-xs text-white/40">Principal ${loan.principal} · Paid ${loan.paid}</div>
        </div>
        <div className="fm-display text-lg" style={{ color: remaining === 0 ? "#7FA87F" : "#D1685E" }}>
          {remaining === 0 ? "Paid off" : `$${remaining} left`}
        </div>
      </div>
      <div className="mt-3 h-[5px] rounded-full bg-black/30">
        <div className="h-[5px] rounded-full bg-[#7FA87F]" style={{ width: `${Math.min((loan.paid / loan.principal) * 100, 100)}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {loan.history.map((h, i) => (
            <span key={i} className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/45">{h.date}: ${h.amount}</span>
          ))}
        </div>
        {remaining > 0 && (
          <div className="ml-auto flex items-center gap-1.5">
            <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number"
              className="w-24 rounded-md border border-white/10 bg-black/25 px-2 py-1.5 text-xs outline-none focus:border-[#3E8EDE]" />
            <PrimaryButton onClick={() => { onLogPayment(loan.id, amount); setAmount(""); }} className="!px-3 !py-1.5 !text-xs">
              <Receipt size={12} /> Log payment
            </PrimaryButton>
          </div>
        )}
      </div>
    </Panel>
  );
}

function LoanBookScreen({ loans, userById, onLogPayment }) {
  return (
    <div className="flex flex-col gap-4">
      <Header eyebrow="Your ledger" title="Loan book" subtitle="Who owes you, and how it's going." accent="#D1685E" />
      {loans.length === 0 && <Panel><p className="text-sm text-white/35">Nobody's on your book right now.</p></Panel>}
      {loans.map((l) => <LoanRow key={l.id} loan={l} otherUser={userById(l.borrowerId)} otherLabel="Borrower" onLogPayment={onLogPayment} />)}
    </div>
  );
}

function MyDebtsScreen({ loans, userById, onLogPayment }) {
  return (
    <div className="flex flex-col gap-4">
      <Header eyebrow="Where you stand" title="My debts" subtitle="Everything you owe, and everything you've already paid down." accent="#B99C6C" />
      {loans.length === 0 && <Panel><p className="text-sm text-white/35">You're clean — no open balances.</p></Panel>}
      {loans.map((l) => <LoanRow key={l.id} loan={l} otherUser={userById(l.lenderId)} otherLabel="Owed to" onLogPayment={onLogPayment} />)}
    </div>
  );
}

function ChatScreen({ channels, activeChannel, setActiveChannel, messages, userById, chatInput, setChatInput, onSend }) {
  const chan = channels.find((c) => c.id === activeChannel);
  return (
    <div className="flex h-[68vh] flex-col overflow-hidden rounded-lg border border-white/[0.07] bg-[#171C22] md:flex-row">
      <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-white/[0.07] p-2 md:w-44 md:flex-col md:overflow-visible md:border-b-0 md:border-r">
        {channels.map((c) => (
          <button key={c.id} onClick={() => setActiveChannel(c.id)}
            className="shrink-0 rounded-md border-l-2 px-2.5 py-2 text-left text-xs whitespace-nowrap transition-colors"
            style={{
              borderColor: activeChannel === c.id ? "#3E8EDE" : "transparent",
              color: activeChannel === c.id ? "#3E8EDE" : "rgba(236,239,243,0.5)",
              background: activeChannel === c.id ? "rgba(232,166,60,0.06)" : "transparent",
            }}>
            #{c.name}
          </button>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-white/[0.07] px-4 py-3">
          <div className="fm-display text-base">#{chan?.name}</div>
          <div className="text-xs text-white/35">{chan?.desc}</div>
        </div>
        <div className="flex-1 space-y-3.5 overflow-y-auto px-4 py-3">
          {messages.length === 0 && <p className="text-sm text-white/25">No messages yet — say something.</p>}
          {messages.map((m) => {
            const u = userById(m.userId);
            return (
              <div key={m.id} className="flex gap-2 text-sm">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ROLES[u.role].color }} />
                <div>
                  <span className="font-semibold">{u.name}</span>{" "}
                  <span className="text-[11px] text-white/25">{m.time}</span>
                  <div className="text-white/65">{m.text}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 border-t border-white/[0.07] p-3">
          <input value={chatInput} onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            placeholder={`Message #${chan?.name || ""}`}
            className="flex-1 rounded-md border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none focus:border-[#3E8EDE]" />
          <button onClick={onSend} className="rounded-md bg-[#3E8EDE] px-3 py-2 text-[#0D1116]"><Send size={15} /></button>
        </div>
      </div>
    </div>
  );
}


function FordGalleryScreen() {
  const slides = [
    { title: "Front", sub: "Black Ford Ranger Wildtrak — daytime", accent: "#3E8EDE" },
    { title: "Rear", sub: "Tailgate · dual exhaust · Wildtrak badge", accent: "#3E8EDE" },
    { title: "Side profile", sub: "Full side view on the open road", accent: "#3E8EDE" },
    { title: "Door open", sub: "Driver door open — cabin ready", accent: "#3E8EDE" },
    { title: "Interior", sub: "Wildtrak cabin · orange stitch · SYNC", accent: "#3E8EDE" },
    { title: "Rear door open", sub: "Rear three-quarter · passenger door open", accent: "#3E8EDE" },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, []);
  const s = slides[i];
  return (
    <div className="flex flex-col gap-5">
      <Header eyebrow="Proudly Sponsored By Ford™" title="Ranger Wildtrak" subtitle="Black · daytime · auto-playing gallery (slideshow — not a real video with sound)." accent="#3E8EDE" />
      <Panel accent="#3E8EDE" className="overflow-hidden p-0">
        <div className="relative flex min-h-[280px] flex-col items-center justify-center bg-gradient-to-b from-[#1B3A54] to-[#0A0D11] px-6 py-12 text-center">
          <div className="fm-display mb-2 text-4xl text-white sm:text-5xl">{s.title}</div>
          <p className="max-w-md text-sm text-white/55">{s.sub}</p>
          <div className="mt-8 flex gap-2">
            {slides.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)}
                className="h-1.5 rounded-full transition-all"
                style={{ width: idx === i ? 28 : 8, background: idx === i ? "#3E8EDE" : "rgba(255,255,255,0.25)" }}
              />
            ))}
          </div>
          <p className="mt-6 text-[11px] text-white/30">Slide {i + 1} / {slides.length} · advances every 3.5s</p>
        </div>
      </Panel>
      <Panel>
        <SectionLabel>About this gallery</SectionLabel>
        <p className="text-sm text-white/50">
          This is an auto-playing slideshow of the black Wildtrak angles (front, rear, side, open door, interior).
          A real video with engine noise and the Ford startup chime can’t be generated here — only stills and this slideshow.
        </p>
        <p className="mt-3 text-sm text-white/40">
          To use the photos from chat: save them into an <code className="text-white/60">images/</code> folder as
          ranger-1.jpg … ranger-6.jpg and we can wire them in next.
        </p>
      </Panel>
      <div className="grid gap-3 sm:grid-cols-3">
        {slides.map((sl, idx) => (
          <button key={sl.title} onClick={() => setI(idx)}
            className="rounded-lg border border-white/[0.07] bg-[#171C22] p-4 text-left transition-colors hover:border-[#3E8EDE]/40"
            style={{ borderColor: idx === i ? "#3E8EDE55" : undefined }}>
            <div className="fm-display text-base" style={{ color: idx === i ? "#3E8EDE" : "#fff" }}>{sl.title}</div>
            <div className="mt-1 text-xs text-white/40">{sl.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}


function RolesScreen({ users }) {
  return (
    <div>
      <Header eyebrow="What everyone gets" title="Roles & perks" subtitle="Every seat at the counter comes with its own perks and a signature power." />
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(ROLES).map(([key, r]) => {
          const Icon = r.icon;
          const count = users.filter((u) => u.role === key).length;
          return (
            <Panel key={key} accent={r.color} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md" style={{ background: r.color + "18", color: r.color }}>
                    <Icon size={15} />
                  </span>
                  <div className="fm-display text-lg" style={{ color: r.color }}>{r.label}</div>
                </div>
                <span className="text-xs text-white/35">{count} member{count === 1 ? "" : "s"}</span>
              </div>
              <p className="text-sm text-white/50">{r.tagline}</p>
              {r.perks.length > 0 && (
                <ul className="flex flex-col gap-1 text-xs text-white/55">
                  {r.perks.map((p) => <li key={p} className="flex gap-1.5"><span style={{ color: r.color }}>•</span>{p}</li>)}
                </ul>
              )}
              <div className="mt-1 rounded-md bg-black/20 px-2.5 py-2 text-xs text-white/50">
                <span className="font-semibold" style={{ color: r.color }}>Power: </span>{r.power}
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<FryMenu />);
