import AcademicLayout from "@/components/AcademicLayout";

const Activities = () => (
  <AcademicLayout showSidebar={false}>
    <h1 className="text-3xl font-semibold mb-6">Activities</h1>
    <p className="text-muted-foreground mb-6">Seminars, workshops, and academic activities.</p>
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-5">
        <h3 className="font-semibold mb-1">Conferences & Workshops</h3>
        <p className="text-sm text-muted-foreground">A list of conferences and workshops attended will appear here.</p>
      </div>
      <div className="rounded-lg border bg-card p-5">
        <h3 className="font-semibold mb-1">Seminars</h3>
        <p className="text-sm text-muted-foreground">Reading seminars and study groups will appear here.</p>
      </div>
    </div>
  </AcademicLayout>
);

export default Activities;
