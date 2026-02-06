import { labelCell, valueCell } from "../inline-styles.js";

export const TemplateRow = ({
  label,
  value,
}: {
  label: string;
  value?: any;
}) => {
  if (value === null || value === undefined || value === "" || value === false)
    return null;

  return (
    <tr>
      <td style={labelCell}>{label}</td>
      <td style={valueCell}>{String(value)}</td>
    </tr>
  );
};
