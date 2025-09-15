import React from 'react'
import LeadList from './components/LeadList.jsx'
import LeadDetailPanel from './components/LeadDetailPanel.jsx'
import OpportunitiesTable from './components/OpportunitiesTable.jsx'
import { useLeads } from './hooks/useLeads.js'

export default function App() {
  const {
    leads, filtered, loading, error,
    selected, selectLead, closePanel, updateLead,
    convertToOpportunity,
    search, setSearch,
    statusFilter, setStatusFilter,
    sortDir, setSortDir,
    opps,
  } = useLeads()

  return (
    <div className="min-h-full">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold tracking-tight">Mini Seller Console</h1>
          <p className="text-slate-500 text-sm">Triage leads and convert them into opportunities.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <LeadList
            leads={filtered}
            loading={loading}
            error={error}
            search={search} setSearch={setSearch}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            sortDir={sortDir} setSortDir={setSortDir}
            onRowClick={selectLead}
          />
        </div>
        <div className="lg:col-span-2">
          <OpportunitiesTable opps={opps} />
        </div>
      </main>

      <LeadDetailPanel
        lead={selected}
        open={!!selected}
        onClose={closePanel}
        onSave={updateLead}
        onConvert={convertToOpportunity}
      />
    </div>
  )
}
