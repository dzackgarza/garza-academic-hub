import AcademicLayout from "@/components/AcademicLayout";

const Teaching = () => (
  <AcademicLayout showSidebar={false}>
    <h1 className="text-3xl font-semibold mb-6">Teaching</h1>
    <p className="text-muted-foreground mb-6">Course materials and teaching history.</p>
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-5">
        <h3 className="font-semibold mb-1">Graduate Teaching Assistant</h3>
        <p className="text-sm text-muted-foreground">University of Georgia — Department of Mathematics</p>
        <p className="text-sm text-muted-foreground mt-2">Details about courses taught will appear here.</p>
      </div>
    </div>
  </AcademicLayout>
);

export default Teaching;
