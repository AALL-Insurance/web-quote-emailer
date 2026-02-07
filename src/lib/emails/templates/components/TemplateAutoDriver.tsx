import { Heading, Section } from "@react-email/components";
import type { WebQuote } from "../../../queries.js";
import { headerCell, tableStyle, valueCell } from "../inline-styles.js";

type TemplateAutoDriverProps = {
  AutoDriver: WebQuote["AutoDriver"];
};

export const TemplateAutoDriver = ({ AutoDriver }: TemplateAutoDriverProps) => {
  if (!AutoDriver || AutoDriver.length === 0) {
    return null;
  }

  return (
    <Section>
      <Heading as="h2">Drivers</Heading>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerCell("#619f42")}>Name</th>
            <th style={headerCell("#619f42")}>DOB</th>
            <th style={headerCell("#619f42")}>Gender</th>
            <th style={headerCell("#619f42")}>Relationship</th>
            <th style={headerCell("#619f42")}>Marital</th>
            <th style={headerCell("#619f42")}>License Status</th>
            <th style={headerCell("#619f42")}>License Type</th>
            <th style={headerCell("#619f42")}>License State</th>
            <th style={headerCell("#619f42")}>License Number</th>
          </tr>
        </thead>
        <tbody>
          {AutoDriver.map((driver) => (
            <tr key={driver.DriverUID}>
              <td style={valueCell}>
                {driver.DriverFirstName} {driver.DriverLastName}
              </td>
              <td style={valueCell}>{driver.DriverDOB}</td>
              <td style={valueCell}>{driver.Gender}</td>
              <td style={valueCell}>{driver.Relationship}</td>
              <td style={valueCell}>{driver.MaritalStatus}</td>
              <td style={valueCell}>{driver.LicenseStatus}</td>
              <td style={valueCell}>{driver.LicenseType}</td>
              <td style={valueCell}>{driver.LicenseState}</td>
              <td style={valueCell}>{driver.LicenseNumber} (placeholder)</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
};
