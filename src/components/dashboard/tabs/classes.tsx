import { useClasses } from "@/lib/store";
import { SimpleListTab } from "./simple-list";

export function ClassesTab() {
  const [classes, setClasses] = useClasses();
  return (
    <SimpleListTab
      title="Classes"
      desc="Manage class names."
      items={classes}
      setItems={setClasses}
      columns={[{ key: "name", label: "Class Name" }]}
      blank={{ name: "" } as any}
    />
  );
}
