import { Heading, Section } from "@react-email/components";
import type { WebQuote } from "../../../queries.js";
import { tableStyle } from "../inline-styles.js";
import { TemplateRow } from "./TemplateRow.js";

type TemplateContactInformationProps = {
  webQuote: WebQuote;
};

export const TemplateContactInformation = ({
  webQuote,
}: TemplateContactInformationProps) => {
  return (
    <Section>
      <Heading as="h2">Contact Information</Heading>
      <table style={tableStyle}>
        <tbody>
          <TemplateRow
            label="Insured Name"
            value={`${webQuote.InsuredFirstName} ${webQuote.InsuredLastName}`}
          />
          <TemplateRow label="Phone" value={webQuote.PhoneNumber} />
          <TemplateRow label="Email" value={webQuote.EmailAddress} />
          <TemplateRow
            label="Address"
            value={`${webQuote.Address1}
${webQuote.City}, ${webQuote.State} ${webQuote.ZipCode}`}
          />
          <TemplateRow
            label="Years at Address"
            value={webQuote.YearsAtAddress}
          />
          <TemplateRow
            label="Months at Address"
            value={webQuote.MonthsAtAddress}
          />
          <TemplateRow label="Residence Type" value={webQuote.ResidenceType} />
        </tbody>
      </table>
    </Section>
  );
};
