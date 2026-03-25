import { Html, Head, Body, Text, Section, Link } from "@react-email/components";
import { getEmailPrefix, greetByTime } from "../lib/utils";

export const NewResourceEmail = ({
  to,
  body,
  resourceUrl,
}: {
  to: string;
  body: string;
  resourceUrl: string;
}) => {
  return (
    <Html>
      <Head />
      <Body>
        <Section>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {greetByTime()} {getEmailPrefix(to)}!
          </Text>
          <Text>{body}</Text>
          {resourceUrl.trim() && <Link href={resourceUrl}>Åpne ressurs</Link>}
        </Section>
      </Body>
    </Html>
  );
};
