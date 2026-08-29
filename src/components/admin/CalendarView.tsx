import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, User, Mail, Phone, Tag, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarViewProps {
  bookings: any[];
}

export default function CalendarView({ bookings }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredBooking, setHoveredBooking] = useState<any | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getDayBookings = (date: Date) => {
    return bookings.filter(b => b.date && isSameDay(parseISO(b.date), date));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-serif text-white mb-2">Booking Calendar</h2>
          <p className="text-gray-400 text-sm">Schedule and appointment overview.</p>
        </div>
        <div className="flex items-center gap-4 bg-charcoal-800 border border-white/10 p-2 rounded-lg">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-white/5 rounded-md transition-colors text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-white font-medium min-w-[140px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-white/5 rounded-md transition-colors text-gray-400 hover:text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-charcoal-800 border border-white/10 rounded-xl overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-white/5">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest bg-charcoal-900/50">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const dayBookings = getDayBookings(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, monthStart);

            return (
              <div 
                key={idx} 
                className={`min-h-[140px] border-r border-b border-white/5 p-2 transition-colors ${
                  !isCurrentMonth ? 'bg-black/20 opacity-30' : 'bg-transparent'
                } hover:bg-white/[0.02] relative group`}
              >
                <div className="flex justify-between items-center mb-2">
                   <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                     isToday ? 'bg-gold-500 text-charcoal-900' : 'text-gray-400'
                   }`}>
                     {format(day, 'd')}
                   </span>
                   {dayBookings.length > 0 && (
                     <span className="text-[10px] bg-white/10 text-gray-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">
                       {dayBookings.length} Bookings
                     </span>
                   )}
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[90px] scrollbar-hide">
                  {dayBookings.map((b, i) => (
                    <div 
                      key={i} 
                      onMouseEnter={(e) => {
                        setHoveredBooking(b);
                        setMousePos({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseLeave={() => setHoveredBooking(null)}
                      onMouseMove={(e) => {
                        setMousePos({ x: e.clientX, y: e.clientY });
                      }}
                      className={`px-2 py-1.5 rounded-md text-[10px] leading-tight border transition-all ${
                        b.status === 'confirmed' 
                          ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                          : b.status === 'cancelled'
                          ? 'bg-red-500/10 border-red-500/20 text-red-400'
                          : 'bg-gold-500/10 border-gold-500/20 text-gold-500'
                      } cursor-pointer hover:brightness-125 z-10`}
                    >
                      <div className="flex items-center gap-1 font-bold mb-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {b.time}
                      </div>
                      <div className="truncate font-medium">{b.fullName}</div>
                    </div>
                  ))}
                </div>

                {!isCurrentMonth && <div className="absolute inset-0 bg-charcoal-900/40 pointer-events-none" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover Info Card */}
      <AnimatePresence>
        {hoveredBooking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            style={{ 
              position: 'fixed',
              top: mousePos.y + 20,
              left: mousePos.x + 20,
              zIndex: 100
            }}
            className="w-72 bg-charcoal-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden pointer-events-none p-4"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  hoveredBooking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                  hoveredBooking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                  'bg-gold-500/20 text-gold-500'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold leading-tight">{hoveredBooking.fullName}</h4>
                  <span className={`text-[10px] uppercase font-black tracking-widest ${
                    hoveredBooking.status === 'confirmed' ? 'text-green-500' :
                    hoveredBooking.status === 'cancelled' ? 'text-red-500' :
                    'text-gold-500'
                  }`}>
                    {hoveredBooking.status}
                  </span>
                </div>
              </div>
              <Info className="w-4 h-4 text-gray-600" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Clock className="w-4 h-4 text-gold-500/50" />
                <span className="text-xs font-medium">
                  {hoveredBooking.date ? format(parseISO(hoveredBooking.date), 'MMM d, yyyy') : 'N/A'} • {hoveredBooking.time}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4 text-gold-500/50" />
                <span className="text-xs font-medium truncate">{hoveredBooking.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4 text-gold-500/50" />
                <span className="text-xs font-medium">{hoveredBooking.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 pt-2 border-t border-white/5">
                <Tag className="w-4 h-4 text-gold-500/50" />
                <span className="text-xs font-black uppercase tracking-widest text-gold-500">{hoveredBooking.sessionType} Package</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex gap-6 justify-center mt-6">
         <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-3 h-3 rounded-full bg-gold-500/20 border border-gold-500/50" />
            Pending
         </div>
         <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            Confirmed
         </div>
         <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            Cancelled
         </div>
      </div>
    </div>
  );
}
