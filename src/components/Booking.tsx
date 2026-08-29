import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isBefore, startOfDay, isSameDay } from 'date-fns';
import { collection, query, getDocs, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<{ date: string; time: string; status: string }[]>([]);

  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0 });
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    sessionType: ''
  });

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', 
    '05:00 PM', '06:00 PM'
  ];

  // Fetch Public Bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const q = query(collection(db, 'public_bookings'));
        const snapshot = await getDocs(q);
        setBookings(snapshot.docs.map(doc => doc.data() as any));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'public_bookings');
      }
    };
    fetchBookings();
  }, [submitted]);

  useEffect(() => {
    const handlePackageSelected = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const pkgMap: Record<string, string> = {
        'Basic': 'basic',
        'Standard': 'standard',
        'Barkada Deal': 'barkada',
        'Deluxe': 'deluxe',
        'Premium': 'premium' 
      };
      if (customEvent.detail && pkgMap[customEvent.detail]) {
        setFormData(prev => ({ ...prev, sessionType: pkgMap[customEvent.detail] }));
      }
    };
    window.addEventListener('package-selected', handlePackageSelected);
    return () => window.removeEventListener('package-selected', handlePackageSelected);
  }, []);

  useEffect(() => {
    setCaptchaQuestion({
      num1: Math.floor(Math.random() * 10) + 1,
      num2: Math.floor(Math.random() * 10) + 1
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    if (parseInt(captchaAnswer) !== captchaQuestion.num1 + captchaQuestion.num2) {
      setCaptchaError('Incorrect answer, please try again.');
      setCaptchaQuestion({
        num1: Math.floor(Math.random() * 10) + 1,
        num2: Math.floor(Math.random() * 10) + 1
      });
      setCaptchaAnswer('');
      return;
    }
    setCaptchaError('');

    setLoading(true);
    try {
      const batch = writeBatch(db);
      const newDocRef = doc(collection(db, 'public_bookings'));

      batch.set(doc(db, 'public_bookings', newDocRef.id), {
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      batch.set(doc(db, 'private_bookings', newDocRef.id), {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        sessionType: formData.sessionType,
        createdAt: serverTimestamp()
      });

      await batch.commit();
      setSubmitted(true);
      setCaptchaAnswer('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'bookings');
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Calendar logic
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  const startingDayIndex = getDay(startOfMonth(currentMonth));
  const today = startOfDay(new Date());

  const getTakenTimeSlots = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings
      .filter(b => b.date === dateStr && b.status !== 'cancelled')
      .map(b => b.time);
  };

  const getAvailableTimeSlots = (date: Date) => {
    const takenSlots = getTakenTimeSlots(date);
    return timeSlots.filter(t => !takenSlots.includes(t));
  };


  if (submitted) {
    return (
      <section id="booking" className="py-24 bg-charcoal-900 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-charcoal-800 p-12 border border-gold-500/30">
            <CheckCircle2 className="w-16 h-16 text-gold-500 mx-auto mb-6" />
            <h2 className="text-3xl font-serif text-white mb-4">Session Requested!</h2>
            <p className="text-gray-400 font-light text-lg">
              Thank you for choosing PIXXXLR Creatives. We have received your booking request and will contact you shortly to confirm your schedule.
            </p>
            <button onClick={() => {setSubmitted(false); setSelectedDate(null); setSelectedTime(null);}} className="mt-8 px-6 py-2 border border-gold-500 text-gold-500 uppercase tracking-wider text-xs font-bold hover:bg-gold-500 hover:text-black transition-colors">
              Book Another
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-charcoal-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-white">Reserve Your Session</h2>
          <div className="w-16 h-1 bg-gold-500 mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg">
            Select your preferred date and time. Our team will review availability and confirm your booking via email.
          </p>
        </div>

        <div id="booking" className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-charcoal-800 p-6 md:p-8 border border-white/5 max-w-5xl mx-auto rounded-xl scroll-mt-16 md:scroll-mt-24">
          {/* Calendar Widget */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <h3 className="text-base font-serif text-white flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-gold-500" />
                  Select a Date
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={prevMonth} className="p-1 text-gray-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-white font-medium min-w-[100px] text-center uppercase tracking-widest text-xs">
                    {format(currentMonth, 'MMM yyyy')}
                  </span>
                  <button onClick={nextMonth} className="p-1 text-gray-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-center text-[10px] text-gray-500 font-medium pb-1 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
                
                {/* Empty days offset */}
                {Array.from({ length: startingDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-8"></div>
                ))}
                
                {/* Days mapping */}
                {daysInMonth.map((day) => {
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isPast = isBefore(day, today);
                  const availableSlots = getAvailableTimeSlots(day);
                  const fullyBooked = !isPast && availableSlots.length === 0;
                  const isDisabled = isPast || fullyBooked;

                  return (
                    <button
                      key={day.toISOString()}
                      disabled={isDisabled}
                      onClick={() => {
                        setSelectedDate(day);
                        setSelectedTime(null);
                      }}
                      className={`h-8 w-8 mx-auto flex items-center justify-center text-xs transition-all duration-200 relative rounded-sm ${
                        isDisabled
                          ? 'text-gray-600 opacity-50 cursor-not-allowed'
                          : isSelected
                          ? 'bg-gold-500 text-black font-bold'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {format(day, 'd')}
                      {fullyBooked && !isPast && (
                        <span className="absolute bottom-1 w-1 h-1 bg-red-500 rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 justify-end mt-4">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 opacity-50"></span> Fully Booked</div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selectedDate && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h3 className="text-lg font-serif text-white flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-gold-500" />
                    Available Time Slots
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => {
                      const isTaken = getTakenTimeSlots(selectedDate).includes(time);
                      const isSelected = selectedTime === time;

                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isTaken}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-2 border text-[11px] sm:text-xs font-bold transition-all rounded-sm ${
                            isTaken
                              ? 'border-transparent bg-gray-900/50 text-gray-700 cursor-not-allowed opacity-40 font-normal'
                              : isSelected
                              ? 'border-green-500 bg-green-500/20 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                              : 'border-green-500/30 text-green-500 hover:border-green-500 hover:bg-green-500/10 bg-charcoal-900/40'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                  {getAvailableTimeSlots(selectedDate).length === 0 && (
                    <div className="mt-4 text-center text-red-400 text-xs py-3 border border-red-900/50 bg-red-900/10 rounded-sm">
                      No slots available on this date.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form */}
          <div className="bg-charcoal-900 p-6 border border-white/5 relative rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Full Name</label>
                <input
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  type="text"
                  className="w-full bg-charcoal-800 border-b border-white/10 pb-1.5 pt-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500 transition-colors"
                  placeholder="Jane Doe"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Email Address</label>
                <input
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  type="email"
                  className="w-full bg-charcoal-800 border-b border-white/10 pb-1.5 pt-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500 transition-colors"
                  placeholder="jane@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Phone Number</label>
                <input
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  type="tel"
                  className="w-full bg-charcoal-800 border-b border-white/10 pb-1.5 pt-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500 transition-colors"
                  placeholder="+63 900 000 0000"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Session Type</label>
                <select 
                  required
                  value={formData.sessionType}
                  onChange={(e) => setFormData({...formData, sessionType: e.target.value})}
                  className="w-full bg-charcoal-800 border-b border-white/10 pb-1.5 pt-1.5 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors appearance-none"
                >
                  <option value="" disabled hidden>Select a package</option>
                  <option value="basic">Basic (₱599)</option>
                  <option value="standard">Standard (₱799)</option>
                  <option value="barkada">Barkada Deal (₱749)</option>
                  <option value="deluxe">Deluxe (₱1,099)</option>
                  <option value="premium">Premium (₱1,399)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Security Check: What is {captchaQuestion.num1} + {captchaQuestion.num2}?</label>
                <input
                  required
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  type="number"
                  className="w-full bg-charcoal-800 border-b border-white/10 pb-1.5 pt-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500 transition-colors"
                  placeholder="Your answer"
                />
                {captchaError && <p className="text-red-500 text-xs mt-1">{captchaError}</p>}
              </div>

              <button
                type="submit"
                disabled={!selectedDate || !selectedTime || loading}
                className="w-full mt-6 py-3 bg-gold-500 text-black uppercase text-xs font-bold tracking-wider hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
              >
                {loading ? 'Processing...' : (selectedDate && selectedTime ? 'Confirm Booking' : 'Select Date & Time')}
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
