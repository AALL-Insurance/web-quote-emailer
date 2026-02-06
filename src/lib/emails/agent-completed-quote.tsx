import { render, Text, toPlainText } from "@react-email/components";
import type { WebQuote } from "../queries.js";
import type { AutoWebQuoteRates } from "../types/database.js";
import AgentEmailTemplate from "./templates/AgentEmailTemplate.js";

const AgentCompletedQuoteEmail = (
  webQuote: WebQuote,
  autoWebQuoteRate: Array<AutoWebQuoteRates>,
) => (
  <AgentEmailTemplate
    title="Quote Completed"
    description={
      <Text>
        The following customer received an online rate but has not requested
        contact. <b>Review Quote {webQuote.QuoteNumber}</b>, verify accuracy and
        missing discounts before contacting the customer.
      </Text>
    }
    webQuote={webQuote}
    autoWebQuoteRate={autoWebQuoteRate}
  />
);

export const getAgentCompletedQuoteEmailHtml = async (
  webQuote: WebQuote,
  autoWebQuoteRate: Array<AutoWebQuoteRates>,
) => {
  const html = await render(
    AgentCompletedQuoteEmail(webQuote, autoWebQuoteRate),
  );
  return html;
};

export const getAgentCompletedQuoteEmailText = async (
  webQuote: WebQuote,
  autoWebQuoteRate: Array<AutoWebQuoteRates>,
) => {
  const html = await render(
    AgentCompletedQuoteEmail(webQuote, autoWebQuoteRate),
  );
  const plainText = toPlainText(html);
  return plainText;
};
