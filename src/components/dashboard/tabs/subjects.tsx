import { useSubjects } from "@/lib/store";
import { SimpleListTab } from "./simple-list";

export function SubjectsTab() {
  const [subjects, setSubjects] = useSubjects();
  return (
    <SimpleListTab
      title="Subjects"
      desc="Subjects and weekly period count."
      items={subjects}
      setItems={setSubjects}
      columns={[
        { key: "name", label: "Subject" },
        { key: "periodsPerWeek", label: "Periods / Week", type: "number" },
      ]}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      blank={{ name: "", periodsPerWeek: 6 } as any}
    />
  );
}
