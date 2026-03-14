import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Smile, MessageSquare, ShieldCheck, Trash2, TrendingUp } from 'lucide-react';
import { useChatSession, EMOTION_META } from '../context/ChatContext';

// ── Helpers ───────────────────────────────────────────────────────────────────

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—';

const SAFETY_COLORS = {
  SAFE: '#10B981',
  MODERATE_DISTRESS: '#F59E0B',
  HIGH_RISK: '#EF4444',
};

const SAFETY_LABELS = {
  SAFE: 'Safe',
  MODERATE_DISTRESS: 'Moderate',
  HIGH_RISK: 'High Risk',
};

// ── Custom Recharts Tooltip ───────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { session, clearSession } = useChatSession();
  const { events, totalMessages } = session;

  // ── Derived stats ────────────────────────────────────────────────────────────
  const hasData = events.length > 0;

  const dominantEmotion = useMemo(() => {
    if (!hasData) return null;
    const counts = {};
    events.forEach(e => { counts[e.emotion] = (counts[e.emotion] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  }, [events, hasData]);

  const avgScore = useMemo(() => {
    if (!hasData) return null;
    const avg = events.reduce((sum, e) => sum + e.score, 0) / events.length;
    return avg.toFixed(1);
  }, [events, hasData]);

  const latestSafety = useMemo(() => {
    if (!hasData) return 'SAFE';
    return events[events.length - 1]?.safetyLevel || 'SAFE';
  }, [events, hasData]);

  // ── Pie chart: emotion distribution ─────────────────────────────────────────
  const pieData = useMemo(() => {
    const counts = {};
    events.forEach(e => { counts[e.emotion] = (counts[e.emotion] || 0) + 1; });
    return Object.entries(counts).map(([emotion, value]) => ({
      name: capitalize(emotion),
      value,
      color: EMOTION_META[emotion]?.color || '#9CA3AF'
    }));
  }, [events]);

  // ── Line chart: emotion score over time (last 20 events) ─────────────────────
  const lineData = useMemo(() => {
    return events.slice(-20).map((e, i) => ({
      index: i + 1,
      time: e.time,
      score: e.score,
      emotion: capitalize(e.emotion),
    }));
  }, [events]);

  // ── Bar chart: safety level counts ──────────────────────────────────────────
  const safetyBarData = useMemo(() => {
    const counts = { SAFE: 0, MODERATE_DISTRESS: 0, HIGH_RISK: 0 };
    events.forEach(e => { if (counts[e.safetyLevel] !== undefined) counts[e.safetyLevel]++; });
    return [
      { name: 'Safe', value: counts.SAFE, color: SAFETY_COLORS.SAFE },
      { name: 'Moderate', value: counts.MODERATE_DISTRESS, color: SAFETY_COLORS.MODERATE_DISTRESS },
      { name: 'High Risk', value: counts.HIGH_RISK, color: SAFETY_COLORS.HIGH_RISK },
    ];
  }, [events]);

  // ── Recent emotion feed ──────────────────────────────────────────────────────
  const recentFeed = useMemo(() => [...events].reverse().slice(0, 8), [events]);

  // ── Stat Cards ───────────────────────────────────────────────────────────────
  const statCards = [
    {
      label: 'Messages Sent',
      value: totalMessages || '0',
      icon: <MessageSquare size={22} />,
      bg: 'bg-blue-50', text: 'text-blue-600',
    },
    {
      label: 'Dominant Emotion',
      value: capitalize(dominantEmotion) || '—',
      icon: <Smile size={22} />,
      bg: 'bg-emerald-50', text: 'text-emerald-600',
    },
    {
      label: 'Avg Wellness Score',
      value: avgScore ? `${avgScore} / 5` : '—',
      icon: <Activity size={22} />,
      bg: 'bg-amber-50', text: 'text-amber-600',
    },
    {
      label: 'Current Safety',
      value: SAFETY_LABELS[latestSafety],
      icon: <ShieldCheck size={22} />,
      bg: latestSafety === 'SAFE' ? 'bg-emerald-50' : latestSafety === 'MODERATE_DISTRESS' ? 'bg-amber-50' : 'bg-rose-50',
      text: latestSafety === 'SAFE' ? 'text-emerald-600' : latestSafety === 'MODERATE_DISTRESS' ? 'text-amber-600' : 'text-rose-600',
    },
  ];

  return (
    <div className="flex-1 w-full bg-[#F8FAFC] min-h-[calc(100vh-4rem)] p-4 md:p-8 pb-20">
      <div className="max-w-6xl mx-auto space-y-8 mt-4">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900 tracking-tight"
            >
              Your Wellness Dashboard
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="text-gray-500 mt-1"
            >
              {hasData
                ? `Live view — ${events.length} emotion events tracked this session.`
                : 'Start chatting to see your real-time emotional insights here.'}
            </motion.p>
          </div>
          {hasData && (
            <button
              onClick={clearSession}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-rose-500 transition px-3 py-2 rounded-xl hover:bg-rose-50"
            >
              <Trash2 size={16} /> Clear
            </button>
          )}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{card.label}</p>
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={card.value}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-xl font-bold text-gray-900 truncate"
                  >
                    {card.value}
                  </motion.h3>
                </AnimatePresence>
              </div>
              <div className={`w-11 h-11 rounded-xl ${card.bg} ${card.text} flex items-center justify-center flex-shrink-0`}>
                {card.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {!hasData ? (
          // Empty state
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center justify-center gap-4 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">No data yet</h3>
            <p className="text-gray-500 max-w-xs leading-relaxed">
              Your emotional insights will appear here as you chat with MindMitra. Every message is tracked in real-time.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Line Chart — Wellness Score Over Time */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Wellness Score Over Time</h3>
                <p className="text-xs text-gray-400 mb-6">Updated live from your chat session</p>
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} dy={10} />
                      <YAxis domain={[0, 5]} ticks={[1,2,3,4,5]} axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} dx={-6} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone" dataKey="score" name="Wellness"
                        stroke="#2563EB" strokeWidth={3}
                        dot={{ r: 5, fill: '#2563EB', strokeWidth: 2, stroke: 'white' }}
                        activeDot={{ r: 7 }}
                        isAnimationActive={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Pie Chart — Emotion Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Emotion Distribution</h3>
                <p className="text-xs text-gray-400 mb-4">This session</p>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {pieData.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name} ({item.value})
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Safety Distribution Bar Chart */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Safety Distribution</h3>
                <p className="text-xs text-gray-400 mb-6">Message risk levels detected</p>
                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={safetyBarData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Count" radius={[6,6,0,0]}>
                        {safetyBarData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Recent Emotion Feed */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Recent Emotion Log</h3>
                <p className="text-xs text-gray-400 mb-5">Latest detected emotions from your conversations</p>
                <div className="space-y-3 overflow-y-auto max-h-52">
                  <AnimatePresence>
                    {recentFeed.map((e, i) => (
                      <motion.div
                        key={e.timestamp}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: EMOTION_META[e.emotion]?.color || '#9CA3AF' }}
                          />
                          <span className="text-sm font-medium text-gray-700 capitalize">{e.emotion}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: SAFETY_COLORS[e.safetyLevel] + '18',
                              color: SAFETY_COLORS[e.safetyLevel]
                            }}
                          >
                            {SAFETY_LABELS[e.safetyLevel]}
                          </span>
                          <span className="text-xs text-gray-400 font-medium tabular-nums">{e.time}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
