import dayjs from "dayjs";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/mssql";
import { db } from "./database.js";

export const getWebQuotes = async (olderThan: number = 30) => {
  const TIMEZONE_OFFSET = 7; // America/Phoenix is UTC-7
  const dateTimeLimit = dayjs()
    .subtract(TIMEZONE_OFFSET, "hour")
    .subtract(olderThan, "minute")
    .toDate();
  const results = await db
    .selectFrom("AutoInsured")
    .innerJoin("AutoDriver", "AutoInsured.InsuredUID", "AutoDriver.InsuredUID")
    .innerJoin(
      "AutoVehicle",
      "AutoInsured.InsuredUID",
      "AutoVehicle.InsuredUID",
    )
    .innerJoin(
      "AutoWebQuote",
      "AutoInsured.InsuredUID",
      "AutoWebQuote.InsuredUID",
    )
    .leftJoin(
      "AutoViolation",
      "AutoInsured.InsuredUID",
      "AutoViolation.InsuredUID",
    )
    .leftJoin(
      "AutoInsuredPriorPolicy",
      "AutoInsured.InsuredUID",
      "AutoInsuredPriorPolicy.InsuredUID",
    )
    .where("AutoInsured.LastSavedDate", "<", dateTimeLimit)
    .where("AutoInsured.LeadSource", "like", "Web Quotes")
    .where("AutoInsured.EmailAddress", "is not", null)
    .where("AutoInsured.PhoneNumber", "is not", null)
    .where("AutoWebQuote.wasAgentScheduledCallbackEmailSent", "is", null)
    .where("AutoWebQuote.wasAgentQuoteFinishedEmailSent", "is", null)
    .where("AutoWebQuote.wasAgentQuoteAbandonedEmailSent", "is", null)
    .orderBy("AutoInsured.QuoteNumber", "desc")
    .selectAll("AutoInsured")
    .select((eb) => [
      // AutoWebQuote
      jsonObjectFrom(
        eb
          .selectFrom("AutoWebQuote")
          .select([
            "AutoWebQuote.CustomerSelectedCarrier",
            "AutoWebQuote.DidCustomerCall",
            "AutoWebQuote.ScheduledCallbackDateTime",
            "AutoWebQuote.IsCurrentOrPreviousCustomer",
            "AutoWebQuote.ResumeQuoteSection",
            "AutoWebQuote.UninsuredReason",
            "AutoWebQuote.WebLeadSource",
            "AutoWebQuote.WebLeadSourceDescription",
            "AutoWebQuote.WebProgress",
            "AutoWebQuote.wasAgentQuoteAbandonedEmailSent",
            "AutoWebQuote.wasAgentQuoteFinishedEmailSent",
            "AutoWebQuote.wasAgentScheduledCallbackEmailSent",
            "AutoWebQuote.wasUserInitialEmailSent",
            "AutoWebQuote.wasUserQuoteFinishedEmailSent",
          ])
          .whereRef("AutoWebQuote.InsuredUID", "=", "AutoInsured.InsuredUID"),
      ).as("AutoWebQuote"),

      // AutoInsuredPriorPolicy
      jsonObjectFrom(
        eb
          .selectFrom("AutoInsuredPriorPolicy")
          .select([
            "AutoInsuredPriorPolicy.CarrierName",
            "AutoInsuredPriorPolicy.MonthsWithInsurer",
            "AutoInsuredPriorPolicy.PolicyExpirationDate",
            "AutoInsuredPriorPolicy.BILimit",
            "AutoInsuredPriorPolicy.PDLimit",
            "AutoInsuredPriorPolicy.NAICCode",
            "AutoInsuredPriorPolicy.PolicyEffectiveDate",
            "AutoInsuredPriorPolicy.PolicyNumber",
            "AutoInsuredPriorPolicy.PriorRenewalPrice",
            "AutoInsuredPriorPolicy.RenewalPrice",
          ])
          .whereRef(
            "AutoInsuredPriorPolicy.InsuredUID",
            "=",
            "AutoInsured.InsuredUID",
          ),
      ).as("AutoInsuredPriorPolicy"),

      // AutoDriver
      jsonArrayFrom(
        eb
          .selectFrom("AutoDriver")
          .select([
            "AutoDriver.CreatedDate",
            "AutoDriver.DriverDOB",
            "AutoDriver.DriverFirstName",
            "AutoDriver.DriverLastName",
            "AutoDriver.DriverMiddleName",
            "AutoDriver.DriverNumber",
            "AutoDriver.DriverUID",
            "AutoDriver.Excluded",
            "AutoDriver.Gender",
            "AutoDriver.InsuredUID",
            "AutoDriver.LicenseNumber",
            "AutoDriver.LicenseState",
            "AutoDriver.LicenseStatus",
            "AutoDriver.LicenseType",
            "AutoDriver.MaritalStatus",
            "AutoDriver.Occupation",
            "AutoDriver.Relationship",
            "AutoDriver.SR22",
          ])
          .whereRef("AutoDriver.InsuredUID", "=", "AutoInsured.InsuredUID"),
      ).as("AutoDriver"),

      // AutoVehicle
      jsonArrayFrom(
        eb
          .selectFrom("AutoVehicle")
          .select([
            "AutoVehicle.CreatedDate",
            "AutoVehicle.Year",
            "AutoVehicle.Make",
            "AutoVehicle.Model",
            "AutoVehicle.VIN",
            "AutoVehicle.VehicleNumber",
            "AutoVehicle.VehicleUID",
            "AutoVehicle.BodyType",
            "AutoVehicle.CompDed",
            "AutoVehicle.CollDed",
            "AutoVehicle.CustomEquipment",
            "AutoVehicle.DailyMileage",
            "AutoVehicle.Mileage",
            "AutoVehicle.FullGlass",
            "AutoVehicle.IsIncludedInQuote",
            "AutoVehicle.IsManualOverride",
            "AutoVehicle.IsValidated",
            "AutoVehicle.UsedForRideShare",
            "AutoVehicle.UsedFor",
            "AutoVehicle.ExistingDamage",
            "AutoVehicle.LPP",
            "AutoVehicle.Rental",
            "AutoVehicle.Towing",
            "AutoVehicle.Modifications",
            "AutoVehicle.NonOwned",
            "AutoVehicle.OwnershipType",
            "AutoVehicle.PrimaryDriverNumber",
            "AutoVehicle.PurchaseDate",
            "AutoVehicle.SalvagedRestored",
            "AutoVehicle.Trim",
            "AutoVehicle.UMPD",
          ])
          .whereRef("AutoVehicle.InsuredUID", "=", "AutoInsured.InsuredUID"),
      ).as("AutoVehicle"),

      // AutoViolation
      jsonArrayFrom(
        eb
          .selectFrom("AutoViolation")
          .select([
            "AutoViolation.CreatedDate",
            "AutoViolation.DriverNumber",
            "AutoViolation.ViolationDate",
            "AutoViolation.ViolationDescription",
            "AutoViolation.ViolationUID",
          ])
          .whereRef("AutoViolation.InsuredUID", "=", "AutoInsured.InsuredUID"),
      ).as("AutoViolation"),
    ])
    .execute();
  return results;
};

export type WebQuote = Awaited<ReturnType<typeof getWebQuotes>>[number];

export const getAutoWebQuoteRates = async (InsuredUID: string) => {
  const result = await db
    .selectFrom("AutoWebQuoteRates")
    .where("AutoWebQuoteRates.InsuredUID", "=", InsuredUID)
    .orderBy("AutoWebQuoteRates.Installment", "asc")
    .selectAll("AutoWebQuoteRates")
    .execute();

  const recommendedRate = result.find((rate) => rate.IsRecommended);
  const preferredRate = result.find((rate) => rate.IsPreferred);
  const autoWebQuoteRates = result.filter(
    (rate) => !rate.IsRecommended && !rate.IsPreferred,
  );
  if (recommendedRate) {
    autoWebQuoteRates.unshift(recommendedRate);
  }
  if (preferredRate) {
    autoWebQuoteRates.unshift(preferredRate);
  }

  return autoWebQuoteRates;
};

export type AutoWebQuoteRates = Awaited<
  ReturnType<typeof getAutoWebQuoteRates>
>[number];

export const updateAgentUserCompletedEmailSent = async (InsuredUID: string) => {
  try {
    await db
      .updateTable("AutoWebQuote")
      .set({ wasAgentQuoteFinishedEmailSent: true })
      .where("InsuredUID", "=", InsuredUID)
      .execute();
  } catch (error) {
    console.error(
      `Error updating wasAgentQuoteFinishedEmailSent for InsuredUID: ${InsuredUID}`,
      error,
    );
  }
};

export const updateAgentUserAbandonedEmailSent = async (InsuredUID: string) => {
  try {
    await db
      .updateTable("AutoWebQuote")
      .set({ wasAgentQuoteAbandonedEmailSent: true })
      .where("InsuredUID", "=", InsuredUID)
      .execute();
  } catch (error) {
    console.error(
      `Error updating wasAgentQuoteAbandonedEmailSent for InsuredUID: ${InsuredUID}`,
      error,
    );
  }
};

export const updateAgentUserScheduledCallbackEmailSent = async (
  InsuredUID: string,
) => {
  try {
    await db
      .updateTable("AutoWebQuote")
      .set({ wasAgentScheduledCallbackEmailSent: true })
      .where("InsuredUID", "=", InsuredUID)
      .execute();
  } catch (error) {
    console.error(
      `Error updating wasAgentScheduledCallbackEmailSent for InsuredUID: ${InsuredUID}`,
      error,
    );
  }
};
