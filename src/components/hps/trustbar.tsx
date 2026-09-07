import { TRUST_ITEMS } from "@/lib/hps-data";

export function Trustbar() {
  return (
    <div
      className="border-y"
      style={{
        background: "#F6F8FB",
        borderColor: "#E2E8F0",
      }}
    >
      <div className="hps-wrap flex flex-wrap justify-center gap-x-9 gap-y-2.5 px-6 py-[18px]">
        {TRUST_ITEMS.map((t) => (
          <span
            key={t}
            className="flex items-center gap-2.5 uppercase"
            style={{
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: "0.76rem",
              letterSpacing: "0.12em",
              color: "var(--color-steel)",
            }}
          >
            <span className="text-[0.6rem]" style={{ color: "var(--color-gold)" }}>
              ◆
            </span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
