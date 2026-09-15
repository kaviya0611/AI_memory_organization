import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Sparkles, 
  Mail, 
  Award, 
  Code, 
  Brain, 
  Database, 
  Edit3, 
  Check 
} from 'lucide-react';

export default function Team() {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "Team Lead & AI Architect",
      role: "System Architecture & LLM Extraction",
      rollNo: "Roll No. / ID Placeholder #01",
      initials: "TA",
      color: "from-blue-600 to-indigo-600",
      focus: "Neuro-Symbolic Reasoning & LangGraph Agents"
    },
    {
      id: 2,
      name: "Knowledge Graph Specialist",
      role: "Neo4j Schema & Ontology Design",
      rollNo: "Roll No. / ID Placeholder #02",
      initials: "KG",
      color: "from-purple-600 to-pink-600",
      focus: "Cypher Query Indexing & Temporal Validity"
    },
    {
      id: 3,
      name: "Full-Stack Engineer",
      role: "FastAPI Backend & Interactive Frontend",
      rollNo: "Roll No. / ID Placeholder #03",
      initials: "FE",
      color: "from-amber-500 to-yellow-500",
      focus: "Vite + Tailwind UI & Real-Time REST APIs"
    },
    {
      id: 4,
      name: "Product & Domain Strategist",
      role: "Governance & Enterprise Guardrails",
      rollNo: "Roll No. / ID Placeholder #04",
      initials: "PS",
      color: "from-emerald-600 to-teal-600",
      focus: "SDG 9 Alignment & User Experience Validation"
    }
  ]);

  const [editingId, setEditingId] = useState(null);

  const handleUpdate = (id, field, value) => {
    setTeamMembers(prev =>
      prev.map(m => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F4F6FB] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1C52C2]/10 text-[#1C52C2] text-xs font-bold uppercase tracking-wider border border-[#1C52C2]/20"
          >
            <Users className="w-3.5 h-3.5" />
            <span>The Builders</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-extrabold text-[#071A45] tracking-tight leading-tight"
          >
            Project Team &amp; Contributors
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 font-normal"
          >
            Passionate developers bringing institutional memory and decision intelligence to life.
          </motion.p>
        </div>

        {/* Team Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft-lg hover:shadow-soft-xl hover:border-[#1C52C2] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Avatar with Initials */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${member.color} text-white font-display font-black text-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                    {member.initials}
                  </div>
                  <button
                    onClick={() => setEditingId(editingId === member.id ? null : member.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#1C52C2] hover:bg-slate-100 transition"
                    title="Click to edit name/roll number directly"
                  >
                    {editingId === member.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Edit3 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Name / Role / Roll Number */}
                {editingId === member.id ? (
                  <div className="space-y-2 mb-3">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleUpdate(member.id, 'name', e.target.value)}
                      placeholder="Name"
                      className="w-full text-sm font-bold p-1.5 border rounded border-[#1C52C2]"
                    />
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => handleUpdate(member.id, 'role', e.target.value)}
                      placeholder="Role"
                      className="w-full text-xs p-1.5 border rounded"
                    />
                    <input
                      type="text"
                      value={member.rollNo}
                      onChange={(e) => handleUpdate(member.id, 'rollNo', e.target.value)}
                      placeholder="Roll No"
                      className="w-full text-xs p-1.5 border rounded font-mono"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="font-display font-black text-lg text-[#071A45] mb-1">
                      {member.name}
                    </h3>

                    <div className="text-xs font-bold text-[#1C52C2] mb-2">
                      {member.role}
                    </div>

                    <div className="inline-block px-2.5 py-1 rounded-md bg-slate-100 font-mono text-[11px] font-bold text-slate-600 mb-4">
                      {member.rollNo}
                    </div>
                  </>
                )}

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Specialization
                  </span>
                  <p className="text-xs text-slate-600 leading-snug">
                    {member.focus}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs">
                <span>Hackathon 2026</span>
                <span className="text-[#FFC000] font-bold">★ Core Team</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Presentation Pitch Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-2xl mx-auto shadow-sm space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1C52C2] mx-auto flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#FFC000]" />
          </div>
          <h4 className="font-display font-bold text-xl text-[#071A45]">
            Live Hackathon Evaluation Note
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Team cards above are interactively editable by clicking the edit icon in the top right of each card.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
