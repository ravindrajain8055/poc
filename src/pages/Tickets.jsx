import React, { useState } from 'react';
import { Ticket, Search, Filter, Plus, Clock, CheckCircle2, AlertCircle, MoreHorizontal } from 'lucide-react';

const DUMMY_TICKETS = [
  {
    id: 'TKT-1042',
    title: 'Access Request: Sales Q3 Data',
    type: 'Access',
    status: 'Open',
    priority: 'High',
    assignee: 'Data Gov Team',
    date: '2026-04-28',
  },
  {
    id: 'TKT-1041',
    title: 'Ingestion Pipeline Failure: Marketing Assets',
    type: 'Bug',
    status: 'In Progress',
    priority: 'Critical',
    assignee: 'Data Eng Team',
    date: '2026-04-27',
  },
  {
    id: 'TKT-1038',
    title: 'Marketplace Publish Review',
    type: 'Review',
    status: 'Resolved',
    priority: 'Medium',
    assignee: 'Compliance',
    date: '2026-04-25',
  },
  {
    id: 'TKT-1035',
    title: 'Update Data Classification for Patient Demographics',
    type: 'Request',
    status: 'Closed',
    priority: 'Low',
    assignee: 'Security',
    date: '2026-04-20',
  }
];

const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTickets = DUMMY_TICKETS.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Critical': return <AlertCircle size={14} className="text-red-500" />;
      case 'High': return <AlertCircle size={14} className="text-orange-500" />;
      case 'Medium': return <Clock size={14} className="text-yellow-500" />;
      case 'Low': return <CheckCircle2 size={14} className="text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-full bg-gray-50 flex flex-col py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
              <Ticket className="text-[#d52b1e]" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
              <p className="text-gray-500 text-sm">Manage your support and request tickets</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-[#d52b1e] hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
            <Plus size={16} />
            Create Ticket
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID or title..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d52b1e] focus:border-transparent outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter size={18} className="text-gray-400" />
            <select
              className="w-full sm:w-auto border border-gray-300 rounded-md py-2 pl-3 pr-8 focus:ring-2 focus:ring-[#d52b1e] focus:border-transparent outline-none text-sm text-gray-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="p-4 pl-6">Ticket</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4 hidden md:table-cell">Assignee</th>
                  <th className="p-4 hidden sm:table-cell">Date</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="font-medium text-gray-900 group-hover:text-[#d52b1e] transition-colors cursor-pointer">
                        {ticket.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{ticket.id}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-700">{ticket.type}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        {getPriorityIcon(ticket.priority)}
                        {ticket.priority}
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-gray-600">
                      {ticket.assignee}
                    </td>
                    <td className="p-4 hidden sm:table-cell text-sm text-gray-500">
                      {ticket.date}
                    </td>
                    <td className="p-4 text-center">
                      <button className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTickets.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No tickets found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tickets;
