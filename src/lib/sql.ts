import dayjs from "dayjs";
import { db } from "./database";

export const getAgentEmails = async () =>
  await db
    .selectFrom("AutoInsured")
    .innerJoin("AutoDriver", "InsuredUID", "AutoDriver.InsuredUID")
    .innerJoin("AutoVehicle", "InsuredUID", "AutoVehicle.InsuredUID")
    .innerJoin("AutoViolation", "InsuredUID", "AutoViolation.InsuredUID")
    .innerJoin("AutoWebQuote", "InsuredUID", "AutoWebQuote.InsuredUID")
    .innerJoin(
      "AutoInsuredPriorPolicy",
      "InsuredUID",
      "AutoInsuredPriorPolicy.InsuredUID",
    )
    .selectAll()
    .where(
      "AutoInsured.LastSavedDate",
      "<",
      dayjs().subtract(30, "minute").toDate(),
    )
    .where("AutoInsured.LeadSource", "=", "Web Quotes")
    .where("AutoInsured.LeadSource", "is not", null)
    .where("AutoWebQuote.wasAgentScheduledCallbackEmailSent", "is", null)
    .where("AutoWebQuote.wasAgentQuoteFinishedEmailSent", "is", null)
    .where("AutoWebQuote.wasAgentQuoteAbandonedEmailSent", "is", null)
    .orderBy("AutoInsured.QuoteNumber", "desc")
    .execute();
