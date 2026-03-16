import AcademicLayout from "@/components/AcademicLayout";

const Resources = () => (
  <AcademicLayout showSidebar={false}>
    <h1 className="text-3xl font-semibold mb-6">Resources</h1>
    <p className="text-muted-foreground mb-6">Useful links and reference materials.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="rounded-lg border bg-card p-5">
        <h3 className="font-semibold mb-1">Textbooks & References</h3>
        <p className="text-sm text-muted-foreground">Recommended reading and references will appear here.</p>
      </div>
      <div className="rounded-lg border bg-card p-5">
        <h3 className="font-semibold mb-1">Software & Tools</h3>
        <p className="text-sm text-muted-foreground">Mathematical software and productivity tools will appear here.</p>
      </div>
    </div>
  </AcademicLayout>
);

export default Resources;
