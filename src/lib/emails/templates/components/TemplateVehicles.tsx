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
            <th style={headerCell("#619f42")}>Primary Use</th>
            <th style={headerCell("#619f42")}>Daily Mileage</th>
            <th style={headerCell("#619f42")}>Yearly Mileage</th>
            <th style={headerCell("#619f42")}>Comprehensive</th>
            <th style={headerCell("#619f42")}>Collision</th>
            <th style={headerCell("#619f42")}>Full Glass</th>
            <th style={headerCell("#619f42")}>Towing</th>
            <th style={headerCell("#619f42")}>Rental</th>
          </tr>
        </thead>
        <tbody>
          {AutoVehicle.map((vehicle) => (
            <tr key={vehicle.VIN}>
              <td style={valueCell}>{vehicle.Year}</td>
              <td style={valueCell}>{vehicle.Make}</td>
              <td style={valueCell}>{vehicle.Model}</td>
              <td style={valueCell}>{vehicle.VIN}</td>
              <td style={valueCell}>{vehicle.UsedFor}</td>
              <td style={valueCell}>{vehicle.DailyMileage}</td>
              <td style={valueCell}>{vehicle.Mileage}</td>
              <td style={valueCell}>{vehicle.CompDed || "N/A"}</td>
              <td style={valueCell}>{vehicle.CollDed || "N/A"}</td>
              <td style={valueCell}>
                {vehicle.FullGlass === "Y"
                  ? "Yes"
                  : vehicle.FullGlass === "N"
                    ? "No"
                    : "N/A"}
              </td>
              <td style={valueCell}>
                {vehicle.Towing === "Y"
                  ? "Yes"
                  : vehicle.Towing === "N"
                    ? "No"
                    : "N/A"}
              </td>
              <td style={valueCell}>
                {vehicle.Rental === "50"
                  ? "Yes"
                  : vehicle.Rental === "No Coverage"
                    ? "No"
                    : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
};
