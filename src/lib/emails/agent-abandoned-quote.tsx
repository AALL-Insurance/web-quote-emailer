import { render, Text, toPlainText } from "@react-email/components";
import type { WebQuote } from "../queries.js";
import type { AutoWebQuoteRates } from "../types/database.js";
import AgentEmailTemplate from "./templates/AgentEmailTemplate.js";

const AgentAbandonedQuoteEmail = (
  webQuote: WebQuote,
  autoWebQuoteRate: Array<AutoWebQuoteRates>,
) => (
  <AgentEmailTemplate
    title="Quote Abandoned"
    description={
      <Text>
        The client started the quote 30 minutes ago and has not completed it,
        therefore it is assumed they have abandoned the quote process.
        {webQuote.AutoWebQuote &&
          ` Specifically, at the ${webQuote.AutoWebQuote.WebProgress} step.`}{" "}
        <b>Review Quote ${webQuote.QuoteNumber}</b>, verify accuracy and missing
        discounts before contacting the customer.
      </Text>
    }
    webQuote={webQuote}
    autoWebQuoteRate={autoWebQuoteRate}
  />
);

export const getAgentAbandonedQuoteEmailHtml = async (
  webQuote: WebQuote,
  autoWebQuoteRate: Array<AutoWebQuoteRates>,
) => {
  const html = await render(
    AgentAbandonedQuoteEmail(webQuote, autoWebQuoteRate),
  );
  return html;
};

export const getAgentAbandonedQuoteEmailText = async (
  webQuote: WebQuote,
  autoWebQuoteRate: Array<AutoWebQuoteRates>,
) => {
  const html = await render(
    AgentAbandonedQuoteEmail(webQuote, autoWebQuoteRate),
  );
  const plainText = toPlainText(html);
  return plainText;
};
