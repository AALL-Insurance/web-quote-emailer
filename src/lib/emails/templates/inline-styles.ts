export const fontFamily = "Arial, Helvetica, sans-serif";

export const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

export const labelCell: React.CSSProperties = {
  padding: "6px 8px",
  fontSize: "13px",
  fontWeight: "bold",
  verticalAlign: "top",
  borderBottom: "1px solid #e5e7eb",
};

export const valueCell: React.CSSProperties = {
  padding: "6px 8px",
  fontSize: "13px",
  borderBottom: "1px solid #e5e7eb",
};

export const headerCell = (bg: string): React.CSSProperties => ({
  backgroundColor: bg,
  color: "#ffffff",
  padding: "8px",
  fontSize: "13px",
  textAlign: "left",
});
