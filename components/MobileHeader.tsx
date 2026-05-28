"use client";

export default function MobileHeader() {
  return (
    <div className="flex lg:hidden items-center gap-2 px-4 py-3 bg-[#1e3a5f] text-white shadow-md no-print">
      <span className="text-[#c9a84c] text-xl">✝</span>
      <div>
        <p className="font-bold text-sm tracking-wide leading-none">Parish Records</p>
        <p className="text-[10px] text-blue-300 leading-none mt-0.5">Catechism Management</p>
      </div>
    </div>
  );
}
