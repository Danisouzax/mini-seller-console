import React from 'react'

const statuses = ['New','Contacted','Qualified','Unqualified']

export default function LeadList({
  leads,
  loading,
  error,
  search, setSearch,
  statusFilter, setStatusFilter,
  sortDir, setSortDir,
  onRowClick,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Leads</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name/company"
            className="w-full sm:w-72 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={() => setSortDir(sortDir === 'desc' ? 'asc' : 'desc')}
            className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
            title="Toggle sort by score"
          >
            Sort: score {sortDir === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-t border-b border-slate-200">
            <tr className="text-left">
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Company</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Source</th>
              <th className="py-2 px-3">Score</th>
              <th className="py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="p-6 text-center text-slate-500">Loading leads…</td></tr>
            )}
            {error && !loading && (
              <tr><td colSpan={6} className="p-6 text-center text-rose-600">{error}</td></tr>
            )}
            {!loading && !error && leads.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-slate-500">No leads found.</td></tr>
            )}
            {!loading && !error && leads.map(lead => (
              <tr
                key={lead.id}
                onClick={() => onRowClick(lead)}
                className="border-b border-slate-100 hover:bg-indigo-50/50 cursor-pointer"
              >
                <td className="py-2 px-3 font-medium">{lead.name}</td>
                <td className="py-2 px-3">{lead.company}</td>
                <td className="py-2 px-3">{lead.email}</td>
                <td className="py-2 px-3">{lead.source}</td>
                <td className="py-2 px-3">{lead.score}</td>
                <td className="py-2 px-3">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs border border-slate-300">
                    {lead.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
