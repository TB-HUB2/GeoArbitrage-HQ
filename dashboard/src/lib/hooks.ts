"use client"
import { useState, useEffect, useMemo } from "react"
import { getSupabase } from "./supabase"
import { safeNum, safeDivide, TYPE_COLORS } from "./helpers"

// Generic hook for Supabase queries with realtime
function useSupabaseQuery<T>(table: string, options?: {
  select?: string
  order?: { column: string; ascending?: boolean }
  filter?: { column: string; op: string; value: any }[]
  limit?: number
}) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = getSupabase()
      if (!supabase) { setLoading(false); return }
      let query = supabase.from(table).select(options?.select || "*")
      if (options?.filter) {
        for (const f of options.filter) {
          query = (query as any).filter(f.column, f.op, f.value)
        }
      }
      if (options?.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending ?? true })
      }
      if (options?.limit) {
        query = query.limit(options.limit)
      }
      const { data: result, error } = await query
      if (!error && result) setData(result as T[])
      setLoading(false)
    }
    fetchData()

    // Realtime subscription
    const supabase = getSupabase()
    if (!supabase) return
    const channel = supabase
      .channel(`realtime-${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        fetchData()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [table])

  return { data, loading }
}

// Budget data
export function useBudget() {
  const { data, loading } = useSupabaseQuery<any>("budget", {
    order: { column: "created_at", ascending: false },
    limit: 50,
  })

  const computed = useMemo(() => {
    if (!data.length) return {
      budgetData: [], totalIncome: 0, totalExpense: 0,
      totalInvest: 0, savingsRate: 0, spendRate: 0, overBudgetItems: [],
    }
    const income = data.filter((b: any) => b.type === "income").reduce((s: number, b: any) => s + safeNum(b.actual), 0)
    const expense = Math.abs(data.filter((b: any) => b.type === "expense").reduce((s: number, b: any) => s + safeNum(b.actual), 0))
    const invest = Math.abs(data.filter((b: any) => b.type === "investment" || b.type === "reserve").reduce((s: number, b: any) => s + safeNum(b.actual), 0))
    const overBudgetItems = data.filter((b: any) => b.type === "expense" && Math.abs(b.actual) > Math.abs(b.planned))
    return {
      budgetData: data, totalIncome: income, totalExpense: expense,
      totalInvest: invest, savingsRate: safeDivide(invest, income) * 100,
      spendRate: safeDivide(expense, income) * 100, overBudgetItems,
    }
  }, [data])

  return { ...computed, loading }
}

// Milestones
export function useMilestones() {
  const { data, loading } = useSupabaseQuery<any>("milestones", {
    order: { column: "priority", ascending: true },
  })
  return { milestones: data, loading }
}

// Properties — compute derived financial fields from raw Supabase data
export function useProperties() {
  const { data, loading } = useSupabaseQuery<any>("properties", {
    order: { column: "created_at", ascending: true },
  })

  const properties = useMemo(() => data.map((p: any) => {
    const currentValue = safeNum(p.current_value)
    const loanCurrent = safeNum(p.loan_amount_current)
    const loanRate = safeNum(p.loan_rate)
    const loanMonthlyPayment = safeNum(p.loan_monthly_payment)
    const rentGross = safeNum(p.monthly_rent_gross)
    const hausgeld = safeNum(p.monthly_hausgeld)
    const nichtUmlagefaehig = safeNum(p.monthly_nicht_umlagefaehig)
    const verwaltung = safeNum(p.monthly_verwaltung)

    // Derived fields
    const equity = currentValue - loanCurrent
    const monthlyInterest = loanCurrent * (loanRate / 100) / 12
    const monthlyPrincipal = loanMonthlyPayment - monthlyInterest
    const cashflowBeforeDebt = rentGross - hausgeld - nichtUmlagefaehig - monthlyInterest
    const cashflowAfterDebt = cashflowBeforeDebt - monthlyPrincipal
    // Vermögenszuwachs = Tilgung (Equity-Aufbau) + Netto-Cashflow
    const wealthGrowthMonthly = monthlyPrincipal + cashflowAfterDebt

    return {
      ...p,
      // Mapped field names for dashboard compatibility
      value: currentValue,
      equity,
      loan: loanCurrent,
      remaining_loan: loanCurrent,
      rent_gross: rentGross,
      hausgeld,
      non_recoverable: nichtUmlagefaehig,
      monthly_interest: Math.round(monthlyInterest * 100) / 100,
      monthly_principal: Math.round(monthlyPrincipal * 100) / 100,
      monthly_payment: loanMonthlyPayment,
      cashflow_before_debt: Math.round(cashflowBeforeDebt * 100) / 100,
      cashflow_after_debt: Math.round(cashflowAfterDebt * 100) / 100,
      wealth_growth_monthly: Math.round(wealthGrowthMonthly * 100) / 100,
      bank: p.loan_bank,
      fixed_rate_end: p.loan_zinsbindung_end,
      last_valuation_date: p.current_value_date,
    }
  }), [data])

  return { properties, loading }
}

// Portfolio
export function usePortfolio() {
  const { data, loading } = useSupabaseQuery<any>("portfolio_holdings", {
    order: { column: "name", ascending: true },
  })

  const computed = useMemo(() => {
    const holdings = data.map((h: any) => ({
      ...h,
      value: safeNum(h.shares) * safeNum(h.current_price),
      cost: safeNum(h.shares) * safeNum(h.avg_price),
      pl: safeNum(h.shares) * safeNum(h.current_price) - safeNum(h.shares) * safeNum(h.avg_price),
      plPct: safeDivide(safeNum(h.current_price) - safeNum(h.avg_price), safeNum(h.avg_price)) * 100,
      color: TYPE_COLORS[h.type] || "#8B7355",
      sparplan: safeNum(h.sparplan_monthly),
    }))
    const totalPortfolio = holdings.reduce((s: number, h: any) => s + h.value, 0)
    const totalCost = holdings.reduce((s: number, h: any) => s + h.cost, 0)
    return { holdings, totalPortfolio, totalCost, unrealizedPL: totalPortfolio - totalCost }
  }, [data])

  return { ...computed, loading }
}

// Calendar events / deadlines
export function useCalendar() {
  const { data, loading } = useSupabaseQuery<any>("calendar_events", {
    filter: [{ column: "status", op: "neq", value: "cancelled" }],
    order: { column: "event_date", ascending: true },
    limit: 20,
  })
  return { events: data, loading }
}

// Wealth snapshots for net worth chart
export function useWealthSnapshots() {
  const { data, loading } = useSupabaseQuery<any>("wealth_snapshots", {
    order: { column: "snapshot_date", ascending: true },
    limit: 120,
  })
  return { snapshots: data, loading }
}

// Agent logs for weekly scan
export function useAgentLogs() {
  const { data, loading } = useSupabaseQuery<any>("agent_logs", {
    order: { column: "created_at", ascending: false },
    limit: 50,
  })
  return { logs: data, loading }
}

// Monthly scan results
export function useScanResults() {
  const { data, loading } = useSupabaseQuery<any>("monthly_scan_results", {
    order: { column: "created_at", ascending: false },
    limit: 20,
  })
  return { scanResults: data, loading }
}

// Exit prerequisites
export function useExitPrerequisites() {
  const { data, loading } = useSupabaseQuery<any>("exit_prerequisites", {
    order: { column: "weight", ascending: false },
  })

  const computed = useMemo(() => {
    const score = data.filter((p: any) => p.met).reduce((s: number, p: any) => s + safeNum(p.weight), 0)
    const metCount = data.filter((p: any) => p.met).length
    return { prerequisites: data, score, metCount }
  }, [data])

  return { ...computed, loading }
}

// Savings goals — map DB field names to dashboard names
export function useSavingsGoals() {
  const { data, loading } = useSupabaseQuery<any>("savings_goals", {
    order: { column: "created_at", ascending: true },
  })

  const goals = useMemo(() => data.map((g: any) => ({
    ...g,
    current: safeNum(g.current_amount),
    target: safeNum(g.target_amount),
  })), [data])

  return { goals, loading }
}

// Asset allocation computed from properties + portfolio + cash (from latest snapshot)
export function useAssetAllocation(properties: any[], holdings: any[], snapshots?: any[]) {
  return useMemo(() => {
    const groups: Record<string, { value: number; color: string }> = {}
    const immoEquity = (properties || []).reduce((s: number, p: any) => s + safeNum(p.equity), 0)
    if (immoEquity > 0) groups["Immobilien (Equity)"] = { value: immoEquity, color: "#C9A84C" }

    ;(holdings || []).forEach((h: any) => {
      const label = h.type === "ETF" || h.type === "Aktie" ? "Aktien/ETFs" : h.type
      if (!groups[label]) groups[label] = { value: 0, color: TYPE_COLORS[h.type] || "#8B7355" }
      groups[label].value += safeNum(h.shares) * safeNum(h.current_price || h.currentPrice)
    })

    // Cash + Notreserve from latest wealth snapshot
    const latest = (snapshots || []).length > 0 ? snapshots![snapshots!.length - 1] : null
    if (latest) {
      const cashEur = safeNum(latest.cash_eur)
      const notreserve = safeNum(latest.notreserve)
      const totalCash = cashEur + notreserve
      if (totalCash > 0) groups["Cash / Reserve"] = { value: totalCash, color: "#4A90A4" }
    }

    return Object.entries(groups).map(([name, { value, color }]) => ({
      name, value: Math.round(value), color,
    }))
  }, [properties, holdings, snapshots])
}
