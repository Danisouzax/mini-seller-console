import { useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEY = 'msc_prefs_v1'
const OPPS_KEY = 'msc_opps_v1'

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}
function savePrefs(p) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
  } catch {}
}

function loadOpps() {
  try {
    const raw = localStorage.getItem(OPPS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
function saveOpps(list) {
  try {
    localStorage.setItem(OPPS_KEY, JSON.stringify(list))
  } catch {}
}

export function useLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  const prefs = useRef(loadPrefs())
  const [search, setSearch] = useState(prefs.current.search || '')
  const [statusFilter, setStatusFilter] = useState(prefs.current.statusFilter || 'all')
  const [sortDir, setSortDir] = useState(prefs.current.sortDir ?? 'desc')

  const [opps, setOpps] = useState(loadOpps())

  // Persist preferences
  useEffect(() => {
    savePrefs({ search, statusFilter, sortDir })
  }, [search, statusFilter, sortDir])

  // Load leads with artificial latency
  useEffect(() => {
    let canceled = false
    setLoading(true)
    setError(null)

    const timer = setTimeout(() => {
      fetch('/leads.json')
        .then(r => {
          if (!r.ok) throw new Error('Falha ao carregar leads')
          return r.json()
        })
        .then(data => {
          if (!canceled) setLeads(data)
        })
        .catch(err => {
          if (!canceled) setError(err.message || 'Erro desconhecido')
        })
        .finally(() => {
          if (!canceled) setLoading(false)
        })
    }, 700)

    return () => {
      canceled = true
      clearTimeout(timer)
    }
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    let out = leads
    if (term) {
      out = out.filter(l =>
        l.name.toLowerCase().includes(term) ||
        l.company.toLowerCase().includes(term)
      )
    }
    if (statusFilter !== 'all') {
      out = out.filter(l => l.status === statusFilter)
    }
    out = [...out].sort((a, b) => {
      const diff = (b.score ?? 0) - (a.score ?? 0)
      return sortDir === 'desc' ? diff : -diff
    })
    return out
  }, [leads, search, statusFilter, sortDir])

  // Update lead with optimistic UI and rollback
  async function updateLead(id, changes) {
    const idx = leads.findIndex(l => l.id === id)
    if (idx === -1) throw new Error('Lead não encontrado')
    const prev = leads[idx]
    const next = { ...prev, ...changes }

    // optimistic
    const snapshot = leads
    const draft = [...leads]
    draft[idx] = next
    setLeads(draft)

    // network latency & failure chance
    await new Promise(res => setTimeout(res, 600))
    const failed = Math.random() < 0.18 // ~18% failure to demonstrate rollback
    if (failed) {
      setLeads(snapshot) // rollback
      throw new Error('Falha ao salvar (simulada). Tente novamente.')
    }
    return next
  }

  function selectLead(lead) {
    setSelected(lead)
  }
  function closePanel() {
    setSelected(null)
  }

  async function convertToOpportunity(lead, { stage = 'Prospecting', amount } = {}) {
    // simulate latency
    await new Promise(res => setTimeout(res, 500))
    const opp = {
      id: `opp_${Date.now()}_${lead.id}`,
      name: lead.name,
      stage,
      amount: amount ?? null,
      accountName: lead.company,
    }
    const next = [opp, ...opps]
    setOpps(next)
    saveOpps(next)
    return opp
  }

  useEffect(() => {
    saveOpps(opps)
  }, [opps])

  return {
    leads,
    loading,
    error,
    filtered,
    selected,
    selectLead,
    closePanel,
    updateLead,
    convertToOpportunity,
    search, setSearch,
    statusFilter, setStatusFilter,
    sortDir, setSortDir,
    opps,
  }
}
