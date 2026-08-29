import React from 'react';
import { 
  Users, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  TrendingUp,
  Eye,
  MousePointer2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';

interface DashboardProps {
  bookings: any[];
  chats: any[];
}

export default function Dashboard({ bookings, chats }: DashboardProps) {
  // Mock traffic data
  const trafficData = [
    { name: 'Mon', views: 400, visitor: 240 },
    { name: 'Tue', views: 300, visitor: 139 },
    { name: 'Wed', views: 200, visitor: 980 },
    { name: 'Thu', views: 278, visitor: 390 },
    { name: 'Fri', views: 189, visitor: 480 },
    { name: 'Sat', views: 239, visitor: 380 },
    { name: 'Sun', views: 349, visitor: 430 },
  ];

  const bookingSummary = [
    { name: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length },
    { name: 'Pending', value: bookings.filter(b => b.status === 'pending').length },
    { name: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length },
  ];

  const stats = [
    { label: 'Total Inquiries', value: bookings.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Confirmed Bookings', value: bookingSummary[0].value, icon: CalendarIcon, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Support Chats', value: chats.length, icon: MessageSquare, color: 'text-gold-500', bg: 'bg-gold-500/10' },
    { label: 'Conversion Rate', value: '12.5%', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-serif text-white mb-2">Dashboard Overview</h2>
        <p className="text-gray-400 text-sm">Real-time performance and studio metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-charcoal-800 border border-white/10 p-6 rounded-xl hover:border-gold-500/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-xs text-gray-500 font-medium">Last 30 Days</span>
            </div>
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Traffic Chart */}
        <div className="lg:col-span-2 bg-charcoal-800 border border-white/10 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-white font-medium mb-1">Website Traffic</h3>
              <p className="text-gray-500 text-xs">Total views vs Unique visitors</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <div className="w-2 h-2 rounded-full bg-gold-500" /> Views
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <div className="w-2 h-2 rounded-full bg-blue-400" /> Visitors
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#666', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#666', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff'}}
                  itemStyle={{color: '#fff'}}
                />
                <Area type="monotone" dataKey="views" stroke="#D4AF37" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
                <Area type="monotone" dataKey="visitor" stroke="#3b82f6" fillOpacity={0} strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-charcoal-800 border border-white/10 p-6 rounded-xl">
          <h3 className="text-white font-medium mb-8 text-center uppercase tracking-widest text-sm">Booking Status</h3>
          <div className="h-64 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingSummary}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#666', fontSize: 10}}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#ffffff05'}}
                  contentStyle={{backgroundColor: '#1a1a1a', border: '1px solid #333'}}
                />
                <Bar 
                  dataKey="value" 
                  fill="#D4AF37" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                  label={{ position: 'top', fill: '#fff', fontSize: 12 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {bookingSummary.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{item.name}</span>
                <span className="text-white font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Source Mock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-charcoal-800 border border-white/10 p-6 rounded-xl overflow-hidden">
          <h3 className="text-white font-medium mb-6">Recent Activity</h3>
          <div className="space-y-4">
             {bookings.slice(0, 5).map((b, i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors group">
                  <div className={`w-2 h-2 rounded-full ${b.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">{b.fullName}</p>
                    <p className="text-[10px] text-gray-500 uppercase">{b.sessionType} • {b.date}</p>
                  </div>
                  <span className="text-[10px] text-gray-600 font-mono tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">NEW BOOKING</span>
                </div>
             ))}
          </div>
        </div>

        <div className="bg-charcoal-800 border border-white/10 p-6 rounded-xl">
           <h3 className="text-white font-medium mb-6">Website Real-time</h3>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-charcoal-900/50 rounded-lg border border-white/5">
                 <Eye className="w-5 h-5 text-blue-400 mb-2" />
                 <p className="text-[10px] text-gray-500 uppercase mb-1">Active Now</p>
                 <p className="text-2xl font-bold text-white">14</p>
              </div>
              <div className="p-4 bg-charcoal-900/50 rounded-lg border border-white/5">
                 <MousePointer2 className="w-5 h-5 text-gold-500 mb-2" />
                 <p className="text-[10px] text-gray-500 uppercase mb-1">Clicks (1h)</p>
                 <p className="text-2xl font-bold text-white">128</p>
              </div>
           </div>
           
           <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Facebook Referral</span>
                <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-[70%]" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Google Search</span>
                <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-500 w-[45%]" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Direct Visit</span>
                <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 w-[20%]" />
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
