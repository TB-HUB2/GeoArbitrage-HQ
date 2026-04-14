"use client"
import { useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen lang sein")
      setLoading(false)
      return
    }

    const supabase = getSupabase()
    if (!supabase) {
      setError("Supabase nicht konfiguriert")
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push("/")
      router.refresh()
    }, 2000)
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0A0A0A",
      fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
        padding: 32,
        background: "#141414",
        border: "1px solid #2A2A2A",
        borderRadius: 12,
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: "#E8E8E8", marginBottom: 4, textAlign: "center" }}>
          Neues Passwort setzen
        </h1>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 28, textAlign: "center" }}>
          GeoArbitrage HQ
        </p>

        {success ? (
          <div style={{
            padding: "10px 12px",
            background: "#152D1C",
            border: "1px solid #205C35",
            borderRadius: 8,
            color: "#4ADE80",
            fontSize: 13,
            textAlign: "center",
          }}>
            Passwort gesetzt. Weiterleitung zum Dashboard...
          </div>
        ) : (
          <form onSubmit={handleSetPassword}>
            <label style={{ display: "block", marginBottom: 24 }}>
              <span style={{ fontSize: 12, color: "#AAA", display: "block", marginBottom: 6 }}>
                Neues Passwort
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                minLength={8}
                placeholder="Mindestens 8 Zeichen"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#1A1A1A",
                  border: "1px solid #333",
                  borderRadius: 8,
                  color: "#E8E8E8",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </label>

            {error && (
              <div style={{
                padding: "10px 12px",
                background: "#2D1515",
                border: "1px solid #5C2020",
                borderRadius: 8,
                color: "#F87171",
                fontSize: 13,
                marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px 16px",
                background: loading ? "#333" : "#C9A84C",
                color: loading ? "#888" : "#0A0A0A",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Speichern..." : "Passwort setzen"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
