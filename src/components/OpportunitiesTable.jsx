import React from 'react'

export default function OpportunitiesTable({ opps }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Opportunities</h2>
        <span className="text-sm text-slate-500">{opps.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-t border-b border-slate-200">
            <tr className="text-left">
              <th className="py-2 px-3">ID</th>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Stage</th>
              <th className="py-2 px-3">Amount</th>
              <th className="py-2 px-3">Account</th>
            </tr>
          </thead>
          <tbody>
            {opps.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-500">No opportunities yet.</td></tr>
            ) : opps.map(opp => (
              <tr key={opp.id} className="border-b border-slate-100">
                <td className="py-2 px-3">{opp.id}</td>
                <td className="py-2 px-3 font-medium">{opp.name}</td>
                <td className="py-2 px-3">{opp.stage}</td>
                <td className="py-2 px-3">{opp.amount ?? '—'}</td>
                <td className="py-2 px-3">{opp.accountName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
