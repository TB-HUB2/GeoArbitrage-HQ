"use client"
import { useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = getSupabase()
    if (!supabase) {
      setError("Supabase nicht konfiguriert")
      setLoading(false)
      return
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError("Falsche Email oder Passwort")
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  const handleResetPassword = async () => {
    if (!email) {
      setError("Bitte Email eingeben")
      return
    }
    setError(null)
    setMessage(null)
    setLoading(true)

    const supabase = getSupabase()
    if (!supabase) {
      setError("Supabase nicht konfiguriert")
      setLoading(false)
      return
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })

    if (resetError) {
      setError(resetError.message)
    } else {
      setMessage("Passwort-Reset-Email gesendet. Pruefe dein Postfach.")
    }
    setLoading(false)
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
        <h1 style={{
          fontSize: 20,
          fontWeight: 600,
          color: "#E8E8E8",
          marginBottom: 4,
          textAlign: "center",
        }}>
          GeoArbitrage HQ
        </h1>
        <p style={{
          fontSize: 13,
          color: "#888",
          marginBottom: 28,
          textAlign: "center",
        }}>
          Virtual Family Office
        </p>

        <form onSubmit={handleLogin}>
          <label style={{ display: "block", marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: "#AAA", display: "block", marginBottom: 6 }}>
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
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

          <label style={{ display: "block", marginBottom: 24 }}>
            <span style={{ fontSize: 12, color: "#AAA", display: "block", marginBottom: 6 }}>
              Passwort
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

          {message && (
            <div style={{
              padding: "10px 12px",
              background: "#152D1C",
              border: "1px solid #205C35",
              borderRadius: 8,
              color: "#4ADE80",
              fontSize: 13,
              marginBottom: 16,
            }}>
              {message}
            </div>
          )}

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
            {loading ? "Anmeldung..." : "Anmelden"}
          </button>

          <button
            type="button"
            onClick={handleResetPassword}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 12,
              padding: "8px 16px",
              background: "transparent",
              color: "#888",
              border: "none",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Passwort vergessen?
          </button>
        </form>
      </div>
    </div>
  )
}
