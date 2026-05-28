"use client";

// Reusable form sections for 1st Communion, Marriage, Husband, Wife, Sign-off.
// Used by both the new baptism form and the edit baptism form.

interface Props {
  form: Record<string, string>;
  set: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b border-gray-100 pb-2 mb-4">
      <h2 className="font-semibold text-[#1e3a5f] text-sm uppercase tracking-wide">{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default function BaptismLifeEventsFields({ form, set }: Props) {
  return (
    <>
      {/* ── First Holy Communion ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <SectionHeader
          title="First Holy Communion"
          subtitle="Can be filled in later when the sacrament is received"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date of 1st Communion</label>
            <input
              type="date"
              value={form.firstCommunionDate || ""}
              onChange={set("firstCommunionDate")}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Place of 1st Communion</label>
            <input
              type="text"
              value={form.firstCommunionPlace || ""}
              onChange={set("firstCommunionPlace")}
              className={inputClass}
              placeholder="Church name"
            />
          </div>
        </div>
      </section>

      {/* ── Marriage ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <SectionHeader
          title="Marriage"
          subtitle="Can be filled in later — noted as a marginal annotation on the baptism record"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Date of Marriage</label>
            <input
              type="date"
              value={form.marriageDate || ""}
              onChange={set("marriageDate")}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Place of Marriage</label>
            <input
              type="text"
              value={form.marriagePlace || ""}
              onChange={set("marriagePlace")}
              className={inputClass}
              placeholder="Church / location"
            />
          </div>
          <div>
            <label className={labelClass}>Register No.</label>
            <input
              type="text"
              value={form.marriageNo || ""}
              onChange={set("marriageNo")}
              className={inputClass}
              placeholder="e.g. Book 2, Entry 5"
            />
          </div>
        </div>
      </section>

      {/* ── Husband ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <SectionHeader
          title="Husband"
          subtitle="Spouse details noted on the baptismal record"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3">
            <label className={labelClass}>Husband's Full Name</label>
            <input
              type="text"
              value={form.husbandName || ""}
              onChange={set("husbandName")}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Date of Baptism</label>
            <input
              type="date"
              value={form.husbandBaptismDate || ""}
              onChange={set("husbandBaptismDate")}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Baptism Register No.</label>
            <input
              type="text"
              value={form.husbandBaptismNo || ""}
              onChange={set("husbandBaptismNo")}
              className={inputClass}
              placeholder="e.g. Book 1, Entry 3"
            />
          </div>
        </div>
      </section>

      {/* ── Wife ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <SectionHeader
          title="Wife"
          subtitle="Spouse details noted on the baptismal record"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3">
            <label className={labelClass}>Wife's Full Name</label>
            <input
              type="text"
              value={form.wifeName || ""}
              onChange={set("wifeName")}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Date of Baptism</label>
            <input
              type="date"
              value={form.wifeBaptismDate || ""}
              onChange={set("wifeBaptismDate")}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Baptism Register No.</label>
            <input
              type="text"
              value={form.wifeBaptismNo || ""}
              onChange={set("wifeBaptismNo")}
              className={inputClass}
              placeholder="e.g. Book 1, Entry 7"
            />
          </div>
          <div className="sm:col-span-3">
            <label className={labelClass}>Signed By</label>
            <input
              type="text"
              value={form.signedBy || ""}
              onChange={set("signedBy")}
              className={inputClass}
              placeholder="Officiating priest / parish secretary"
            />
          </div>
        </div>
      </section>
    </>
  );
}
