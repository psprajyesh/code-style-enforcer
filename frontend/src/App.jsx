import { useState } from "react";
import axios from "axios";

const FONT_IMPORT_ID = "csenforcer-fonts";

function ensureFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById(FONT_IMPORT_ID)) return;
  const link = document.createElement("link");
  link.id = FONT_IMPORT_ID;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}

function App() {
  ensureFonts();

  const [code, setCode] = useState("");
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(null);

  const checkCode = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("http://127.0.0.1:5000/check", { code });
      setViolations(res.data);
      setChecked(true);
    } catch {
      setError("Couldn't reach the checker. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const lineCount = code ? code.split("\n").length : 0;

  return (
    <div style={styles.page}>
      <div style={styles.scanline} />

      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoMark}>{"{ }"}</div>
          <div>
            <h1 style={styles.title}>Code Style Enforcer</h1>
            <p style={styles.subtitle}>
              A teammate that never forgets your standards.
            </p>
          </div>
        </div>
        <div style={styles.statusPill}>
          <span style={styles.statusDot} />
          rules synced from Parcle
        </div>
      </header>

      <main style={styles.main}>
        {/* Left panel — input */}
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelLabel}>01 — INPUT</span>
            <span style={styles.lineCounter}>{lineCount} lines</span>
          </div>

          <textarea
            style={styles.textarea}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// paste a snippet to check it against your style rules&#10;function user_name() {&#10;  console.log('debug');&#10;}"
            spellCheck="false"
          />

          <button
            style={{
              ...styles.button,
              ...(loading ? styles.buttonLoading : {}),
            }}
            onClick={checkCode}
            disabled={loading || !code.trim()}
          >
            {loading ? "Checking…" : "Check Code"}
            {!loading && <span style={styles.buttonArrow}>→</span>}
          </button>

          {error && <p style={styles.errorText}>{error}</p>}
        </section>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Right panel — results */}
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelLabel}>02 — VIOLATIONS</span>
            {checked && (
              <span
                style={{
                  ...styles.countPill,
                  ...(violations.length === 0 ? styles.countPillClean : {}),
                }}
              >
                {violations.length === 0
                  ? "all clear"
                  : `${violations.length} found`}
              </span>
            )}
          </div>

          <div style={styles.resultsArea}>
            {!checked && !loading && (
              <div style={styles.emptyState}>
                <div style={styles.emptyGlyph}>?</div>
                <p style={styles.emptyText}>
                  Results will appear here once you check a snippet.
                </p>
              </div>
            )}

            {loading && (
              <div style={styles.emptyState}>
                <div style={styles.loadingGlyph} />
                <p style={styles.emptyText}>Querying style rules…</p>
              </div>
            )}

            {checked && !loading && violations.length === 0 && (
              <div style={styles.emptyState}>
                <div style={{ ...styles.emptyGlyph, color: "#3FB950" }}>
                  ✓
                </div>
                <p style={styles.emptyText}>
                  No violations. This snippet follows every stored rule.
                </p>
              </div>
            )}

            {checked &&
              !loading &&
              violations.map((v, i) => (
                <div key={i} style={styles.violationCard}>
                  <div style={styles.violationHead}>
                    <span style={styles.violationTag}>{v.rule}</span>
                    {v.line !== undefined && (
                      <span style={styles.violationLine}>
                        line {v.line}
                      </span>
                    )}
                  </div>
                  <p style={styles.violationFix}>
                    <span style={styles.fixLabel}>fix · </span>
                    {v.fix}
                  </p>
                </div>
              ))}
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        powered by <span style={styles.footerAccent}>Parcle</span> memory ·
        built on <span style={styles.footerAccent}>Enter Pro</span>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0D1117",
    color: "#E6EDF3",
    fontFamily: "'Inter', sans-serif",
    padding: "32px 40px 24px",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
  },
  scanline: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background:
      "linear-gradient(90deg, transparent, #7C5CFC, transparent)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "32px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  logoMark: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "20px",
    fontWeight: 700,
    color: "#7C5CFC",
    background: "#161B22",
    border: "1px solid #2A3140",
    borderRadius: "10px",
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: "20px",
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.01em",
  },
  subtitle: {
    fontSize: "13px",
    color: "#8B949E",
    margin: "2px 0 0",
    fontStyle: "italic",
  },
  statusPill: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "12px",
    color: "#8B949E",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #2A3140",
    borderRadius: "20px",
    padding: "6px 14px",
    background: "#161B22",
  },
  statusDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#3FB950",
    boxShadow: "0 0 8px #3FB950",
  },
  main: {
    display: "grid",
    gridTemplateColumns: "1fr 1px 1fr",
    gap: "28px",
    alignItems: "start",
  },
  divider: {
    background:
      "linear-gradient(180deg, transparent, #2A3140 15%, #2A3140 85%, transparent)",
    height: "100%",
    minHeight: "420px",
  },
  panel: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  panelLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    color: "#7C5CFC",
  },
  lineCounter: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "11px",
    color: "#8B949E",
  },
  textarea: {
    width: "100%",
    minHeight: "320px",
    background: "#161B22",
    border: "1px solid #2A3140",
    borderRadius: "10px",
    color: "#E6EDF3",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "13.5px",
    lineHeight: "1.6",
    padding: "16px",
    boxSizing: "border-box",
    resize: "vertical",
    outline: "none",
  },
  button: {
    marginTop: "14px",
    background: "#7C5CFC",
    color: "#0D1117",
    border: "none",
    borderRadius: "8px",
    padding: "12px 20px",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "opacity 0.15s ease, transform 0.1s ease",
  },
  buttonLoading: {
    opacity: 0.6,
    cursor: "default",
  },
  buttonArrow: {
    transition: "transform 0.15s ease",
  },
  errorText: {
    color: "#F85149",
    fontSize: "13px",
    marginTop: "10px",
    fontFamily: "'JetBrains Mono', monospace",
  },
  resultsArea: {
    background: "#161B22",
    border: "1px solid #2A3140",
    borderRadius: "10px",
    minHeight: "320px",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    overflowY: "auto",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "40px 20px",
    minHeight: "300px",
  },
  emptyGlyph: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "26px",
    color: "#2A3140",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "1px solid #2A3140",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingGlyph: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    border: "2px solid #2A3140",
    borderTopColor: "#7C5CFC",
    animation: "spin 0.8s linear infinite",
  },
  emptyText: {
    fontSize: "13px",
    color: "#8B949E",
    textAlign: "center",
    maxWidth: "260px",
    margin: 0,
  },
  countPill: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "11px",
    fontWeight: 600,
    color: "#F85149",
    background: "rgba(248, 81, 73, 0.12)",
    border: "1px solid rgba(248, 81, 73, 0.3)",
    borderRadius: "20px",
    padding: "4px 10px",
  },
  countPillClean: {
    color: "#3FB950",
    background: "rgba(63, 185, 80, 0.12)",
    border: "1px solid rgba(63, 185, 80, 0.3)",
  },
  violationCard: {
    background: "#0D1117",
    border: "1px solid #2A3140",
    borderLeft: "3px solid #F85149",
    borderRadius: "6px",
    padding: "12px 14px",
  },
  violationHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "6px",
  },
  violationTag: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "12px",
    fontWeight: 600,
    color: "#E6EDF3",
  },
  violationLine: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "11px",
    color: "#8B949E",
  },
  violationFix: {
    fontSize: "13px",
    color: "#C9D1D9",
    margin: 0,
    lineHeight: "1.5",
  },
  fixLabel: {
    color: "#7C5CFC",
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
  },
  footer: {
    textAlign: "center",
    marginTop: "32px",
    fontSize: "12px",
    color: "#5C6470",
    fontFamily: "'JetBrains Mono', monospace",
  },
  footerAccent: {
    color: "#7C5CFC",
  },
};

export default App;