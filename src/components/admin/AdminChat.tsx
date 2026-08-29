import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { format } from 'date-fns';
import { Send, User, MessageCircle, Search, MoreVertical } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';

interface ChatSession {
  id: string; // userId
  userName: string;
  userEmail: string;
  lastMessage: string;
  updatedAt: any;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderEmail: string;
  timestamp: any;
  isAdmin: boolean;
}

export default function AdminChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen to all sessions
  useEffect(() => {
    const q = query(collection(db, 'support_chats'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sess = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as ChatSession[];
      setSessions(sess);
    }, (error) => {
      console.error("Sessions listener error:", error);
    });
    return () => unsubscribe();
  }, []);

  // Listen to active session messages
  useEffect(() => {
    if (!activeSession) {
      setMessages([]);
      return;
    }

    const path = `support_chats/${activeSession.id}/messages`;
    const q = query(collection(db, path), orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Message[];
      setMessages(msgs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [activeSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeSession || !auth.currentUser) return;

    const replyText = inputText;
    setInputText('');

    const chatPath = `support_chats/${activeSession.id}`;
    const messagesPath = `support_chats/${activeSession.id}/messages`;

    try {
      // Add message as admin
      await addDoc(collection(db, messagesPath), {
        text: replyText,
        senderId: auth.currentUser.uid,
        senderEmail: auth.currentUser.email,
        timestamp: serverTimestamp(),
        isAdmin: true
      });

      // Update metadata
      await updateDoc(doc(db, chatPath), {
        lastMessage: replyText,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, messagesPath);
    }
  };

  const filteredSessions = sessions.filter(s => 
    s.userName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-160px)] flex border border-white/10 rounded-2xl overflow-hidden bg-charcoal-800 shadow-2xl">
      {/* Session List */}
      <div className="w-80 border-r border-white/10 flex flex-col bg-charcoal-900/30">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-white font-bold text-lg mb-4">Support Chats</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-charcoal-900 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setActiveSession(session)}
              className={`w-full p-4 flex items-start gap-4 border-b border-white/5 transition-all hover:bg-white/5 text-left group ${
                activeSession?.id === session.id ? 'bg-gold-500/10 border-l-4 border-l-gold-500' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-charcoal-800 flex items-center justify-center text-gold-500 border border-white/10">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-white truncate">{session.userName || 'Anonymous'}</h4>
                    <span className="text-[10px] text-gray-600 font-mono">
                      {session.updatedAt ? format(new Date(session.updatedAt.toMillis ? session.updatedAt.toMillis() : session.updatedAt), 'HH:mm') : ''}
                    </span>
                 </div>
                 <p className="text-xs text-gray-500 truncate group-hover:text-gray-400">{session.lastMessage}</p>
              </div>
            </button>
          ))}
          {filteredSessions.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
                No active conversations found.
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-charcoal-900/10">
        {activeSession ? (
          <>
            {/* Header */}
            <div className="p-4 bg-charcoal-800 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
                    <User className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="text-white font-bold leading-none">{activeSession.userName}</h3>
                    <p className="text-gray-500 text-xs mt-1">{activeSession.userEmail}</p>
                 </div>
              </div>
              <button className="p-2 text-gray-500 hover:text-white transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] group`}>
                    <div className={`p-4 rounded-2xl text-sm shadow-md ${
                      msg.isAdmin 
                        ? 'bg-gold-500 text-charcoal-900 rounded-tr-none' 
                        : 'bg-charcoal-800 text-white rounded-tl-none border border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                    <p className={`text-[10px] mt-1 text-gray-600 ${msg.isAdmin ? 'text-right' : 'text-left'}`}>
                       {msg.timestamp ? format(msg.timestamp.toMillis(), 'MMM d, h:mm a') : 'Sending...'}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendReply} className="p-6 bg-charcoal-800 border-t border-white/5">
              <div className="relative flex gap-4">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 bg-charcoal-900 border border-white/10 rounded-xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-gold-500 text-charcoal-900 px-6 py-2 rounded-xl font-bold hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-charcoal-900/20">
             <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <MessageCircle className="w-10 h-10 text-gray-600" />
             </div>
             <h3 className="text-white font-serif text-2xl mb-2">Select a Conversation</h3>
             <p className="text-gray-500 max-w-xs">Pick a user from the left panel to start a real-time support session.</p>
          </div>
        )}
      </div>
    </div>
  );
}
