import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { db, auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { Camera, Lock, Loader2 } from 'lucide-react';

// Components
import Sidebar from './admin/Sidebar';
import Dashboard from './admin/Dashboard';
import CalendarView from './admin/CalendarView';
import BookingsList from './admin/BookingsList';
import AdminChat from './admin/AdminChat';

type BookingRecord = {
  id: string;
  date: string;
  time: string;
  status: string;
  createdAt: any;
  fullName?: string;
  email?: string;
  phone?: string;
  sessionType?: string;
};

type AdminView = 'dashboard' | 'calendar' | 'bookings' | 'chats';

export default function Admin() {
  const [user, setUser] = useState(auth.currentUser);
  const [isAdminState, setIsAdminState] = useState(false);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<AdminView>('dashboard');
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        setAuthLoading(true);
        setErrorMsg('');
        try {
          const userSnap = await getDoc(doc(db, 'users', u.uid));
          const isAdmin = (userSnap.exists() && userSnap.data()?.isAdmin === true) || 
                          (u.email === 'xenned12@gmail.com');
                          
          if (isAdmin) {
            // Success: User is an admin
            setIsAdminState(true); // Re-using this state name for "Verified Admin"
            fetchAdminBookings();
            fetchSupportChats();
          } else {
            setErrorMsg('Access Denied: Your account does not have administrative privileges. If you believe this is an error, please contact the system administrator.');
            await signOut(auth);
          }
        } catch (err) {
          console.error("Admin check failed:", err);
          setErrorMsg('An error occurred while verifying your permissions. Please try logging in again.');
          await signOut(auth);
        } finally {
          setAuthLoading(false);
          setLoading(false);
        }
      } else {
        setIsAdminState(false);
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const loginWithGoogle = async () => {
    setAuthLoading(true);
    setErrorMsg('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Auth state change will handle the rest
    } catch (e: any) {
      console.error(e);
      if (e.code === 'auth/popup-blocked') {
        setErrorMsg('Sign-in popup was blocked. Please allow popups or open this page in a new tab.');
      } else if (e.code === 'auth/cancelled-popup-request') {
        // User closed the popup, don't show error unless they keep clicking
      } else {
        setErrorMsg('We couldn\'t connect to Google Sign-In. Please check your internet connection and try again.');
      }
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setIsAdminState(false);
    signOut(auth);
  };

  const fetchSupportChats = async () => {
    try {
      const chatsSnap = await getDocs(collection(db, 'support_chats'));
      const chatsData = chatsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setChats(chatsData);
    } catch (err) {
      console.error('Error fetching chats:', err);
    }
  };

  const fetchAdminBookings = async () => {
    setLoading(true);
    try {
      const publicSnap = await getDocs(collection(db, 'public_bookings'));
      const privateSnap = await getDocs(collection(db, 'private_bookings'));

      const publicData = new Map();
      publicSnap.forEach(d => publicData.set(d.id, d.data()));

      const privateData = new Map();
      privateSnap.forEach(d => privateData.set(d.id, d.data()));

      const combined: BookingRecord[] = Array.from(publicData.entries()).map(([id, pub]) => {
        const priv = privateData.get(id) || {};
        return {
          id,
          ...pub,
          ...priv,
        };
      });

      combined.sort((a, b) => {
        if(a.createdAt && b.createdAt) {
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        }
        return 0;
      });

      setBookings(combined);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to load records. Make sure your account has admin access.");
      handleFirestoreError(err, OperationType.GET, 'multiple_collections');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'public_bookings', id), {
        status: newStatus
      });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));

      // Fetch the booking details to send an email
      const booking = bookings.find(b => b.id === id);
      if (booking && booking.email) {
        try {
          await fetch('/api/bookings/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: booking.email,
              fullName: booking.fullName,
              date: booking.date,
              time: booking.time,
              status: newStatus,
              sessionType: booking.sessionType
            })
          });
        } catch (emailErr) {
          console.error("Failed to send email notification", emailErr);
        }
      }

    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `public_bookings/${id}`);
    }
  };

  if (!user || !isAdminState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-900 px-6 py-24 font-sans">
        <div className="max-w-md w-full p-10 bg-charcoal-800 border border-white/10 rounded-2xl shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-gold-500" />
            </div>
            <h2 className="text-3xl font-serif text-white mb-2">Admin Access</h2>
            <p className="text-gray-400 text-sm font-light">
              Sign in with your administrative account to continue.
            </p>
          </div>

          <div className="space-y-6">
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                <p className="text-red-400 text-center text-sm font-medium leading-relaxed">{errorMsg}</p>
              </div>
            )}

            <button
              type="button"
              onClick={loginWithGoogle}
              disabled={authLoading}
              className="w-full py-4 bg-white text-charcoal-900 rounded-xl uppercase text-sm font-black tracking-widest hover:bg-gray-100 transition-all disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-white/5"
            >
              {authLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  Sign In with Google
                </>
              )}
            </button>
            
            <p className="text-center text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
              Restricted to authorized personnel only
            </p>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/5 text-center">
             <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">Secure Studio Access System</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-900 font-sans flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={logout} 
      />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Synchronizing Data...</p>
             </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <Dashboard bookings={bookings} chats={chats} />}
              {activeTab === 'calendar' && <CalendarView bookings={bookings} />}
              {activeTab === 'bookings' && (
                <BookingsList bookings={bookings} updateStatus={updateStatus} />
              )}
              {activeTab === 'chats' && <AdminChat />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

