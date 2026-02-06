import { Heading, Img, Section, Text } from "@react-email/components";

type HeaderProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
};

export const TemplateHeader = ({ title, description }: HeaderProps) => {
  return (
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
    </Section>
  );
};
