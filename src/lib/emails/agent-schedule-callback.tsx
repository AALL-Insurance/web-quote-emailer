import { render, toPlainText } from "@react-email/components";
import type { WebQuote } from "../queries.js";
import type { AutoWebQuoteRates } from "../types/database.js";
import AgentEmailTemplate from "./templates/AgentEmailTemplate.js";

const AgentScheduleCallbackEmail = (
  webQuote: WebQuote,
  autoWebQuoteRate: Array<AutoWebQuoteRates>,
  callbackDateTime: string,
) => (
  <AgentEmailTemplate
    title="We received your quote request!"
    description={`A customer has scheduled a callback on ${callbackDateTime}. Please reach out to them to assist with their insurance quote.`}
    webQuote={webQuote}
    autoWebQuoteRate={autoWebQuoteRate}
  />
);

export const getAgentScheduleCallbackEmailHtml = async (
  webQuote: WebQuote,
  autoWebQuoteRate: Array<AutoWebQuoteRates>,
  callbackDateTime: string,
) => {
  const html = await render(
    AgentScheduleCallbackEmail(webQuote, autoWebQuoteRate, callbackDateTime),
  );
  return html;
};

export const getAgentScheduleCallbackEmailText = async (
  webQuote: WebQuote,
  autoWebQuoteRate: Array<AutoWebQuoteRates>,
  callbackDateTime: string,
) => {
  const html = await render(
    AgentScheduleCallbackEmail(webQuote, autoWebQuoteRate, callbackDateTime),
  );
  const plainText = toPlainText(html);
  return plainText;
};
