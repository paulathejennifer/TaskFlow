import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("lucide-react", () => {
  const createIcon = (name: string) => {
    function Icon(props: Record<string, unknown>) {
      return {
        type: "svg",
        props: {
          ...props,
          "data-testid": `icon-${name}`,
          "aria-hidden": true,
        },
      };
    }

    Icon.displayName = name;

    return Icon;
  };

  return {
    CheckCircle2: createIcon("CheckCircle2"),
    ClipboardList: createIcon("ClipboardList"),
    Clock3: createIcon("Clock3"),
    Plus: createIcon("Plus"),
    Ellipsis: createIcon("Ellipsis"),
    Folder: createIcon("Folder"),
    CalendarDays: createIcon("CalendarDays"),
    ChevronDown: createIcon("ChevronDown"),
    Flag: createIcon("Flag"),
    Info: createIcon("Info"),
    Trash2: createIcon("Trash2"),
    X: createIcon("X"),
  };
});