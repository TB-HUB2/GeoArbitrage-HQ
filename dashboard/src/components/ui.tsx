"use client"
import { Component, ReactNode } from "react"
import { GRAY_MUTED, GRAY_MID, GRAY_FAINT, fmt, urgencyColors } from "@/lib/helpers"

// Error Boundary
interface EBProps { section?: string; children: ReactNode }
interface EBState { hasError: boolean; error: Error | null }

export class ErrorBoundary extends Component<EBProps, EBState> {
  constructor(props: EBProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error } }
  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl p-5 my-2" style={{ background: "#D45B5B11", border: "1px solid #D45B5B33" }}>
          <p className="text-sm" style={{ color: "#D45B5B" }}>Fehler in {this.props.section || "dieser Sektion"}.</p>
          <p className="text-xs mt-1" style={{ color: GRAY_MUTED }}>{this.state.error?.message}</p>
          <button className="text-xs mt-2 px-3 py-1 rounded" style={{ background: "#2a2e38", color: "#E8DCC8" }}
            onClick={() => this.setState({ hasError: false, error: null })}>Erneut versuchen</button>
        </div>
      )
    }
    return this.props.children
  }
}

export const Skeleton = ({ width, height, className }: { width?: string | number; height?: string | number; className?: string }) => (
  <div className={`rounded animate-pulse ${className || ""}`}
    style={{ width: width || "100%", height: height || 20, background: "linear-gradient(90deg, #1a1d23 25%, #2a2e38 50%, #1a1d23 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
)

export const KPICard = ({ label, value, sub, accent, target, targetLabel }: {
  label: string; value: string; sub?: string; accent?: string
  target?: { pct: number; label: string }; targetLabel?: string
}) => (
  <div className="rounded-xl p-5 flex flex-col justify-between" style={{ background: "linear-gradient(135deg, #1a1d23 0%, #22262e 100%)", border: "1px solid #2a2e38" }}>
    <span className="text-xs tracking-widest uppercase" style={{ color: GRAY_MUTED, fontSize: 11 }}>{label}</span>
    <span className="text-2xl font-bold mt-2" style={{ color: accent || "#E8DCC8", fontFamily: "'DM Sans', sans-serif" }}>{value}</span>
    {sub && <span className="text-xs mt-1" style={{ color: sub.startsWith("+") ? "#5B8C5A" : sub.startsWith("-") ? "#D45B5B" : GRAY_MUTED, fontSize: 12 }}>{sub}</span>}
    {target && (
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "#2a2e38" }}>
          <div className="h-full rounded-full" style={{ width: `${Math.min(100, target.pct)}%`, background: accent || "#C9A84C", transition: "width 0.7s ease" }} />
        </div>
        <span style={{ color: GRAY_MUTED, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>{targetLabel || `Ziel: ${target.label}`}</span>
      </div>
    )}
  </div>
)

export const SectionHeader = ({ icon, title, right, timestamp }: { icon: string; title: string; right?: ReactNode; timestamp?: string }) => (
  <div className="flex items-center gap-1.5 sm:gap-2 mb-4 mt-2">
    <span className="text-lg flex-shrink-0">{icon}</span>
    <h2 className="text-[10px] sm:text-sm font-semibold tracking-wide sm:tracking-widest uppercase whitespace-nowrap min-w-0" style={{ color: "#C9A84C", fontFamily: "'DM Sans', sans-serif" }}>{title}</h2>
    <div className="flex-1 h-px ml-1 sm:ml-3" style={{ background: "linear-gradient(to right, #C9A84C33, #C9A84C11, transparent)" }} />
    {timestamp && <span className="flex-shrink-0" style={{ color: GRAY_MUTED, fontSize: 10 }}>{timestamp}</span>}
    {right && <div className="flex-shrink-0">{right}</div>}
  </div>
)

export const UrgencyDot = ({ u }: { u: string }) => (
  <span className="inline-block w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0"
    style={{ background: urgencyColors[u] || GRAY_FAINT, boxShadow: `0 0 6px ${(urgencyColors[u] || GRAY_FAINT)}44` }} />
)

export const ProgressBar = ({ pct, color, height }: { pct: number; color?: string; height?: number }) => (
  <div className="w-full rounded-full overflow-hidden" style={{ background: "#1a1d23", height: height || 6 }}>
    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(pct, 2)}%`, background: color || "#C9A84C" }} />
  </div>
)

export const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { bg: string; color: string; border: string; label: string }> = {
    active: { bg: "#5B8C5A22", color: "#5B8C5A", border: "#5B8C5A33", label: "Aktiv" },
    research: { bg: "#7B68EE22", color: "#7B68EE", border: "#7B68EE33", label: "Research" },
    blocked: { bg: "#D45B5B22", color: "#D45B5B", border: "#D45B5B33", label: "Blockiert" },
    upcoming: { bg: "#4A90A422", color: "#4A90A4", border: "#4A90A433", label: "Geplant" },
    done: { bg: "#5B8C5A22", color: "#5B8C5A", border: "#5B8C5A33", label: "Erledigt" },
  }
  const s = map[status] || map.upcoming
  return <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 11 }}>{s.label}</span>
}

export const StepPipeline = ({ steps, color }: { steps: { label: string; done: boolean; sub?: string }[]; color: string }) => (
  <div className="flex items-center gap-0.5 mt-3">
    {steps.map((s, i) => (
      <div key={i} className="flex items-center">
        <div className="rounded-full transition-all cursor-default" title={`${s.label}${s.sub ? ` (${s.sub})` : ""}`}
          style={{ width: s.done ? 10 : 8, height: s.done ? 10 : 8, background: s.done ? color : "#2a2e38",
            border: s.done ? "none" : `1.5px solid ${color}44`, boxShadow: s.done ? `0 0 8px ${color}44` : "none",
            padding: 7, backgroundClip: "content-box" }} />
        {i < steps.length - 1 && <div style={{ width: 12, height: 1.5, background: s.done ? color : "#2a2e3866" }} />}
      </div>
    ))}
  </div>
)

export const Row = ({ label, value, color, bold, indent }: { label: string; value: string; color?: string; bold?: boolean; indent?: boolean }) => (
  <div className={`flex justify-between items-baseline gap-3 py-px ${indent ? "pl-3" : ""}`}>
    <span style={{ color: color || GRAY_MID, fontWeight: bold ? 700 : 400, minWidth: 0, fontSize: 12 }}>{label}</span>
    <span className="shrink-0" style={{ color: color || "#E8DCC8", fontWeight: bold ? 700 : 400, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{value}</span>
  </div>
)

export const Sep = () => <div className="my-1" style={{ borderTop: "1px solid #2a2e3866" }} />

export const Acc = ({ title, isOpen, onToggle, summary, children }: {
  title: string; isOpen: boolean; onToggle: () => void; summary?: string; children: ReactNode
}) => (
  <div style={{ borderBottom: "1px solid #2a2e3833" }}>
    <button onClick={onToggle} className="w-full flex items-center justify-between py-2.5 px-1 text-left">
      <span className="font-medium" style={{ color: GRAY_MID, fontSize: 12 }}>{title}</span>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        {!isOpen && summary && <span style={{ color: GRAY_MUTED, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{summary}</span>}
        <span className="select-none" style={{ color: GRAY_FAINT, fontSize: 12 }}>{isOpen ? "\u25B2" : "\u25BC"}</span>
      </div>
    </button>
    {isOpen && <div className="pb-3 px-1 space-y-0.5">{children}</div>}
  </div>
)

export const EmptyState = ({ icon, message }: { icon: string; message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 opacity-60">
    <span className="text-3xl mb-3">{icon}</span>
    <p style={{ color: GRAY_MID, fontSize: 13 }}>{message}</p>
  </div>
)
