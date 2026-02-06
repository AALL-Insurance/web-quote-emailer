import { Heading, Section } from "@react-email/components";
import type { WebQuote } from "../../../queries.js";
import { tableStyle } from "../inline-styles.js";
import { TemplateRow } from "./TemplateRow.js";

type TemplatePreviousAddressProps = {
  webQuote: WebQuote;
};

export const TemplatePreviousAddress = ({
  webQuote,
}: TemplatePreviousAddressProps) => {
  if (!webQuote.YearsAtAddress || webQuote.YearsAtAddress <= 2) {
    return null;
  }

  return (
    <Section>
      <Heading as="h2">Previous Address</Heading>
      <table style={tableStyle}>
        <tbody>
          <TemplateRow
            label="Previous Address"
            value={`${webQuote.PreviousAddress1}
   ${webQuote.PreviousCity}, ${webQuote.PreviousState} ${webQuote.PreviousZipCode}`}
          />
        </tbody>
      </table>
    </Section>
  );
};
