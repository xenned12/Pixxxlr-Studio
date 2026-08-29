import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, LogIn, Loader2 } from 'lucide-react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  setDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: any;
  isAdmin: boolean;
}

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !isOpen) return;

    const path = `support_chats/${user.uid}/messages`;
    const q = query(collection(db, path), orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    const msgText = inputText;
    setInputText('');

    const chatPath = `support_chats/${user.uid}`;
    const messagesPath = `support_chats/${user.uid}/messages`;

    try {
      // Update/Create chat session metadata
      await setDoc(doc(db, chatPath), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        lastMessage: msgText,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Add message
      await addDoc(collection(db, messagesPath), {
        text: msgText,
        senderId: user.uid,
        senderEmail: user.email,
        timestamp: serverTimestamp(),
        isAdmin: false
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, messagesPath);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-80 md:w-96 bg-charcoal-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-gold-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-charcoal-900 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <h3 className="text-charcoal-900 font-bold leading-none">PIXXXLR Support</h3>
                  <p className="text-charcoal-900/70 text-xs mt-1">Typical reply time: 5 mins</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-charcoal-900 hover:bg-black/10 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!user ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                    <LogIn className="w-8 h-8 text-gold-500" />
                  </div>
                  <h4 className="text-white font-medium">Ready to chat?</h4>
                  <p className="text-gray-400 text-sm">Please sign in with your Google account to start a conversation with our team.</p>
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-white text-black py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />}
                    Sign in with Google
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center py-2">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Conversation Started</span>
                  </div>
                  {messages.length === 0 && (
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-sm text-gray-400 italic">
                      Hi {user.displayName?.split(' ')[0]}! How can we help you today? Send us a message and we'll get back to you shortly.
                    </div>
                  )}
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        msg.isAdmin 
                          ? 'bg-white/10 text-white rounded-bl-none' 
                          : 'bg-gold-500 text-charcoal-900 rounded-br-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Footer */}
            {user && (
              <form onSubmit={sendMessage} className="p-4 bg-charcoal-900/50 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-gold-500 text-charcoal-900 p-2 rounded-lg hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:hover:bg-gold-500 cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gold-500 text-charcoal-900 rounded-full shadow-2xl flex items-center justify-center hover:bg-gold-400 transition-colors cursor-pointer group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="absolute right-full mr-4 bg-charcoal-800 text-white text-xs py-1.5 px-3 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Chat with us
        </span>
      </motion.button>
    </div>
  );
}
