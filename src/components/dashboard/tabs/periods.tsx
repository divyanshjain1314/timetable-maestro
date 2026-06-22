import { usePeriods } from "@/lib/store";
import { SimpleListTab } from "./simple-list";

export function PeriodsTab() {
  const [periods, setPeriods] = usePeriods();

  return (
    <SimpleListTab
      title="Period Slots"
      desc="Daily period schedule (7 periods, Mon–Sat)."
      items={periods}
      setItems={setPeriods}
      columns={[
        { key: "label", label: "Period" },
        { key: "time", label: "Time" },
      ]}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      blank={{ label: "", time: "" } as any}
    />
  );
}
