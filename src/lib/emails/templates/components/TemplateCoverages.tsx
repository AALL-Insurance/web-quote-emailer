import { Heading, Section } from "@react-email/components";
import type { WebQuote } from "../../../queries.js";
import { TemplateRow } from "./TemplateRow.js";

type TemplateCoveragesProps = {
  webQuote: WebQuote;
};

export const TemplateCoverages = ({ webQuote }: TemplateCoveragesProps) => {
  if (
    !webQuote.BILimit &&
    !webQuote.PDLimit &&
    !webQuote.UMBILimit &&
    !webQuote.UIMBILimit &&
    !webQuote.MedPm
  ) {
    return null;
  }
  return (
    <Section>
      <Heading as="h2">Coverages</Heading>
      <TemplateRow label="Bodily Injury" value={webQuote.BILimit} />
      <TemplateRow label="Property Damage" value={webQuote.PDLimit} />
      <TemplateRow label="UMBI" value={webQuote.UMBILimit} />
      <TemplateRow label="UIMBI" value={webQuote.UIMBILimit} />
      <TemplateRow label="Medical Payments" value={webQuote.MedPm} />
    </Section>
  );
};
