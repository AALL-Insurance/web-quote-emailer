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

  const previousAddress = `${webQuote.PreviousAddress1 || ""}
   ${webQuote.PreviousCity || ""}, ${webQuote.PreviousState || ""} ${webQuote.PreviousZipCode || ""}`.trim();

  if (
    !webQuote.PreviousAddress1 &&
    !webQuote.PreviousCity &&
    !webQuote.PreviousState &&
    !webQuote.PreviousZipCode
  ) {
    return null;
  }

  if (!previousAddress) {
    return null;
  }

  return (
    <Section>
      <Heading as="h2">Previous Address</Heading>
      <table style={tableStyle}>
        <tbody>
          <TemplateRow label="Previous Address" value={previousAddress} />
        </tbody>
      </table>
    </Section>
  );
};
