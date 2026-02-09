import { Body, Container, Head, Html, Text } from "@react-email/components";
import type React from "react";
import type { WebQuote } from "../../queries.js";
import type { AutoWebQuoteRates } from "../../types/database.js";
import { TemplateAutoDriver } from "./components/TemplateAutoDriver.js";
import { TemplateContactInformation } from "./components/TemplateContactInformation.js";
import { TemplateCoverages } from "./components/TemplateCoverages.js";
import { TemplateGarageAddress } from "./components/TemplateGarageAddress.js";
import { TemplateGeneralInformation } from "./components/TemplateGeneralInformation.js";
import { TemplateHeader } from "./components/TemplateHeader.js";
import { TemplatePreviousAddress } from "./components/TemplatePreviousAddress.js";
import { TemplatePriorInsuranceHistory } from "./components/TemplatePriorInsuranceHistory.js";
import { TemplateRatesTable } from "./components/TemplateRatesTable.js";
import { TemplateVehicles } from "./components/TemplateVehicles.js";
import { TemplateViolations } from "./components/TemplateViolations.js";
import { fontFamily } from "./inline-styles.js";

type AutoQuoteEmailProps = {
  webQuote: WebQuote;
  autoWebQuoteRate: Array<AutoWebQuoteRates>;
  title?: React.ReactNode;
  description?: React.ReactNode;
};

export const AgentEmailTemplate = ({
  title,
  description,
  webQuote,
  autoWebQuoteRate,
}: AutoQuoteEmailProps) => {
  if (!webQuote) return null;

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f3f4f6", fontFamily }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            margin: "0 auto",
            padding: "24px",
            maxWidth: "720px",
          }}
        >
          <TemplateHeader title={title} description={description} />
          <TemplateContactInformation webQuote={webQuote} />
          <TemplatePreviousAddress webQuote={webQuote} />
          <TemplateRatesTable autoWebQuoteRate={autoWebQuoteRate} />
          <TemplateCoverages webQuote={webQuote} />
          <TemplateGeneralInformation webQuote={webQuote} />
          <TemplatePriorInsuranceHistory webQuote={webQuote} />
          <TemplateGarageAddress webQuote={webQuote} />
          <TemplateAutoDriver AutoDriver={webQuote.AutoDriver} />
          <TemplateViolations AutoViolation={webQuote.AutoViolation} />
          <TemplateVehicles AutoVehicle={webQuote.AutoVehicle} />

          <Text>
            <strong>Quote Number:</strong> {webQuote.QuoteNumber}
          </Text>
          <Text style={{ fontSize: "11px", color: "#6b7280" }}>
            This email was generated automatically. Please contact relevant
            managers or support teams with any questions.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AgentEmailTemplate;
