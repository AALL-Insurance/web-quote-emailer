import { getWebQuotes } from "./lib/queries.js";

type HandleRunCommand = {
  olderThan: string;
};

export const handleRunCommand = async ({ olderThan }: HandleRunCommand) => {
  const olderThanNumber = Number(olderThan);
  console.log(
    `Running web-quote-emailer for quotes older than ${olderThanNumber} minutes...`,
  );

  // get web quotes
  const webQuotes = await getWebQuotes(olderThanNumber);
  console.log(`Found ${webQuotes.length} web quotes.`);

  if (!webQuotes || webQuotes.length === 0) {
    console.log("No web quotes found. Exiting...");
    process.exit(0);
  }
  // loop through web quotes
  for (const webQuote of webQuotes) {
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

    // if webprogress is display-quote and wasuserquotefinishedeamilsent is true send quote completed email
    if (
      webQuote.WebProgress === "display-quote" &&
      webQuote.wasUserQuoteFinishedEmailSent === true
    ) {
      console.log(
        `Sending quote completed email for InsuredUID: ${webQuote.InsuredUID}`,
      );
    } else {
      // else send quote abandoned email
      console.log(
        `Sending quote abandoned email for InsuredUID: ${webQuote.InsuredUID}`,
      );
    }

    // update autowebquotes table to set wasagentquotefinishedeamilsent or wasagentquoteabandonedeamilsent to true
    console.log(
      `Updating AutoWebQuotes for InsuredUID: ${webQuote.InsuredUID}`,
    );
  }
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
