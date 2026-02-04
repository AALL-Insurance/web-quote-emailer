import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Section,
  Text,
} from "@react-email/components";
import React from "react";
import type { WebQuote } from "../../queries.js";
import type { AutoWebQuoteRates } from "../../types/database.js";

/* ================================
   Styles (inline only)
================================ */

const fontFamily = "Arial, Helvetica, sans-serif";

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const labelCell: React.CSSProperties = {
  padding: "6px 8px",
  fontSize: "13px",
  fontWeight: "bold",
  verticalAlign: "top",
  borderBottom: "1px solid #e5e7eb",
};

const valueCell: React.CSSProperties = {
  padding: "6px 8px",
  fontSize: "13px",
  borderBottom: "1px solid #e5e7eb",
};

const headerCell = (bg: string): React.CSSProperties => ({
  backgroundColor: bg,
  color: "#ffffff",
  padding: "8px",
  fontSize: "13px",
  textAlign: "left",
});

/* ================================
   Helpers
================================ */

const Row = ({ label, value }: { label: string; value?: any }) => {
  if (value === null || value === undefined || value === "" || value === false)
    return null;

  return (
    <tr>
      <td style={labelCell}>{label}</td>
      <td style={valueCell}>{String(value)}</td>
    </tr>
  );
};

/* ================================
   Types (minimal)
================================ */

type AutoQuoteEmailProps = {
  webQuote: WebQuote;
  autoWebQuoteRate: Array<AutoWebQuoteRates>;
  title?: string;
  description?: string;
};

/* ================================
   Email Template
================================ */

export const AgentEmailTemplate = ({
  title,
  description,
  webQuote,
  autoWebQuoteRate,
}: AutoQuoteEmailProps) => {
  if (!webQuote) return null;

  const gender =
    webQuote.AutoDriver.find((d) => d.Relationship === "Insured")?.Gender ||
    "N/A";

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f3f4f6", fontFamily }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            margin: "0 auto",
            padding: "24px",
            maxWidth: "720px",
          }}
        >
          {/* Header */}
          <Section style={{ textAlign: "center" }}>
            <Img
              src="https://aall.net/logos/aall-menu-logo.png"
              alt="Company Logo"
              width="140"
            />

            {title && (
              <Heading style={{ color: "#619F42", marginTop: "12px" }}>
                {title}
              </Heading>
            )}

            {description && (
              <Text style={{ color: "#374151", fontSize: "14px" }}>
                {description}
              </Text>
            )}

            <Text>
              <strong>Quote Number:</strong> {webQuote.QuoteNumber}
            </Text>
          </Section>

          {/* Contact Information */}
          <Section>
            <Heading as="h3">Contact Information</Heading>
            <table style={tableStyle}>
              <tbody>
                <Row
                  label="Insured Name"
                  value={`${webQuote.InsuredFirstName} ${webQuote.InsuredLastName}`}
                />
                <Row label="Phone" value={webQuote.PhoneNumber} />
                <Row label="Email" value={webQuote.EmailAddress} />
                <Row
                  label="Address"
                  value={`${webQuote.Address1}
${webQuote.City}, ${webQuote.State} ${webQuote.ZipCode}`}
                />
                <Row label="Years at Address" value={webQuote.YearsAtAddress} />
                <Row
                  label="Months at Address"
                  value={webQuote.MonthsAtAddress}
                />
                <Row label="Residence Type" value={webQuote.ResidenceType} />
              </tbody>
            </table>
          </Section>

          <Hr />

          {autoWebQuoteRate && autoWebQuoteRate.length > 0 && (
            <>
              <Section>
                <Heading as="h3">Rates</Heading>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={headerCell("#619f42")}>Status</th>
                      <th style={headerCell("#619f42")}>Carrier Code</th>
                      <th style={headerCell("#619f42")}>Carrier Name</th>
                      <th style={headerCell("#619f42")}>Deposit</th>
                      <th style={headerCell("#619f42")}>Installment</th>
                      <th style={headerCell("#619f42")}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {autoWebQuoteRate.map((rate) => (
                      <tr key={rate.RateUID}>
                        <td style={valueCell}>
                          {rate.IsPreferred
                            ? "Preferred"
                            : rate.IsRecommended
                              ? "Recommended"
                              : rate.IsSelected
                                ? "Selected"
                                : ""}
                        </td>
                        <td style={valueCell}>{rate.CarrierCode}</td>
                        <td style={valueCell}>{rate.CarrierName}</td>
                        <td style={valueCell}>{rate.Deposit}</td>
                        <td style={valueCell}>{rate.Installment}</td>
                        <td style={valueCell}>{rate.Total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
              <Hr />
            </>
          )}

          {/* Previous Address */}
          {webQuote.YearsAtAddress && webQuote.YearsAtAddress > 2 && (
            <>
              <Section>
                <Heading as="h3">Previous Address</Heading>
                <table style={tableStyle}>
                  <tbody>
                    <Row
                      label="Previous Address"
                      value={`${webQuote.PreviousAddress1}
${webQuote.PreviousCity}, ${webQuote.PreviousState} ${webQuote.PreviousZipCode}`}
                    />
                  </tbody>
                </table>
              </Section>
              <Hr />
            </>
          )}

          {/* Policyholder */}
          <Section>
            <Heading as="h3">Policyholder</Heading>
            <table style={tableStyle}>
              <tbody>
                <Row label="First Name" value={webQuote.InsuredFirstName} />
                <Row label="Last Name" value={webQuote.InsuredLastName} />
                <Row label="Gender" value={gender} />
              </tbody>
            </table>
          </Section>

          <Hr />

          {/* General Info */}
          <Section>
            <Heading as="h3">General Information</Heading>
            <table style={tableStyle}>
              <tbody>
                <Row
                  label="Policy Effective"
                  value={webQuote.PolicyEffectiveDate}
                />
                <Row
                  label="Currently Insured"
                  value={webQuote.IsCurrentlyInsured}
                />
                <Row
                  label="Garaging Different?"
                  value={
                    webQuote.IsGaragingDifferentThanMailing === true
                      ? "Yes"
                      : "No"
                  }
                />
                <Row
                  label="Home Owner"
                  value={webQuote.IsHomeOwner === true ? "Yes" : "No"}
                />
              </tbody>
            </table>
          </Section>

          <Hr />

          {/* Garaging Address */}
          {webQuote.IsGaragingDifferentThanMailing && (
            <>
              <Section>
                <Heading as="h3">Garaging Address</Heading>
                <table style={tableStyle}>
                  <tbody>
                    <Row
                      label="Garaging Address"
                      value={`${webQuote.GaragingAddress1}
${webQuote.GaragingCity}, ${webQuote.GaragingState} ${webQuote.GaragingZipCode}`}
                    />
                  </tbody>
                </table>
              </Section>
              <Hr />
            </>
          )}

          {/* Drivers */}
          {webQuote.AutoDriver && webQuote.AutoDriver.length > 0 && (
            <>
              <Section>
                <Heading as="h3">Drivers</Heading>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={headerCell("#619f42")}>Name</th>
                      <th style={headerCell("#619f42")}>DOB</th>
                      <th style={headerCell("#619f42")}>Gender</th>
                      <th style={headerCell("#619f42")}>Relationship</th>
                      <th style={headerCell("#619f42")}>Marital</th>
                    </tr>
                  </thead>
                  <tbody>
                    {webQuote.AutoDriver.map((driver) => (
                      <tr key={driver.DriverUID}>
                        <td style={valueCell}>
                          {driver.DriverFirstName} {driver.DriverLastName}
                        </td>
                        <td style={valueCell}>{driver.DriverDOB}</td>
                        <td style={valueCell}>{driver.Gender}</td>
                        <td style={valueCell}>{driver.Relationship}</td>
                        <td style={valueCell}>{driver.MaritalStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
              <Hr />
            </>
          )}

          {/* Violations */}
          <Section>
            <Heading as="h3">Violations</Heading>
            <table style={tableStyle}>
              <tbody>
                {webQuote.AutoViolation?.length ? (
                  webQuote.AutoViolation.map((violation) => (
                    <React.Fragment key={`violation-${violation.ViolationUID}`}>
                      <Row
                        label="Violation Date"
                        value={violation.ViolationDate}
                      />
                      <Row
                        label="Description"
                        value={violation.ViolationDescription}
                      />
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td style={valueCell} colSpan={2}>
                      No traffic violations reported
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Section>

          <Hr />

          {/* Vehicles */}
          {webQuote.AutoVehicle && webQuote.AutoVehicle.length > 0 && (
            <>
              <Section>
                <Heading as="h3">Vehicles</Heading>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={headerCell("#619f42")}>Year</th>
                      <th style={headerCell("#619f42")}>Make</th>
                      <th style={headerCell("#619f42")}>Model</th>
                      <th style={headerCell("#619f42")}>VIN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {webQuote.AutoVehicle.map((vehicle) => (
                      <tr key={vehicle.VIN}>
                        <td style={valueCell}>{vehicle.Year}</td>
                        <td style={valueCell}>{vehicle.Make}</td>
                        <td style={valueCell}>{vehicle.Model}</td>
                        <td style={valueCell}>{vehicle.VIN}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
              <Hr />
            </>
          )}

          {/* Footer */}
          <Text>
            <strong>Quote Number:</strong> {webQuote.QuoteNumber}
          </Text>

          <Text style={{ fontSize: "11px", color: "#6b7280" }}>
            This email was generated automatically. Please contact your agent
            with any questions.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AgentEmailTemplate;
