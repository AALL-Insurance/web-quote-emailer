import { Heading, Section } from "@react-email/components";
import type { WebQuote } from "../../../queries.js";
import { headerCell, tableStyle, valueCell } from "../inline-styles.js";

type TemplateVehiclesProps = {
  AutoVehicle: WebQuote["AutoVehicle"];
};

export const TemplateVehicles = ({ AutoVehicle }: TemplateVehiclesProps) => {
  if (!AutoVehicle || AutoVehicle.length === 0) {
    return null;
  }

  return (
    <Section>
      <Heading as="h2">Vehicles</Heading>
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
          {AutoVehicle.map((vehicle) => (
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
  );
};
