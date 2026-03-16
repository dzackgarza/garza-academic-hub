import NavBar from "./NavBar";
import ProfileSidebar from "./ProfileSidebar";

interface AcademicLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const AcademicLayout = ({ children, showSidebar = true }: AcademicLayoutProps) => (
  <div className="min-h-screen flex flex-col">
    <NavBar />
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
      {showSidebar ? (
        <div className="flex flex-col lg:flex-row gap-10">
          <ProfileSidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      ) : (
        children
      )}
    </main>
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      © 2025 D. Zack Garza.
    </footer>
  </div>
);

export default AcademicLayout;
