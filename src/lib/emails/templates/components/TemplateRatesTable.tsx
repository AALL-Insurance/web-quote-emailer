import { Heading, Section, Text } from "@react-email/components";
import type { AutoWebQuoteRates } from "../../../queries.js";
import { headerCell, tableStyle, valueCell } from "../inline-styles.js";

type TemplateRatesTableProps = {
  autoWebQuoteRate: Array<AutoWebQuoteRates>;
};

export const TemplateRatesTable = ({
  autoWebQuoteRate,
}: TemplateRatesTableProps) => {
  if (!autoWebQuoteRate || autoWebQuoteRate.length === 0) {
    return null;
  }

  return (
    <Section>
      <Heading as="h2">Rates</Heading>
      <Text
        style={{
          fontSize: "13px",
          marginTop: "0px",
          marginBottom: "0px",
          color: "#868e96",
        }}
      >
        The <b>Recommended</b> carrier is calculated based on lowest installment
        cost.
        <br /> The <b>Preferred</b> carrier is always ABS as long as a rate is
        returned from ABS.
      </Text>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerCell("#619f42")}>Status</th>
            <th style={headerCell("#619f42")}>Carrier Code</th>
            <th style={headerCell("#619f42")}>Carrier Name</th>
            <th style={headerCell("#619f42")}>Deposit</th>
            <th style={headerCell("#619f42")}>Installment</th>
            <th style={headerCell("#619f42")}>Total</th>
          </tr>
        </thead>
        <tbody>
          {autoWebQuoteRate.map((rate) => (
            <tr key={rate.RateUID}>
              <td style={valueCell}>
                {rate.IsPreferred
                  ? "Preferred"
                  : rate.IsRecommended
                    ? "Recommended"
                    : rate.IsSelected
                      ? "Selected"
                      : ""}
              </td>
              <td style={valueCell}>{rate.CarrierCode}</td>
              <td style={valueCell}>{rate.CarrierName}</td>
              <td style={valueCell}>
                {rate.Deposit ? `$${rate.Deposit.toFixed(2)}` : "N/A"}
              </td>
              <td style={valueCell}>
                {rate.Installment ? `$${rate.Installment.toFixed(2)}` : "N/A"}
              </td>
              <td style={valueCell}>
                {rate.Total ? `$${rate.Total.toFixed(2)}` : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
};
