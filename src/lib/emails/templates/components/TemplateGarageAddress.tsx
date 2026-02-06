import { Heading, Section } from "@react-email/components";
import type { WebQuote } from "../../../queries.js";
import { tableStyle } from "../inline-styles.js";
import { TemplateRow } from "./TemplateRow.js";

type TemplateGarageAddressProps = {
  webQuote: WebQuote;
};

export const TemplateGarageAddress = ({
  webQuote,
}: TemplateGarageAddressProps) => {
  if (!webQuote.IsGaragingDifferentThanMailing) {
    return null;
  }

  return (
    <Section>
      <Heading as="h2">Garaging Address</Heading>
      <table style={tableStyle}>
        <tbody>
          <TemplateRow
            label="Garaging Address"
            value={`${webQuote.GaragingAddress1}
${webQuote.GaragingCity}, ${webQuote.GaragingState} ${webQuote.GaragingZipCode}`}
          />
        </tbody>
      </table>
    </Section>
  );
};
