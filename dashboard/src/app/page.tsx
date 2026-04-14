"use client"
import { useState, useMemo, useCallback } from "react"
import { getSupabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { ErrorBoundary, Skeleton, KPICard, SectionHeader, UrgencyDot, ProgressBar, StatusBadge, StepPipeline, Row, Sep, Acc, EmptyState } from "@/components/ui"
import { fmt, fmtPct, daysUntil, safeNum, safeDivide, GRAY_MUTED, GRAY_MID, GRAY_FAINT, urgencyOrder, TYPE_COLORS } from "@/lib/helpers"
import { useBudget, useMilestones, useProperties, usePortfolio, useCalendar, useWealthSnapshots, useScanResults, useExitPrerequisites, useSavingsGoals, useAssetAllocation } from "@/lib/hooks"

export default function Dashboard() {
  const [tab, setTab] = useState("overview")
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ "0-cashflow": true })
  const [chartRange, setChartRange] = useState("6M")
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = getSupabase()
    if (supabase) await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  // Data hooks
  const { budgetData, totalIncome, totalExpense, totalInvest, savingsRate, spendRate, overBudgetItems, loading: budgetLoading } = useBudget()
  const { milestones, loading: msLoading } = useMilestones()
  const { properties, loading: propLoading } = useProperties()
  const { holdings, totalPortfolio, totalCost, unrealizedPL, loading: pfLoading } = usePortfolio()
  const { events: calendarEvents, loading: calLoading } = useCalendar()
  const { snapshots, loading: nwLoading } = useWealthSnapshots()
  const { scanResults, loading: scanLoading } = useScanResults()
  const { prerequisites, score: exitScore, metCount: exitMetCount, loading: exitLoading } = useExitPrerequisites()
  const { goals: savingsGoals, loading: goalsLoading } = useSavingsGoals()

  const isLoading = budgetLoading || msLoading || propLoading || pfLoading

  const assetAllocation = useAssetAllocation(properties, holdings, snapshots)

  const netWorth = useMemo(() => assetAllocation.reduce((s, a) => s + safeNum(a.value), 0), [assetAllocation])
  const nwChange = useMemo(() => {
    if (snapshots.length < 2) return 0
    const prev = safeNum(snapshots[snapshots.length - 2]?.nettovermoegen || snapshots[snapshots.length - 2]?.total_net_worth || snapshots[snapshots.length - 2]?.total)
    return prev ? safeDivide(netWorth - prev, prev) * 100 : 0
  }, [netWorth, snapshots])

  const chartData = useMemo(() => {
    const data = snapshots.map((s: any) => ({
      month: new Date(s.snapshot_date).toLocaleDateString("de-DE", { month: "short" }),
      total: safeNum(s.nettovermoegen || s.total_net_worth || s.total),
    }))
    if (chartRange === "3M") return data.slice(-3)
    if (chartRange === "6M") return data.slice(-6)
    if (chartRange === "12M") return data.slice(-12)
    return data // "All"
  }, [snapshots, chartRange])

  const nwTarget = 200000

  // Deadlines from calendar events
  const deadlines = useMemo(() => {
    return (calendarEvents || [])
      .filter((e: any) => e.urgency || e.category)
      .map((e: any) => ({
        date: e.event_date,
        title: e.title || e.description,
        urgency: e.urgency || (daysUntil(e.event_date) < 30 ? "red" : daysUntil(e.event_date) < 90 ? "yellow" : "green"),
      }))
      .sort((a: any, b: any) => (urgencyOrder[a.urgency] || 2) - (urgencyOrder[b.urgency] || 2))
      .slice(0, 8)
  }, [calendarEvents])

  // Tab badges
  const openTaskCount = useMemo(() => (milestones || []).reduce((s: number, m: any) => s + ((m.tasks || []).filter((t: any) => t.status !== "done")).length, 0), [milestones])
  const scanChangeCount = useMemo(() => (scanResults || []).filter((s: any) => s.status === "change").length, [scanResults])

  const handleTabKeyDown = useCallback((e: React.KeyboardEvent, tabs: any[], currentIdx: number) => {
    if (e.key === "ArrowRight") { e.preventDefault(); setTab(tabs[(currentIdx + 1) % tabs.length].id) }
    else if (e.key === "ArrowLeft") { e.preventDefault(); setTab(tabs[(currentIdx - 1 + tabs.length) % tabs.length].id) }
  }, [])

  const tabs = [
    { id: "overview", label: "Überblick" },
    { id: "milestones", label: "Strategie", badge: openTaskCount > 0 ? openTaskCount : null },
    { id: "budget", label: "Budget", badge: overBudgetItems.length > 0 ? overBudgetItems.length : null, badgeColor: "#D45B5B" },
    { id: "property", label: "Immobilien" },
    { id: "portfolio", label: "Portfolio" },
    { id: "scan", label: "Weekly Scan", badge: scanChangeCount > 0 ? scanChangeCount : null },
  ]

  const toggleSection = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))
  const isOpen = (key: string) => !!expandedSections[key]

  return (
    <div className="min-h-screen" style={{ background: "#0f1117", color: "#E8DCC8" }}>
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid #1e2028" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: "linear-gradient(135deg, #C9A84C, #8B7355)", color: "#0f1117" }}>G</div>
          <div>
            <h1 className="text-base font-bold tracking-wide" style={{ color: "#E8DCC8" }}>GeoArbitrage HQ</h1>
            <span style={{ color: GRAY_MUTED, fontSize: 12 }}>Virtual Family Office</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full" style={{ background: "#5B8C5A22", color: "#5B8C5A", border: "1px solid #5B8C5A33", fontSize: 12 }}>
            {isLoading ? "Laden..." : "System aktiv"}
          </span>
          <span style={{ color: GRAY_MUTED, fontSize: 12 }}>{new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}</span>
          <button onClick={handleLogout} style={{ color: GRAY_MUTED, fontSize: 12, background: "transparent", border: "1px solid #333", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="px-6 pt-4 flex gap-1 overflow-x-auto" role="tablist">
        {tabs.map((t, idx) => (
          <button key={t.id} onClick={() => setTab(t.id)} onKeyDown={e => handleTabKeyDown(e, tabs, idx)}
            role="tab" aria-selected={tab === t.id} tabIndex={tab === t.id ? 0 : -1}
            className="px-4 py-2 rounded-t-lg font-medium transition-all whitespace-nowrap relative flex items-center gap-1.5"
            style={{ background: tab === t.id ? "#C9A84C12" : "transparent", color: tab === t.id ? "#C9A84C" : GRAY_MUTED,
              borderBottom: tab === t.id ? "2px solid #C9A84C" : "2px solid transparent", fontSize: 12 }}>
            {t.label}
            {t.badge && (
              <span className="inline-flex items-center justify-center rounded-full font-bold"
                style={{ background: t.badgeColor ? `${t.badgeColor}22` : "#C9A84C22", color: t.badgeColor || "#C9A84C", fontSize: 9, width: 18, height: 18 }}>
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <main className="px-6 py-5">

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <ErrorBoundary section="Überblick">
            <div className="space-y-6">
              {isLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} height={110} className="rounded-xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  <KPICard label="Nettovermögen" value={fmt(netWorth)} sub={fmtPct(nwChange) + " vs. Vormonat"} target={{ pct: (netWorth / nwTarget) * 100, label: fmt(nwTarget) }} />
                  <KPICard label="Sparquote" value={`${savingsRate.toFixed(0)}%`} sub={fmt(totalInvest) + " investiert"} accent="#5B8C5A" target={{ pct: (savingsRate / 50) * 100, label: "50%" }} />
                  <KPICard label="Spend Rate" value={`${spendRate.toFixed(0)}%`} sub={fmt(totalExpense) + " Ausgaben"} accent={spendRate > 50 ? "#D45B5B" : "#4A90A4"} />
                  <KPICard label="Frei verfügbar" value={fmt(totalIncome - totalExpense - totalInvest)} sub={`von ${fmt(totalIncome)} netto`} accent="#4A90A4" />
                  <ExitReadinessCompact score={exitScore} metCount={exitMetCount} total={prerequisites.length} />
                </div>
              )}

              {/* Charts + Asset Allocation */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-xl p-3 sm:p-5" style={{ background: "#1a1d23", border: "1px solid #2a2e38" }}>
                  <SectionHeader icon="📈" title="Vermögensentwicklung" right={
                    <div className="flex gap-1">
                      {["3M", "6M", "12M", "All"].map(r => (
                        <button key={r} onClick={() => setChartRange(r)} className="px-2 py-0.5 rounded transition-all"
                          style={{ background: chartRange === r ? "#C9A84C22" : "transparent", color: chartRange === r ? "#C9A84C" : GRAY_MUTED,
                            border: chartRange === r ? "1px solid #C9A84C33" : "1px solid transparent", fontSize: 10 }}>{r}</button>
                      ))}
                    </div>
                  } />
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" tick={{ fill: GRAY_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: GRAY_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={{ background: "#22262e", border: "1px solid #2a2e38", borderRadius: 8, color: "#E8DCC8", fontSize: 12 }} formatter={(v: number) => [fmt(v), "Vermögen"]} />
                        <ReferenceLine y={nwTarget} stroke="#C9A84C44" strokeDasharray="6 4" />
                        <Area type="monotone" dataKey="total" stroke="#C9A84C" strokeWidth={2} fill="url(#nwGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState icon="📈" message="Noch keine Vermögensdaten. Erste Einträge via Telegram oder Dashboard." />
                  )}
                </div>

                <div className="rounded-xl p-3 sm:p-5" style={{ background: "#1a1d23", border: "1px solid #2a2e38" }}>
                  <SectionHeader icon="🎯" title="Asset Allocation" />
                  {assetAllocation.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={140}>
                        <PieChart>
                          <Pie data={assetAllocation} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={3} dataKey="value">
                            {assetAllocation.map((a, i) => <Cell key={i} fill={a.color} stroke="none" />)}
                          </Pie>
                          <Tooltip contentStyle={{ background: "#22262e", border: "1px solid #2a2e38", borderRadius: 8, color: "#E8DCC8", fontSize: 11 }} formatter={(v: number) => fmt(v)} />
                        </PieChart>
                      </ResponsiveContainer>
                      {(() => {
                        const total = assetAllocation.reduce((s, a) => s + a.value, 0)
                        return (
                          <div className="space-y-1.5 mt-2">
                            {assetAllocation.map((a, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                                  <span style={{ color: GRAY_MID, fontSize: 12 }}>{a.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#E8DCC8", fontSize: 12 }}>{fmt(a.value)}</span>
                                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: GRAY_MUTED, fontSize: 10 }}>{((a.value / total) * 100).toFixed(0)}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      })()}
                    </>
                  ) : (
                    <EmptyState icon="🎯" message="Noch keine Assets erfasst." />
                  )}
                </div>
              </div>

              {/* Milestones + Deadlines */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-xl p-5" style={{ background: "#1a1d23", border: "1px solid #2a2e38" }}>
                  <SectionHeader icon="🚀" title="Strategie-Milestones"
                    right={<button onClick={() => setTab("milestones")} style={{ color: "#C9A84C", fontSize: 12 }}>Alle anzeigen →</button>} />
                  {(milestones || []).length === 0 ? (
                    <EmptyState icon="🎯" message="Noch keine Milestones definiert." />
                  ) : (
                    <div className="space-y-3">
                      {(milestones || []).map((m: any, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-base flex-shrink-0">{m.icon || "📌"}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="truncate" style={{ color: "#E8DCC8", fontSize: 12 }}>{m.title}</span>
                              <span className="font-medium ml-2 flex-shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace", color: m.color || "#C9A84C", fontSize: 12 }}>{m.progress || 0}%</span>
                            </div>
                            <ProgressBar pct={m.progress || 0} color={m.color || "#C9A84C"} height={4} />
                          </div>
                          <StatusBadge status={m.status || "upcoming"} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-xl p-5" style={{ background: "#1a1d23", border: "1px solid #2a2e38" }}>
                  <SectionHeader icon="⏰" title="Anstehende Fristen" />
                  {deadlines.length === 0 ? (
                    <EmptyState icon="⏰" message="Keine anstehenden Fristen." />
                  ) : (
                    <div className="space-y-3">
                      {deadlines.map((d: any, i: number) => (
                        <div key={i} className="flex items-start gap-3 py-2" style={{ borderBottom: i < deadlines.length - 1 ? "1px solid #2a2e3844" : "none" }}>
                          <UrgencyDot u={d.urgency} />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{d.title}</div>
                            <div className="mt-0.5" style={{ color: GRAY_MUTED, fontSize: 12 }}>
                              {new Date(d.date).toLocaleDateString("de-DE")} — in {daysUntil(d.date)} Tagen
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Exit Readiness */}
              <ExitReadinessGauge prerequisites={prerequisites} score={exitScore} metCount={exitMetCount} />
            </div>
          </ErrorBoundary>
        )}

        {/* STRATEGIE TAB */}
        {tab === "milestones" && (
          <ErrorBoundary section="Strategie">
            <div className="space-y-6">
              <ExitReadinessGauge prerequisites={prerequisites} score={exitScore} metCount={exitMetCount} />
              <div>
                <SectionHeader icon="🚀" title="Strategie-Milestones & To-Dos" />
                {(milestones || []).length === 0 ? (
                  <EmptyState icon="🎯" message="Noch keine Milestones definiert." />
                ) : (
                  <div className="space-y-3">
                    {(milestones || []).map((m: any) => (
                      <MilestoneCard key={m.id} m={m} expanded={expandedMilestone === m.id}
                        onToggle={() => setExpandedMilestone(expandedMilestone === m.id ? null : m.id)} showTasks />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ErrorBoundary>
        )}

        {/* BUDGET TAB */}
        {tab === "budget" && (
          <ErrorBoundary section="Budget">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <KPICard label="Einkommen" value={fmt(totalIncome)} sub="Gehalt + Miete" accent="#5B8C5A" />
                <KPICard label="Ausgaben" value={fmt(totalExpense)} sub={`${spendRate.toFixed(0)}% des Einkommens`} accent="#D45B5B" />
                <KPICard label="Investiert" value={fmt(totalInvest)} sub={`${savingsRate.toFixed(0)}% Sparquote`} accent="#C9A84C" target={{ pct: (savingsRate / 50) * 100, label: "50%" }} />
                <KPICard label="Frei verfügbar" value={fmt(totalIncome - totalExpense - totalInvest)} accent="#4A90A4" />
              </div>

              {overBudgetItems.length > 0 && (
                <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "#D45B5B08", border: "1px solid #D45B5B22" }}>
                  <span style={{ fontSize: 16 }}>⚠️</span>
                  <div>
                    <p className="font-medium" style={{ color: "#D45B5B", fontSize: 13 }}>Budget überschritten</p>
                    <p style={{ color: GRAY_MID, fontSize: 12 }}>
                      {overBudgetItems.map((b: any) => `${b.cat || b.category}: ${fmt(Math.abs(b.actual) - Math.abs(b.planned))} über Plan`).join(" · ")}
                    </p>
                  </div>
                </div>
              )}

              <div className="rounded-xl p-5" style={{ background: "#1a1d23", border: "1px solid #2a2e38" }}>
                <SectionHeader icon="💶" title="Budget — Plan vs. Ist" />
                {[
                  { type: "income", label: "Einkommen", icon: "📥", barColor: "#5B8C5A" },
                  { type: "expense", label: "Ausgaben", icon: "📤", barColor: "#4A90A4" },
                  { type: "investment", label: "Investitionen", icon: "📊", barColor: "#C9A84C" },
                  { type: "reserve", label: "Rücklagen", icon: "🛡️", barColor: "#7B68EE" },
                ].map(group => {
                  const items = budgetData.filter((b: any) => b.type === group.type)
                  if (items.length === 0) return null
                  const maxVal = Math.max(...budgetData.map((x: any) => Math.abs(x.planned || 0)))
                  return (
                    <div key={group.type} className="mb-4">
                      <div className="flex items-center gap-2 mb-2 mt-3">
                        <span style={{ fontSize: 13 }}>{group.icon}</span>
                        <span className="font-medium uppercase tracking-wider" style={{ color: group.barColor, fontSize: 11 }}>{group.label}</span>
                        <div className="flex-1 h-px" style={{ background: `${group.barColor}22` }} />
                      </div>
                      {items.map((b: any, i: number) => {
                        const planned = Math.abs(b.planned || 0)
                        const actual = Math.abs(b.actual || 0)
                        const diff = actual - planned
                        const overBudget = b.type !== "income" && diff > 0
                        return (
                          <div key={i} className="flex items-center gap-3 py-2 px-2 rounded"
                            style={{ borderBottom: "1px solid #2a2e3822", background: overBudget ? "#D45B5B06" : "transparent" }}>
                            <div className="w-36 truncate" style={{ color: GRAY_MID, fontSize: 12 }}>{b.cat || b.category}</div>
                            <div className="flex-1 flex items-center gap-2">
                              <div className="flex-1 relative h-5 rounded" style={{ background: "#0f111766" }}>
                                <div className="absolute inset-y-0 left-0 rounded" style={{ width: `${maxVal ? (planned / maxVal) * 100 : 0}%`, background: `${group.barColor}33`, borderRight: `1px dashed ${group.barColor}66` }} />
                                <div className="absolute inset-y-0 left-0 rounded" style={{ width: `${maxVal ? (actual / maxVal) * 100 : 0}%`, background: `${group.barColor}88` }} />
                              </div>
                            </div>
                            <div className="w-20 text-right">
                              <span className="font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#E8DCC8", fontSize: 12 }}>{fmt(actual)}</span>
                            </div>
                            <div className="w-16 text-right">
                              {diff !== 0 && <span style={{ fontFamily: "'JetBrains Mono', monospace", color: overBudget ? "#D45B5B" : "#5B8C5A", fontSize: 12 }}>{overBudget ? "+" : ""}{fmt(diff)}</span>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
                {budgetData.length === 0 && <EmptyState icon="💶" message="Noch keine Budget-Daten. Erfasse sie via Telegram: 'Gehalt 4200'" />}
              </div>

              {/* Savings Goals */}
              {(savingsGoals || []).length > 0 && (
                <div className="rounded-xl p-5" style={{ background: "#1a1d23", border: "1px solid #2a2e38" }}>
                  <SectionHeader icon="🎯" title="Ziel-Budgets" />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {(savingsGoals || []).map((g: any, i: number) => {
                      const pct = safeDivide(g.current || 0, g.target || 1) * 100
                      return (
                        <div key={i} className="rounded-lg p-4" style={{ background: "#0f111744", border: "1px solid #2a2e3866" }}>
                          <div className="flex items-center gap-2 mb-3">
                            <span>{g.icon || "🎯"}</span>
                            <span className="font-medium" style={{ color: GRAY_MID, fontSize: 12 }}>{g.name}</span>
                          </div>
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-lg font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: g.color || "#C9A84C" }}>{fmt(g.current || 0)}</span>
                            <span style={{ color: GRAY_MUTED, fontSize: 12 }}>/ {fmt(g.target || 0)}</span>
                          </div>
                          <ProgressBar pct={pct} color={g.color || "#C9A84C"} height={6} />
                          <p className="mt-2" style={{ color: GRAY_MUTED, fontSize: 12 }}>{pct.toFixed(0)}% erreicht</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </ErrorBoundary>
        )}

        {/* PROPERTY TAB */}
        {tab === "property" && (
          <ErrorBoundary section="Immobilien">
            <div className="space-y-6">
              {(properties || []).length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <KPICard label="Portfolio-Wert" value={fmt(properties.reduce((s: number, p: any) => s + safeNum(p.value || p.current_value), 0))} accent="#C9A84C" />
                  <KPICard label="Eigenkapital" value={fmt(properties.reduce((s: number, p: any) => s + safeNum(p.equity), 0))} accent="#5B8C5A" />
                  <KPICard label="Vermögensaufbau" value={`${fmt(properties.reduce((s: number, p: any) => s + safeNum(p.wealth_growth_monthly || 0), 0))} /Mo`} accent="#7B68EE" />
                  <KPICard label="Netto-Cashflow" value={`${fmt(properties.reduce((s: number, p: any) => s + safeNum(p.cashflow_after_debt || 0), 0))} /Mo`} accent="#4A90A4" />
                </div>
              )}
              {(properties || []).length === 0 ? (
                <EmptyState icon="🏠" message="Noch keine Immobilien erfasst." />
              ) : (
                (properties || []).map((p: any, i: number) => (
                  <div key={i} className="rounded-xl p-4 sm:p-5" style={{ background: "#1a1d23", border: "1px solid #2a2e38" }}>
                    <SectionHeader icon="🏠" title={p.name} timestamp={`Bewertung: ${p.last_valuation_date || "—"}`} />
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        { l: "Marktwert", v: fmt(p.value || p.current_value || 0), c: "#E8DCC8" },
                        { l: "Restschuld", v: fmt(p.loan || p.remaining_loan || 0), c: "#D45B5B" },
                        { l: "Eigenkapital", v: fmt(p.equity || 0), c: "#5B8C5A" },
                      ].map((x, j) => (
                        <div key={j} className="text-center">
                          <div className="mb-0.5" style={{ color: GRAY_MUTED, fontSize: 12 }}>{x.l}</div>
                          <div className="text-sm font-bold" style={{ color: x.c, fontFamily: "'JetBrains Mono', monospace" }}>{x.v}</div>
                        </div>
                      ))}
                    </div>
                    <Acc title="📊 Monatlicher Cashflow" isOpen={isOpen(`${i}-cashflow`)} onToggle={() => toggleSection(`${i}-cashflow`)}
                      summary={fmt(p.cashflow_after_debt || 0) + "/Mo"}>
                      <Row label="+ Kaltmiete" value={fmt(p.rent_gross || 0)} color="#5B8C5A" />
                      <Row label="− Hausgeld + NK" value={fmt(safeNum(p.hausgeld || 0) + safeNum(p.non_recoverable || 0))} color="#D45B5B" />
                      <Row label="− Zinsanteil" value={fmt(p.monthly_interest || 0)} color="#D45B5B" />
                      <Sep />
                      <Row label="= Cashflow vor Tilgung" value={fmt(p.cashflow_before_debt || 0)} color="#C9A84C" bold />
                      <Row label="− Tilgung" value={fmt(p.monthly_principal || 0)} color="#7B68EE" />
                      <Sep />
                      <Row label="= Netto auf Konto" value={fmt(p.cashflow_after_debt || 0)} color={safeNum(p.cashflow_after_debt) >= 0 ? "#5B8C5A" : "#D45B5B"} bold />
                    </Acc>
                    <Acc title="🏦 Finanzierung" isOpen={isOpen(`${i}-fin`)} onToggle={() => toggleSection(`${i}-fin`)} summary={`${p.loan_rate || 0}%`}>
                      <Row label="Monatsrate" value={fmt(p.monthly_payment || 0)} />
                      <Row label="Zinssatz" value={`${p.loan_rate || 0}%`} />
                      <Row label="Zinsbindung bis" value={p.fixed_rate_end || "—"} color="#C9A84C" />
                      <Row label="Bank" value={p.bank || "—"} />
                    </Acc>
                  </div>
                ))
              )}
            </div>
          </ErrorBoundary>
        )}

        {/* PORTFOLIO TAB */}
        {tab === "portfolio" && (
          <ErrorBoundary section="Portfolio">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <KPICard label="Portfolio Gesamt" value={fmt(totalPortfolio)} accent="#5B8C5A" />
                <KPICard label="Investiert" value={fmt(totalCost)} sub="Cost Basis" accent={GRAY_MID} />
                <KPICard label="Unrealisiert P/L" value={`${unrealizedPL >= 0 ? "+" : ""}${fmt(unrealizedPL)}`}
                  sub={`${safeDivide(unrealizedPL, totalCost) * 100 >= 0 ? "+" : ""}${(safeDivide(unrealizedPL, totalCost) * 100).toFixed(1)}%`}
                  accent={unrealizedPL >= 0 ? "#5B8C5A" : "#D45B5B"} />
                <KPICard label="Sparplan/Mo" value={fmt(holdings.reduce((s: number, h: any) => s + safeNum(h.sparplan || h.savings_plan || 0), 0))} accent="#7B68EE" />
              </div>

              {holdings.length === 0 ? (
                <EmptyState icon="📊" message="Noch keine Portfolio-Positionen erfasst." />
              ) : (
                <div className="rounded-xl p-4 sm:p-5" style={{ background: "#1a1d23", border: "1px solid #2a2e38" }}>
                  <SectionHeader icon="📋" title="Positionen" />
                  <div className="space-y-0">
                    {holdings.map((h: any, i: number) => {
                      const isPos = h.pl >= 0
                      const weight = totalPortfolio ? ((h.value / totalPortfolio) * 100).toFixed(1) : "0"
                      return (
                        <div key={i} style={{ borderBottom: "1px solid #2a2e3833" }}>
                          <button onClick={() => toggleSection(`pf-pos-${i}`)} className="w-full flex items-center gap-2 py-2.5 text-left">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: h.color }} />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate" style={{ color: "#E8DCC8", fontSize: 12 }}>{h.name}</div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span style={{ fontFamily: "'JetBrains Mono', monospace", color: GRAY_MUTED, fontSize: 12 }}>{h.ticker}</span>
                                <span className="px-1 py-0 rounded" style={{ background: h.type === "Krypto" ? "#7B68EE18" : "#5B8C5A18", color: h.type === "Krypto" ? "#7B68EE" : "#5B8C5A", fontSize: 10 }}>{h.type}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#E8DCC8", fontSize: 12 }}>{fmt(h.value)}</div>
                              <div style={{ fontFamily: "'JetBrains Mono', monospace", color: isPos ? "#5B8C5A" : "#D45B5B", fontSize: 12 }}>{isPos ? "+" : ""}{h.plPct.toFixed(1)}%</div>
                            </div>
                            <span className="shrink-0 ml-1" style={{ color: GRAY_FAINT, fontSize: 12 }}>{isOpen(`pf-pos-${i}`) ? "\u25B2" : "\u25BC"}</span>
                          </button>
                          {isOpen(`pf-pos-${i}`) && (
                            <div className="pb-3 px-1 space-y-0.5">
                              <Row label="Stück / Anteile" value={h.type === "Krypto" ? safeNum(h.shares).toFixed(4) : String(h.shares)} />
                              <Row label="Ø Kaufpreis" value={fmt(h.avg_price || h.avgPrice || 0)} />
                              <Row label="Aktueller Kurs" value={fmt(h.current_price || h.currentPrice || 0)} />
                              <Sep />
                              <Row label="Investiert" value={fmt(h.cost)} />
                              <Row label="Aktueller Wert" value={fmt(h.value)} />
                              <Row label="Unrealisiert P/L" value={`${isPos ? "+" : ""}${fmt(h.pl)}`} color={isPos ? "#5B8C5A" : "#D45B5B"} bold />
                              <Row label="Anteil am Portfolio" value={`${weight}%`} />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </ErrorBoundary>
        )}

        {/* WEEKLY SCAN TAB */}
        {tab === "scan" && (
          <ErrorBoundary section="Weekly Scan">
            <div className="space-y-6">
              <SectionHeader icon="🔍" title="Weekly Scan — Agent-Ergebnisse" />
              {(scanResults || []).length === 0 ? (
                <EmptyState icon="🔍" message="Noch kein Weekly Scan durchgeführt." />
              ) : (
                <div className="rounded-xl p-5" style={{ background: "#1a1d23", border: "1px solid #2a2e38" }}>
                  <div className="space-y-3">
                    {(scanResults || []).map((s: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 py-2" style={{ borderBottom: i < scanResults.length - 1 ? "1px solid #2a2e3844" : "none" }}>
                        <UrgencyDot u={s.status === "change" ? "yellow" : s.status === "alert" ? "red" : "green"} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium" style={{ color: "#E8DCC8", fontSize: 12 }}>{s.agent || s.agent_name}</span>
                            {s.status === "change" && <span className="px-1.5 py-0.5 rounded" style={{ background: "#C9A84C22", color: "#C9A84C", fontSize: 10 }}>Änderung</span>}
                          </div>
                          <p className="mt-0.5" style={{ color: GRAY_MID, fontSize: 12 }}>{s.note || s.summary}</p>
                          {s.source && <p className="mt-0.5" style={{ color: GRAY_MUTED, fontSize: 11 }}>Quelle: {s.source}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ErrorBoundary>
        )}
      </main>
    </div>
  )
}

// Sub-components used in the page

function ExitReadinessCompact({ score, metCount, total }: { score: number; metCount: number; total: number }) {
  return (
    <div className="rounded-xl p-5 flex flex-col justify-between" style={{ background: "linear-gradient(135deg, #1a1d23 0%, #22262e 100%)", border: "1px solid #2a2e38" }}>
      <span className="text-xs tracking-widest uppercase" style={{ color: GRAY_MUTED, fontSize: 11 }}>Exit-Readiness</span>
      <div className="flex items-center gap-2 mt-2">
        <svg width="36" height="36" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="14" fill="none" stroke="#2a2e38" strokeWidth="3" />
          <circle cx="18" cy="18" r="14" fill="none"
            stroke={score >= 80 ? "#5B8C5A" : score >= 40 ? "#C9A84C" : "#D45B5B"}
            strokeWidth="3" strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 88} 88`} transform="rotate(-90 18 18)" />
        </svg>
        <span className="text-2xl font-bold" style={{ color: score >= 80 ? "#5B8C5A" : score >= 40 ? "#C9A84C" : "#D45B5B", fontFamily: "'DM Sans', sans-serif" }}>{score}%</span>
      </div>
      <span className="mt-1" style={{ color: GRAY_MUTED, fontSize: 12 }}>{metCount}/{total} Voraussetzungen</span>
    </div>
  )
}

function ExitReadinessGauge({ prerequisites, score, metCount }: { prerequisites: any[]; score: number; metCount: number }) {
  if (!prerequisites || prerequisites.length === 0) return null
  return (
    <div className="rounded-xl p-5" style={{ background: "linear-gradient(135deg, #1a1d23 0%, #22262e 100%)", border: "1px solid #2a2e38" }}>
      <SectionHeader icon="🎯" title="Exit-Readiness Score" />
      <div className="flex items-center gap-6 mb-5">
        <div className="relative flex-shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#2a2e38" strokeWidth="6" />
            <circle cx="50" cy="50" r="42" fill="none"
              stroke={score >= 80 ? "#5B8C5A" : score >= 40 ? "#C9A84C" : "#D45B5B"}
              strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 264} 264`} transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dasharray 1s ease" }} />
            <text x="50" y="46" textAnchor="middle" style={{ fill: "#E8DCC8", fontSize: 22, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{score}</text>
            <text x="50" y="62" textAnchor="middle" style={{ fill: GRAY_MUTED, fontSize: 9 }}>von 100</text>
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm mb-1" style={{ color: "#E8DCC8" }}>
            {score < 30 ? "Noch am Anfang — Fundament wird gelegt" :
             score < 60 ? "Fortschritt sichtbar — Kernentscheidungen stehen an" :
             score < 80 ? "Gut aufgestellt — Feinschliff und Umsetzung" :
             "Fast bereit — letzte Schritte vor dem Exit"}
          </p>
          <p style={{ color: GRAY_MUTED, fontSize: 12 }}>{metCount} von {prerequisites.length} Voraussetzungen erfüllt</p>
        </div>
      </div>
      <div className="space-y-2">
        {prerequisites.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: p.met ? "#5B8C5A22" : "#1a1d2366", border: `1px solid ${p.met ? "#5B8C5A" : "#2a2e38"}` }}>
              {p.met ? <span style={{ color: "#5B8C5A", fontSize: 11 }}>✓</span> : <span style={{ color: GRAY_FAINT, fontSize: 11 }}>○</span>}
            </div>
            <span className="flex-1" style={{ color: p.met ? GRAY_MUTED : "#E8DCC8", fontSize: 12 }}>{p.label}</span>
            <span className="w-8 text-right" style={{ fontFamily: "'JetBrains Mono', monospace", color: GRAY_MUTED, fontSize: 12 }}>{p.weight}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MilestoneCard({ m, expanded, onToggle, showTasks }: { m: any; expanded: boolean; onToggle: () => void; showTasks?: boolean }) {
  const steps = m.steps || []
  const tasks = m.tasks || []
  const openTasks = tasks.filter((t: any) => t.status !== "done").length

  return (
    <div className="rounded-xl p-5 transition-all w-full text-left"
      style={{ background: expanded ? `linear-gradient(135deg, #1a1d23 0%, ${m.color || "#C9A84C"}08 100%)` : "#1a1d23",
        border: expanded ? `1px solid ${m.color || "#C9A84C"}33` : "1px solid #2a2e38" }}>
      <div className="cursor-pointer" onClick={onToggle} role="button" tabIndex={0} onKeyDown={(e: any) => e.key === "Enter" && onToggle()}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{m.icon || "📌"}</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold" style={{ color: "#E8DCC8" }}>{m.title}</span>
                <StatusBadge status={m.status || "upcoming"} />
                {openTasks > 0 && (
                  <span style={{ background: "#C9A84C22", color: "#C9A84C", border: "1px solid #C9A84C33", fontSize: 10, padding: "1px 6px", borderRadius: 9999 }}>
                    {openTasks} offen
                  </span>
                )}
              </div>
              <p className="mt-1" style={{ color: GRAY_MID, fontSize: 12 }}>{m.current_step || ""}</p>
            </div>
          </div>
          <span className="text-lg font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: m.color || "#C9A84C" }}>{m.progress || 0}%</span>
        </div>
        {steps.length > 0 && (
          <>
            <div className="mt-3"><ProgressBar pct={m.progress || 0} color={m.color || "#C9A84C"} height={4} /></div>
            <StepPipeline steps={steps} color={m.color || "#C9A84C"} />
          </>
        )}
      </div>

      {expanded && (
        <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${m.color || "#C9A84C"}22` }}>
          {steps.length > 0 && (
            <div className="space-y-2 mb-4">
              {steps.map((s: any, i: number) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: s.done ? `${m.color || "#C9A84C"}22` : "#1a1d2366", border: `1px solid ${s.done ? (m.color || "#C9A84C") : "#2a2e38"}` }}>
                    {s.done && <span style={{ color: m.color || "#C9A84C", fontSize: 11 }}>✓</span>}
                  </div>
                  <span style={{ color: s.done ? GRAY_MUTED : "#E8DCC8", textDecoration: s.done ? "line-through" : "none", fontSize: 12 }}>{s.label}</span>
                  {s.sub && <span className="ml-auto" style={{ fontFamily: "'JetBrains Mono', monospace", color: m.color || "#C9A84C", fontSize: 12 }}>{s.sub}</span>}
                </div>
              ))}
            </div>
          )}
          {m.next_action && (
            <div className="rounded-lg p-3" style={{ background: `${m.color || "#C9A84C"}08`, border: `1px solid ${m.color || "#C9A84C"}22` }}>
              <span className="font-semibold" style={{ color: m.color || "#C9A84C", fontSize: 12 }}>→ Nächster Schritt: </span>
              <span style={{ color: "#E8DCC8", fontSize: 12 }}>{m.next_action}</span>
            </div>
          )}
          {showTasks && tasks.length > 0 && (
            <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${m.color || "#C9A84C"}15` }}>
              <span className="font-semibold" style={{ color: GRAY_MID, fontSize: 12 }}>📋 Aktive To-Dos</span>
              <div className="space-y-1 mt-2">
                {tasks.map((t: any, j: number) => (
                  <div key={j} className="flex items-start gap-2 py-1.5" style={{ borderBottom: j < tasks.length - 1 ? "1px solid #2a2e3822" : "none" }}>
                    <span className="mt-0.5 shrink-0" style={{ fontSize: 12 }}>
                      {t.status === "done" ? "✅" : t.status === "in_progress" ? "🔄" : "⬜"}
                    </span>
                    <span className="flex-1" style={{ color: t.status === "done" ? "#5B8C5A" : t.status === "in_progress" ? "#C9A84C" : GRAY_MUTED, fontSize: 12 }}>{t.task}</span>
                    <span className="shrink-0 px-1.5 py-0.5 rounded" style={{
                      background: t.owner === "Agent" ? "#7B68EE18" : "#C9A84C18",
                      color: t.owner === "Agent" ? "#7B68EE" : "#C9A84C", fontSize: 10
                    }}>{t.owner}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
