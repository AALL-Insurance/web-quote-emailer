import { Heading, Section } from "@react-email/components";
import type { WebQuote } from "../../../queries.js";
import { TemplateRow } from "./TemplateRow.js";

type TemplatePriorInsuranceHistoryProps = {
  webQuote: WebQuote;
};

export const TemplatePriorInsuranceHistory = ({
  webQuote,
}: TemplatePriorInsuranceHistoryProps) => {
  if (
    !webQuote.IsCurrentlyInsured ||
    webQuote.IsCurrentlyInsured === null ||
    webQuote.IsCurrentlyInsured.toLowerCase() === "no"
  ) {
    return null;
  }

  if (!webQuote.AutoInsuredPriorPolicy) {
    return null;
  }

  return (
    <Section>
      <Heading as="h2">Prior Insurance History</Heading>
      <TemplateRow
        label="Prior Carrier Name"
        value={webQuote.AutoInsuredPriorPolicy.CarrierName}
      />
      <TemplateRow
        label="Prior Bodily Injury Limit"
        value={
          webQuote.AutoInsuredPriorPolicy
            ? webQuote.AutoInsuredPriorPolicy.BILimit
            : "N/A"
        }
      />
      <TemplateRow
        label="Prior Property Damage Limit"
        value={
          webQuote.AutoInsuredPriorPolicy
            ? webQuote.AutoInsuredPriorPolicy.PDLimit
            : "N/A"
        }
      />
      <TemplateRow
        label="Months With Prior Insurer"
        value={
          webQuote.AutoInsuredPriorPolicy.MonthsWithInsurer
            ? webQuote.AutoInsuredPriorPolicy.MonthsWithInsurer.toString()
            : "N/A"
        }
      />
      <TemplateRow
        label="Prior Policy Expiration Date"
        value={webQuote.AutoInsuredPriorPolicy.PolicyExpirationDate}
      />
    </Section>
  );
};
