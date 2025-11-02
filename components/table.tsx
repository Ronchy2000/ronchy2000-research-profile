type TableProps = {
  caption?: string;
  headers: string[];
  rows: string[][];
};

/**
 * Minimal table component for listing courses or skills.
 * Accepts plain string matrix data; replace with richer typing if needed.
 */
export function Table({ caption, headers, rows }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
        {caption ? <caption className="p-3 text-left text-xs text-slate-500">{caption}</caption> : null}
        <thead className="bg-slate-50/80 dark:bg-slate-900/40">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white/80 dark:bg-slate-900/60">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2 text-slate-600 dark:text-slate-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
