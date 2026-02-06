import { Heading, Section } from "@react-email/components";
import React from "react";
import type { WebQuote } from "../../../queries.js";
import { tableStyle, valueCell } from "../inline-styles.js";
import { TemplateRow } from "./TemplateRow.js";

type TemplateViolationsProps = {
  AutoViolation: WebQuote["AutoViolation"];
};

export const TemplateViolations = ({
  AutoViolation,
}: TemplateViolationsProps) => {
  return (
    <Section>
      <Heading as="h2">Violations</Heading>
      <table style={tableStyle}>
        <tbody>
          {AutoViolation?.length ? (
            AutoViolation.map((violation) => (
              <React.Fragment key={`violation-${violation.ViolationUID}`}>
                <TemplateRow
                  label="Violation Date"
                  value={violation.ViolationDate}
                />
                <TemplateRow
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
  );
};
