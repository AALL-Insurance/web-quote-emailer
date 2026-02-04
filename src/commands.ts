import {
  sendAgentUserAbandonedEmail,
  sendAgentUserCompletedEmail,
  sendAgentUserScheduledCallbackEmail,
} from "./lib/emails/agent-emails.js";
import {
  getAutoWebQuoteRates,
  getWebQuotes,
  type WebQuote,
} from "./lib/queries.js";

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
        quote.AutoWebQuote.WebProgress !== "display-quote" ||
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

  // loop through web quotes
  for (const webQuote of quotes) {
    const autoWebQuoteRates = await getAutoWebQuoteRates(webQuote.InsuredUID);

    console.log(`Processing quote with InsuredUID: ${webQuote.InsuredUID}`);

    // check if firstname, lastname, emailaddress, phonenumber are not null or empty
    if (
      webQuote.InsuredFirstName == null ||
      webQuote.InsuredLastName == null ||
      webQuote.EmailAddress == null ||
      webQuote.PhoneNumber == null
    ) {
      console.log(
        `Skipping quote with InsuredUID: ${webQuote.InsuredUID} due to missing contact information.`,
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
        `Skipping test quote with InsuredUID: ${webQuote.InsuredUID}.`,
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
    }

    // send quote abandoned email
    if (emailType === "abandoned") {
      console.log(
        `Sending quote abandoned email for InsuredUID: ${webQuote.InsuredUID}`,
      );
      await sendAgentUserAbandonedEmail(webQuote, autoWebQuoteRates);
    }

    // send scheduled callback email
    if (emailType === "scheduled-callback") {
      console.log(
        `Sending scheduled callback email for InsuredUID: ${webQuote.InsuredUID}`,
      );

      if (!webQuote.AutoWebQuote.ScheduledCallbackDateTime) {
        console.log(
          `Skipping quote with InsuredUID: ${webQuote.InsuredUID} due to missing ScheduledCallbackDateTime.`,
        );
        continue;
      }

      await sendAgentUserScheduledCallbackEmail(
        webQuote,
        autoWebQuoteRates,
        webQuote.AutoWebQuote.ScheduledCallbackDateTime,
      );
    }

    // update autowebquotes table
    console.log(
      `Updating AutoWebQuotes for InsuredUID: ${webQuote.InsuredUID}`,
    );
  }

  console.log("Process completed.");
  process.exit(0);
};
/*

GmailMessageBuilder gmailMessageBuilder = new("noreply@aall.net");
foreach (var record in results)
{
    if (record.AutoWebQuote == null)
    {
        continue;
    }

    if (record.InsuredFirstName == null || record.InsuredLastName == null || record.EmailAddress == null || record.PhoneNumber == null)
    {
        continue;
    }

    if (record.AutoWebQuote.WebProgress == "display-quote" && record.AutoWebQuote.WasUserQuoteFinishedEmailSent == true) // SEND QUOTE COMPLETED BUT NO CONTACT REQUEST EMAIL
    {
        var email = Emails.WebQuoteEmail("Quote Completed", $"The following customer received an online rate but has not requested contact. Review Quote {record.QuoteNumber}, verify accuracy and missing discounts before contacting the customer.", record);
        gmailMessageBuilder
            .SetFrom("Web Quotes")
            .SetTo(emailRecipients)
            .SetBcc("ricardo.valdovinos@aall.net")
            .SetSubject($"WebQuote: Review Completed Quote for {record.InsuredFirstName} {record.InsuredLastName}")
            .SetBody(email, false);
        await db.AutoWebQuotes
            .Where(w => w.InsuredUid == record.InsuredUid)
            .ExecuteUpdateAsync(s => s
            .SetProperty(w => w.WasAgentQuoteFinishedEmailSent, true));
        sent["completed"] += 1;
    }
    else // SEND QUOTE ABANDONED EMAIL
    {
        var email = Emails.WebQuoteEmail("Quote Abandoned", $"The client started the quote 30 minutes ago and has not completed it, therefore it is assumed they have abandoned the quote process.", record);
        gmailMessageBuilder
            .SetFrom("Web Quotes")
            .SetTo(emailRecipients)
            .SetBcc("ricardo.valdovinos@aall.net")
            .SetSubject($"WebQuote: Review Abandoned Quote for {record.InsuredFirstName} {record.InsuredLastName}")
            .SetBody(email, false);
        await db.AutoWebQuotes
            .Where(w => w.InsuredUid == record.InsuredUid)
            .ExecuteUpdateAsync(s => s
            .SetProperty(w => w.WasAgentQuoteAbandonedEmailSent, true));
        sent["abandoned"] += 1;
    }
    gmailMessageBuilder.Send();
    Console.WriteLine($"Sending email for InsuredUid: {record.InsuredUid}");
    gmailMessageBuilder.Reset();
}


*/
