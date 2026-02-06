import { Heading, Section } from "@react-email/components";
import type { WebQuote } from "../../../queries.js";
import { tableStyle } from "../inline-styles.js";
import { TemplateRow } from "./TemplateRow.js";

type TemplateGeneralInformationProps = {
  webQuote: WebQuote;
};

export const TemplateGeneralInformation = ({
  webQuote,
}: TemplateGeneralInformationProps) => {
  return (
    <Section>
      <Heading as="h2">General Information</Heading>
      <table style={tableStyle}>
        <tbody>
          <TemplateRow
            label="Policy Effective"
            value={
              webQuote.PolicyEffectiveDate
                ? new Date(webQuote.PolicyEffectiveDate).toLocaleDateString()
                : "N/A"
            }
          />
          <TemplateRow
            label="Currently Insured"
            value={webQuote.IsCurrentlyInsured}
          />
          <TemplateRow
            label="Garaging Address Different than Mailing Address"
            value={
              webQuote.IsGaragingDifferentThanMailing === true ? "Yes" : "No"
            }
          />
          <TemplateRow
            label="Home Owner"
            value={webQuote.IsHomeOwner === true ? "Yes" : "No"}
          />
        </tbody>
      </table>
    </Section>
  );
};
