import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js"; // ES 2015
import utc from "dayjs/plugin/utc.js"; // ES 2015
import {
  sendAgentUserAbandonedEmail,
  sendAgentUserCompletedEmail,
  sendAgentUserScheduledCallbackEmail,
} from "./lib/emails/agent-emails.js";
import {
  getAutoWebQuoteRates,
  getWebQuotes,
  updateAgentUserAbandonedEmailSent,
  updateAgentUserCompletedEmailSent,
  updateAgentUserScheduledCallbackEmailSent,
  type WebQuote,
} from "./lib/queries.js";

dayjs.extend(utc);
dayjs.extend(timezone);

type HandleRunCommand = (
  emailType: "abandoned" | "completed" | "scheduled-callback",
  options: { olderThan: string },
) => Promise<void>;

export const handleRunCommand: HandleRunCommand = async (
  emailType,
  { olderThan },
) => {
  const olderThanNumber = Number(olderThan);
  console.log(
    `Running web-quote-emailer for quotes older than ${olderThanNumber} minutes and email type ${emailType}...`,
  );

  // get web quotes
  const webQuotes = await getWebQuotes(olderThanNumber);
  console.log(`Found ${webQuotes.length} web quotes.`);
  if (!webQuotes || webQuotes.length === 0) {
    console.log("No web quotes found. Exiting...");
    process.exit(0);
  }

  let quotes: Array<WebQuote> = [];
  if (emailType === "completed") {
    quotes = webQuotes.filter((quote) => {
      if (!quote.AutoWebQuote) {
        return false;
      }

      return (
        quote.AutoWebQuote.WebProgress === "display-quote" &&
        quote.AutoWebQuote.wasUserQuoteFinishedEmailSent === true &&
        quote.AutoWebQuote.ScheduledCallbackDateTime == null
      );
    });
  }

  if (emailType === "abandoned") {
    quotes = webQuotes.filter((quote) => {
      if (!quote.AutoWebQuote) {
        return false;
      }
      return (
        quote.AutoWebQuote.WebProgress !== "display-quote" &&
        quote.AutoWebQuote.wasUserQuoteFinishedEmailSent === false
      );
    });
  }

  if (emailType === "scheduled-callback") {
    quotes = webQuotes.filter((quote) => {
      if (!quote.AutoWebQuote) {
        return false;
      }
      return (
        quote.AutoWebQuote.WebProgress === "display-quote" &&
        quote.AutoWebQuote.wasUserQuoteFinishedEmailSent === true &&
        quote.AutoWebQuote.ScheduledCallbackDateTime != null
      );
    });
  }
  console.log(
    `Filtered down to ${quotes.length} web quotes to process for email type ${emailType}.`,
  );
  // loop through web quotes
  for (const webQuote of quotes) {
    const autoWebQuoteRates = await getAutoWebQuoteRates(webQuote.InsuredUID);

    console.log(`Processing quote with InsuredUID: ${webQuote.InsuredUID}`);

    if (!webQuote.EmailAddress) {
      console.log(
        `Skipping quote with InsuredUID: ${webQuote.InsuredUID} due to missing EmailAddress.`,
      );
      continue;
    }

    // skip test quotes
    if (
      webQuote.InsuredFirstName === "test" &&
      webQuote.InsuredLastName === "test" &&
      webQuote.EmailAddress.toLowerCase().includes("@aall.net")
    ) {
      console.log(
        `Skipping test quote with InsuredUID: ${webQuote.InsuredUID}. ${webQuote.InsuredFirstName} ${webQuote.InsuredLastName} - ${webQuote.EmailAddress}`,
      );
      continue;
    }

    // check if autowebquote is valid
    if (!webQuote.AutoWebQuote) {
      console.log(
        `Skipping quote with InsuredUID: ${webQuote.InsuredUID} due to missing AutoWebQuote data.`,
      );
      continue;
    }

    // send quote completed email
    if (emailType === "completed") {
      console.log(
        `Sending quote completed email for InsuredUID: ${webQuote.InsuredUID}`,
      );
      await sendAgentUserCompletedEmail(webQuote, autoWebQuoteRates);
      console.log(
        `Updating completed email sent for InsuredUID: ${webQuote.InsuredUID}`,
      );
      await updateAgentUserCompletedEmailSent(webQuote.InsuredUID);
    }

    // send quote abandoned email
    if (emailType === "abandoned") {
      console.log(
        `Sending quote abandoned email for InsuredUID: ${webQuote.InsuredUID}`,
      );
      await sendAgentUserAbandonedEmail(webQuote, autoWebQuoteRates);
      console.log(
        `Updating abandoned email sent for InsuredUID: ${webQuote.InsuredUID}`,
      );
      await updateAgentUserAbandonedEmailSent(webQuote.InsuredUID);
    }

    // send scheduled callback email
    if (emailType === "scheduled-callback") {
      if (!webQuote.AutoWebQuote.ScheduledCallbackDateTime) {
        console.log(
          `Skipping quote with InsuredUID: ${webQuote.InsuredUID} due to missing ScheduledCallbackDateTime.`,
        );
        continue;
      }

      console.log(
        `Sending scheduled callback email for InsuredUID: ${webQuote.InsuredUID}`,
      );
      await sendAgentUserScheduledCallbackEmail(
        webQuote,
        autoWebQuoteRates,
        webQuote.AutoWebQuote.ScheduledCallbackDateTime,
      );
      console.log(
        `Updating scheduled callback email sent for InsuredUID: ${webQuote.InsuredUID}`,
      );
      await updateAgentUserScheduledCallbackEmailSent(webQuote.InsuredUID);
    }
  }

  console.log("Process completed.");
  process.exit(0);
};
