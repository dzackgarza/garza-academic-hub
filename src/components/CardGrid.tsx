import AcademicCard from "@/components/AcademicCard";
import type { AcademicCardProps } from "@/components/AcademicCard";

interface CardGridProps {
  items: AcademicCardProps[];
  columns?: 2 | 3;
}

const CardGrid = ({ items, columns = 2 }: CardGridProps) => (
  <div className={`grid gap-4 ${columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}>
    {items.map((item, i) => (
      <AcademicCard key={i} {...item} />
    ))}
  </div>
);

export default CardGrid;
