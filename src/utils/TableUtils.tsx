import { formatDate } from "./DateUtils";
import type { RefObject } from "react";

export function getSelection<D>(selection: "one" | "many", selected: string[], key: string | undefined, data?: D[], index?: number, ctrlKey?: boolean, shiftKey?: boolean) {
  let res: string[] = [];
  const value = (e: D | undefined, index: number) => key === undefined ? String(index) : String(e?.[key as keyof D] ?? "*")
  if (data && index === undefined) {
    if (selection === "many") {
      res = data.map((e, i) => {
        const id = value(e, i);
        return selected.includes(id) ? undefined : id;
      }).filter(e => e) as string[];
    }
  }
  else if (data && index !== undefined) {
    const current = value(data?.[index], index);
    if (selection === "many" && ctrlKey) {
      res = selected.includes(current)
        ? selected.filter(v => v !== current)
        : [...selected, current];
    }
    else if (selection === "many" && shiftKey) {
      res = [...selected];
      const last = selected.at(-1);
      const start = data.findIndex((e, i) => value(e, i) === last);
      if (start !== -1) {
        const exclude = selected.includes(current);
        const step = start <= index ? 1 : -1;
        for (let i = start; i != index + step; i += step) {
          const id = value(data[i], i);
          if (exclude) {
            if (i !== index) {
              res = res.filter(s => s !== id);
            }
          }
          else if (!res.includes(id)) {
            res.push(id);
          }
        }
      }
    }
    else if (current !== "*") {
      res = [current];
    }
  }
  return res;
}

const isVisible = (cell: Element) => {
  const style = window.getComputedStyle(cell);
  return style.display !== "none" && style.visibility !== "hidden";
};

const isValidNumber = (value: string) => /^[+-]?(0|[1-9]\d*)(\.\d+)?$/.test(value);

export function copyTable(ref: RefObject<HTMLTableElement | null>, fileName = "table", bom: string = "\uFEFF", sep: string = "\t", eol: string = "\n") {
  const table = ref.current;
  if (!table) return;

  const rows: Element[] = [];

  const theadRows = table.querySelectorAll("thead tr");
  rows.push(...theadRows);

  const allRows = Array.from(table.querySelectorAll("tbody tr"));
  let parentSelected = true;
  const tbodyRows = allRows.filter(tr => {
    // ✅ always include rows that contain TH
    if (tr.querySelector("th")) {
      return true;
    }

    const firstCell = tr.querySelector("td");
    const checkbox = firstCell?.querySelector<HTMLInputElement>(
      'input[type="checkbox"]'
    );

    // main row
    if (checkbox) {
      parentSelected = checkbox.checked;
      return checkbox.checked;
    }

    // subrow
    return parentSelected;
  });

  rows.push(...tbodyRows);

  const content = rows.map(row => {
    const cells = Array.from(row.querySelectorAll("th, td")).filter(isVisible);
    return cells
      .map(cell => {
        // If cell contains an input, use its value
        const input = cell.querySelector("input, textarea, select");
        const text = input ? (input as any).value : (cell.textContent || "");
        if (isValidNumber(text)) return text;
        // Escape quotes and prefix with single quote to avoid Excel auto-format
        const escaped = `${text.replace(/"/g, `""`)}`;
        // Wrap in quotes in CSV
        return `"${escaped}"`; // `="${escaped}"`
      })
      .join(sep);
  }).join(eol);

  // Create blob and trigger download
  const blob = new Blob([bom + content], { type: "text/tab-separated-values; charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}${formatDate(new Date(), "YYYY-MM-DD HH-mm-ss")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
