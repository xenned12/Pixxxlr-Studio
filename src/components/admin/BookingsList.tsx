import React from 'react';
import { format, parseISO } from 'date-fns';
import { CheckCircle, XCircle, Search, Filter, Download } from 'lucide-react';

interface BookingsListProps {
  bookings: any[];
  updateStatus: (id: string, status: string) => void;
}

export default function BookingsList({ bookings, updateStatus }: BookingsListProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = (b.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (b.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif text-white mb-2">Manage Bookings</h2>
        <p className="text-gray-400 text-sm">Review, confirm, or cancel studio appointments.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-charcoal-800 border border-white/10 p-4 rounded-xl">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-charcoal-900 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-charcoal-900 border border-white/10 rounded-lg px-3">
             <Filter className="w-4 h-4 text-gray-500" />
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               className="bg-transparent border-none text-sm text-gray-400 py-2 focus:ring-0 cursor-pointer"
             >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
             </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm hover:bg-white/10 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="bg-charcoal-800 border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-charcoal-900/80 border-b border-white/10">
              <tr>
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Client Details</th>
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Appointment</th>
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Package</th>
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-white/[0.01] transition-all group">
                  <td className="p-5">
                    <p className="text-white font-bold group-hover:text-gold-500 transition-colors">{booking.fullName || 'N/A'}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{booking.email}</p>
                    <p className="text-gray-600 text-[10px] uppercase mt-1 tracking-tighter">{booking.phone}</p>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-white/20" />
                      <p className="text-white text-sm font-medium">
                        {booking.date ? format(parseISO(booking.date), 'EEE, MMM d, yyyy') : 'N/A'}
                      </p>
                    </div>
                    <p className="text-gold-500 text-xs font-bold tracking-widest pl-4">{booking.time}</p>
                  </td>
                  <td className="p-5">
                    <span className="px-2 py-1 bg-white/5 border border-white/5 rounded text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                       {booking.sessionType}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-full border ${
                      booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {booking.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => updateStatus(booking.id, 'confirmed')}
                            className="p-2 text-gray-500 hover:text-green-400 hover:bg-green-400/10 rounded-full transition-all"
                            title="Confirm Booking"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => updateStatus(booking.id, 'cancelled')}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => updateStatus(booking.id, 'pending')}
                          className="text-[10px] text-gray-600 hover:text-white uppercase font-bold tracking-widest px-3 py-1 bg-white/5 border border-white/5 rounded hover:bg-white/10 transition-all"
                        >
                          Mark as Pending
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center">
                       <Filter className="w-10 h-10 text-gray-800 mb-4" />
                       <p className="text-gray-500 text-lg font-serif italic">No matching records found.</p>
                       <button 
                         onClick={() => {setSearchTerm(''); setStatusFilter('all');}}
                         className="mt-4 text-gold-500 text-xs font-bold uppercase tracking-widest border-b border-gold-500/30 hover:border-gold-500"
                       >
                         Clear All Filters
                       </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
