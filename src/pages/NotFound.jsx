import { SearchX } from "lucide-react";
import { Container, EmptyState, PrimaryLink } from "../components/ui";
import usePageTitle from "../lib/usePageTitle";

export default function NotFound() {
  usePageTitle("الصفحة غير موجودة");
  return (
    <Container className="py-24">
      <EmptyState icon={SearchX} title="الصفحة غير موجودة (404)" text="الرابط ده مش موجود أو اتنقل لمكان تاني." action={<PrimaryLink to="/">العودة للرئيسية</PrimaryLink>} />
    </Container>
  );
}
