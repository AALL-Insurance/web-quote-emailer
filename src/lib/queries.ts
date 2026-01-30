import dayjs from "dayjs";
import { db } from "./database.js";

export const getWebQuotes = async (olderThan: number = 30) =>
  await db
    .selectFrom("AutoInsured")
    .innerJoin("AutoDriver", "AutoInsured.InsuredUID", "AutoDriver.InsuredUID")
    .innerJoin(
      "AutoVehicle",
      "AutoInsured.InsuredUID",
      "AutoVehicle.InsuredUID",
    )
    .innerJoin(
      "AutoViolation",
      "AutoInsured.InsuredUID",
      "AutoViolation.InsuredUID",
    )
    .innerJoin(
      "AutoWebQuote",
      "AutoInsured.InsuredUID",
      "AutoWebQuote.InsuredUID",
    )
    .innerJoin(
      "AutoInsuredPriorPolicy",
      "AutoInsured.InsuredUID",
      "AutoInsuredPriorPolicy.InsuredUID",
    )
    .selectAll()
    .where(
      "AutoInsured.LastSavedDate",
      "<",
      dayjs().subtract(olderThan, "minute").toDate(),
    )
    .where("AutoInsured.LeadSource", "=", "Web Quotes")
    .where("AutoInsured.LeadSource", "is not", null)
    .where("AutoWebQuote.wasAgentScheduledCallbackEmailSent", "is", null)
    .where("AutoWebQuote.wasAgentQuoteFinishedEmailSent", "is", null)
    .where("AutoWebQuote.wasAgentQuoteAbandonedEmailSent", "is", null)
    .orderBy("AutoInsured.QuoteNumber", "desc")
    .execute();
