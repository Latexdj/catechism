"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { Plus, BookOpen, Users, ChevronRight } from "lucide-react";

interface CatechismClass {
  id: string;
  name: string;
  year: number;
  sacramentType: string;
  catechist?: string;
  isActive: boolean;
  members: { id: string }[];
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<CatechismClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/classes").then((r) => r.json()).then((data) => { setClasses(data); setLoading(false); });
  }, []);

  const active = classes.filter((c) => c.isActive);
  const inactive = classes.filter((c) => !c.isActive);

  const sacramentBadge = (type: string) => {
    const map: Record<string, string> = {
      BAPTISM: "bg-indigo-100 text-indigo-700",
      CONFIRMATION: "bg-amber-100 text-amber-700",
      BOTH: "bg-purple-100 text-purple-700",
    };
    return map[type] || "bg-gray-100 text-gray-500";
  };

  const ClassCard = ({ cls }: { cls: CatechismClass }) => (
    <Link href={`/classes/${cls.id}`} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-50 rounded-lg mt-0.5">
          <BookOpen size={18} className="text-[#1e3a5f]" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{cls.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">Class Year: {cls.year}</p>
          {cls.catechist && <p className="text-xs text-gray-400 mt-1">Catechist: {cls.catechist}</p>}
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sacramentBadge(cls.sacramentType)}`}>
              {cls.sacramentType}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Users size={12} /> {cls.members.length} students
            </span>
          </div>
        </div>
      </div>
      <ChevronRight size={18} className="text-gray-300 flex-shrink-0 mt-1" />
    </Link>
  );

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Classes & Cohorts"
        subtitle={`${active.length} active class${active.length !== 1 ? "es" : ""}`}
        actions={
          <Link href="/classes/new" className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2d5f8a] transition-colors">
            <Plus size={16} /> New Class
          </Link>
        }
      />
      <div className="p-8 space-y-8">
        {loading && <p className="text-gray-400">Loading...</p>}

        {!loading && active.length === 0 && inactive.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No classes yet. Create your first class.</p>
            <Link href="/classes/new" className="mt-4 inline-block text-[#1e3a5f] font-medium hover:underline text-sm">
              + New Class
            </Link>
          </div>
        )}

        {active.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Active Classes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {active.map((cls) => <ClassCard key={cls.id} cls={cls} />)}
            </div>
          </div>
        )}

        {inactive.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Archived Classes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
              {inactive.map((cls) => <ClassCard key={cls.id} cls={cls} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
