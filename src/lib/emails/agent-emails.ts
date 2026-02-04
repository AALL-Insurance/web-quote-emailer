import { transporter } from "../email.js";
import type { WebQuote } from "../queries.js";
import type { AutoWebQuoteRates } from "../types/database.js";
import {
  getAgentAbandonedQuoteEmailHtml,
  getAgentAbandonedQuoteEmailText,
} from "./agent-abandoned-quote.js";
import {
  getAgentCompletedQuoteEmailHtml,
  getAgentCompletedQuoteEmailText,
} from "./agent-completed-quote.js";
import {
  getAgentScheduleCallbackEmailHtml,
  getAgentScheduleCallbackEmailText,
} from "./agent-schedule-callback.js";

const to = "ricardo.valdovinos@aall.net";

export const sendAgentUserScheduledCallbackEmail = async (
  webQuote: WebQuote,
  autoWebQuoteRate: Array<AutoWebQuoteRates>,
  callbackDateTime: string,
) => {
  try {
    const text = await getAgentScheduleCallbackEmailText(
      webQuote,
      autoWebQuoteRate,
      callbackDateTime,
    );
    const html = await getAgentScheduleCallbackEmailHtml(
      webQuote,
      autoWebQuoteRate,
      callbackDateTime,
    );

    if (
      (webQuote.InsuredFirstName === "test" ||
        webQuote.InsuredLastName === "test") &&
      to.includes("@aall.net")
    ) {
      return;
    }

    await transporter.sendMail({
      from: `"Web Quotes" <${process.env.GMAIL_USER}>`,
      to: to,
      replyTo: to,
      subject: `WebQuote: Review Scheduled Callback for ${webQuote.InsuredFirstName} ${webQuote.InsuredLastName}`,
      text,
      html,
    });
  } catch (error) {
    console.error(error);
  }
  return;
};

export const sendAgentUserCompletedEmail = async (
  webQuote: WebQuote,
  autoWebQuoteRate: Array<AutoWebQuoteRates>,
) => {
  try {
    const text = await getAgentCompletedQuoteEmailText(
      webQuote,
      autoWebQuoteRate,
    );
    const html = await getAgentCompletedQuoteEmailHtml(
      webQuote,
      autoWebQuoteRate,
    );

    if (
      (webQuote.InsuredFirstName === "test" ||
        webQuote.InsuredLastName === "test") &&
      to.includes("@aall.net")
    ) {
      return;
    }

    await transporter.sendMail({
      from: `"Web Quotes" <${process.env.GMAIL_USER}>`,
      to: to,
      replyTo: to,
      subject: `WebQuote: Review Completed Quote for ${webQuote.InsuredFirstName} ${webQuote.InsuredLastName}`,
      text,
      html,
    });
  } catch (error) {
    console.error(error);
  }
  return;
};

export const sendAgentUserAbandonedEmail = async (
  webQuote: WebQuote,
  autoWebQuoteRate: Array<AutoWebQuoteRates>,
) => {
  try {
    const text = await getAgentAbandonedQuoteEmailText(
      webQuote,
      autoWebQuoteRate,
    );
    const html = await getAgentAbandonedQuoteEmailHtml(
      webQuote,
      autoWebQuoteRate,
    );

    if (
      (webQuote.InsuredFirstName === "test" ||
        webQuote.InsuredLastName === "test") &&
      to.includes("@aall.net")
    ) {
      return;
    }

    await transporter.sendMail({
      from: `"Web Quotes" <${process.env.GMAIL_USER}>`,
      to: to,
      replyTo: to,
      subject: `WebQuote: Review Abandoned Quote for ${webQuote.InsuredFirstName} ${webQuote.InsuredLastName}`,
      text,
      html,
    });
  } catch (error) {
    console.error(error);
  }
  return;
};
